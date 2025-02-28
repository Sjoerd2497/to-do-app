const myHeading = document.getElementById('dateText');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const clearButton = document.getElementById('clearButton');
const taskList = document.getElementById('taskList');
var itemId = 0;

// Update heading with current date:
myHeading.textContent = `${day()}, ${new Date().getDate()} ${month()}`;
// Example: Mon, 30 Dec

// Apply custom style to all external links;
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(location.hostname)) {
        link.classList.add('external-link');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Add event listeners for the Add button and when 'Enter' is pressed:
addTaskButton.addEventListener('click', addListItem);
taskInput.addEventListener('keydown', (event) =>{
    // If the user presses the "Enter" key:
    if (event.key === "Enter"){
        addListItem();
    }
});
clearButton.addEventListener('click', clearList);

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

function clearList(){
    [...taskList.children].forEach((element) => {
        const checkBoxId = "checkbox" + extractNumberFromString(element.id);
        const checkBox = document.getElementById(checkBoxId);
        if (checkBox.checked === true){
            element.remove();
        }
    });
}

function createCheckBox(id){
    const checkBox = document.createElement('input');
    checkBox.setAttribute("type","checkbox");
    checkBox.setAttribute("class", "checkbox");
    checkBox.setAttribute("id", "checkbox" + id);
    checkBox.setAttribute("onclick", "clickCheckBox(id)");
    return checkBox
}

function createEditLink(id){
    const editLink = document.createElement('a');
    editLink.setAttribute("href","javascript:void(0);");
    editLink.setAttribute("id", "editlink" + id);
    editLink.setAttribute("onclick", "editListItem(id)")
    editLink.setAttribute("class", "editlink");
    editLink.textContent = "(edit)";
    return editLink
}

function clickCheckBox(id){
    const checkBox = document.getElementById(id);
    // Extract number from id string:
    const idNumber = extractNumberFromString(id);
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

function editListItem(id){
    const listItem = document.getElementById("list" + extractNumberFromString(id));
    const checkBox = document.getElementById("checkbox" + extractNumberFromString(id));
    checkBox.disabled = true;
    const editLink = document.getElementById(id).remove();
    const listItemText = listItem.textContent;
    listItem.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = ""; // Modify the text only
        }
    });

    // Create new input field
    const editInput = document.createElement('input');
    editInput.setAttribute("type", "text");
    editInput.setAttribute("class", "editinput")
    editInput.setAttribute("id", "editinput" + extractNumberFromString(id));
    editInput.value = listItemText;
    listItem.insertAdjacentElement('beforeend', editInput);
    editInput.focus(); // Puts cursor in text input field
    editInput.addEventListener("keydown", (event) => {
        // If the user presses the "Enter" key:
        if (event.key === "Enter"){
            listItem.textContent = editInput.value.trim();
            checkBox.disabled = false;
            const editLink = createEditLink(extractNumberFromString(id));
            listItem.insertAdjacentElement('afterbegin', checkBox);
            listItem.insertAdjacentElement('beforeend', editLink);
        }  
    });
}

function extractNumberFromString(text){
    const numberArr = text.match(/(\d+)/);
    const number = numberArr[0];
    return number;
}

// Move checked items to the bottom of the list.
function sortList(){
    [...taskList.children].forEach((element) => {
        const checkBoxId = "checkbox" + extractNumberFromString(element.id);
        const checkBox = document.getElementById(checkBoxId);
        if (checkBox.checked === true){
            taskList.appendChild(element);
        }
    });
}

function day(){
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = days[new Date().getDay()];
    return day
}

function month(){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
    const month = months[new Date().getMonth()];
    return month
}

