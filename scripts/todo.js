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
    addListItem(itemText) {
        itemText.trim();
        if (itemText) {
            const listItem = TodoList.createListItemFragment(itemText, this.itemId);
            this.taskList.prepend(listItem); // prepend() adds to the top of the list
            this.itemId++;
        }
    }



    /** 
     * Create a DocumentFragment containing the contents of 1 list item.  
     * Each list item has:  
     * `<li> <input type="checkbox"> <span>List item text</span> <a>(edit)</a> </li>`
     * @param {string} listItemText  Whatever text should go into the list item
     * @param {string} id            A unique id for this list item
     * @returns A [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) (MDN Web Docs)
     * */
    static createListItemFragment(listItemText, id) {
        // Each list item has a class
        // li: "list-item"
        // input: "checkbox"
        // span: "list-text"
        // a: "edit-link"

        const listItemFragment = new DocumentFragment();

        const li = TodoList.createListItem(id);
        const input = TodoList.createCheckbox();
        const span = TodoList.createListTextSpan(listItemText);
        const a = TodoList.createEditLink();

        li.append(input, span, a);
        listItemFragment.append(li);
        
        return listItemFragment;
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
    


    static createListItem(id){
        const li = document.createElement("li");
        li.setAttribute("class", "list-item");
        li.setAttribute("id", id);
        return li;
    }



    static createCheckbox(){
        const input = document.createElement("input");
        input.setAttribute("class", "checkbox");
        input.setAttribute("type", "checkbox");
        input.addEventListener('click', TodoList.clickCheckBox)
        return input;
    }



    static createListTextSpan(listItemText){
        const span = document.createElement("span");
        span.setAttribute("class", "list-text");
        span.textContent = listItemText;
        return span;
    }



    static createEditLink(){
        const a = document.createElement('a');
        a.setAttribute("href","javascript:void(0);");
        a.setAttribute("class", "edit-link");
        a.textContent = "(edit)";
        a.addEventListener('click', TodoList.editListItem)
        return a;
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
            const checkBox = element.getElementByClassName("checkbox")[0];

            if (checkBox.checked === true){
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
class ListItem{
    // Each list item part has its own CSS class:
    // li: "list-item"
    // input: "checkbox"
    // span: "list-text"
    // a: "edit-link"

    //
    // Class fields:
    //
    li;         // The <li> that is the parent, is a flex container
    input;      // The checkbox on the list item
    span;       // Contains the text for the list item
    a;          // The edit link to edit the list item
    checked;    // Whether the item is checked or not ('completed')

    //
    // Class methods:
    //
    /** 
     * Create a DocumentFragment containing the contents of 1 ListItem.  
     * Each ListItem has:  
     * `<li> <input type="checkbox"> <span>List item text</span> <a>(edit)</a> </li>`
     * @param {string} listItemText  Whatever text should go into the list item
     * @param {string} id            A unique id for this list item
     * @returns A [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) (MDN Web Docs)
     * */
    constructor(listItemText, id) {
        const listItemFragment = new DocumentFragment();

        this.li = TodoList.createListItem(id);
        this.input = TodoList.createCheckbox();
        this.span = TodoList.createListTextSpan(listItemText);
        this.a = TodoList.createEditLink();
        this.checked = false;

        this.li.append(this.input, this.span, this.a);
        listItemFragment.append(this.li);
        
        return listItemFragment;
    }
    
}