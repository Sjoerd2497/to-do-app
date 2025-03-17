import * as utils from "./utils.js";
import * as storage from "./storage.js";

export class TodoList {
  // Rename this class? 'CustomList', 'GenericList', ...?

  title; // Name of this list, for example: "My to-do list"
  description; // Description of the list
  itemIdCounter; // The id counter for the list items
  listEntries; // Array containing all items (objects of the ListEntry class)
  taskList; // The <ul> list object on the web page containing list items
  descriptionParagraph; // The <p> that holds the description
  descriptionInput; // Input field for editing description
  titleHeading; // <h1> that holds the title

  /**
   * Create a new list.
   * @param {string} title // Title of the list
   * @param {string} description // Description of the list
   * @param {string} titleId  // The id of <h1> that holds the title
   * @param {string} listId   // The id of the <ul> on the page
   * @param {string} paragraphId // The id of the <p> that holds the description
   */
  constructor(title, description, titleId, listId, paragraphId) {
    this.title = title;
    this.description = description;
    this.taskList = document.getElementById(listId);
    this.descriptionParagraph = document.getElementById(paragraphId);
    this.titleHeading = document.getElementById(titleId);
    this.titleHeading.textContent = this.title;
    this.descriptionParagraph.textContent = this.description;
    this.itemIdCounter = 0;
    this.listEntries = [];
  }

  // Is called everytime the TodoList or a child ListEntry is changed
  onListMutation() {
    storage.saveList(this);
    console.log(this);
  }

  // Add an item to the list.
  addListEntry(itemText, checked = false) {
    itemText.trim();
    if (itemText) {
      const listEntry = new ListEntry(
        itemText,
        this.itemIdCounter,
        this.sortList.bind(this),
        this.onListMutation.bind(this),
        checked
      );
      this.taskList.prepend(listEntry.docFragment); // Put in front of list (display newest item on top)
      this.listEntries.push(listEntry); // Put in back of array
      this.itemIdCounter++;
    }
    this.onListMutation();
  }

  // Remove an item from the list
  removeListEntry(id) {
    // Remove the <li> from the DOM
    this.listEntries[id].li.remove();
    // Remove ListEntry object from array
    this.listEntries.splice(id, 1);
    this.onListMutation();
  }

  // Remove all checked items from the list
  clearList() {
    let indices = [];
    this.listEntries.forEach((element, index) => {
      if (element.checked) {
        // Add index to array of indices to-be-deleted
        indices.push(index);
      }
    });
    // Loop in reverse order to not mess up array index order with splice()
    for (let i = indices.length - 1; i >= 0; i--) {
      this.removeListEntry(indices[i]);
    }
    this.onListMutation();
  }

  // Move all checked items to the bottom of the list.
  sortList() {
    this.listEntries.forEach((element, index) => {
      if (element.checked) {
        taskList.appendChild(element.li);
        // Add the index of the checked element to the indices array
        utils.moveToStartOfArray(this.listEntries, index);
      }
    });
    this.onListMutation();
  }

  // Edit the title of the list
  editTitle() {
    // code
    this.titleHeading.setAttribute("contenteditable", true);

    console.log("yippee");
  }

  setTitle() {
    this.titleHeading.setAttribute("contenteditable", false);
    this.title = this.titleHeading.textContent;
    this.onListMutation();
  }

  // Edit the description of the list
  editDescription() {
    // code
    this.description = this.descriptionParagraph.textContent;
    this.onListMutation();
  }

  // Export only the necessary properties required to rebuild the list
  toJSON() {
    return {
      title: this.title,
      description: this.description,
      itemIdCounter: this.itemIdCounter,
      listEntries: this.listEntries,
    };
  }
}

/**
 * A ListEntry is an item on a TodoList.
 * Each ListEntry has:
 * `<li> <input type="checkbox"> <span>List item text</span> </li>`
 */
class ListEntry {
  // Question: Would it be better to make everything private? Or everything public? Is using a get/set method for entryText a good choice?

  id; // Identifier of this list item
  entryText; // The text of the list item
  setEntryText(text) {
    this.entryText = text;
  }
  getEntryText() {
    return this.entryText;
  }
  li; // The <li> that is the parent, is a flex container
  checkbox; // The checkbox on the list item
  span; // Contains the text for the list item
  listInput; // Input field for editing the list item
  checked; // Bool whether the ListEntry is checked.
  docFragment; // The document fragment of the list item to be added to the list
  // The fragment has the form:
  // `<li> <input type="checkbox"> <span>List item text</span> </li>`
  sortList; // The the sortList() function of the TodoList parent
  onListMutation; // The onListMutation() funciton of the TodoList parent

  // Each list item part has its own CSS class:
  // li: "list-item"
  // checkbox: "checkbox"
  // span: "list-text" or "list-text-checked" when the checkbox is checked
  // listInput: "list-input"

  /**
   * Create a ListEntry.
   * Each ListItem has:
   * `<li> <input type="checkbox"> <span>List item text</span> </li>`
   * @param {string} listEntryText  Whatever text should go into the list item
   * @param {string} id             A unique id for this list item
   * @param {function} sortList     The the sortList() function of the TodoList parent
   * @param {function} onListMutation   The onListMutation() funciton of the TodoList parent
   * */
  constructor(listEntryText, id, sortList, onListMutation, checked = false) {
    this.id = "li" + id;
    this.setEntryText(listEntryText);
    this.li = this.createListItem(this.id);
    this.checkbox = this.createCheckbox();
    this.span = this.createListTextSpan(this.getEntryText());
    this.checked = checked;
    // If this new list item is already checked:
    if (checked) {
      this.checkbox.checked = this.checked; // Check the checkbox
      this.li.style.textDecoration = "line-through";
      this.span.setAttribute("class", "list-text-checked"); // Change style to remove the hover styling
    }
    this.docFragment = this.createDocumentFragment();
    this.sortList = sortList;
    this.onListMutation = onListMutation;
  }

  // Create a DocumentFragment containing the contents of 1 ListItem.
  createDocumentFragment() {
    const listItemFragment = new DocumentFragment();
    this.li.append(this.checkbox, this.span);
    listItemFragment.append(this.li);
    return listItemFragment;
  }

  // Removes the span with the text, create text input
  editListItem() {
    if (this.checked) {
      return;
    }

    // Swap <span> for <input>
    this.listInput = this.createListInput(this.getEntryText());
    this.li.append(this.listInput);
    this.span.remove();
    this.listInput.focus();

    // Save the changes on [Enter] or focusout:
    this.listInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.saveListItem();
      }
    });
    this.listInput.addEventListener("focusout", (event) => {
      this.saveListItem();
    });
  }

  saveListItem() {
    // Update the entryText
    this.setEntryText(this.listInput.value.trim());
    // Switch <input> for <span> and set its text:
    this.listInput.remove();
    this.li.append(this.span);
    this.span.textContent = this.getEntryText();
    this.onListMutation(); // List is changed!
  }

  clickCheckbox() {
    if (this.checkbox.checked === true) {
      this.checked = true;
      this.li.style.textDecoration = "line-through";
      this.span.setAttribute("class", "list-text-checked"); // Change style to remove the hover styling
    } else if (this.checkbox.checked === false) {
      this.checked = false;
      this.li.style.textDecoration = "none";
      this.span.setAttribute("class", "list-text");
    }
    this.sortList();
    this.onListMutation(); // List is changed!
  }

  // Export only the necessary properties
  toJSON() {
    return {
      entryText: this.entryText,
      id: this.id,
      checked: this.checked,
    };
  }

  // Functions for creating the elements that are part of a ListEntry
  // (<li>, <input type=checkbox>, <span> and <input>)

  createListItem(id) {
    const li = document.createElement("li");
    li.setAttribute("class", "list-item");
    li.setAttribute("id", id);
    return li;
  }

  createCheckbox() {
    const checkbox = document.createElement("input");
    checkbox.setAttribute("class", "checkbox");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", this.clickCheckbox.bind(this));
    return checkbox;
  }

  createListTextSpan(listItemText) {
    const span = document.createElement("span");
    span.setAttribute("class", "list-text");
    span.textContent = listItemText;
    span.addEventListener("click", this.editListItem.bind(this)); // I don't like using 'this' in JavaScript
    return span;
  }

  createListInput(textContent) {
    const input = document.createElement("input");
    input.setAttribute("class", "list-input");
    input.value = textContent;
    return input;
  }
}
