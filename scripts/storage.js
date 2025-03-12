// I will use LocalStorage for now
// In the future I might look into IndexedDB as a fun exercise!

export function saveList(obj){
    const listJSON = JSON.stringify(obj);
    // Add a check for list name duplicates?
    localStorage.setItem(obj.name, listJSON); // The key is the list name
    console.log(listJSON);
}