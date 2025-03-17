import * as todo from "./todo.js";
import * as utils from "./utils.js";
import * as storage from "./storage.js";

// Fun things to investigate in the future:
// - Look into decorator patterns for the TodoList and ListEntry classes, if applicable
// - Recreate this project in React once I learn it

const dateHeading = document.getElementById("dateText");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const clearButton = document.getElementById("clearButton");
const descriptionParagraph = document.getElementById("descriptionParagraph");

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
    "mylist",
    "This is a description of a to-do list.",
    "listTitle",
    "taskList",
    "descriptionParagraph"
  );
}

// Update date heading with current date:
dateHeading.textContent = `${utils.day()}, ${new Date().getDate()} ${utils.month()}`;
// Example: Mon, 30 Dec

// Add event listeners:
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
descriptionParagraph.addEventListener(
  "click",
  pageList.editDescription.bind(pageList)
);

// Apply custom style to all external links [ChatGPT code]
document.querySelectorAll('a[href^="http"]').forEach((link) => {
  if (!link.href.includes(location.hostname)) {
    link.classList.add("external-link");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
});
