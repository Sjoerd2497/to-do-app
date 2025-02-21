const myHeading = document.getElementById('dateText');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const clearButton = document.getElementById('clearButton');
const taskList = document.getElementById('taskList');
var itemId = 0;

// Update heading with current date:
myHeading.textContent = `${day()}, ${month()} ${new Date().getDate()}`;
// Example: Monday, December 30

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
    const checkBox = document.getElementById("checkbox" + extractNumberFromString(id)).remove();
    const editLink = document.getElementById(id).remove();
    const listItemText = listItem.textContent;
    listItem.textContent = "";

    // Create new input field
    const editInput = document.createElement('input');
    editInput.setAttribute("type", "text");
    editInput.setAttribute("class", "editinput")
    editInput.setAttribute("id", "editinput" + extractNumberFromString(id));
    editInput.value = listItemText;
    listItem.insertAdjacentElement('afterbegin', editInput);
    editInput.focus(); // Puts cursor in text input field
    editInput.addEventListener("keydown", (event) => {
        // If the user presses the "Enter" key:
        if (event.key === "Enter"){
            listItem.textContent = editInput.value.trim();
            const checkBox = createCheckBox(extractNumberFromString(id));
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
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[new Date().getDay()];
    return day
}

function month(){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"];
    const month = months[new Date().getMonth()];
    return month
}
