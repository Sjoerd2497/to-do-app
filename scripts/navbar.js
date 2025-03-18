import * as storage from "./storage.js";
import * as main from "./main.js";
// Each navbar item has the following elements:
// <a class="nav-link" href><div class="nav-item">[List title]</div></a>

export class NavBar {
  navElement;     // The <nav> item on the page
  navItems;

  constructor(navElement){
    this.navElement = navElement;
    this.buildNavBar();
  }

  buildNavBar(){
    // Clear current navbar if it has items
    while (this.navElement.firstChild) {
      this.navElement.removeChild(this.navElement.lastChild);
    }

    let list_names = storage.getSavedListNames();
    if (!list_names) return;
    list_names.forEach( (listName) => {
      let navItem = new NavItem(listName);
      this.navElement.append(navItem.docFragment);
    });
  }
}

class NavItem {
navTitle;    // The list title displayed in this NavItem
navLink;     // The <a></a> link to open/load the list
divElement;
docFragment;  // The DocumentFragment holding all elements:
              // <a class="nav-link" href="#"><div class="nav-item">[List title]</div></a>

  constructor(listTitle){
    this.navTitle = listTitle;
    // use this to change the pagelist
    // main.getPageList();
    this.navLink = this.createLinkElement(this.navTitle);
    this.divElement = this.createDivElement();
    this.docFragment = this.createDocumentFragment();
  }

  createDocumentFragment() {
    const navItemFragment = new DocumentFragment();
    this.divElement.append(this.navTitle);
    this.navLink.append(this.divElement);
    navItemFragment.append(this.navLink);
    return navItemFragment;
  }

  createLinkElement(target) {
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("class", "nav-link");
    a.addEventListener("click", (event) => {
      // event.preventDefault();
      // Load list [target]
      main.displayList(target);
    });
    return a;
  }

  createDivElement() {
    const div = document.createElement("div");
    div.setAttribute("class", "nav-item")
    return div;
  }
}
