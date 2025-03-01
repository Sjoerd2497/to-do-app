const indexedDB = 
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitInndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open("ListDatabase", 1);