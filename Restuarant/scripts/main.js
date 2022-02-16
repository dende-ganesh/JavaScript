//display menu
function displayMenu(menuItems) {
    menu = document.querySelector('.Menu');
    for (let item of menuItems) {
        // console.log(item["name"]);
        let itemCard = document.createElement('div');
        itemCard.setAttribute('draggable', true);
        let itemName = document.createElement('h3');
        let itemPrice = document.createElement('p');
        let category = document.createElement('p');
        category.textContent = item["category"];
        category.style.display = 'none';
        itemCard.setAttribute("id", "item- " + item["id"]);
        itemCard.setAttribute("class", "fooditems");
        itemName.textContent = item["name"];
        itemPrice.textContent = "₹" + item["price"];
        itemCard.appendChild(itemName);
        itemCard.appendChild(itemPrice);
        itemCard.appendChild(category);
        menu.appendChild(itemCard);
    }

}
displayMenu(menuItems);
//display tables
(function displayTables(tables) {
    let tableElement = document.querySelector('.Table');
    // console.log(tableElement);
    for (let table of tables) {
        let tableCard = document.createElement('div');
        tableCard.setAttribute('ondragover', 'allowdrag(event)')
        let tableName = document.createElement('h3');
        let tableContent = document.createElement('div');
        tableContent.setAttribute('id', 'tableContent');
        let tableTotal = document.createElement('p');
        let TotalItems = document.createElement('p');
        tableCard.setAttribute("id", table.id);
        tableCard.setAttribute("class", "tables");
        tableContent.setAttribute("class", "tableContent");
        tableName.textContent = `Table-${table.id}`;
        tableTotal.textContent = "Rs 0 ";
        TotalItems.textContent = "| Total Items: 0";
        tableCard.appendChild(tableName);
        tableContent.appendChild(tableTotal);
        tableContent.appendChild(TotalItems);
        tableCard.appendChild(tableContent);
        tableElement.appendChild(tableCard);
    }

})(tables);
// document.addEventListener('onload',displayTables(tables));



//searching food items
let search = document.getElementById('searchitem');
let allItems = document.querySelectorAll('.fooditems')
search.addEventListener('keyup', () => {
    let target = search.value.toLowerCase();
    for (let item of allItems) {
        let name = item.children[0].innerHTML.toLowerCase();
        let category = item.children[2].innerHTML.toLowerCase();
        if (name.includes(target) || category.includes(target)) {
            item.style.display = '';
        }
        else {
            item.style.display = 'none';
        }
    }
})

//searching tables
const tableElements = document.querySelectorAll('.tables');
const searchTable = document.querySelector('.searchtable');
searchTable.addEventListener('keyup', () => {
    let targetTable = searchTable.value.toLowerCase();
    for (let table of tableElements) {
        let tableName = table.children[0].innerHTML.toLowerCase();
        if (tableName.includes(targetTable)) {
            table.style.display = '';
        }
        else {
            table.style.display = "none";
        }
    }
}
);
function allowdrag(ev) {
    ev.preventDefault();
}
//dragging
let draggables = document.querySelectorAll('.fooditems');
let enterIntoTables = document.querySelectorAll('.tables');
// console.log(enterIntoTables);

for (let drag of draggables) {
    drag.addEventListener('dragstart', (ev) => {
        ev.dataTransfer.setData("text", ev.target.id);
        drag.classList.add('dragging');
    })
    drag.addEventListener('dragend', () => {
        drag.classList.remove('dragging');
    })
}
function countQuantity(table) {
    // console.log(table);
    let total = 0;
    const iterator = table.orders.values();
    let next = iterator.next().value;
    while (next) {
        total += Number(next);
        next = iterator.next().value;
    }
    return total;

}
enterIntoTables.forEach(table => {
    table.addEventListener('drop', (e) => {
        let itemId = e.dataTransfer.getData("text");
        let itemElement = document.getElementById(itemId);
        let itemName = itemElement.children[0].textContent;
        let itemPrice = itemElement.children[1].textContent;
        let id = Number(table.getAttribute('id')) - 1;
        let cost = table.children[1].children[0];
        let noOfItems = table.children[1].children[1];
        tables[id].totalCost += Number(itemPrice.slice(1,));
        cost.textContent = `Rs ${tables[id].totalCost}`;
        let orderlist = tables[id].orders;
        if (orderlist.get(itemName) == null) {
            orderlist.set(itemName, 1);
        }
        else {
            orderlist.set(itemName, Number(orderlist.get(itemName)) + 1);
        }
        noOfItems.textContent = `Total Items:${countQuantity(tables[id])}`;
        // console.log(tables);
    })
})
let itemPrice = new Map();
menuItems.forEach(item => {
    itemPrice.set(item.name, item.price)
});
// console.log(itemPrice);



function displayPopup(table) {
    document.querySelector('.popcontent').style.display = 'block';
    let tableContent = document.querySelector('.ordertable');
    let currentTable = tables[table.parentElement.id - 1];
    let foodOrders = currentTable.orders;
    // console.log(tables);
    document.getElementById('total').textContent = `Total:${currentTable.totalCost}`;
    // console.log(foodOrders);
    let count = 1;
    for (let foodItem of foodOrders) {
        let row = document.createElement('tr');
        row.setAttribute('id', `sno${count}`)
        let sno = document.createElement('td');
        sno.textContent = count;
        let item = document.createElement('td');
        item.textContent = foodItem[0];
        let price = document.createElement('td');
        price.textContent = itemPrice.get(item.textContent);
        let quantity = document.createElement('td');
        let quantInput = document.createElement('input');
        quantInput.setAttribute('type', 'Number');
        quantInput.setAttribute('value', foodItem[1]);
        quantInput.setAttribute('min', 1);
        quantInput.setAttribute('max', 10);
        quantInput.addEventListener('change', () => {
            foodOrders.set(foodItem[0], quantInput.value);
            let totalCost=calculateTotal();
            table.children[0].textContent=`Rs ${totalCost}`;
            let totalItems=countQuantity(tables[table.parentElement.id-1]);
            table.children[1].textContent=`Total Items:${totalItems}`;
            document.getElementById('total').textContent = `Total:${totalCost}`;
        })
        quantity.appendChild(quantInput);
        let deleteImage=document.createElement('img');
        deleteImage.setAttribute('id',count);
        deleteImage.setAttribute('src','https://img.icons8.com/ios-glyphs/20/000000/filled-trash.png');
        let tabled=document.createElement('td');
        let imageButton=document.createElement('button');

        imageButton.appendChild(deleteImage);
        tabled.appendChild(imageButton);
        row.appendChild(sno);
        row.appendChild(item);
        row.appendChild(price);
        row.appendChild(quantity);
        row.appendChild(tabled);
        tableContent.appendChild(row);
        // imageButton.addEventListener('click',(event)=>{
        //     let rowElement=document.getElementById(`sno${event.target.id}`);
        //     let parent=rowElement.children[1].textContent;
        //     // console.log(parent);
        //     rowElement.remove();
        //     let target=foodOrders.get(parent)
        //     if(currentTable.totalCost>0)
        //     currentTable.totalCost-=Number(itemPrice.get(parent))*Number(target);
        //     foodOrders.set(target,0);
        //     table.children[0].textContent=`Rs ${currentTable.totalCost}`;
        //     let totalItems=countQuantity(tables[currentTable]);
        //     table.children[1].textContent=`Total Items:${totalItems}`;
        //     document.getElementById('total').textContent = `Total:${currentTable.totalCost}`;    
        // });
        count++;
    }
    function calculateTotal() {
        let total = 0;
        for (let order of foodOrders) {
            total += itemPrice.get(order[0]) * Number(order[1]);
        }
        return total;
    }


    // console.log(tableContent);
    document.querySelector('#closebtn').addEventListener('click', () => {
        // console.log(tableContent);
        while (tableContent.hasChildNodes()) {
            tableContent.removeChild(tableContent.children[0]);
        }
        document.querySelector('.popcontent').style.display = 'none';
        table.classList.remove('selected');
    }
    )
}

const tableContents = document.querySelectorAll('#tableContent')
tableContents.forEach(table => table.addEventListener('click', () => {
    table.classList.add('selected');
    displayPopup(table);
}
))
