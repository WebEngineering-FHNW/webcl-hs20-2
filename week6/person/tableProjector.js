import {EDITABLE, LABEL, VALID, VALUE} from "../presentationModel/presentationModel.js";

export {listItemProjector, formProjector, pageCss}

const masterClassName = 'instant-update-master'; // should be unique for this projector
const detailClassName = 'instant-update-detail';


const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
            ? inputElement.classList.remove("invalid")
            : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
            ? inputElement.removeAttribute("readonly")
            : inputElement.setAttribute("readonly", true));

    textAttr.getObs(LABEL, '').onChange(label => inputElement.setAttribute("title", label));
};

const tableDataProjector = textAttr => {

    const td = document.createElement("TD")
    const inputElement = document.createElement("INPUT");
    td.appendChild(inputElement)
    inputElement.type = "text";
    inputElement.size = 20;
    inputElement.classList.add("inputField")

    bindTextInput(textAttr, inputElement);

    return [td, inputElement];
};

const listItemTable = (() => {
    let hasHeader = false;
    const tbody = document.createElement('TBODY');
    const table = document.createElement('TABLE');
    const headerRow = document.createElement('TR');
    tbody.appendChild(headerRow);
    table.appendChild(tbody);

    return {
        table: table,
        tbody: tbody,
        header: headerRow,
        hasHeader: hasHeader,
    }
})();

const listItemProjector = (masterController, selectionController, rootElement, model, attributeNames) => {

    if (!listItemTable.hasHeader) {
        attributeNames.forEach(name => {
            const headerData = document.createElement("TH")
            headerData.innerText = name.toUpperCase();
            listItemTable.header.appendChild(headerData)
        })
        const headerDataDelete = document.createElement("TH");
        headerDataDelete.style.width = "20px";
        listItemTable.header.appendChild(headerDataDelete)
        listItemTable.hasHeader = true;
    }

    const itemRow = (_ => {
        const itemRow = document.createElement("TR")
        const inputElementsData = [];

        attributeNames.forEach(name => {
            const [td, inputElement] = tableDataProjector(model[name]);
            inputElement.onfocus = _ => selectionController.setSelectedModel(model);
            inputElementsData.push(td);
        });

        inputElementsData.forEach(inputElement => {
            itemRow.appendChild(inputElement)
        });

        return itemRow;
    })();

    const deleteButton = (_ => {
        const td = document.createElement("TD")
        const deleteButton = document.createElement("Button");
        deleteButton.setAttribute("class", "delete");
        deleteButton.className.concat("deleteButton")
        deleteButton.innerHTML = "&times;";
        deleteButton.onclick = _ => masterController.removeModel(model);
        td.appendChild(deleteButton);
        (function setBinding() {
            selectionController.onModelSelected(
                selected => selected === model
                    ? deleteButton.classList.add("selected")
                    : deleteButton.classList.remove("selected")
            );
        })()
        return td;
    })();

    (function setControllerBinding() {
        masterController.onModelRemove((removedModel, removeMe) => {
            if (removedModel !== model) return;
            itemRow.remove()
            selectionController.clearSelection();
            removeMe();
        });
    })()

    itemRow.addEventListener("mouseover", () => selectionController.setSelectedModel(model));

    itemRow.appendChild(deleteButton);
    listItemTable.tbody.append(itemRow);
    rootElement.appendChild(listItemTable.table);
    rootElement.classList.add(masterClassName);
    selectionController.setSelectedModel(model);
};


const formProjector = (detailController, rootElement, model, attributeNames) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="${detailClassName}">
        </DIV>
    </FORM>`;
    const detailFormElement = divElement.querySelector("." + detailClassName);

    attributeNames.forEach(attributeName => {
        const labelElement = document.createElement("LABEL"); // add view for attribute of this name
        labelElement.setAttribute("for", attributeName);
        const inputElement = document.createElement("INPUT");
        inputElement.setAttribute("TYPE", "text");
        inputElement.setAttribute("SIZE", "20");
        inputElement.setAttribute("ID", attributeName);
        detailFormElement.appendChild(labelElement);
        detailFormElement.appendChild(inputElement);

        bindTextInput(model[attributeName], inputElement);
        model[attributeName].getObs(LABEL, '').onChange(label => labelElement.textContent = label);
    });

    if (rootElement.firstChild) {
        rootElement.firstChild.replaceWith(divElement);
    } else {
        rootElement.appendChild(divElement);
    }
};


const pageCss = `
    .${masterClassName} {
        width:100%;
        table-layout:fixed;
        color: black;
    }
    
    .${masterClassName} table {
        width:100%;
        table-layout:fixed;
        border-collapse: collapse;
    }
    
    .card {
        background-image: linear-gradient(to left bottom, #1570ae, #008fb9, #2babba, #6cc4b7, #a5dbba);
    }
    
    tr:nth-child(even):hover {
        background-color: rgb(21, 112, 174, 0.2);
    }
    
    tr:hover {
        background-color: rgb(21, 112, 174, 0.2);
    }
   
    .delete:hover {
        transform: scale(1.6);
    }
   
    .selected {
        box-shadow: 0 0 0 0;   
    }
   
    th {
        padding: 15px;
        text-align: left;
        border-bottom: solid 2px rgb(21, 112, 174);
    }
   
    td {
        padding: 15px;
        text-align: left;
        vertical-align:middle;
        border-bottom: solid 1px rgb(21, 112, 174);
    }
   
    .inputField {
        margin: 0;
        height: 100%;
        width: 100%;
    }
   
    input[type=text] {
        font-size: 1.1em;
        background: none;  
        border: none; 
        color: black;
    }

    input[type=text]:focus {
        transition: none;
    }

    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
    
    .${detailClassName} input {
        background: none;
        border: 1px solid rgb(21, 112, 174);
        margin-bottom: 2px
    }
`;
