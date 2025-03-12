import * as todo from './todo.js';
import * as utils from './utils.js';

// Fun things to investigate in the future:
// - Look into decorator patterns for the TodoList and ListEntry classes
// - Recreate this project in React once I learn it


// If list-names is not empty:
// 1 Load list names
// 2 Place list names in sidebar
// 3 Load the first list
// 
// If list-names is empty:
// 1 Create new default list

const myHeading = document.getElementById('dateText');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const clearButton = document.getElementById('clearButton');
const taskList = document.getElementById('taskList');
var itemId = 0;

// Update heading with current date:
myHeading.textContent = `${utils.day()}, ${new Date().getDate()} ${utils.month()}`;
// Example: Mon, 30 Dec

// Apply custom style to all external links [ChatGPT code]
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(location.hostname)) {
        link.classList.add('external-link');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Create a list class
const myList = new todo.TodoList("mylist","taskList");

// Add event listeners for the Add button and when 'Enter' is pressed:
addTaskButton.addEventListener('click', (event) =>{
    myList.addListEntry(taskInput.value);
    taskInput.value = '';
});
taskInput.addEventListener('keydown', (event) =>{
    // If the user presses the "Enter" key:
    if (event.key === "Enter"){
        myList.addListEntry(taskInput.value);
        taskInput.value = ''; // Clear the input
    }
});
clearButton.addEventListener('click', myList.clearList.bind(myList));







