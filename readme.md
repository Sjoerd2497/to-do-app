# 📋 My to-do web app

I made this to-do app to learn the basics of HTML/CSS/JavaScript.

## 🚀 Features

- Add list entries
- Mark list entry as completed
- Clear completed entries from list
- Edit list entries
- Save the list in storage

## 💡 Future improvements

- Edit list description
- Edit list title
- Add sidebar button
- Re-ordering lists by drag and drop
- Add and save multiple lists
- Add night mode

## 🖥️ Demo

I will add a live demo later!

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
There are *two* classes in `todo.js`, TodoList and ListEntry. An instance of
the TodoList class represents a list. Each TodoList instance can have multiple
ListEntry instances, which represent list items. A TodoList instance keeps an
array of all ListEntry instances. Therefore when a TodoList instance is saved
as a JSON in localStorage, it automatically includes the list items.

## 📜 License

This project is licensed under the _MIT License_.
