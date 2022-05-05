import StorageCtrl from './StorageCtrl.js';

const ItemCtrl = (function (StorageCtrl) {
  const data = {
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    logData: function () {
      return data;
    },

    addItem: async function (item) {
      const items = await data.items;
      items.push(item);
      return item;
    },

    setCurrentItem: async function (id) {
      const items = await data.items;
      data.currentItem = items.find((item) => item.id === id);
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    updateItem: async function (updatedItem) {
      const items = await data.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === updatedItem.id) {
          items[i] = { ...updatedItem };
          break;
        }
      }
    },

    deleteItem: async function (id) {
      let items = await data.items;
      items = items.filter((item) => item.id !== id);
    },

    clearItems: async function () {
      let items = await data.items;
      items = [];
    },

    setTotalCalories: async function () {
      const items = await data.items;
      let total = 0;

      items.forEach((item) => {
        total += item.calories;
      });

      data.totalCalories = total;
      return total;
    },
  };
})(StorageCtrl);

export default ItemCtrl;
