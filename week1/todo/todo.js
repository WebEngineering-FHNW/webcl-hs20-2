// requires ../observable/observable.js
// requires ../transformer/transformer.js
// requires ./fortuneService.js
// requires ../dataflow/dataflow.js


const transformer = Transformers()

const capitalTransformer = (event) => {
    return event
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .reduce((acc, word) => acc + word + ' ', "")
        .trim()
}
const whateverTransformer = (event) => {
    return 'whatever'
}

const addSuffix = (event) => {
    return event
        .split(' ')
        .map(word => word + "-suffix")
        .reduce((acc, word) => acc + word + ' ', "")
        .trim()
}
transformer.add('capital', capitalTransformer)

transformer.add('whatever', whateverTransformer)
transformer.add('addsuffix', addSuffix)

const TodoController = () => {

    const Todo = () => {                                // facade
        const textAttr = Observable("text");            // we current don't expose it as we don't use it elsewhere
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
                <input type="text" size="42" whatever capital addsuffix>
                <input type="checkbox" >            
            `;
            return template.children;
        }

        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick = _ => todoController.removeTodo(todo);
        inputElement.onblur = value => {
            const fns = transformer
                .get(Array.prototype.slice.call(inputElement.attributes).map(att => att.name));
            let transformed = value.target.value
            for (let i = 0; i < fns.length; i++) {
                transformed = fns[i](transformed)
            }
            inputElement.value = transformed
        }

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
