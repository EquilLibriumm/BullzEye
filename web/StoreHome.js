var roleID = localStorage.getItem("roleID");
var locationID = localStorage.getItem("locationID");
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");
var addOrUpdate;
var isHighlighted = false;
var hideButtons = false;
var id = 0;
var quantityID = 1;
var transactionNumID = 0;
var orderArray;
var orderAllArray;
var idCount;
var transactionMajorID = 0;
var emergency = true;
var lossGainReturn = "LOSS";
var warehouseInventory;
var warehouseQuantity;

window.onload = function() {
    getAllItems();
    getWarehouseInventory();
    document.querySelector("body").addEventListener("click", handleRowClick);
    document.querySelector("#createOrder").addEventListener("click", hideTables);
    document.querySelector("#submitOrder").addEventListener("click", submitOrder);
    document.querySelector("#emergencyCancelButton").addEventListener("click", cancelOrder);
    document.querySelector("#viewAll").addEventListener("click", allStoreOrders);
    document.querySelector("#back").addEventListener("click", goBack);
    document.querySelector("#scan").addEventListener("click", Scan);
    document.querySelector("#createLoss").addEventListener("click", getInventory);
    document.querySelector("#submitLoss").addEventListener("click", submitLoss);
    document.querySelector("#createReturn").addEventListener("click", returnOrder);
    document.querySelector("#submitReturn").addEventListener("click", submitLoss);
    getStoreOrders();
    getAllStoreOrders();
    hideEOrder();
    readUser();
    printUser();
}

function getWarehouseInventory() {
    let url = "WarehouseManagerServlet/"; // file name or server-side process name
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert("oh no...");
            } else {
                warehouseInventory = JSON.parse(resp);
                console.log(warehouseInventory);
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function returnOrder() {
    lossGainReturn = "RETURN";
    document.querySelector("#submitLoss").classList.add("hidden");
    document.querySelector("#createReturn").classList.add("hidden");
    getInventory();

}

function submitLoss() {
    let numItems = document.querySelector("#itemQuantityInput").value;
    let numCases = document.querySelector("#caseQuantityInput").value;
    if (numItems == "" && numCases == "") {
        alert("Please enter either item quantity or case quantity or both");
        return;
    }
    let row = document.querySelector(".highlighted");
    if (row == null) {
        alert("Please select an item");
        return;
    }
    let cells = row.closest("tr").childNodes;
    let itemID = cells[0].innerHTML;
    let quantity = cells[6].innerHTML;
    let caseSize = cells[8].innerHTML;
    let lost;
    console.log(numCases);
    if (numCases == "") {
        quantity = (parseFloat(quantity) - parseFloat(numItems));
        lost = parseFloat(numItems);
    } else if (numItems == "") {
        quantity = parseFloat(quantity) - (parseFloat(caseSize) * parseFloat(numCases));
        lost = parseFloat(numCases) * parseFloat(caseSize);
    } else {
        quantity = (parseFloat(quantity) - numItems);
        quantity = parseFloat(quantity) - (parseFloat(caseSize) * parseFloat(numCases));
        lost = parseFloat(numItems) + (parseFloat(numCases) * parseFloat(caseSize));
    }
    let notes;
    if (lossGainReturn = "LOSS") {
        notes = "Item ID: " + itemID + " Quantity Lost : " + lost;
    }
    if (lossGainReturn = "RETURN") {
        notes = "Item ID: " + itemID + " Quantity Returned : " + lost;
    }
    let today = new Date();
    let month = today.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let date = today.getFullYear() + '-' + month + '-' + today.getDate();

    //Order Object for servlet
    let obj = {
        transactionID: orderAllArray[orderAllArray.length - 1].transaction.transactionID + 1,
        transactionType: lossGainReturn,
        originalLocationID: locationID,
        creationDate: date,
        estimatedArrival: null,
        sourceTransactionID: null,
        notes: notes,
        itemID: itemID,
        quantity: quantity
    }

    createLossOrder(obj);

    let url = "LossServlet/" + itemID + "/" + quantity + "/" + notes + "/" + locationID // file name or server-side process name
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert("oh no...");
            } else {
                window.location.href = "StoreHome.html";
            }
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.send();
}

// function submitReturn() {
//     let numItems = document.querySelector("#itemQuantityInput").value;
//     let numCases = document.querySelector("#caseQuantityInput").value;
//     if (numItems == "" && numCases == "") {
//         alert("Please enter either item quantity or case quantity or both");
//         return;
//     }
//     let row = document.querySelector(".highlighted");
//     if (row == null) {
//         alert("Please select an item");
//         return;
//     }
//     let cells = row.closest("tr").childNodes;
//     let itemID = cells[0].innerHTML;
//     let quantity = cells[6].innerHTML;
//     let caseSize = cells[8].innerHTML;
//     let lost;
//     console.log(numCases);
//     if (numCases == "") {
//         quantity = (parseFloat(quantity) - parseFloat(numItems));
//         lost = parseFloat(numItems);
//     } else if (numItems == "") {
//         quantity = parseFloat(quantity) - (parseFloat(caseSize) * parseFloat(numCases));
//         lost = parseFloat(numCases) * parseFloat(caseSize);
//     } else {
//         quantity = (parseFloat(quantity) - numItems);
//         quantity = parseFloat(quantity) - (parseFloat(caseSize) * parseFloat(numCases));
//         lost = parseFloat(numItems) + (parseFloat(numCases) * parseFloat(caseSize));
//     }
//     let notes = "Item ID: " + itemID + " Quantity Lost : " + lost;
//     let today = new Date();
//     let month = today.getMonth() + 1;
//     if (month < 10) {
//         month = "0" + month;
//     }
//     let date = today.getFullYear() + '-' + month + '-' + today.getDate();

//     //Order Object for servlet
//     let obj = {
//         transactionID: orderAllArray[orderAllArray.length - 1].transaction.transactionID + 1,
//         transactionType: lossGainReturn,
//         originalLocationID: locationID,
//         creationDate: date,
//         estimatedArrival: null,
//         sourceTransactionID: null,
//         notes: notes,
//         itemID: itemID,
//         quantity: quantity
//     }



//     createLossOrder(obj);

//     let url = "LossServlet/" + itemID + "/" + quantity + "/" + notes + "/" + locationID // file name or server-side process name
//     let xmlhttp = new XMLHttpRequest();

//     xmlhttp.onreadystatechange = function() {

//         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
//             let resp = xmlhttp.responseText;
//             if (resp == 0) {
//                 alert("oh no...");
//             } else {
//                 window.location.href = "StoreHome.html";
//             }
//         }
//     }
//     xmlhttp.open("POST", url, true);
//     xmlhttp.send();
// }

function createLossOrder(obj) {
    console.log(obj.transactionType);
    let method = "POST";
    if (obj.transactionType == "RETURN") {

    }
    let url = "OrderServlet/"; // file name or server-side process name
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert("oh no...");
            } else {
                alert("Loss has been created");
                window.location.href = "StoreHome.html";
            }
        }
    }
    xmlhttp.open(method, url, true);
    xmlhttp.send(JSON.stringify(obj));

}

function createLoss(text) {
    document.querySelector("#back").classList.remove("hidden");
    document.querySelector("#createReturn").classList.add("hidden");
    document.querySelector("#submitReturn").classList.add("hidden");
    document.querySelector("#submitLoss").classList.remove("hidden");
    let arr = JSON.parse(text);
    let html = "<table id='inventory' class='table'><tr><th onclick=sortTable()>Item ID</th><th onclick='sortTable()'>Item Name</th><th onclick='sortTable()'>Location ID</th>" +
        "<th onclick='sortTable()'>Sku</th><th onclick='sortTable()'>Category Name</th><th onclick='sortTable()'>Description</th><th onclick='sortTable()'>Quantity</th>" +
        "<th onclick='sortTable()'>Weight</th><th onclick='sortTable()'>Case Size</th><th onclick='sortTable()'>Cost Price</th><th onclick='sortTable()'>Retail Price</th>" +
        "<th onclick='sortTable()'>Supplier ID</th><th onclick='sortTable()'>Reorder Threshold</th><th onclick='sortTable()'>Reorder Level</th>" +
        "</tr>";
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        if (locationID == row.locationID) {

            html += "<tr>";
            html += "<td>" + row.itemID + "</td>";
            html += "<td>" + row.itemName + "</td>";
            html += "<td>" + row.locationID + "</td>";
            html += "<td>" + row.sku + "</td>";
            html += "<td>" + row.categoryName + "</td>";
            html += "<td>" + row.description + "</td>";
            html += "<td>" + row.quantity + "</td>";
            html += "<td>" + row.weight + "</td>";
            html += "<td>" + row.caseSize + "</td>";
            html += "<td>" + row.costPrice + "</td>";
            html += "<td>" + row.retailPrice + "</td>";
            html += "<td>" + row.supplierID + "</td>";
            html += "<td>" + row.reorderThreshold + "</td>";
            html += "<td>" + row.reorderLevel + "</td>";
            html += "</tr>";

        }
        if (i == arr.length - 1) {
            id = row.itemID + 1;
        }
    }
    html += "</table>";
    document.querySelector("#ordersTable").innerHTML = html;
    if (lossGainReturn == "LOSS") {
        document.querySelector("#ordersTable").innerHTML = html;
        document.querySelector("#searchButtons").classList.remove("hidden");
        document.querySelector("#createLoss").classList.add("hidden");
        document.querySelector("#createOrder").classList.add("hidden");
        document.querySelector("#viewAll").classList.add("hidden");
        document.querySelector("#createReturn").classList.add("hidden");
        document.querySelector("#submitReturn").classList.add("hidden");

        document.querySelector("#itemQuantityInputDiv").classList.remove("hidden");
        document.querySelector("#submitLoss").classList.remove("hidden");

    } else {
        document.querySelector("#searchButtons").classList.remove("hidden");
        document.querySelector("#createLoss").classList.add("hidden");
        document.querySelector("#createOrder").classList.add("hidden");
        document.querySelector("#viewAll").classList.add("hidden");
        document.querySelector("#viewAll").classList.add("hidden");
        document.querySelector("#itemQuantityInputDiv").classList.remove("hidden");
        document.querySelector("#submitReturn").classList.remove("hidden");
        document.querySelector("#submitLoss").classList.add("hidden");

    }
}

function getInventory() {
    let url = "InventoryServlet"; // file name or server-side process name
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                createLoss(resp);
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function Scan() {
    let sku = document.querySelector(".highlighted").children[7].innerHTML;
    document.querySelector("#scanSku").value = sku;
    document.querySelector(".highlighted").closest("tr").classList.add("scanned");
    let trs = document.querySelector("tbody").children;
    console.log(trs.children);
    for (let i = 1; i < trs.length; i++) {
        if (!trs[i].classList.contains("scanned")) {
            return;
        }
    }
    let signature = prompt("Sign Here for Order", "Signature");
    if (signature != "" || signature != null) {
        let transactionID = trs[1].cells[0].innerHTML;
        let itemID = trs[1].cells[6].innerHTML;
        let quantity = trs[1].cells[8].innerHTML;
        let notes = trs[1].cells[5].innerHTML;

        var url = "WarehouseManagerServlet/" + transactionID + "/DELIVERED/" + locationID;
        console.log(url);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                let resp = xmlhttp.responseText;
                console.log(resp);
                if (resp == 0) {
                    alert('Transction: ' + transactionID + ' was NOT Changed');
                    getStoreOrders();
                } else if (resp == 1) {
                    alert('Transction: ' + transactionID + ' was Changed');
                    getStoreOrders();
                }

            }
        };
        xmlhttp.open("PUT", url, true);
        xmlhttp.send();
    } else {
        return;
    }
}

function goBack() {
    orders();
    document.querySelector("#changeOrderButtons").classList.add("hidden");
    document.querySelector("#changesDiv").classList.add("hidden");

    document.querySelector("#createOrder").classList.remove("hidden");
    document.querySelector("#createLoss").classList.remove("hidden");
    document.querySelector("#viewAll").classList.remove("hidden");
    document.querySelector("#createReturn").classList.remove("hidden");

    document.querySelector("#back").classList.add("hidden");
    document.querySelector("#searchButtons").classList.add("hidden");
    document.querySelector("#itemQuantityInputDiv").classList.add("hidden");
    document.querySelector("#submitLoss").classList.add("hidden");
    document.querySelector("#submitReturn").classList.add("hidden");
}

function cancelOrder() {
    hideTables();
}

function allStoreOrders() {
    console.log(orderAllArray);
    arr = orderAllArray;
    console.log(arr);
    let html = "<table id='ordersTable' class='table'><tr><th scope='col' onclick=sortTable()>Transaction ID</th>" +
        "<th onclick='sortTable()'>Transaction Type</th><th onclick='sortTable()'>Location ID</th><th onclick='sortTable()'>Creation Date</th></tr>";
    let id = 0;
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        if (row.transaction.transactionID != id) {
            html += "<tr>";
            html += "<td>" + row.transaction.transactionID + "</td>";
            html += "<td>" + row.transaction.transactionType + "</td>";
            html += "<td>" + row.transaction.originalLocationID + "</td>";
            html += "<td>" + row.transaction.creationDate + "</td>";
            id = row.transaction.transactionID;
        }
    }
    html += "</table>";
    document.querySelector("#orderdiv").innerHTML = html;
    document.querySelector("#ordersTable").addEventListener('dblclick', buildOrderTable);
}

function getAllStoreOrders() {
    var url = "WarehouseOrdersServlet"; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                userType = "";
                orderAllArray = JSON.parse(resp);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function makeChanges() {
    let trs = document.querySelector(".highlighted");
    if (trs == null) {
        alert("Please select a transaction...")
    } else {
        if (document.querySelector("#changesDiv").classList.contains("hidden")) {
            document.querySelector("#changesDiv").classList.remove("hidden");
        } else {
            document.querySelector("#changesDiv").classList.add("hidden");
        }
    }
}

function submitChange() {
    let row = document.querySelector(".highlighted");
    let cells = row.childNodes;
    let tansactionID = cells[0].innerHTML;
    let transactionStatus = cells[5].innerHTML;
    let itemID = cells[7].innerHTML;
    let quantity = document.querySelector("#itemQuantity").value;
    console.log(cells[2].innerHTML);

    if (locationID != cells[2].innerHTML) {
        alert("Cannot change order because this is not your store...");
        return;

    }
    if (quantity > 0 && cells[5].innerHTML != "NEW") {
        alert("Cannot change item quantity on order due to the order being past the 'NEW' stage...");
        return;
    }

    var url = "ManagerServlet/" + tansactionID + "/" + transactionStatus + "/" + itemID + "/" + quantity; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            console.log(resp);
            if (resp == 0) {
                alert('Item ID: ' + itemID + ' On Transction: ' + tansactionID + ' was NOT Changed');
                getStoreOrders();
                document.querySelector("#changesDiv").classList.add("hidden");
            } else if (resp == 1) {
                alert('Item ID: ' + itemID + ' On Transction: ' + tansactionID + ' was Changed');
                getStoreOrders();
                document.querySelector("#changesDiv").classList.add("hidden");
            }

        }
    };
    xmlhttp.open("PUT", url, true);
    xmlhttp.send();

}

function orders() {
    arr = orderArray;
    let html = "<table id='ordersTable' class='table'><tr><th scope='col' onclick=sortTable()>Transaction ID</th>" +
        "<th onclick='sortTable()'>Transaction Type</th><th onclick='sortTable()'>Location ID</th><th onclick='sortTable()'>Creation Date</th></tr>";
    let id = 0;
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        if (row.transaction.transactionID != id) {
            html += "<tr>";
            html += "<td>" + row.transaction.transactionID + "</td>";
            html += "<td>" + row.transaction.transactionType + "</td>";
            html += "<td>" + row.transaction.originalLocationID + "</td>";
            html += "<td>" + row.transaction.creationDate + "</td>";
            id = row.transaction.transactionID;
            if (row.transaction.transactionType == "EMERGENCY") {
                emergency = false;
            }
        }
    }
    html += "</table>";
    document.querySelector("#orderdiv").innerHTML = html;
    this.document.querySelector("#ordersTable").addEventListener('dblclick', buildOrderTable);
}

function hideEOrder() {
    if (Permissions == "CRUD" || roleID == "Store Manager" || roleID == "DB Admin") {
        console.log(emergency)
        document.querySelector("#createOrder").classList.remove("hidden");

    }
}

function decressInventory(newWarehouseQuantity, itemID) {
    var url = "WeightServlet/" + newWarehouseQuantity + "/" + itemID; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert("FAIL");
            } else {
                alert("PASS");
            }
        }
    };
    xmlhttp.open("PUT", url, true);
    xmlhttp.send();
}

function submitOrder() {
    let order = "ORDER";
    let newWarehouseQuantity;
    let backorderQuantity;
    let yesNo = confirm("Are you sure you want to submit this Order?")
    if (yesNo == false) {
        window.location.href = "StoreHome.html";
    } else {
        let newOrderTable = document.querySelector("#newOrderTable");
        if (newOrderTable.rows.length == 1) {
            alert("Please add items to the order");
        } else {
            let today = new Date();
            let month = today.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let date = today.getFullYear() + '-' + month + '-' + today.getDate();


            for (var i = 1; i < newOrderTable.rows.length; i++) {
                let row = newOrderTable.rows[i];
                let tds = row.getElementsByTagName("td");
                let quantity = document.querySelector(".itemQuantity" + i).value;
                if (quantity > tds[10].innerHTML) {
                    backorderQuantity = quantity - tds[10].innerHTML;
                    order = "BACKORDER";
                    quantity = tds[10].innerHTML;
                    newWarehouseQuantity = 0;
                }
                let obj = {
                    transactionID: orderAllArray[orderAllArray.length - 1].transaction.transactionID + 1,
                    transactionType: order,
                    originalLocationID: locationID,
                    creationDate: date,
                    estimatedArrival: null,
                    transactionStatus: "NEW",
                    sourceTransactionID: null,
                    notes: "New Order Placed",
                    itemID: tds[0].innerHTML,
                    quantity: quantity
                }
                decressInventory(newWarehouseQuantity, tds[0].innerHTML);
                console.log(obj);
                var url = "OrderServlet/"; // file name or server-side process name
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                        let resp = xmlhttp.responseText;
                        if (resp == 0) {
                            alert("oh no... Try again");
                        } else {
                            alert("Order has been submitted.");
                            // window.location.href = "StoreHome.html";
                        }
                    }
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.send(JSON.stringify(obj));
            }
        }
    }
}

function addToOrder(ev) {
    let tr = ev.target.closest("tr");
    let tds = tr.getElementsByTagName("td");
    let newOrderTable = document.querySelector("#newOrderTable");
    let newRow = newOrderTable.insertRow(-1);
    for (var i = 0; i < tds.length; i++) {
        if (i != tds.length - 1 && i != tds.length - 3) {
            let newCell = newRow.insertCell(i);
            let newText = document.createTextNode(tds[i].innerHTML);
            newCell.appendChild(newText);
        }
        if (i == tds.length - 3) {
            let newCell = newRow.insertCell(i);
            let newText = document.createElement("input");
            newText.className = "itemQuantity itemQuantity" + quantityID++;
            newText.value = 1;
            newCell.appendChild(newText);
        }
        if (i == tds.length - 1) {
            let newCell = newRow.insertCell(i);
            let newText = document.createElement("button");
            newText.className = "button removeFromOrder";
            newText.innerHTML = "Remove";
            newCell.appendChild(newText);
        }
        let rowIndex = tr.rowIndex;
        document.getElementById("itemOrderTable").deleteRow(rowIndex);
    }
    let allButtons = document.querySelectorAll('.removeFromOrder');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', removeFromOrder);
    }
}

function removeFromOrder(ev) {
    let tr = ev.target.closest("tr");
    let rowIndex = tr.rowIndex;
    document.getElementById("newOrderTable").deleteRow(rowIndex);
}

function userInventory() {
    document.querySelector("#locationIDSearch").value = locationID;
}

function search(name, number) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(name);
    filter = input.value === "." || input.value === "/" ? input.value : input.value.toUpperCase();
    table = document.getElementById("inventory");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[number];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    //                    Re calculate total records
    let trArr = document.querySelectorAll("tr");
    let count = 0;
    for (var i = 0; i < trArr.length; i++) {
        if (trArr[i].style.display == "") {
            count++;
        }
    }
    document.querySelector("#records").innerHTML = "Records: " + (count - 1).toString();
}

function hideTables() {
    if (emergency == true) {
        let element1 = document.querySelector("#MainTables");
        let element2 = document.querySelector("#storeButtons");
        let element3 = document.querySelector("#storeHeader");
        if (element1.classList.contains("hidden")) {
            element1.classList.remove("hidden");
            element2.classList.add("hidden");
            element3.classList.add("hidden");
        } else {
            element1.classList.add("hidden");
            element2.classList.remove("hidden");
            element3.classList.remove("hidden");
        }
    } else {
        alert("Your store already has an EMERGENCY order for this week");
    }

}

function getStoreOrders() {
    var url = "OrderServlet/" + locationID; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                orderArray = JSON.parse(resp);
                console.log(orderArray);
                orders();
                clearSelections();
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function handleRowClick(ev) {
    if (ev.target.tagName === "TD") {
        //add style to parent of clicked cell
        clearSelections();
        ev.target.parentElement.classList.add("highlighted");
        isHighlighted = true;
    }
}

function clearSelections() {
    let trs = document.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove("highlighted");
    }
}

function getAllItems() {
    var url = "UpdateServlet"; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                userType = "";
                buildTable(resp);
                clearSelections();
                if (hideButtons == false) {
                    hideButtons = true;
                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function insertInventory() {
    addOrUpdate = "add";
    showUpdatePanel();
    updateHideToggle("AddUpdatePanel");
    document.querySelector("#itemID").disabled = true;
    document.querySelector("#itemName").disabled = false;
    document.querySelector("#locationID").disabled = false;
    document.querySelector("#sku").disabled = false;
    document.querySelector("#categoryName").disabled = false;
    document.querySelector("#description").disabled = false;
    document.querySelector("#quantity").disabled = false;
    document.querySelector("#weight").disabled = false;
    document.querySelector("#caseSize").disabled = false;
    document.querySelector("#costPrice").disabled = false;
    document.querySelector("#retailPrice").disabled = false;
    document.querySelector("#supplierID").disabled = false;
}

function getRocordsByLocation() {
    let Div = document.querySelector("#lid");
}

function buildTable(text) {
    let arr = JSON.parse(text);
    console.log(arr);
    let html = "<table id='itemOrderTable'><tr><th scope='col' onclick=sortTable()>Item ID</th>" +
        "<th onclick='sortTable()'>Name</th><th onclick='sortTable()'>Sku</th>" +
        "<th onclick='sortTable()'>Category</th><th>Weight</th><th>Cost Price</th><th>Retail Price</th><th>Supplier ID</th>" +
        "<th>Active</th><th>Case Size</th><th>Warehouse Quantity</th><th></th></tr>";
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        let active = row.Active;
        html += "<tr>";
        html += "<td>" + row.ID + "</td>";
        html += "<td>" + row.ItemName + "</td>";
        html += "<td>" + row.Sku + "</td>";
        html += "<td>" + row.category + "</td>";
        html += "<td>" + row.Weight + "</td>";
        html += "<td>" + row.CostPrice + "</td>";
        html += "<td>" + row.RetailPrice + "</td>";
        html += "<td>" + row.SupplierID + "</td>";
        if (active == 0) {
            html += "<td>NO</td>";
        } else {
            html += "<td>YES</td>";
        }
        html += "<td>" + row.CaseSize + "</td>";
        for (let j = 0; j < warehouseInventory.length; j++) {
            if (warehouseInventory[j].itemID == row.ID) {
                html += "<td>" + warehouseInventory[j].quantity + "</td>";
                break;
            }
        }
        html += "<td><button id='addToOrder' class='button' >Add</button></td>";
        html += "</tr>";
        if (i == arr.length - 1) {
            idCount = row.ID + 1;
        }
    }
    html += "</table>";
    document.querySelector("#tablediv").innerHTML = html;
    addListeners();
}

function addListeners() {
    var allButtons = document.querySelectorAll('#addToOrder');

    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', addToOrder);
    }
}


function buildOrderTable(ev) {
    document.querySelector("#createOrder").classList.add("hidden");
    document.querySelector("#createLoss").classList.add("hidden");
    document.querySelector("#viewAll").classList.add("hidden");
    document.querySelector("#createReturn").classList.add("hidden");
    document.querySelector("#back").classList.remove("hidden");
    let arr = orderAllArray;
    let transactionID = ev.target.closest("tr").querySelectorAll("td")[0].innerHTML;
    let html = "<table id='orderTable' class='table'><tr><th scope='col' onclick=sortTable()>Transaction ID</th>" +
        "<th onclick='sortTable()'>Transaction Type</th><th onclick='sortTable()'>Location ID</th><th onclick='sortTable()'>Creation Date</th>" +
        "<th onclick='sortTable()'>ETA</th><th>Transaction Status</th><th>Notes</th><th>Item ID</th>" +
        "<th>Quantity</th></tr>";
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        console.log(row);
        console.log(row.transaction.trasnactionStatus);
        if (row.transaction.transactionID == transactionID) {
            html += "<tr>";
            html += "<td>" + row.transaction.transactionID + "</td>";
            html += "<td>" + row.transaction.transactionType + "</td>";
            if (row.transaction.trasnactionStatus == "IN TRANSIT") {
                html += "<td>VHCL</td>";

            } else {
                html += "<td>" + row.transaction.originalLocationID + "</td>";

            }
            html += "<td>" + row.transaction.creationDate + "</td>";
            if (row.transaction.estimatedArrival != null) {
                html += "<td>" + row.transaction.creationDate + "</td>";
            } else {
                html += "<td> No ETA </td>";
            }
            if (row.transaction.transactionType == "LOSS") {
                html += "<td>COMPLETE</td>";
            } else if (row.transaction.transactionType == "RETURN") {
                html += "<td>SUBMITTED</td>";
            } else {
                html += "<td>" + row.transaction.trasnactionStatus + "</td>";
            }
            html += "<td>" + row.transaction.notes + "</td>";
            html += "<td>" + row.transactionline.itemID + "</td>";
            html += "<td>" + row.transactionline.quantity + "</td>";
        }
    }
    html += "</tr></table>";
    document.querySelector("#orderdiv").innerHTML = html;
    let buttons = document.querySelector("#changeOrderButtons");
    buttons.classList.remove("hidden");
    console.log(roleID);
    if (roleID != "Store Manager" && roleID != "DB Admin") {
        document.querySelector("#makeChanges").classList.add("hidden")
        document.querySelector("#submitChange").classList.add("hidden")
    } else {
        document.querySelector("#makeChanges").addEventListener("click", makeChanges);
        document.querySelector("#submitChange").addEventListener("click", submitChange);
    }
}

function sortTable() {
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    // do the work...
    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr));
    })));
}

function toggleHidden(id) {
    let element = document.querySelector(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function accessToButtons() {
    let x = JSON.parse(Permissions);
    console.log(x);
    console.log(roleID);
    for (var i = 0; i < x.length; i++) {
        if (x[i] == "CREATE INVENTORY") {

        }
        if (x[i] == "READ INVENTORY") {

        }
        if (x[i] == "UPDATE ALL INVENTORY") {
            toggleHidden("#updateButton");
        }
        if (x[i] == "CRUD") {
            toggleHidden("#updateButton");
            break;
        }
    }
}

function readUser() {
    let x = JSON.parse(Permissions);
    console.log(x);
    let links = document.querySelectorAll("#navbarResponsive li a");
    for (var i = 1; i < links.length - 1; i++) {
        let tof = false;
        for (var z = 0; z < x.length; z++) {
            if (x[z] === "READ " + links[i].innerHTML.toUpperCase() || x[z] === "CRUD") {
                tof = true;
                break;
            }
        }
        if (!tof) {
            if (!links[i].text == "Deliveries") {

            } else {
                links[i].classList.add("disabled");
            }
        }
    }
}

function printUser() {
    let location = document.querySelector("#userName");
    location.innerHTML = userName;
}