# 📋 My to-do web app

I made this to-do app to learn the basics of HTML/CSS/JavaScript.

## 🚀 Features

- Add list entries
- Mark list entry as completed
- Clear completed entries from list
- Edit list entries
- Save the list in storage
- Edit list description
- Edit list title
- Add and save multiple lists

## 💡 Future improvements

- Add sidebar button
- Re-ordering lists by drag and drop
- Add night mode

## 🖥️ Demo

[Preview the app here!](https://sjoerd2497.github.io/to-do-app/)

## 📂 Project structure

```
/to-do-app
|-- index.html      # Main HTML file
|-- README.md       # Read me
|-- scripts/
|   |-- main.js     # Initilizes app, event listeners, link list to DOM
|   |-- navbar.js   # Builds the navigation sidebar
|   |-- todo.js     # Todo list functionality
|   |-- storage.js  # Manages storage
|   |-- utils.js    # Utility functions
|-- styles/
|   |-- reset.css   # CSS reset
|   |-- styles.css  # Stylesheet
```

### Project classes

There are **two** classes in `todo.js`, TodoList and ListEntry. An instance of
the TodoList class represents a list. Each TodoList instance can have multiple
ListEntry instances, which represent list items. A TodoList instance keeps an
array of all ListEntry instances. Therefore when a TodoList instance is saved
as a JSON in localStorage, it automatically includes the list items.

The two classes in `navbar.js` follow a similar pattern. The NavBar class
represents the navigation bar, while the NavItem class represents a
navigation bar item that can be clicked to display a list. The navigation bar
is not saved into localStorage, however, but rebuilt based on the titles of the
lists saved in localStorage.

## 📜 License

This project is licensed under the _MIT License_.
