//import * as todo from './todo.js';
import * as utils from './utils.js';

// 1. Create function for document fragment of a list item
//      List item has...
//      - Checkbox
//      - Text
//      - Edit button/link
// 2. Create function to append list with fragment (create new list item)
// 3. ...

const myHeading = document.getElementById('dateText');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const clearButton = document.getElementById('clearButton');
const taskList = document.getElementById('taskList');
var itemId = 0;

/** 
 * Create a DocumentFragment containing the contents of 1 list item.  
 * Each list item has:  
 * `<li> <input type="checkbox"> <span>List item text</span> <a>(edit)</a> </li>`
 * 
 * @param listItemText  Whatever text should go into the list item
 * @returns A DocumentFragment
 * */
function createListItemFragment(listItemText){
    // Each list item has a class
    // li: "list-item"
    // input: "checkbox"
    // span: "list-text"
    // a: "edit-link"

    // <li id="list99" class="list-item"><input type="checkbox" class="checkbox" id="checkbox99" onclick="clickCheckBox(id)"><span class="list-text">List item 1</span><a href="javascript:void(0);" id="editlink99" onclick="editListItem(id)" class="edit-link">(edit)</a></li>

    const listItemFragment = new DocumentFragment();

    const li = document.createElement("li");
    li.setAttribute("class", "list-item");
    const input = document.createElement("input");
    input.setAttribute("class", "checkbox");
    input.setAttribute("type", "checkbox");
    const span = document.createElement("span");
    span.setAttribute("class", "list-text");
    span.textContent = listItemText;
    const a = document.createElement("a");
    a.setAttribute("class", "edit-link");
    a.setAttribute("href", "javascript:void(0)");

    listItemFragment.append(li,input,span,a);
    return listItemFragment;
}

// Update heading with current date:
myHeading.textContent = `${utils.day()}, ${new Date().getDate()} ${utils.month()}`;
// Example: Mon, 30 Dec

// ChatGPT code:
// Apply custom style to all external links;
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(location.hostname)) {
        link.classList.add('external-link');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Add item to list. Give listitem unique id. Add checkbox with similar id.
function addListItem(){
    const taskText = taskInput.value.trim();
    if (taskText) {
        const listItem = document.createElement('li');
        listItem.setAttribute("id", "list" + itemId);
        listItem.setAttribute("class", "list-item")
        const checkBox = createCheckBox(itemId);
        const editLink = createEditLink(itemId);
        
        listItem.textContent = taskText;
        listItem.insertAdjacentElement('afterbegin', checkBox);
        listItem.insertAdjacentElement('beforeend', editLink);
        taskList.prepend(listItem); // Adds to top of list! appendChild adds to bottom.
        taskInput.value = ''; // Clear the input
        itemId++;
    }
}


function createEditLink(id){
    const editLink = document.createElement('a');
    editLink.setAttribute("href","javascript:void(0);");
    editLink.setAttribute("id", "editlink" + id);
    editLink.setAttribute("onclick", "editListItem(id)")
    editLink.setAttribute("class", "edit-link");
    editLink.textContent = "(edit)";
    return editLink
}


function clickCheckBox(id){
    const checkBox = document.getElementById(id);
    // Extract number from id string:
    const idNumber = utils.extractNumberFromString(id);
    // Grab listitem with matching id number:
    const listItem = document.getElementById("list" + idNumber);
    
    if (checkBox.checked === true){
        listItem.style.textDecoration = "line-through";
        const editLink = document.getElementById("editlink" + idNumber).remove();
    }
    else if (checkBox.checked === false){
        listItem.style.textDecoration = "none";
        const editLink = createEditLink(idNumber);
        listItem.insertAdjacentElement('beforeend', editLink);
    }
    sortList();
}

function createCheckBox(id){
    const checkBox = document.createElement('input');
    checkBox.setAttribute("type","checkbox");
    checkBox.setAttribute("class", "checkbox");
    checkBox.setAttribute("id", "checkbox" + id);
    checkBox.setAttribute("onclick", "clickCheckBox(id)");
    return checkBox
}


function clearList(){
    [...taskList.children].forEach((element) => {
        const checkBoxId = "checkbox" + utils.extractNumberFromString(element.id);
        const checkBox = document.getElementById(checkBoxId);
        if (checkBox.checked === true){
            element.remove();
        }
    });
}


// Add event listeners for the Add button and when 'Enter' is pressed:
addTaskButton.addEventListener('click', addListItem);
taskInput.addEventListener('keydown', (event) =>{
    // If the user presses the "Enter" key:
    if (event.key === "Enter"){
        addListItem();
    }
});
clearButton.addEventListener('click', clearList);


window.editListItem = function(id){
    const listItem = document.getElementById("list" + utils.extractNumberFromString(id));
    const checkBox = document.getElementById("checkbox" + utils.extractNumberFromString(id));
    checkBox.disabled = true;
    const editLink = document.getElementById(id).remove();
    const listItemText = listItem.textContent;

    // ChatGPT code:
    listItem.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = ""; // Modify the text only
        }
    });

    // Create new input field
    const editInput = document.createElement('input');
    editInput.setAttribute("type", "text");
    editInput.setAttribute("class", "editinput")
    editInput.setAttribute("id", "editinput" + utils.extractNumberFromString(id));
    editInput.value = listItemText;
    listItem.insertAdjacentElement('beforeend', editInput);
    editInput.focus(); // Puts cursor in text input field
    editInput.addEventListener("keydown", (event) => {
        // If the user presses the "Enter" key:
        if (event.key === "Enter"){
            listItem.textContent = editInput.value.trim();
            checkBox.disabled = false;
            const editLink = createEditLink(utils.extractNumberFromString(id));
            listItem.insertAdjacentElement('afterbegin', checkBox);
            listItem.insertAdjacentElement('beforeend', editLink);
        }  
    });
}

// Move checked items to the bottom of the list.
function sortList(){
    [...taskList.children].forEach((element) => {
        const checkBoxId = "checkbox" + utils.extractNumberFromString(element.id);
        const checkBox = document.getElementById(checkBoxId);

        if (checkBox.checked === true){
            taskList.appendChild(element);
        }
    });
}



