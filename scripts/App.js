import ItemCtrl from './ItemCtrl.js';
import UICtrl from './UICtrl.js';
import StorageCtrl from './StorageCtrl.js';

const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  const loadEventListeners = () => {
    // Prevent adding item when pressing Enter
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });

    // Add item event
    document
      .querySelector(UICtrl.getSelectors().addBtn)
      .addEventListener('click', handleAddItem);

    // Edit icon click event
    document
      .querySelector(UICtrl.getSelectors().itemList)
      .addEventListener('click', handleEditItem);

    // Update item event
    document
      .querySelector(UICtrl.getSelectors().updateBtn)
      .addEventListener('click', handleUpdateItem);

    // Delete item event
    document
      .querySelector(UICtrl.getSelectors().deleteBtn)
      .addEventListener('click', handleDeleteItem);

    // Back button click event
    document
      .querySelector(UICtrl.getSelectors().backBtn)
      .addEventListener('click', (e) => {
        UICtrl.clearEditState();
        e.preventDefault();
      });

    // Clear button click event
    document
      .querySelector(UICtrl.getSelectors().clearBtn)
      .addEventListener('click', handleClearAll);
  };

  const handleAddItem = (e) => {
    const itemList = document.querySelector(UICtrl.getSelectors().itemList);
    if (itemList.style.display === 'none') {
      UICtrl.toggleList();
    }

    const inputs = UICtrl.getInputValues();
    if (inputs.name.trim() === '' || inputs.calories === 0)
      return alert('Please enter meal & calories.');

    const item = ItemCtrl.addItem(inputs);
    const totalCalories = ItemCtrl.setTotalCalories();

    UICtrl.addListItem(item);
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.addItem(item);

    UICtrl.clearInputs();

    e.preventDefault();
  };

  const handleEditItem = (e) => {
    if (e.target.classList.contains('edit-item')) {
      UICtrl.showEditState();

      const listItem = e.target.parentElement.parentElement;
      const listItemId = listItem.id; // (item-0, item-1...)
      const listItemArr = listItemId.split('-');
      const itemId = +listItemArr[1];

      ItemCtrl.setCurrentItem(itemId);

      UICtrl.showItemToEdit();
    }
  };

  const handleUpdateItem = (e) => {
    const inputs = UICtrl.getInputValues();
    const currentItem = ItemCtrl.getCurrentItem();
    const updatedItem = { id: currentItem.id, ...inputs };

    ItemCtrl.updateItem(updatedItem);
    const totalCalories = ItemCtrl.setTotalCalories();

    UICtrl.updateListItem(updatedItem);
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.updateItem(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const handleDeleteItem = (e) => {
    if (!confirm('Are you sure?')) return;

    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);
    const totalCalories = ItemCtrl.setTotalCalories();

    UICtrl.deleteListItem(currentItem.id);
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.deleteItem(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const handleClearAll = (e) => {
    if (!confirm('Are you sure?')) return;

    ItemCtrl.clearItems();
    const totalCalories = ItemCtrl.setTotalCalories();

    UICtrl.clearListItems();
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.clearItems();

    UICtrl.toggleList();
    UICtrl.clearEditState();

    e.preventDefault();
  };

  return {
    init: function () {
      UICtrl.clearEditState();

      let items = StorageCtrl.getItems();

      if (items.length === 0) {
        UICtrl.toggleList();
      } else {
        UICtrl.populateItemList(items);
      }

      const totalCalories = ItemCtrl.setTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
