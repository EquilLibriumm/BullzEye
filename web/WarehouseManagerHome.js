var user = "";
var userType = "";
var tableOnOff = false;
var isHighlighted = false;
var hideButtons = false;
var idCount;
var addOrUpdate;
var orderArray;
var deliverysArray;
var VHCL = "";
var DATE = new Date();
var warehouseInventory;
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");
var roleID = localStorage.getItem("roleID");

window.onload = function() {
    document.querySelector("body").addEventListener("click", handleRowClick);
    document.querySelector("#back").addEventListener("click", goBack);
    document.querySelector("#scan").addEventListener("click", Scan);
    document.querySelector("#processReturn").addEventListener("click", processReturn);
    this.readUser();
    this.getStoreOrders();
    this.printUser();
    getDeliveryIDs();
    getWarehouseInventory();
};

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
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function processReturn() {
    let row = document.querySelector(".highlighted");
    if (row == undefined) {
        alert("Please select an item");
        return;
    }
    if (row.childNodes[1].innerHTML != "RETURN") {
        alert("This item is not of type 'RETURN'");
        return;
    }
    let id = row.childNodes[0].innerHTML;
    let status = "COMPLETE";
    let location = row.childNodes[2].innerHTML;
    let note = document.querySelector("#selectReturn").value;

    var url = "WarehouseManagerServlet/" + id + "/" + status + "/" + location + "/" + note;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert('Transction: ' + id + ' was NOT Changed');
                getStoreOrders();
            } else if (resp == 1) {
                alert('Transction: ' + id + ' was Changed');
                getStoreOrders();
            }

        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send();
}

function Scan() {
    let sku = document.querySelector(".highlighted").children[7].innerHTML;
    document.querySelector("#scanSku").value = sku;
    document.querySelector(".highlighted").closest("tr").classList.add("scanned");

    let trs = document.querySelectorAll("tr");
    for (let i = 1; i < trs.length; i++) {
        if (!trs[i].classList.contains("scanned")) {
            return;
        }
    }
    let signature = prompt("Sign Here for Order", "Signature");
    if (signature != "" || signature != null) {
        let transactionID = trs[1].cells[0].innerHTML;
        let locationID = trs[1].cells[2].innerHTML;
        let itemID = trs[1].cells[6].innerHTML;
        let quantity = trs[1].cells[8].innerHTML;
        let notes = trs[1].cells[5].innerHTML;
        let status = "IN TRANSIT";
        if (trs[1].cells[1].innerHTML == "RETURN") {
            status = "DELIVERED";
            locationID = "WARE";
        }
        var url = "WarehouseManagerServlet/" + transactionID + "/" + status + "/" + locationID;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                let resp = xmlhttp.responseText;
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
    }
}

function readUser() {
    let x = JSON.parse(Permissions);
    let y = document.querySelectorAll("#navbarResponsive li a");
    for (var i = 1; i < y.length - 1; i++) {
        let tof = false;
        for (var z = 0; z < x.length; z++) {
            if (x[z] === "READ " + y[i].innerHTML.toUpperCase() || x[z] === "CRUD") {
                tof = true;
                break;
            }
        }
        if (!tof) {
            if (y[i].text == "Deliveries") {

            } else {
                y[i].classList.add("disabled");
            }
        }
    }
    printUser();
}

function printUser() {
    document.getElementById("userName").innnerHTML = userName;
}

function getStoreOrders() {
    var url = "WarehouseOrdersServlet"; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                userType = "";
                orderArray = JSON.parse(resp);
                orders(orderArray);
                // buildOrderTable(resp);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function goBack() {
    orders();
    let buttons = document.querySelector("#changeOrderButtons");
    buttons.classList.add("hidden");
    document.querySelector("#changesDiv").classList.add("hidden");
    document.querySelector("#searchDivManager").classList.remove("hidden");
}

function makeChanges() {
    let trs = document.querySelector(".highlighted");
    if (trs == null) {
        alert("Please select a transaction...")
    } else {
        if (document.querySelector("#changesDiv").classList.contains("hidden")) {
            document.querySelector("#changesDiv").classList.remove("hidden");
            let quantity = document.querySelector(".highlighted").children[8].innerHTML;
            let status = document.querySelector(".highlighted").children[5].innerHTML;
            document.querySelector("#itemQuantity").value = quantity;
            document.querySelector("#status").value = status;
        } else {
            document.querySelector("#changesDiv").classList.add("hidden");
        }

    }
}

function getWeight() {

    totalWeight = 0;
    let IDs = "";
    let itemIDs = document.querySelectorAll("tr");
    //url itemIDs
    for (let i = 1; i < itemIDs.length; i++) {
        if (i != itemIDs.length - 1) {
            IDs += itemIDs[i].childNodes[6].innerHTML + "/";
        } else {
            IDs += itemIDs[i].childNodes[6].innerHTML + ",";
        }
    }
    //url Quantitys
    for (let i = 1; i < itemIDs.length; i++) {
        if (i != itemIDs.length - 1) {
            IDs += itemIDs[i].childNodes[8].innerHTML + ",";
        } else {
            IDs += itemIDs[i].childNodes[8].innerHTML;
        }
    }

    var url = "WeightServlet/" + IDs; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == "0") {} else {
                //Do Work Here
                let weight = parseFloat(resp);
                totalWeight += weight;
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    if (totalWeight < 852.76) {
        VHCL = "VAN";
    } else if (totalWeight < 1292.75) {
        VHCL = "LIGHT";
    } else if (totalWeight < 4086.88) {
        VHCL = "MEDIUM";
    } else if (totalWeight > 4086.87) {
        VHCL = "HEAVY";
    }
}

function getDeliveryIDs() {
    var url = "DeliveryServlet/"; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == []) {
                alert("DID NOT WORK");
            } else {
                deliverysArray = JSON.parse(resp);
            }
        }
    };
    xmlhttp.open("PUT", url, true);
    xmlhttp.send();
}

function submitChange() {
    //CREATE Delivery in DB
    let obj = {
        deliveryID: 3,
        dateTime: DATE,
        vehicleID: VHCL,
        courierID: 1
    }
    let x = JSON.stringify(obj);
    var url = "DeliveryServlet/"; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert("DID NOT WORK");
            } else if (resp == 1) {

            }

        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(x);

}

function submitChanges(transactionI, transactionStatu, itemI, quantit, locationI, note) {
    let row;
    let cells;
    let transactionID;
    let transactionStatus;
    let itemID;
    let quantity;
    let newWarehouseQuantity;
    let notes;
    let locationID;

    row = document.querySelector(".highlighted");
    cells = row.childNodes;
    transactionID = cells[0].innerHTML;
    transactionStatus = document.querySelector("#status").value;
    itemID = cells[6].innerHTML;
    quantity = document.querySelector("#itemQuantity").value;
    locationID = "";
    if (transactionStatus == "IN TRANSIT") {
        locationID = "VHCL"
    } else {
        locationID = cells[2].innerHTML;
    }
    notes = "Transaction Status changed from " + cells[5].innerHTML + " to " + transactionStatus + ".";

    if (cells[8].innerHTML != quantity) {
        notes += ":-- Quantity changed ";
    }
    // if (quantity > 0 && cells[5].innerHTML != "SUBMITTED") {
    //     alert("Cannot change item quantity on order due to the order being past the processing stage...");
    //     return;
    // }
    if (transactionStatus == "READY") {
        submitChange();
    }


    for (let i = 0; i < warehouseInventory.length; i++) {
        if (itemID == warehouseInventory[i].itemID) {
            newWarehouseQuantity = warehouseInventory[i].quantity - quantity;
            break;
        }
    }

    decreaseWarehouseInventory(newWarehouseQuantity, itemID);

    var url = "WarehouseOrdersServlet/" + transactionID + "/" + transactionStatus + "/" + itemID + "/" + quantity + "/" + locationID + "/" + notes; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert('Item ID: ' + itemID + ' On Transction: ' + transactionID + ' was NOT Changed');
                getStoreOrders();
                document.querySelector("#changesDiv").classList.add("hidden");
            } else if (resp == 1) {
                alert('Item ID: ' + itemID + ' On Transction: ' + transactionID + ' was Changed');
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
        }
    }
    html += "</table>";
    document.querySelector("#orderdiv").innerHTML = html;
    this.document.querySelector("#ordersTable").addEventListener('dblclick', buildOrderTable);
}

function decreaseWarehouseInventory(newWarehouseQuantity, itemID) {

    var url = "/WeightServlet/" + newWarehouseQuantity + "/" + itemID; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == 0) {
                alert('NO');
            } else if (resp == 1) {
                alert('YES');
            }
        }
    };
    xmlhttp.open("PUT", url, true);
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

function buildOrderTable(ev) {
    let arr = orderArray;
    let transactionID = ev.target.closest("tr").querySelectorAll("td")[0].innerHTML;
    let html = "<table id='orderTable' class='table'><tr><th scope='col' onclick=sortTable()>Transaction ID</th>" +
        "<th onclick='sortTable()'>Transaction Type</th><th onclick='sortTable()'>Location ID</th>" +
        "<th onclick='sortTable()'>ETA</th><th>Transaction Status</th><th>Notes</th><th>Item ID</th><th>Sku</th>" +
        "<th>Quantity</th></tr>";
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        if (row.transaction.transactionID == transactionID) {
            html += "<tr>";
            html += "<td>" + row.transaction.transactionID + "</td>";
            html += "<td>" + row.transaction.transactionType + "</td>";
            if (row.transaction.trasnactionStatus == "IN TRANSIT") {
                html += "<td>VHCL</td>";
            } else {
                html += "<td>" + row.transaction.originalLocationID + "</td>";
            }
            if (row.transaction.estimatedArrival != null) {
                html += "<td>" + row.transaction.creationDate + "</td>";
            } else {
                html += "<td> No ETA </td>";
            }
            html += "<td>" + row.transaction.trasnactionStatus + "</td>";
            html += "<td>" + row.transaction.notes + "</td>";
            html += "<td>" + row.transactionline.itemID + "</td>";
            html += "<td>" + row.Sku + "</td>";
            html += "<td>" + row.transactionline.quantity + "</td>";
        }
    }
    html += "</tr></table>";
    document.querySelector("#orderdiv").innerHTML = html;
    let buttons = document.querySelector("#changeOrderButtons");
    buttons.classList.remove("hidden");
    document.querySelector("#searchDivManager").classList.add("hidden");
    if (roleID != "Warehouse Manager" && roleID != "DB Admin") {
        document.querySelector("#makeChanges").classList.add("hidden");
        document.querySelector("#submitChange").classList.add("hidden");
    } else {
        document.querySelector("#makeChanges").addEventListener("click", makeChanges);
        document.querySelector("#submitChange").addEventListener("click", submitChanges);
    }

    getWeight();
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

function printUser() {
    let location = document.querySelector("#userName");
    location.innerHTML = userName;
}