const StorageCtrl = (function () {
  return {
    getItems: async function () {
      const response = await fetch('http://localhost:3000/items');
      const items = await response.json();
      return items;
    },

    addItem: async function (item) {
      const response = await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();
      return data;
    },

    updateItem: async function (updatedItem) {
      const response = await fetch(
        `http://localhost:3000/items/${updatedItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedItem),
        }
      );

      const data = await response.json();
      return data;
    },

    deleteItem: async function (id) {
      await fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },

    clearItems: async function () {
      const items = await this.getItems();
      items.forEach((item) => {
        this.deleteItem(item.id);
      });
    },
  };
})();

export default StorageCtrl;
