import * as storage from "./storage.js";
import * as main from "./main.js";
// Each navbar item has the following elements:
// <a class="nav-link" href><div class="nav-item">[List title]</div></a>

export class NavBar {
  navElement; // The <nav> item on the page
  navItems;

  constructor(navElement) {
    this.navElement = navElement;
    this.navItems = [];
    this.buildNavBar();
  }

  buildNavBar() {
    // Clear current navbar if it has items
    while (this.navElement.firstChild) {
      this.navElement.removeChild(this.navElement.lastChild);
    }

    let list_names = storage.getSavedListNames();
    if (!list_names) return;
    list_names.forEach((listName) => {
      let navItem = new NavItem(listName);
      this.navItems.push(navItem); // Put the NavItem in the array
      this.navElement.append(navItem.docFragment); // Place it in the sidebar
    });
  }

  setActiveNavItem(title) {
    this.navItems.forEach((item) => {
      if (item.navTitle == title) {
        item.divElement.setAttribute("style", "background-color: #e9e9ed;");
      } else {
        item.divElement.setAttribute("style", "background-color: unset;");
      }
    });
  }
}

class NavItem {
  navTitle; // The list title displayed in this NavItem
  navLink; // The <a></a> link to open/load the list
  divElement;
  spanElement;
  deleteButton;
  docFragment; // The DocumentFragment holding all elements:
  // <a class="nav-link" href="#"><div class="nav-item"><span class="overflow">[List title]</span><button class="button-delete-list"></button></div></a>

  constructor(listTitle) {
    this.navTitle = listTitle;
    // use this to change the pagelist
    // main.getPageList();
    this.navLink = this.createLinkElement(this.navTitle);
    this.divElement = this.createDivElement();
    this.spanElement = this.createSpanElement();
    this.deleteButton = this.createDeleteButton();
    this.docFragment = this.createDocumentFragment();
  }

  createDocumentFragment() {
    const navItemFragment = new DocumentFragment();
    this.spanElement.append(this.navTitle);
    this.divElement.append(this.spanElement, this.deleteButton);
    this.navLink.append(this.divElement);
    navItemFragment.append(this.navLink);
    return navItemFragment;
  }

  createLinkElement(target) {
    const a = document.createElement("a");
    a.setAttribute("draggable", false);
    a.setAttribute("href", "#");
    a.setAttribute("class", "nav-link");
    a.addEventListener("click", (event) => {
      // event.preventDefault();
      // Load list [target]
      if (storage.listNameExists(target)) {
        main.displayList(target);
      }
    });
    return a;
  }

  createDivElement() {
    const div = document.createElement("div");
    div.setAttribute("class", "nav-item");
    return div;
  }

  createSpanElement() {
    const span = document.createElement("span");
    span.setAttribute("class", "overflow");
    return span;
  }

  createDeleteButton() {
    const button = document.createElement("button");
    button.setAttribute("class", "button-delete-list");
    button.addEventListener("click", () => {
      // Ask for confirm if the user modified this list
      if (storage.hasListChanged(this.navTitle)) {
        if (!window.confirm("Are you sure you want to delete this list?")) {
          return;
        }
      }
      // Delete this list
      storage.deleteList(this.navTitle);

      if (storage.getSavedListNames()[0]) {
        //console.log(storage.getSavedListNames()[0]);
        main.displayList(storage.getSavedListNames()[0]);
      } else {
        main.setDefaultPageList();
      }
    });
    return button;
  }
}
