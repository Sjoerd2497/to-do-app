import * as utils from './utils.js';
import * as storage from './storage.js';
export class TodoList { // Rename this class? 'CustomList', 'GenericList', ...?

    name;               // Name of this list, for example: "My to-do list"
    itemIdCounter;      // The id counter for the list items
    listEntries;        // Array containing all items (objects of the ListEntry class)
    taskList;           // The list object on the web page containing list items

    /**
     * Create a new list.
     * @param {string} name 
     * @param {string} listId 
     */
    constructor(name, listId){
        this.name = name;
        this.taskList = document.getElementById(listId);
        this.itemIdCounter = 0;
        this.listEntries = new Array();
    }

    // Is called everytime the TodoList or a ListEntry is changed
    onListMutation(){
        storage.saveList(this);
    }

    // Add an item to the list. 
    addListEntry(itemText) {
        itemText.trim();
        if (itemText) {
            const listEntry = new ListEntry(itemText, this.itemIdCounter, this.sortList.bind(this), this.onListMutation.bind(this));
            this.taskList.prepend(listEntry.docFragment);
            this.listEntries[this.itemIdCounter] = listEntry;
            this.itemIdCounter++;
            console.log(this);
        }
        this.onListMutation();
    }

    // Remove an item from the list
    removeListEntry(id) {
        // Remove text from id:
        id = utils.extractNumberFromString(id);
        // Remove the <li> from the DOM
        this.listEntries[id].li.remove();
        // Set ListEntry object to null
        this.listEntries[id] = null;
        // Remove ListEntry object from array
        this.listEntries.splice(id,1);
        console.log(this);
        this.onListMutation();
    }

    // Remove checked items from the list
    clearList(){
        this.listEntries.forEach((element) => {
            if (element.checkbox.checked){
                this.removeListEntry(element.id)
            }
        });
        this.onListMutation();
    }

    // Move checked items to the bottom of the list.
    sortList(){
        let indices = [];
        this.listEntries.forEach((element, index) => {
            if (element.checked){
                taskList.appendChild(element.li);
                
                console.log("ListEntry id: " + element.id + ",index: " + index);
                // Add the index of the checked element to the indices array
                indices.push(index);
                console.log(indices);
            }
        });
        // Reorder ListEntries after loop finishes
        indices.forEach((element) => {
            utils.moveToEndOfArray(this.listEntries, element);
            //this.listEntries // move index to the bo
        });
        this.onListMutation();
    }

    // Export only the necessary properties required to rebuild the list
    // toJSON(){

    // }
}



/**
 * A ListEntry is an item on a TodoList.
 * Each ListEntry has:  
 * `<li> <input type="checkbox"> <span>List item text</span> </li>`
 */
class ListEntry{
// Question: Would it be better to make everything private? Or everything public? Is using a get/set method for entryText a good choice?

    id;             // Identifier of this list item
    entryText;     // The text of the list item
    setEntryText(text){this.entryText = text;}
    getEntryText(){return this.entryText;}
    li;             // The <li> that is the parent, is a flex container
    checkbox;       // The checkbox on the list item
    span;           // Contains the text for the list item
    listInput;      // Input field for editing the list item
    checked;        // Bool whether the ListEntry is checked.
    docFragment;    // The document fragment of the list item to be added to the list
                    // The fragment has the form: 
                    // `<li> <input type="checkbox"> <span>List item text</span> </li>`
    sortList;       // The the sortList() function of the TodoList parent
    onListMutation  // The onListMutation() funciton of the TodoList parent
                    
    // Each list item part has its own CSS class:
    // li: "list-item"
    // checkbox: "checkbox"
    // span: "list-text" or "list-text-checked" when the checkbox is checked
    // listInput: "list-input"

    /** 
     * Create a ListEntry.  
     * Each ListItem has:  
     * `<li> <input type="checkbox"> <span>List item text</span> </li>`
     * @param {string} listEntryText  Whatever text should go into the list item
     * @param {string} id             A unique id for this list item
     * @param {function} sortList     The the sortList() function of the TodoList parent
     * @param {function} onListMutation   The onListMutation() funciton of the TodoList parent
     * */
    constructor(listEntryText, id, sortList, onListMutation) {
        this.id = "li" + id;
        this.setEntryText(listEntryText);
        this.li = this.createListItem(this.id);
        this.checkbox = this.createCheckbox();
        this.span = this.createListTextSpan(this.getEntryText());
        this.checked = false;
        this.docFragment = this.createDocumentFragment();
        this.sortList = sortList;
        this.onListMutation = onListMutation;
    }

    // Create a DocumentFragment containing the contents of 1 ListItem.  
    createDocumentFragment(){
        const listItemFragment = new DocumentFragment();
        this.li.append(this.checkbox, this.span);
        listItemFragment.append(this.li);
        return listItemFragment;
    }

    // Removes the span with the text, create text input
    editListItem(){
        if(this.checkbox.checked){return;}
        
        // Swap <span> for <input>
        this.listInput = this.createListInput(this.getEntryText());
        this.li.append(this.listInput);
        this.span.remove();
        this.listInput.focus();

        // Save the changes on [Enter] or focusout:
        this.listInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter"){
                this.saveListItem();
            }  
        });
        this.listInput.addEventListener("focusout", (event) => {
            this.saveListItem();
        });
    }

    saveListItem(){
        // Update the entryText
        this.setEntryText(this.listInput.value.trim());
        // Switch <input> for <span> and set its text:
        this.listInput.remove();
        this.li.append(this.span);
        this.span.textContent = this.getEntryText(); 
        this.onListMutation(); // List is changed!       
    }

    clickCheckbox(){
        if (this.checkbox.checked === true){
            this.checked = true;
            this.li.style.textDecoration = "line-through";
            this.span.setAttribute("class", "list-text-checked"); // Change style to remove the hover styling
        }
        else if (this.checkbox.checked === false){
            this.checked = false;
            this.li.style.textDecoration = "none";
            this.span.setAttribute("class", "list-text");
        }
        this.sortList();
        this.onListMutation(); // List is changed!
    }

    // Creating the elements that are part of a ListEntry (<li>, <input checkbox>, <span> and <input>)

    createListItem(id){
        const li = document.createElement("li");
        li.setAttribute("class", "list-item");
        li.setAttribute("id", id);
        return li;
    }

    createCheckbox(){
        const checkbox = document.createElement("input");
        checkbox.setAttribute("class", "checkbox");
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener('click', this.clickCheckbox.bind(this));
        return checkbox;
    }

    createListTextSpan(listItemText){
        const span = document.createElement("span");
        span.setAttribute("class", "list-text");
        span.textContent = listItemText;
        span.addEventListener('click', this.editListItem.bind(this)); // I don't like using 'this' in JavaScript
        return span;
    }

    createListInput(textContent){
        const input = document.createElement("input");
        input.setAttribute("class", "list-input");
        input.value = textContent;
        return input;
    }
}