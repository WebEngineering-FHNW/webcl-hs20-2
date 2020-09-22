// requires ../observable/observable.js
// requires ../transformer/transformer.js
// requires ./fortuneService.js
// requires ../dataflow/dataflow.js


const transformer = Transformers()

const capitalTransformer = (attribute) => (event) => {
    let index = attribute.value ? Number(attribute.value) : 1
    return event
        .split(' ')
        .map(word => word.charAt(index - 1).toUpperCase() + word.slice(index))
        .reduce((acc, word) => acc + word + ' ', "")
        .trim()
}
const whateverTransformer = (attribute) => (event) => 'whatever'


const addSuffix = (attribute) => (event) => event
    .split(' ')
    .map(word => {
        if (word.endsWith(attribute.value)) return word
        return word + attribute.value
    })
    .reduce((acc, word) => acc + word + ' ', "")
    .trim()

transformer.add('capital', capitalTransformer)
transformer.add('whatever', whateverTransformer)
transformer.add('addsuffix', addSuffix)

const validator = Validator()

const maxLength = (attribute) => (value) => {
    const length = attribute.value ? Number(attribute.value) : -1
    if (length < 0) return true

    return value.length <= length
}

const minLength = (attribute) => (value) => {
    const length = attribute.value ? Number(attribute.value) : -1
    if (length < 0) return true

    return value.length >= length
}

validator.add('max', maxLength)
validator.add('min', minLength)

const TodoController = () => {

    const Todo = () => {                                // facade
        const textAttr = Observable("text"); // we current don't expose it as we don't use it elsewhere
        textAttr.onChange(t => console.log(t))
        const doneAttr = Observable(false);
        return {
            getDone: doneAttr.getValue,
            setDone: doneAttr.setValue,
            onDoneChanged: doneAttr.onChange,
            setText: textAttr.setValue,
            getText: textAttr.getValue,
            onTextChanged: textAttr.onChange,
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {

        const newTodo = Todo();

        todoModel.add(newTodo);
        newTodo.setText('...');

        scheduler.add(ok =>
            fortuneService(text => {        // schedule the fortune service and proceed when done
                    newTodo.setText(text);
                    ok();
                }
            )
        );
    };

    return {
        numberOfTodos: todoModel.count,
        numberOfopenTasks: () => todoModel.countIf(todo => !todo.getDone()),
        addTodo: addTodo,
        addFortuneTodo: addFortuneTodo,
        removeTodo: todoModel.del,
        onTodoAdd: todoModel.onAdd,
        onTodoRemove: todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
                <button class="delete">&times;</button>
                <input type="text" size="42" max="15"  min="3" capital addsuffix="|" >
                <input type="checkbox" >            
            `;
            return template.children;
        }

        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick = _ => todoController.removeTodo(todo);
        transformer.registerInputElement(inputElement)
        validator.registerInputElement(inputElement)


        todoController.onTodoRemove((removedTodo, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        });

        todo.onTextChanged(() => inputElement.value = todo.getText());

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};
