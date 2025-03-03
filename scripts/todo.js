export class TodoList {
    //
    // Class fields:
    //
    name;       // Name of this list, for example: "My to-do list"
    itemId;     // The id counter for the list items
    taskList;   // The list object on the web page containing list items

    //
    // Class methods:
    //
    /**
     * Create a new list.
     * @param {string} name 
     * @param {string} listId 
     */
    constructor(name, listId){
        this.name = name;
        this.taskList = document.getElementById(listId);
        this.itemId = 0;
    }



    // Add an item to the list. 
    addListEntry(itemText) {
        itemText.trim();
        if (itemText) {
            const listItem = new ListEntry(itemText, this.itemId);
            this.taskList.prepend(listItem);
            this.itemId++;
        }
    }
    


    /**
     * Edit an item from the list.
     * @param {string} listId       The id of the list item to-be-edited
     */
    static editListItem(event){
        const editLink = event.target;
        const listItem = editLink.parentNode;
        const checkBox = listItem.getElementsByClassName("checkbox")[0];
        const spanItemText = listItem.getElementsByClassName("list-text")[0];
        checkBox.disabled = true; // Disable checkbox
        editLink.remove(); // Remove edit link

    
        // [ChatGPT code]
        listItem.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = ""; // Modify the text only
            }
        });
    
        // Create new input field
        const editInput = document.createElement('input');
        editInput.setAttribute("type", "text");
        editInput.setAttribute("class", "editinput")
        editInput.value = spanItemText.textContent;
        spanItemText.remove();

        listItem.insertAdjacentElement('beforeend', editInput);
        editInput.focus(); // Puts cursor in text input field
        editInput.addEventListener("keydown", (event) => {
            // If the user presses the "Enter" key:
            if (event.key === "Enter"){
                const spanItemText = TodoList.createListTextSpan();
                spanItemText.textContent = editInput.value.trim();
                editInput.remove();
                checkBox.disabled = false; 
                const editLink = TodoList.createEditLink();
                listItem.insertAdjacentElement('afterbegin', spanItemText);
                listItem.insertAdjacentElement('afterbegin', checkBox);
                listItem.insertAdjacentElement('beforeend', editLink);
            }  
        });
    }



    static clickCheckBox(event){
        const checkBox = event.target;
        // Grab listitem which is the parent of the checkbox:
        const listItem = checkBox.parentNode;
        
        if (checkBox.checked === true){
            listItem.style.textDecoration = "line-through";
            listItem.getElementByClassName("edit-link")[0].remove();
        }
        else if (checkBox.checked === false){
            listItem.style.textDecoration = "none";
            const editLink = TodoList.createEditLink();
            listItem.insertAdjacentElement('beforeend', editLink);
        }
        sortList();
    }

    clearList(){
        [...this.taskList.children].forEach((element) => {
            const checkBox = element.getElementByClassName("checkbox")[0];
            if (checkBox.checked === true){
                element.remove();
            }
        });
    }

    // Move checked items to the bottom of the list.
    sortList(){
        [...this.taskList.children].forEach((element) => {
            if (element.checkbox.checked){
                taskList.appendChild(element);
            }
        });
    }
}



/**
 * A ListItem is item on a TodoList.
 * 
 * Each list item has:  
 * `<li> <input type="checkbox"> <span>List item text</span> <a>(edit)</a> </li>`
 */
class ListEntry{
    //
    // Class fields:
    //
    li;         // The <li> that is the parent, is a flex container
    checkbox;   // The checkbox on the list item
    span;       // Contains the text for the list item
    listInput;  // Input field for editing the list item
    id;         // Identifier of this list item

    // Each list item part has its own CSS class:
    // li: "list-item"
    // input: "checkbox"
    // span: "list-text"
    // a: "edit-link"

    //
    // Class methods:
    //
    /** 
     * Create a DocumentFragment containing the contents of 1 ListItem.  
     * Each ListItem has:  
     * `<li> <input type="checkbox"> <span>List item text</span> </li>`
     * @param {string} listItemText  Whatever text should go into the list item
     * @param {string} id            A unique id for this list item
     * @returns A [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) (MDN Web Docs)
     * */
    constructor(listItemText, id) {
        const listItemFragment = new DocumentFragment();
        this.id = id;
        this.li = this.createListItem(this.id);
        this.checkbox = this.createCheckbox();
        this.span = this.createListTextSpan(listItemText);
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
        }
        else if (this.checkbox.checked === false){
            this.li.style.textDecoration = "none";
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