import * as todo from "./todo.js";
import * as utils from "./utils.js";
import * as storage from "./storage.js";

// Fun things to investigate in the future:
// - Look into decorator patterns for the TodoList and ListEntry classes, if applicable
// - Recreate this project in React once I learn it

const dateHeading = document.getElementById("dateText");
const titleHeading = document.getElementById("listTitle");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const clearButton = document.getElementById("clearButton");
const descriptionParagraph = document.getElementById("descriptionParagraph");
const editButton = document.getElementById("editButton");

// The TodoList list that is displayed on the page
let pageList;

// Load latest list, if any
if (storage.getSavedListNames()) {
  let listName = storage.getSavedListNames()[0]; // Grab the first list name
  let listJSON = storage.loadList(listName);
  pageList = storage.rebuildListFromJSON(
    listJSON,
    "listTitle",
    "taskList",
    "descriptionParagraph"
  );
} else {
  pageList = new todo.TodoList(
    "My to-do list",
    "A to-do list can contain a description. The description can be used to explain what the list is about. It is placed in an editable <div> element, so you can just click here to start editing! The description is automatically saved for every character you enter.",
    "listTitle",
    "taskList",
    "descriptionParagraph"
  );
}

// Update date heading with current date:
dateHeading.textContent = `${utils.day()}, ${new Date().getDate()} ${utils.month()}`;
// Example: Mon, 30 Dec

/**
 *
 *  Add event listeners:
 *
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
});
// Apply custom style to all external links [ChatGPT code]
document.querySelectorAll('a[href^="http"]').forEach((link) => {
  if (!link.href.includes(location.hostname)) {
    link.classList.add("external-link");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
});
