const UICtrl = (function () {
  const UISelectors = {
    name: '#item-name',
    calories: '#item-calories',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    totalCalories: '.total-calories',
    itemList: '#item-list',
    listItem: '.collection-item',
  };

  const generateHtml = (item) => {
    let html = '';
    html += `
      <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
    `;
    return html;
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },

    populateItemList: function (items) {
      const itemList = document.querySelector(UISelectors.itemList);
      let html = '';

      items.forEach((item) => {
        html += generateHtml(item);
      });

      itemList.innerHTML = html;
    },

    getInputValues: function () {
      return {
        name: document.querySelector(UISelectors.name).value,
        calories: +document.querySelector(UISelectors.calories).value,
      };
    },

    addListItem: function (item) {
      const itemList = document.querySelector(UISelectors.itemList);
      let html = generateHtml(item);
      itemList.innerHTML += html;
    },

    showItemToEdit: function (item) {
      document.querySelector(UISelectors.name).value = item.name;
      document.querySelector(UISelectors.calories).value = item.calories;
    },

    updateListItem: function (updatedItem) {
      const currentListItem = document.getElementById(`item-${updatedItem.id}`);
      let html = generateHtml(updatedItem);
      currentListItem.outerHTML = html;
    },

    deleteListItem: function (id) {
      document.querySelector(`#item-${id}`).remove();
    },

    clearListItems: function () {
      const listItems = document.querySelectorAll(UISelectors.listItem);

      listItems.forEach((item) => {
        item.remove();
      });
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },

    showEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },

    clearEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      this.clearInputs();
    },

    clearInputs: function () {
      document.querySelector(UISelectors.name).value = '';
      document.querySelector(UISelectors.calories).value = '';
    },

    toggleList: function () {
      const itemList = document.querySelector(UISelectors.itemList);

      if (itemList.style.display !== 'none') {
        itemList.style.display = 'none';
      } else {
        itemList.style.display = 'block';
      }
    },
  };
})();

export default UICtrl;
