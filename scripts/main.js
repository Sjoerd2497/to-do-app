import * as todo from "./todo.js";
import * as utils from "./utils.js";
import * as storage from "./storage.js";
import * as navbar from "./navbar.js";

// Fun things to investigate in the future:
// - Look into decorator patterns for the TodoList and ListEntry classes, if applicable
// - Recreate this project in React

const listTitleId = "listTitle";
const taskListId = "taskList";
const navBarId = "navBar";

const dateHeading = document.getElementById("dateText");
const titleHeading = document.getElementById(listTitleId);
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const clearButton = document.getElementById("clearButton");
const descriptionParagraph = document.getElementById("descriptionParagraph");
const editButton = document.getElementById("editButton");
const navElement = document.getElementById(navBarId);
let navBar = new navbar.NavBar(navElement);       // Creates the navbar



// The TodoList list that is displayed on the page
let pageList;

// Function for other scripts/classes to get the current pageList
export function getPageList(){
  return pageList;
}

// Function to display a list as the current pageList
export function displayList(listName) {
  // Clear all current list entries (childs of the taskList node)
  const listNode = document.getElementById(taskListId);
  while (listNode.firstChild) {
    listNode.removeChild(listNode.lastChild);
  }

  // Load list
  let listJSON = storage.loadList(listName);
  pageList = storage.rebuildListFromJSON(
    listJSON,
    listTitleId,
    taskListId,
    "descriptionParagraph"
  );

  // Rebuild navbar
  navBar.buildNavBar();
}
// window.displayList = displayList; // Make displayList() visible to the browser console

/**
 * ============================
 * Start of page load sequence:
 * ============================
 */

/**
 * 1. Load latest list, if any
 */
if (storage.getSavedListNames()) {
  let listName = storage.getSavedListNames()[0]; // Grab the first list name
  displayList(listName);
} else {
  pageList = new todo.TodoList(
    "My to-do list",
    "A to-do list can contain a description. The description can be used to explain what the list is about. It is placed in an editable <div> element, so you can just click here to start editing! The description is automatically saved for every character you enter.",
    listTitleId,
    taskListId,
    "descriptionParagraph"
  );
  pageList.onListMutation();
  navBar.buildNavBar();
}

/** 
 * 2. Update date heading with current date:
 */
dateHeading.textContent = `${utils.day()}, ${new Date().getDate()} ${utils.month()}`;
// Example: Mon, 30 Dec

/**
 *  3. Add event listeners:
 */
addTaskButton.addEventListener("click", (event) => {
  pageList.addListEntry(taskInput.value);
  taskInput.value = "";
});
taskInput.addEventListener("keydown", (event) => {
  // If the user presses the "Enter" key:
  if (event.key === "Enter") {
    pageList.addListEntry(taskInput.value);
    taskInput.value = ""; // Clear the input
  }
});
clearButton.addEventListener("click", pageList.clearList.bind(pageList));
// Save list description either on every keypress or focusout:
descriptionParagraph.addEventListener("keydown", (event) => {
  // If the user presses Shift + Enter:
  if (event.key === "Enter" && event.shiftKey) {
    descriptionParagraph.blur();
  }
  pageList.editDescription();
});
descriptionParagraph.addEventListener("focusout", (event) => {
  pageList.editDescription();
});
editButton.addEventListener("click", (event) => {
  pageList.editTitle();
  titleHeading.focus();
  const selectionRange = document.createRange();
  selectionRange.selectNodeContents(titleHeading);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(selectionRange);
  editButton.setAttribute("style", "display: none;");
});
titleHeading.addEventListener("keydown", (event) => {
  // If the user presses Enter:
  if (event.key === "Enter") {
    titleHeading.blur();
  }
});
titleHeading.addEventListener("focusout", (event) => {
  pageList.setTitle();
  navBar.buildNavBar();
  editButton.removeAttribute("style", "display: none;");
});

/**
 * 4. Apply custom style to all external links [ChatGPT code]
 */ 
document.querySelectorAll('a[href^="http"]').forEach((link) => {
  if (!link.href.includes(location.hostname)) {
    link.classList.add("external-link");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
});

