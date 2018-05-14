let counters = (() => {
  const API = "http://localhost:3000/api/v1";
  let counters = [];
  let itemLists = ``;
  let totalCount = 0;
  
  let input = document.getElementById("counterName");
  let footer = document.getElementById("footer");
  let itemList = document.getElementById("item-list");
  let footerCount = document.getElementById("total-count");

  /* Add counter on key (Enter) press  */
  input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      addCounter();
    }
  });

  /* Fetch counter list from API and load on page */
  let getCounters = () => {
    fetch(`${API}/counters`)
      .then(res => res.json())
      .then(body => {
        counters = body;
        setItemLists();     
        updateItemListElement();
        updateTotalCount();
        showHideFooter();
      });
  }

  /* Set processed "counters" in itemLists and totalCount */
  let setItemLists = () => {
    itemLists = ``;
    totalCount = 0;
    for (let item of counters) {
      itemLists += getCounterItem(item.id, item.title, item.count);
      totalCount += item.count;
    }
  }

  /* Update total count on page */
  let updateTotalCount = () => {
    footerCount.innerHTML = totalCount;
  }

  /* Update item list on page */
  let updateItemListElement = () => {
    itemList.innerHTML = itemLists;
  }

  /* Process counter and create counter item for item list */
  let getCounterItem = (id, title, count) => {
    return `
      <div id="${id}" class="item">
        <button class="delete" onclick="counters.deleteCounter(${id})">x</button>
        <div class="title"><label>${title}</label></div>
        <div class="counter-buttons">
          <button class="decrement" onclick="counters.decrementCounter(${id})">-</button>
          <label class="count-${id}">${count}</label>
          <button class="increment" onclick="counters.incrementCounter(${id})">+</button>
        </div>
      </div>
    `;
  }

  /* Post counter created via API and load on page */
  let addCounter = () => {
    let inputValue = input.value;
    let body = { title: inputValue };

    fetch(`${API}/counter`, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } })
      .then(res => res.json())
      .then(json => {
        counters = json;
        let newItem = counters.slice(-1)[0];
        itemLists += getCounterItem(newItem.id, newItem.title, newItem.count);
        updateItemListElement();
        updateTotalCount();
        showHideFooter();
        input.value = "";
      });
  }

  /* Delete counter selected via API and remove on page */
  let deleteCounter = (item) => {
    let body = { id: item.id };
    fetch(`${API}/counter`, { method: "DELETE", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } })
      .then(res => res.json())
      .then(json => {
        counters = json;
        item.remove();
        setItemLists();
        showHideFooter();
        updateTotalCount();
      });
  }

  /* Increment count of selected counter via API and on page */
  let incrementCounter = (item) => {
    updateCounterItemCount(item, "inc");
  }

  /* Deccrement count of selected counter via API and on page */
  let decrementCounter = (item) => {
    updateCounterItemCount(item, "dec");
  }

  /* Update counter count via API and on page - used by increment and decrement counter */
  let updateCounterItemCount = (item, action) => {
    let body = { id: item.id };
    fetch(`${API}/counter/${action}`, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } })
      .then(res => res.json())
      .then(json => {
        counters = json;
        /* Get index of item */
        let index = counters.map(function(e) { return e.id; }).indexOf(item.id);
        
        /* Update label count */
        let labelCount = item.querySelector(`label.count-${item.id}`);
        labelCount.innerHTML = counters[index]["count"];
        setItemLists();
        updateTotalCount();
      });
  }

  /* Show/hide footer on page depending on counters */
  let showHideFooter = () => {
    console.log('showHideFooter', counters.length);
    if (counters.length > 0) {
      footer.classList.remove("hidden");
    } else {
      footer.classList.add("hidden");
    }
  }

  return {
    getCounters: getCounters,
    addCounter: addCounter,
    deleteCounter: deleteCounter,
    incrementCounter: incrementCounter,
    decrementCounter: decrementCounter
  }

})();

counters.getCounters();
