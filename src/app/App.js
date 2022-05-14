import ItemCtrl from './ItemCtrl';
import UICtrl from './UICtrl';
import StorageCtrl from './StorageCtrl';

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

  const handleAddItem = async (e) => {
    e.preventDefault();

    // Show list
    const itemList = document.querySelector(UICtrl.getSelectors().itemList);
    if (itemList.style.display === 'none') {
      UICtrl.toggleList();
    }

    const inputs = UICtrl.getInputValues();
    if (inputs.name.trim() === '' || inputs.calories === 0)
      return alert('Please enter meal & calories.');

    const item = await StorageCtrl.addItem(inputs);
    ItemCtrl.addItem(item);
    UICtrl.addListItem(item);

    const totalCalories = await ItemCtrl.setTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearInputs();
  };

  const handleEditItem = async (e) => {
    e.preventDefault();

    if (e.target.classList.contains('edit-item')) {
      UICtrl.showEditState();

      const listItem = e.target.parentElement.parentElement;
      const listItemId = listItem.id; // (item-0, item-1...)
      const listItemArr = listItemId.split('-');
      const itemId = +listItemArr[1];

      await ItemCtrl.setCurrentItem(itemId);
      const currentItem = ItemCtrl.getCurrentItem();
      UICtrl.showItemToEdit(currentItem);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    const inputs = UICtrl.getInputValues();
    const currentItem = ItemCtrl.getCurrentItem();
    const updatedItem = { id: currentItem.id, ...inputs };

    await StorageCtrl.updateItem(updatedItem);
    ItemCtrl.updateItem(updatedItem);
    UICtrl.updateListItem(updatedItem);

    const totalCalories = await ItemCtrl.setTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  const handleDeleteItem = async (e) => {
    e.preventDefault();

    if (!confirm('Are you sure?')) return;

    const currentItem = ItemCtrl.getCurrentItem();

    await StorageCtrl.deleteItem(currentItem.id);
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = await ItemCtrl.setTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  };

  const handleClearAll = async (e) => {
    e.preventDefault();

    if (!confirm('Are you sure?')) return;

    await StorageCtrl.clearItems();

    ItemCtrl.clearItems();
    UICtrl.clearListItems();

    const itemList = document.querySelector(UICtrl.getSelectors().itemList);
    if (itemList.style.display !== 'none') {
      UICtrl.toggleList();
    }

    UICtrl.clearEditState();
  };

  return {
    init: async function () {
      UICtrl.clearEditState();

      try {
        let items = await StorageCtrl.getItems();
        if (items.length === 0) {
          UICtrl.toggleList();
        } else {
          UICtrl.populateItemList(items);
        }

        const totalCalories = await ItemCtrl.setTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        loadEventListeners();
      } catch (err) {
        alert(err);
      }
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
