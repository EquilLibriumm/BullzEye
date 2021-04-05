var roleID = localStorage.getItem("roleID");
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");
var addOrUpdate;
var idCount;
var hideButtons = false;
var isHighlighted = false;

window.onload = function() {
    readUser();
    getCouriers();
    document.querySelector("body").addEventListener("click", handleRowClick);
    document.querySelector("#tablediv").addEventListener("click", updateCourier);
    document.querySelector("#updateButton").addEventListener("click", updateHideToggle);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#addButton").addEventListener("click", insertCourier);
    document.querySelector("#changeButton").addEventListener("click", changeActive);
    this.printUser();
};

function printUser() {
    let location = document.querySelector("#userName");
    location.innerHTML = userName;
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

function getCouriers() {
    let url = "CourierServlet"; // file name or server-side process name
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

function insertCourier() {
    addOrUpdate = "add";
    showUpdatePanel();
    updateHideToggle("AddUpdatePanel");
    document.querySelector("#courierID").value = idCount;
    document.querySelector("#active").disabled = false;
}

function buildTable(text) {
    let arr = JSON.parse(text);
    let html = "<table id='courier' class='table'><tr><th onclick=sortTable()>Courier ID</th><th onclick='sortTable()'>Courier Name</th><th onclick='sortTable()'>Address</th><th onclick='sortTable()'>City</th><th onclick='sortTable()'>Province ID</th><th onclick='sortTable()'>Postal Code</th><th onclick='sortTable()'>Country</th><th onclick='sortTable()'>Courier Email</th><th onclick='sortTable()'>Courier Phone</th><th onclick='sortTable()'>Notes</th><th onclick='sortTable()'>Active</th></tr>";
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        html += "<tr>";
        html += "<td>" + row.courierID + "</td>";
        html += "<td>" + row.courierName + "</td>";
        html += "<td>" + row.address + "</td>";
        html += "<td>" + row.city + "</td>";
        html += "<td>" + row.provinceID + "</td>";
        html += "<td>" + row.postalCode + "</td>";
        html += "<td>" + row.country + "</td>";
        html += "<td>" + row.courierEmail + "</td>";
        10
        html += "<td>" + row.courierPhone + "</td>";
        html += "<td>" + row.notes + "</td>";
        html += "<td>" + row.active + "</td>";
        html += "</tr>";
    }
    html += "</table>";
    document.querySelector("#tablediv").innerHTML = html;
    document.querySelector("#records").innerHTML += arr.length.toString();
    idCount = arr.length + 1;
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

function updateCourier(ev) {
    if (ev.target.tagName == "TH") {

    } else {
        let target = ev.target;
        handleRowClick(ev);
        console.log(target);
        addOrUpdate = "update";
        let row = document.querySelector(".highlighted");
        let courierID = row.querySelectorAll("td")[0].innerHTML;
        let courierName = row.querySelectorAll("td")[1].innerHTML;
        let address = row.querySelectorAll("td")[2].innerHTML;
        let city = row.querySelectorAll("td")[3].innerHTML;
        let provinceID = row.querySelectorAll("td")[4].innerHTML;
        let postalCode = row.querySelectorAll("td")[5].innerHTML;
        let Country = row.querySelectorAll("td")[6].innerHTML;
        let courierEmail = row.querySelectorAll("td")[7].innerHTML;
        let courierPhone = row.querySelectorAll("td")[8].innerHTML;
        let notes = row.querySelectorAll("td")[9].innerHTML;
        let active = 0;
        if (row.querySelectorAll("td")[10].innerHTML == "YES") {
            active = 1;
        }
        showUpdatePanel(courierID, courierName, address, city, provinceID, postalCode, Country, courierEmail, courierPhone, notes, active);
    }
}

function updateHideToggle() {
    toggleHidden("#AddUpdatePanel");
    document.querySelector("#active").disabled = true;
}

function toggleHidden(id) {
    let element = document.querySelector(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function showUpdatePanel(courierID, courierName, address, city, provinceID, postalCode, Country, courierEmail, courierPhone, notes, active) {
    if (addOrUpdate == "add") {
        document.querySelector("#courierID").value = null;
        document.querySelector("#courierName").value = "";
        document.querySelector("#address").value = "";
        document.querySelector("#city").value = "";
        document.querySelector("#provinceID").value = "";
        document.querySelector("#postalCode").value = "";
        document.querySelector("#country").value = "";
        document.querySelector("#courierEmail").value = "";
        document.querySelector("#courierPhone").value = "";
        document.querySelector("#notes").value = "";
        document.querySelector("#active").value = null;
    } else {
        document.querySelector("#courierID").value = courierID;
        document.querySelector("#courierName").value = courierName;
        document.querySelector("#address").value = address;
        document.querySelector("#city").value = city;
        document.querySelector("#provinceID").value = provinceID;
        document.querySelector("#postalCode").value = postalCode;
        document.querySelector("#country").value = Country;
        document.querySelector("#courierEmail").value = courierEmail;
        document.querySelector("#courierPhone").value = courierPhone;
        document.querySelector("#notes").value = notes;
        document.querySelector("#active").value = active;
    }
}

function processForm() {
    let courierID = document.querySelector("#courierID").value;
    let courierName = document.querySelector("#courierName").value;
    let address = document.querySelector("#address").value;
    let city = document.querySelector("#city").value;
    let provinceID = document.querySelector("#provinceID").value;
    let postalCode = document.querySelector("#postalCode").value;
    let country = document.querySelector("#country").value;
    let courierEmail = document.querySelector("#courierEmail").value;
    let courierPhone = document.querySelector("#courierPhone").value;
    let notes = document.querySelector("#notes").value;
    let active = document.querySelector("#active").value;
    let obj = {
        courierID: courierID,
        courierName: courierName,
        address: address,
        city: city,
        provinceID: provinceID,
        postalCode: postalCode,
        country: country,
        courierEmail: courierEmail,
        courierPhone: courierPhone,
        notes: notes,
        active: active
    };
    console.log(obj);
    var url = "CourierServlet/courier/" + courierID;
    var method = (addOrUpdate === "add") ? "POST" : "PUT";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resp = xmlhttp.responseText;
            console.log(resp);
            if (resp != 1) {
                alert('Courier ID:' + courierID + ' was NOT succesfully updated');
                getCouriers();
            } else {
                alert('Courier ID:' + courierID + ' was succesfully updated');
                getCouriers();
            }
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send(JSON.stringify(obj));
}

function changeActive() {
    if (isHighlighted == true) {
        let row = document.querySelector(".highlighted");
        let courierID = row.querySelectorAll("td")[0].innerHTML;
        let active = row.querySelectorAll("td")[10].innerHTML;
        if (active == 1) {
            active = 0;
        } else {
            active = 1;
        }
        let url = "CourierServlet/courier/" + courierID + "/" + active;
        let method = "DELETE";
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                let resp = xmlhttp.responseText;
                console.log(resp);
                if (resp != 1) {
                    alert('Courier ID: ' + courierID + ' was NOT Changed');
                    getCouriers();
                    clearSelections();
                } else {
                    alert('Courier ID: ' + courierID + ' was Changed');
                    getCouriers();
                    clearSelections();
                }
            }
        };
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    } else {
        alert("Please select a courier");
    }
}

function accessToButtons() {
    let x = JSON.parse(Permissions);
    console.log(x);
    console.log(roleID);
    for (var i = 0; i < x.length; i++) {
        if (x[i] == "CREATE COURIER") {
            toggleHidden("#addButton");
        }
        if (x[i] == "READ COURIER") {

        }
        if (x[i] == "UPDATE COURIER") {
            toggleHidden("#updateButton");
        }
        if (x[i] == "CRUD") {
            toggleHidden("#changeButton");
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