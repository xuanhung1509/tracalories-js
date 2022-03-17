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
    addBtn: '.add-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
  };

  const generateHTML = (item) => {
    return `
    <li class="collection-item" id="item-${item.id}">
      <strong>${item.name}</strong>: <em>${item.calories}</em>
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
        // html += `
        // <li class="collection-item" id="item-${item.id}">
        //   <strong>${item.name}</strong>: <em>${item.calories}</em>
        //   <a href="#" class="secondary-content">
        //     <i class="edit-item fa fa-pencil"></i>
        //   </a>
        // </li>
        // `;

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

      // Clear inputs
      UICtrl.clearInputs();
    }
  };

  // Public Methods
  return {
    init: function () {
      // Fetch Items from Data Structure
      const items = ItemCtrl.getItems();

      // Check if any item
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate Item List to UI
        UICtrl.populateItemList(items);
      }

      // Load event listeners
      loadEventListeners();
    },
  };
})();

// Initialize App
App.init();
