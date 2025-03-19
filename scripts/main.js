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
const dateTextId = "dateText";
const taskInputId = "taskInput";
const addTaskButtonId = "addTaskButton";
const clearButtonId = "clearButton";
const descriptionParagraphId = "descriptionParagraph";
const editButtonId = "editButton";
const newListButtonId = "newListButton";

const dateHeading = document.getElementById(dateTextId);
const titleHeading = document.getElementById(listTitleId);
const taskInput = document.getElementById(taskInputId);
const addTaskButton = document.getElementById(addTaskButtonId);
const clearButton = document.getElementById(clearButtonId);
const descriptionParagraph = document.getElementById(descriptionParagraphId);
const editButton = document.getElementById(editButtonId);
const newListButton = document.getElementById(newListButtonId);
const navElement = document.getElementById(navBarId);
let navBar = new navbar.NavBar(navElement); // Creates the navbar
const defaultList = new todo.TodoList(
  "My first to-do list",
  "This is the description of the to-do list. It is placed in an editable <div> element, so you can just click on this to start editing! The description is automatically saved for every character you enter. You can also edit the title of this list (hover over it!).",
  listTitleId,
  taskListId,
  descriptionParagraphId
);
export const newListDescription = "Enter the list description here.";

// The TodoList list that is displayed on the page
let pageList;

// Function for other scripts/classes to get the current pageList
export const getPageList = () => pageList;
// window.getPageList = getPageList; // Make getPageList() available to browser console

export function setDefaultPageList() {
  pageList = defaultList;
  pageList.onListMutation();
  displayList(pageList.title);
  onPageChange();
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
  pageList = storage.rebuildListFromJSON(listJSON, listTitleId, taskListId, descriptionParagraphId);
  onPageChange();
}

export function onPageChange() {
  // Rebuild navbar
  navBar.buildNavBar();

  // Set current list as highlighted in navbar
  navBar.setActiveNavItem(getPageList().title);

  // Update dateHeading with current date:
  dateHeading.textContent = `${utils.day()}, ${new Date().getDate()} ${utils.month()}`;
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
  setDefaultPageList();
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
  onPageChange();
});
taskInput.addEventListener("keydown", (event) => {
  // If the user presses the "Enter" key:
  if (event.key === "Enter") {
    pageList.addListEntry(taskInput.value);
    taskInput.value = ""; // Clear the input
    onPageChange();
  }
});
clearButton.addEventListener("click", (event) => {
  getPageList().clearList();
  onPageChange();
});
// Save list description either on every keypress or focusout:
descriptionParagraph.addEventListener("keydown", (event) => {
  // If the user presses Shift + Enter:
  if (event.key === "Enter" && event.shiftKey) {
    descriptionParagraph.blur();
  }
  pageList.editDescription();
  onPageChange();
});
descriptionParagraph.addEventListener("focusout", (event) => {
  pageList.editDescription();
  onPageChange();
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
  onPageChange();
});
newListButton.addEventListener("click", () => {
  let nameTemplate = `${utils.day()}, ${new Date().getDate()} ${utils.month()} ${utils.year()}`;
  let newListName = nameTemplate;
  let i = 1;
  // Check if name is available
  while (storage.listNameExists(newListName)) {
    let appendix = ` (${i})`;
    newListName = nameTemplate + appendix;
    i++;
  }
  // Create a new list
  pageList = new todo.TodoList(
    newListName,
    newListDescription,
    listTitleId,
    taskListId,
    descriptionParagraphId
  );
  pageList.onListMutation();
  displayList(pageList.title);
  onPageChange();
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
