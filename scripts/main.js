import * as todo from './todo.js';
import * as utils from './utils.js';

// Fun things to investigate in the future:
// - Look into decorator patterns for the TodoList and ListEntry classes
// - Recreate this project in React once I learn it

// 0. Create a class for a list.
//      The class has...
//      - A list item id counter (increases for each item created)
//      - List items
// 1. Create function for document fragment of a list item
//      List item has...
//      - Checkbox
//      - Text
//      - Edit button/link
// 2. Create function to append list with fragment (create new list item)
// 3. ...

// Load list if there is one
// Create list if there is none
// 

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







