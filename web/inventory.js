var roleID = localStorage.getItem("roleID");
var locationID = localStorage.getItem("locationID");
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");
var addOrUpdate;
var isHighlighted = false;
var hideButtons = false;
var stringTable;
var id = 0;
var view = "store";

window.onload = function() {
    readUser();
    getInventory();
    document.querySelector("body").addEventListener("click", handleRowClick);
    document.querySelector("#tablediv").addEventListener("click", updateInventory);
    document.querySelector("#updateButton").addEventListener("click", updateHideToggle);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#viewAll").addEventListener("click", viewAll);
    this.printUser();


};

function viewAll() {
    if (view == "store") {
        view = "all";
        buildTable(stringTable);
    } else {
        view = "store";
        buildTable(stringTable);
    }
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
    console.log(count);
    document.querySelector("#records").innerHTML = "Records: " + (count - 1).toString();
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

function getInventory() {

    let url = "InventoryServlet"; // file name or server-side process name
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                buildTable(resp);
                if (hideButtons == false) {
                    accessToButtons();
                    hideButtons = true;
                }
            }
        }
    }
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
    stringTable = (text);
    let arr = JSON.parse(text);
    let html = "<table id='inventory' class='table'><tr><th onclick=sortTable()>Item ID</th><th onclick='sortTable()'>Item Name</th><th onclick='sortTable()'>Location ID</th>" +
        "<th onclick='sortTable()'>Sku</th><th onclick='sortTable()'>Category Name</th><th onclick='sortTable()'>Description</th><th onclick='sortTable()'>Quantity</th>" +
        "<th onclick='sortTable()'>Weight</th><th onclick='sortTable()'>Case Size</th><th onclick='sortTable()'>Cost Price</th><th onclick='sortTable()'>Retail Price</th>" +
        "<th onclick='sortTable()'>Supplier ID</th><th onclick='sortTable()'>Reorder Threshold</th><th onclick='sortTable()'>Reorder Level</th>" +
        "</tr>";
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        if (locationID == row.locationID && view == "store") {

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
        if (view == "all") {
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
    document.querySelector("#tablediv").innerHTML = html;
    document.querySelector("#records").innerHTML = "Records: " + arr.length.toString();

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

function updateInventory(ev) {
    if (ev.target.tagName == "TH") {

    } else {
        let target = ev.target;
        handleRowClick(ev);
        addOrUpdate = "update";
        let row = document.querySelector(".highlighted");
        let itemID = row.querySelectorAll("td")[0].innerHTML;
        let itemName = row.querySelectorAll("td")[1].innerHTML;
        let locationID = row.querySelectorAll("td")[2].innerHTML;
        let sku = row.querySelectorAll("td")[3].innerHTML;
        let categoryName = row.querySelectorAll("td")[4].innerHTML;
        let description = row.querySelectorAll("td")[5].innerHTML;
        let quantity = row.querySelectorAll("td")[6].innerHTML;
        let weight = row.querySelectorAll("td")[7].innerHTML;
        let caseSize = row.querySelectorAll("td")[8].innerHTML;
        let costPrice = row.querySelectorAll("td")[9].innerHTML;
        let retailPrice = row.querySelectorAll("td")[10].innerHTML;
        let SupplierID = row.querySelectorAll("td")[11].innerHTML;
        let reoderThreshold = row.querySelectorAll("td")[12].innerHTML;
        let reoderLevel = row.querySelectorAll("td")[13].innerHTML;
        showUpdatePanel(itemID, itemName, locationID, sku, categoryName, description, quantity, weight, caseSize, costPrice, retailPrice, SupplierID, reoderThreshold, reoderLevel);
    }
}

function updateHideToggle() {
    addOrUpdate = "update";
    toggleHidden("#AddUpdatePanel");
}

function toggleHidden(id) {
    let element = document.querySelector(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function showUpdatePanel(itemID, itemName, locationID, sku, categoryName, description, quantity, weight, caseSize, costPrice, retailPrice, SupplierID, reoderThreshold, reoderLevel) {
    if (addOrUpdate == "add") {
        document.querySelector("#itemID").value = id;
        document.querySelector("#itemName").value = "";
        document.querySelector("#locationID").value = "";
        document.querySelector("#sku").value = "";
        document.querySelector("#categoryName").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#quantity").value = "";
        document.querySelector("#weight").value = "";
        document.querySelector("#caseSize").value = "";
        document.querySelector("#costPrice").value = "";
        document.querySelector("#retailPrice").value = "";
        document.querySelector("#supplierID").value = "";
        document.querySelector("#reorderThreshold").value = "";
        document.querySelector("#reorderLevel").value = "";
    } else {
        document.querySelector("#itemID").value = itemID;
        document.querySelector("#itemName").value = itemName;
        document.querySelector("#locationID").value = locationID;
        document.querySelector("#sku").value = sku;
        document.querySelector("#categoryName").value = categoryName;
        document.querySelector("#description").value = description;
        document.querySelector("#quantity").value = quantity;
        document.querySelector("#weight").value = weight;
        document.querySelector("#caseSize").value = caseSize;
        document.querySelector("#costPrice").value = costPrice;
        document.querySelector("#retailPrice").value = retailPrice;
        document.querySelector("#supplierID").value = SupplierID;
        document.querySelector("#reorderThreshold").value = reoderThreshold;
        document.querySelector("#reorderLevel").value = reoderLevel;
    }
}

function processForm() {

    document.querySelector("#records").innerHTML = "";
    let itemID = document.querySelector("#itemID").value;
    let itemName = document.querySelector("#itemName").value;
    let objlocationID = document.querySelector("#locationID").value;
    let sku = document.querySelector("#sku").value;
    let categoryName = document.querySelector("#categoryName").value;
    let description = document.querySelector("#description").value;
    let quantity = document.querySelector("#quantity").value;
    let weight = document.querySelector("#weight").value;
    let caseSize = document.querySelector("#caseSize").value;
    let costPrice = document.querySelector("#costPrice").value;
    let retailPrice = document.querySelector("#retailPrice").value;
    let supplierID = document.querySelector("#supplierID").value;
    let reorderThreshold = document.querySelector("#reorderThreshold").value;
    let reorderLevel = document.querySelector("#reorderLevel").value;
    let obj = {
        itemID: itemID,
        itemName: itemName,
        locationID: objlocationID,
        sku: sku,
        categoryName: categoryName,
        description: description,
        quantity: quantity,
        weight: weight,
        caseSize: caseSize,
        costPrice: costPrice,
        retailPrice: retailPrice,
        supplierID: supplierID,
        reorderThreshold: reorderThreshold,
        reorderLevel: reorderLevel
    };
    if (locationID == obj.locationID) {
        if (reorderThreshold > reorderLevel) {
            alert("Reorder Threshold must be lower than Reorder Level!");
        } else {
            var url = "InventoryServlet/" + itemID;
            var method = (addOrUpdate === "add") ? "POST" : "PUT";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var resp = xmlhttp.responseText;
                    console.log(resp);
                    if (resp != 1) {
                        alert('locationID# :' + itemID + ' was NOT succesfully updated');
                        getInventory();
                    } else {
                        alert('locationID# :' + itemID + ' was  succesfully added');
                        getInventory();
                    }
                }
            };
            xmlhttp.open(method, url, true);
            xmlhttp.send(JSON.stringify(obj));
        }
    } else {
        alert("This item is not your store! Please choose an item that is in your store.");
    }

}

function changeActive() {
    if (isHighlighted == true) {
        let row = document.querySelector(".highlighted");
        let itemID = row.querySelectorAll("td")[0].innerHTML;
        let active = row.querySelectorAll("td")[15].innerHTML;
        if (active == "NO") {
            active = 1;
        } else if (active == "YES") {
            active = 0
        }
        let url = "InventoryServlet/" + itemID + "/" + active;
        let method = "DELETE";
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                let resp = xmlhttp.responseText;
                if (resp != 1) {
                    alert('Item ID: ' + itemID + ' was NOT Changed');
                    getInventory();
                } else {
                    alert('Item ID: ' + itemID + ' was Changed');
                    getInventory();
                }
            }
        };
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    } else {
        alert("Please select an Inventory Item");
    }
}

function accessToButtons() {
    let x = JSON.parse(Permissions);
    console.log(x);
    console.log(roleID);
    for (var i = 0; i < x.length; i++) {
        if (x[i] == "CREATE INVENTORY") {}
        if (x[i] == "READ INVENTORY") {

        }
        if (x[i] == "UPDATE ALL INVENTORY" || x[i] == "UPDATE INVENTORY") {
            toggleHidden("#updateButton");
        }
        if (x[i] == "CRUD") {
            //            toggleHidden("#changeButton");
            toggleHidden("#updateButton");
            //            toggleHidden("#addButton");
            break;
        }
    }
}

function readUser() {
    let x = JSON.parse(Permissions);
    console.log(x);
    let y = document.querySelectorAll("#navbarResponsive li a");
    for (var i = 1; i < y.length - 1; i++) {
        let tof = false;
        for (var z = 0; z < x.length; z++) {
            if (x[z] === "READ " + y[i].innerHTML.toUpperCase() || x[z] === "CRUD" || x[z] === "UPDATE INVENTORY") {
                tof = true;
                break;
            }
        }
        if (!tof) {
            if (y[i].text == "Deliveries") {

            } else {
                y[i].classList.add("disabled");
            }
            document.querySelector("#imHere").classList.remove("disabled");
        }
    }
}

function printUser() {
    let location = document.querySelector("#userName");
    location.innerHTML = userName;
}