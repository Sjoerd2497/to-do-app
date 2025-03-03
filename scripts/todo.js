export class TodoList {
    name;       // Name of this list, for example: "My to-do list"
    itemId;     // The id counter for the list items
    listItems;  // Array containing all ListEntries
    taskList;   // The list object on the web page containing list items

    /**
     * Create a new list.
     * @param {string} name 
     * @param {string} listId 
     */
    constructor(name, listId){
        this.name = name;
        this.taskList = document.getElementById(listId);
        this.itemId = 0;
        this.listItems = new Array();
    }

    // Add an item to the list. 
    addListEntry(itemText) {
        itemText.trim();
        if (itemText) {
            const listItem = new ListEntry(itemText, this.itemId);
            const documentFragment = listItem.getDocumentFragment();
            this.taskList.prepend(documentFragment);
            this.listItems[this.itemId] = listItem;
            this.itemId++;
        }
    }

    clearList(){
        [...this.taskList.children].forEach((element) => {
            if (element.checkbox.checked === true){
                element.remove();
            }
        });
    }

    // Move checked items to the bottom of the list.
    sortList(){
        this.listItems.forEach((element) => {
            console.log(element);
            if (element.checkbox.checked){
                taskList.appendChild(element);
            }
        });
    }
}



/**
 * A ListEntry is an item on a TodoList.
 * Each ListEntry has:  
 * `<li> <input type="checkbox"> <span>List item text</span> </li>`
 */
class ListEntry{
    li;         // The <li> that is the parent, is a flex container
    checkbox;   // The checkbox on the list item
    span;       // Contains the text for the list item
    listInput;  // Input field for editing the list item
    id;         // Identifier of this list item
    // Each list item part has its own CSS class:
    // li: "list-item"
    // checkbox: "checkbox"
    // span: "list-text" or "lsit-text-checked" when the checkbox is checked
    // listInput: "list-input"

    /** 
     * Create a DocumentFragment containing the contents of 1 ListItem.  
     * Each ListItem has:  
     * `<li> <input type="checkbox"> <span>List item text</span> </li>`
     * @param {string} listItemText  Whatever text should go into the list item
     * @param {string} id            A unique id for this list item
     * @returns A [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) (MDN Web Docs)
     * */
    constructor(listItemText, id) {
        this.id = "li" + id;
        this.li = this.createListItem(this.id);
        this.checkbox = this.createCheckbox();
        this.span = this.createListTextSpan(listItemText);
    }

    getDocumentFragment(){
        const listItemFragment = new DocumentFragment();
        this.li.append(this.checkbox, this.span);
        listItemFragment.append(this.li);
        return listItemFragment;
    }

    // Remove the span with the text, create text input
    editListItem(){
        if(this.checkbox.checked){return}
        this.listInput = this.createListInput(this.span.textContent)
        this.li.append(this.listInput);
        this.span.remove();
        this.listInput.focus();
        this.listInput.addEventListener("keydown", (event) => {
            // If the user presses the "Enter" key:
            if (event.key === "Enter"){
                const spanItemText = this.createListTextSpan();
                this.span.textContent = this.listInput.value.trim();
                this.listInput.remove();
                this.li.append(this.span);
            }  
        });

        this.listInput.addEventListener("focusout", (event) => {
            const spanItemText = this.createListTextSpan();
            this.span.textContent = this.listInput.value.trim();
            this.listInput.remove();
            this.checkbox.disabled = false; 
            this.li.append(this.span);
        });
    }

    clickCheckBox(){
        if (this.checkbox.checked === true){
            this.li.style.textDecoration = "line-through";
            this.span.setAttribute("class", "list-text-checked"); // Change style to remove the hover styling
        }
        else if (this.checkbox.checked === false){
            this.li.style.textDecoration = "none";
            this.span.setAttribute("class", "list-text");
        }
        //sortList();
    }

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
        checkbox.addEventListener('click', this.clickCheckBox.bind(this));
        return checkbox;
    }

    createListTextSpan(listItemText){
        const span = document.createElement("span");
        span.setAttribute("class", "list-text");
        span.textContent = listItemText;
        span.addEventListener('click', this.editListItem.bind(this)); // I hate JavaScript
        return span;
    }

    createListInput(textContent){
        const input = document.createElement("input");
        input.setAttribute("class", "list-input");
        input.value = textContent;
        return input;
    }
}