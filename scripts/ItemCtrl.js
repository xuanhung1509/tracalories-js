import StorageCtrl from './StorageCtrl.js';

const ItemCtrl = (function (StorageCtrl) {
  const data = {
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    addItem: function (item) {
      let id = data.items.length;
      item = { ...item, id };
      data.items.push(item);
      return item;
    },

    setCurrentItem: function (id) {
      data.currentItem = data.items.find((item) => item.id === id);
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    updateItem: function (updatedItem) {
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].id === updatedItem.id) {
          data.items[i] = { ...updatedItem };
          break;
        }
      }
    },

    deleteItem: function (id) {
      data.items = data.items.filter((item) => item.id !== id);
    },

    clearItems: function () {
      data.items = [];
    },

    setTotalCalories: function () {
      let total = 0;

      data.items.forEach((item) => {
        total += item.calories;
      });

      data.totalCalories = total;
      return total;
    },
  };
})(StorageCtrl);

export default ItemCtrl;
