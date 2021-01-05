/**
 * @module Controllers as shallow wrappers around observables
 */
import { ObservableList, Observable }   from "../observable/observable.js";
import { EDITABLE, VALUE }              from "../presentationModel/presentationModel.js"
import { reset, Person }                from "./person.js"

export { ListController, SelectionController }

const ListController = modelConstructor => {

    const listModel = ObservableList([]); // observable array of models, this state is private

    return {
        addModel:            () => listModel.add(modelConstructor()),
        removeModel:         listModel.del,
        onModelAdd:          listModel.onAdd,
        onModelRemove:       listModel.onDel,
    }
};

const noSelection = reset(Person());
noSelection.firstname.setQualifier("Person.none.firstname");
noSelection.lastname .setQualifier("Person.none.lastname");
noSelection.detailed .setQualifier("Person.none.detailed");
noSelection.detailed .getObs(VALUE).setValue(false);
noSelection.firstname.getObs(EDITABLE).setValue(false);
noSelection.lastname .getObs(EDITABLE).setValue(false);

const SelectionController = model => {

    const selectedModelObs = Observable(model);

    return {
        setSelectedModel : selectedModelObs.setValue,
        getSelectedModel : selectedModelObs.getValue,
        onModelSelected  : selectedModelObs.onChange,
        clearSelection   : () => selectedModelObs.setValue(noSelection),
    }
};
