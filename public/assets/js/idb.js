//variable to hold DB connection
let db;
//establishes connection to indexedDB database called pizza_hunt
//sets it to version 1
//indexedDB is a global variable; part of "window"
const request = indexedDB.open("pizza_hunt", 1);

//runs whenever a change to the database is detected
//or when a new one is created
//technically an eventlistener listening for "onupgradeneeded" events
request.onupgradeneeded = function(event) {
  //saves a reference to the database, which
  //event.target.result is going to be
  const db = event.target.result;
  //creates an object store (or table) and sets it 
  //to automatically increment
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  //need to explicitly open a transaction before you can
  //actually write the the database, unlike mongo which is
  //constantly available
  const transaction = db.transaction(["new_pizza"], "readwrite");

  const pizzaObjectStore = transaction.objectStore("new_pizza");

  pizzaObjectStore.add(record);

  return "saveRecord function finished";
};

function uploadPizza() {
  const transaction = db.transaction(["new_pizza"], "readwrite");

  const pizzaObjectStore = transaction.objectStore("new_pizza");

  const getAll = pizzaObjectStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          // clear all items in your store
          pizzaObjectStore.clear();

          alert('All saved pizza has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};

window.addEventListener("online", uploadPizza);