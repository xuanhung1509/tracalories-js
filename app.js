// Storage Controller

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 1200 },
      // { id: 1, name: 'Eggs', calories: 800 },
      // { id: 2, name: 'Cookies', calories: 900 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },

    getItemById: function (id) {
      return data.items.find((item) => item.id === id);
    },

    addItem: function (name, calories) {
      // Generate ID
      let ID = 0;
      if (data.items.length > 0) {
        ID = data.items.length;
      }

      // Create new item
      const newItem = new Item(ID, name, +calories);

      // Add item to data structrue
      data.items.push(newItem);

      return newItem;
    },

    getTotalCalories: function () {
      let total = 0;

      // Iterate through items and add calories to total
      data.items.forEach((item) => {
        total += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = total;

      return total;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    updateItem: function (updatedItem) {
      data.items.forEach((item) => {
        if (item.id === updatedItem.id) {
          item.name = updatedItem.name;
          item.calories = +updatedItem.calories;
        }
      });
    },

    deleteItem: function (id) {
      data.items = data.items.filter((item) => item.id !== id);
    },

    clearAllItems: function () {
      data.items = [];
    },

    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  // Define UI Variables
  const UISelectors = {
    itemList: '#item-list',
    listItem: '.collection-item',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories',
  };

  const generateHTML = (item) => {
    return `
    <li class="collection-item" id="item-${item.id}">
      <strong>${item.name}</strong>: <em>${+item.calories}</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
    </li>
  `;
  };

  // Public Methods
  return {
    // Populate Item List
    populateItemList: function (items) {
      let html = '';

      items.forEach((item) => {
        html += generateHTML(item);
      });

      // Insert Item List to UI
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },

    getSelectors: function () {
      return UISelectors;
    },

    getInputValues: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      };
    },

    addItemToList: function (item) {
      // Show list
      UICtrl.showList();

      // Create a list item
      let html = '';
      html += generateHTML(item);

      // Append item to list
      document.querySelector(UISelectors.itemList).innerHTML += html;
    },

    setInitialState: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      // Clear inputs
      UICtrl.clearInputs();
    },

    showEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },

    showItemToEdit: function () {
      const item = ItemCtrl.getCurrentItem();
      document.querySelector(UISelectors.itemName).value = item.name;
      document.querySelector(UISelectors.itemCalories).value = item.calories;
    },

    updateItemList: function (updatedItem) {
      let html = '';
      html = generateHTML(updatedItem);
      document.querySelector(`#item-${updatedItem.id}`).outerHTML = html;
    },

    deleteItemList: function (id) {
      // Remove the selected list item
      document.getElementById(`item-${id}`).remove();

      // Hide the list if no item left
      const listItems = document.querySelectorAll('.collection-item');
      if (listItems.length === 0) {
        this.hideList();
      }
    },

    clearAllItemLists: function () {
      let listItems = document.querySelectorAll(UISelectors.listItem);

      listItems = Array.from(listItems);

      listItems.forEach((item) => item.remove());
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },

    clearInputs: function () {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
  };
})();

// App Controller
const App = (function () {
  // Load event listeners
  const loadEventListeners = () => {
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', handleAddItem);

    // Prevent adding item on pressing enter
    document.addEventListener('keypress', (e) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        return false;
      }
    });

    // Edit item click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', handleEditItem);

    // Update item submit event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', handleSubmitUpdateItem);

    // Delete buton event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', handleDeleteItem);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', (e) => {
        e.preventDefault();
        UICtrl.setInitialState();
      });

    // Clear all buton event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', handleClearAll);
  };

  // Handle add item
  const handleAddItem = (e) => {
    e.preventDefault();

    // Get input values
    const input = UICtrl.getInputValues();

    // Validate
    if (input.name.trim() !== '' && input.calories.trim() !== '') {
      // Add item to data structure
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to list
      UICtrl.addItemToList(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear inputs
      UICtrl.clearInputs();
    } else {
      alert('Please enter meal & calories');
    }
  };

  // Handle edit item
  const handleEditItem = (e) => {
    e.preventDefault();
    if (e.target.classList.contains('edit-item')) {
      // Show edit state
      UICtrl.showEditState();

      // Get the list id (item-0, item-1...)
      const listId = e.target.parentNode.parentNode.id;

      // Get the current item id
      const listIdArr = listId.split('-');
      const currentItemId = parseInt(listIdArr[1]);

      // Get the item to edit
      const itemToEdit = ItemCtrl.getItemById(currentItemId);

      // Set the current item in data structure
      ItemCtrl.setCurrentItem(itemToEdit);

      // Show item to form
      UICtrl.showItemToEdit();
    }
  };

  // Handle submit update item
  const handleSubmitUpdateItem = (e) => {
    e.preventDefault();
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Get the updated inputs
    let updatedItem = UICtrl.getInputValues();

    // Add selected id to updated item & make calories number
    updatedItem = {
      ...currentItem,
      name: updatedItem.name,
      calories: +updatedItem.calories,
    };

    // Update in data structure
    ItemCtrl.updateItem(updatedItem);

    // Update in UI
    UICtrl.updateItemList(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear edit state
    UICtrl.setInitialState();
  };

  // Handle delete item
  const handleDeleteItem = (e) => {
    e.preventDefault();

    if (!confirm('Are you sure?')) return;

    // Get the current item id
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete item in data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete item in the UI
    UICtrl.deleteItemList(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear inputs
    UICtrl.clearInputs();

    // Clear edit state
    UICtrl.setInitialState();
  };

  // Handle clear all items
  const handleClearAll = (e) => {
    e.preventDefault();

    if (!confirm('Are you sure?')) return;

    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Delete all items from UI
    UICtrl.clearAllItemLists();
    UICtrl.hideList();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear edit state
    UICtrl.setInitialState();
  };

  // Public Methods
  return {
    init: function () {
      // Set initital state
      UICtrl.setInitialState();

      // Fetch Items from Data Structure
      const items = ItemCtrl.getItems();

      // Check if any item
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate Item List to UI
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
})();

// Initialize App
App.init();
