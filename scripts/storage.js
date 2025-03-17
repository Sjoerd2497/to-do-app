import * as todo from "./todo.js";
// I will use LocalStorage for now
// In the future I might look into IndexedDB as a fun exercise!

// In local storage there is "list_names" containing an array of names of the lists that are saved.
// Each list name is also a key for the JSON containing the data of that list.
// If list_names is null, there are no saved lists yet.

// Example of localStorage:
// KEY:                     CONTAINS:
// list_names               ["mylist", "list number two", "groceries"]
// mylist                   a JSON of the TodoList with name 'mylist' with all ListEntry instances
// list number two          a JSON of the TodoList with name 'list number two' with all ListEntry instances
// groceries                a JSON of the TodoList with name 'groceries' with all ListEntry instances

/**
 * Save list in localStorage
 * @param {TodoList} obj
 */
export function saveList(obj) {
  const listJSON = JSON.stringify(obj);
  // Add a check for list name duplicates?
  localStorage.setItem(obj.title, listJSON); // The key is the list name
  // Store the name of the list
  storeListNames(obj.title);
  console.log(listJSON);
}

/**
 * Load list from localStorage
 * @param {string} listKey
 * @returns {JSON} listJSON
 */
export function loadList(listKey) {
  let listJSON = localStorage.getItem(listKey);
  return listJSON;
}

export function getSavedListNames() {
  if (localStorage.getItem("list_names")) {
    return JSON.parse(localStorage.getItem("list_names"));
  }
  return null;
}

/**
 * Rebuild a list from a JSON
 * @param {JSON} listJSON
 * @param {string} titleId
 * @param {string} listId
 * @param {string} paragraphId
 */
export function rebuildListFromJSON(listJSON, titleId, listId, paragraphId) {
  let parsedJSON = JSON.parse(listJSON);
  // create new TodoList().
  let rebuiltList = new todo.TodoList(
    parsedJSON.title,
    parsedJSON.description,
    titleId,
    listId,
    paragraphId
  );
  // addListEntry() in order for each ListEntry
  for (let i = 0; i <= parsedJSON.listEntries.length - 1; i++) {
    rebuiltList.addListEntry(
      parsedJSON.listEntries[i].entryText,
      parsedJSON.listEntries[i].checked
    );
  }
  return rebuiltList;
}

function storeListNames(listName) {
  let existsInMemory = !!localStorage.getItem("list_names");
  let list_names = existsInMemory
    ? JSON.parse(localStorage.getItem("list_names"))
    : [];
  // Check if listName already exists in the list_names array:
  let listNameExists = false;
  list_names.forEach((title) => {
    if (listName == title) {
      listNameExists = true;
      // console.log("Already exists");
    }
  });
  // If not, add the list name to the array list_names:
  if (!listNameExists) {
    list_names.push(listName);
  }
  localStorage.setItem("list_names", JSON.stringify(list_names));
}
