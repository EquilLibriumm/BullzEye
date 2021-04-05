var user = "";
var userType = "";
var tableOnOff = false;
var isHighlighted = false;
var hideButtons = false;
var idCount;
var addOrUpdate;
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");

window.onload = function() {
    readUser();
    accessToButtons();
    // add event handlers for buttons
    getAllItems();
    document.querySelector("#addButton").addEventListener("click", addItem);
    document.querySelector("#active").addEventListener("click", changeActive);
    document.querySelector("#updateButton").addEventListener("click", updateHideToggle);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#tablediv").addEventListener("click", updateItem);
    // add event handler for selections on the table
    document.querySelector("body").addEventListener("click", handleRowClick);
    printUser();
};
//Logs user out
function logOut() {
    window.location.reload(true);
}
//Handle element hide/show
function toggleHidden(id) {
    let element = document.querySelector(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}
//Hides or Shows the updat and add panel
function updateHideToggle() {
    toggleHidden("#AddUpdatePanel");
}

function printUser() {
    let location = document.querySelector("#userName");
    location.innerHTML = userName;
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

function buildTable(text) {
    if (userType == "viewUsers") {
        if (!tableOnOff) {
            toggleHidden("#tablediv");
            tableOnOff = true;
        } else {
            tableOnOff = true;
        }
        console.log(text);
        let arr = JSON.parse(text);
        let html = "<table id='users' class='table'><tr><th onclick=sortTable()>User ID</th><th onclick='sortTable()'>location ID</th><th onclick='sortTable()'>Role ID</th></thead</tr>";
        console.log(arr);
        for (let i = 0; i < arr.length; i++) {
            let row = arr[i];
            html += "<tr>";
            html += "<td>" + row.userID + "</td>";
            html += "<td>" + row.locationID + "</td>";
            html += "<td>" + row.roleID + "</td>";
            html += "</tr>";
        }
        html += "</table>";
        document.querySelector("#tablediv").innerHTML = html;
    } else {
        if (!tableOnOff) {
            toggleHidden("#tablediv");
            tableOnOff = true;
        }
        let arr = JSON.parse(text);
        let html = "<table id='itemTable' class='table'><tr><th scope='col' onclick=sortTable()>Item ID</th>" +
            "<th onclick='sortTable()'>Name</th><th onclick='sortTable()'>Sku</th><th onclick='sortTable()'>Description</th>" +
            "<th onclick='sortTable()'>Category</th><th>Weight</th><th>Cost Price</th><th>Retail Price</th><th>Supplier ID</th>" +
            "<th>Active</th><th>Notes</th><th>Case Size</th></tr>";
        console.log(arr);
        for (let i = 0; i < arr.length; i++) {
            let row = arr[i];
            let active = row.Active;
            html += "<tr>";
            html += "<td>" + row.ID + "</td>";
            html += "<td>" + row.ItemName + "</td>";
            html += "<td>" + row.Sku + "</td>";
            html += "<td>" + row.Des + "</td>";
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
            html += "<td>" + row.Notes + "</td>";
            html += "<td>" + row.CaseSize + "</td>";
            html += "</tr>";
            if (i == arr.length - 1) {
                idCount = row.ID + 1;
            }
        }
        html += "</table>";
        document.querySelector("#tablediv").innerHTML = html;
        document.querySelector("#records").innerHTML = "Records: " + arr.length.toString();
    }
}

function addItem() {
    addOrUpdate = "add";
    showUpdatePanel();
    toggleHidden("#AddUpdatePanel");

}

function updateItem(ev) {
    if (ev.target.tagName == "TH") {

    } else {
        let target = ev.target;
        addOrUpdate = "update";
        let row = document.querySelector(".highlighted");
        let itemID = row.querySelectorAll("td")[0].innerHTML;
        let name = row.querySelectorAll("td")[1].innerHTML;
        let sku = row.querySelectorAll("td")[2].innerHTML;
        let description = row.querySelectorAll("td")[3].innerHTML;
        let category = row.querySelectorAll("td")[4].innerHTML;
        let weight = row.querySelectorAll("td")[5].innerHTML;
        let costPrice = row.querySelectorAll("td")[6].innerHTML;
        let retailPrice = row.querySelectorAll("td")[7].innerHTML;
        let supplierID = row.querySelectorAll("td")[8].innerHTML;
        let active = 0;
        if (row.querySelectorAll("td")[9].innerHTML == "YES") {
            active = 1;
        }
        let notes = row.querySelectorAll("td")[10].innerHTML;
        let caseSize = row.querySelectorAll("td")[11].innerHTML;
        showUpdatePanel(itemID, name, sku, description, category, weight, costPrice, retailPrice, supplierID, active, notes, caseSize);
    }
}

function showUpdatePanel(itemID, name, sku, description, category, weight, costPrice, retailPrice, supplierID, active, notes, caseSize) {
    if (addOrUpdate == "add") {
        document.querySelector("#itemID").value = idCount;
        document.querySelector("#name").value = "";
        document.querySelector("#sku").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#category").value = "";
        document.querySelector("#weight").value = "";
        document.querySelector("#costPrice").value = "";
        document.querySelector("#retailPrice").value = "";
        document.querySelector("#supplierID").value = null;
        document.querySelector("#active").value = null;
        document.querySelector("#notes").value = "";
        document.querySelector("#caseSize").value = null;
    } else if (addOrUpdate == "update") {
        document.querySelector("#itemID").value = itemID;
        document.querySelector("#name").value = name;
        document.querySelector("#sku").value = sku;
        document.querySelector("#description").value = description;
        document.querySelector("#category").value = category;
        document.querySelector("#weight").value = weight;
        document.querySelector("#costPrice").value = costPrice;
        document.querySelector("#retailPrice").value = retailPrice;
        document.querySelector("#supplierID").value = supplierID;
        document.querySelector("#active").value = active;
        document.querySelector("#notes").value = notes;
        document.querySelector("#caseSize").value = caseSize;
    }
}

function hideUpdatePanel() {
    document.getElementById("AddUpdatePanel").classList.add("hidden");
}

function clearSelections() {
    let trs = document.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove("highlighted");
    }
}

function handleRowClick(ev) {
    if (ev.target.tagName === "TD") {
        //add style to parent of clicked cell
        clearSelections();
        ev.target.parentElement.classList.add("highlighted");
        isHighlighted = true;
    }
}

function processForm() {
    document.querySelector("#records").innerHTML = "";
    let itemID = document.querySelector("#itemID").value;
    let itemName = document.querySelector("#name").value;
    let sku = document.querySelector("#sku").value;
    let description = document.querySelector("#description").value;
    let category = document.querySelector("#category").value;
    let Weight = document.querySelector("#weight").value;
    let costPrice = document.querySelector("#costPrice").value;
    let retailPrice = document.querySelector("#retailPrice").value;
    let supplierID = document.querySelector("#supplierID").value;
    let active = document.querySelector("#active").value;
    let notes = document.querySelector("#notes").value;
    let caseSize = document.querySelector("#caseSize").value;

    let obj = {
        ID: itemID,
        ItemName: itemName,
        Sku: sku,
        Des: description,
        category: category,
        Weight: Weight,
        CostPrice: costPrice,
        RetailPrice: retailPrice,
        SupplierID: supplierID,
        Active: 1,
        Notes: notes,
        CaseSize: caseSize
    };
    console.log(obj);
    var url = "UpdateServlet/Item/" + itemID;
    var method = (addOrUpdate === "add") ? "POST" : "PUT";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resp = xmlhttp.responseText;
            console.log(resp);
            if (resp != 1) {
                if (addOrUpdate == "add") {
                    alert('Item# :' + itemID + ' was NOT succesfully added');
                    getAllItems();
                } else {
                    alert('Item# :' + itemID + ' was NOT succesfully updated');
                    getAllItems();

                }
            } else {
                if (addOrUpdate == "add") {
                    alert('Item# :' + itemID + ' was succesfully added');
                    getAllItems();
                } else {
                    alert('Item# :' + itemID + ' was succesfully updated');
                    getAllItems();

                }
            }
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send(JSON.stringify(obj));
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

function changeActive() {
    let row = document.querySelector(".highlighted");
    let itemID = row.querySelectorAll("td")[0].innerHTML;
    let active = row.querySelectorAll("td")[9].innerHTML;
    if (active == "NO") {
        active = 1;
    } else if (active == "YES") {
        active = 0
    }

    var url = "UpdateServlet/Item/" + itemID + "/" + active;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resp = xmlhttp.responseText;
            if (resp != 1) {
                alert('Item ID: ' + itemID + ' was succesfully updated');
                getAllItems();
            } else {
                alert('Item ID: ' + itemID + ' was NOT succesfully updated');
                getAllItems();
            }
        }
    };
    xmlhttp.open("DELETE", url, true);
    xmlhttp.send();
}

function accessToButtons() {
    let x = JSON.parse(Permissions);
    console.log(x);
    for (var i = 0; i < x.length; i++) {
        if (x[i] == "CREATE ITEM") {
            toggleHidden("#addButton");
        }
        if (x[i] == "READ ITEM") {

        }
        if (x[i] == "UPDATE ITEM") {
            toggleHidden("#updateButton");
        }
        if (x[i] == "CRUD") {
            toggleHidden("#active");
            toggleHidden("#updateButton");
            toggleHidden("#addButton");
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
}