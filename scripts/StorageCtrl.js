const StorageCtrl = (function () {
  return {
    getItems: function () {
      let items = [];
      if (localStorage.getItem('items') === null) {
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    addItem: function (item) {
      const items = this.getItems();
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    },

    updateItem: function (updatedItem) {
      const items = this.getItems();

      for (let i = 0; i < items.length; i++) {
        if (items[i].id === updatedItem.id) {
          items[i] = { ...updatedItem };
          break;
        }
      }

      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItem: function (id) {
      let items = this.getItems();
      items = items.filter((item) => item.id !== id);
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItems: function () {
      localStorage.removeItem('items');
    },
  };
})();

export default StorageCtrl;
