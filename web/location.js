var roleID = localStorage.getItem("roleID");
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");
var addOrUpdate;
var hideButtons = false;
var isHighlighted = false;

window.onload = function() {
    readUser();
    getLocations();
    accessToButtons();
    document.querySelector("body").addEventListener("click", handleRowClick);
    document.querySelector("#tablediv").addEventListener("click", updateLocation);
    document.querySelector("#updateButton").addEventListener("click", updateHideToggle);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#addButton").addEventListener("click", insertLocation);
    document.querySelector("#changeButton").addEventListener("click", changeActive);
    this.printUser();
};

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

function getLocations() {
    let url = "LocationServlet"; // file name or server-side process name
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                buildTable(resp);
                if (hideButtons == false) {
                    hideButtons = true;
                }
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function insertLocation() {
    addOrUpdate = "add";
    showUpdatePanel();
    updateHideToggle("AddUpdatePanel");
    document.querySelector("#active").disabled = false;
}

function buildTable(text) {
    let arr = JSON.parse(text);
    let html = "<table id='locations' class='table'><tr><th onclick=sortTable()>Location ID</th><th onclick='sortTable()'>Description</th><th onclick='sortTable()'>Address</th><th onclick='sortTable()'>City</th><th onclick='sortTable()'>Province</th><th onclick='sortTable()'>Postal Code</th><th onclick='sortTable()'>Country</th><th onclick='sortTable()'>Location Type ID</th><th onclick='sortTable()'>Delivery Day</th><th onclick='sortTable()'>Active</th></tr>";
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        html += "<tr>";
        html += "<td>" + row.locationID + "</td>";
        html += "<td>" + row.description + "</td>";
        html += "<td>" + row.address + "</td>";
        html += "<td>" + row.city + "</td>";
        html += "<td>" + row.province + "</td>";
        html += "<td>" + row.postalCode + "</td>";
        html += "<td>" + row.country + "</td>";
        html += "<td>" + row.locationTypeID + "</td>";
        html += "<td>" + row.deliveryDay + "</td>";
        if (row.active == 0) {
            html += "<td>NO</td>";
        } else {
            html += "<td>YES</td>";
        }

        html += "</tr>";
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

function updateLocation(ev) {
    if (ev.target.tagName == "TH") {

    } else {
        let target = ev.target;
        handleRowClick(ev);
        addOrUpdate = "update";
        let row = document.querySelector(".highlighted");
        let locationID = row.querySelectorAll("td")[0].innerHTML;
        let description = row.querySelectorAll("td")[1].innerHTML;
        let address = row.querySelectorAll("td")[2].innerHTML;
        let city = row.querySelectorAll("td")[3].innerHTML;
        let province = row.querySelectorAll("td")[4].innerHTML;
        let postalCode = row.querySelectorAll("td")[5].innerHTML;
        let country = row.querySelectorAll("td")[6].innerHTML;
        let locationTypeID = row.querySelectorAll("td")[7].innerHTML;
        let deliveryDay = row.querySelectorAll("td")[8].innerHTML;
        let active = 0;
        if (row.querySelectorAll("td")[9].innerHTML == "YES") {
            active = 1;
        }
        showUpdatePanel(locationID, description, address, city, province, postalCode, country, locationTypeID, deliveryDay, active);
    }
}

function updateHideToggle() {
    toggleHidden("#AddUpdatePanel");
    document.querySelector("#active").disabled = true;
    document.querySelector("#address").disabled = false;
}

function toggleHidden(id) {
    let element = document.querySelector(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function showUpdatePanel(locationID, description, address, city, province, postalCode, country, locationTypeID, deliveryDay, active) {
    if (addOrUpdate == "add") {
        document.querySelector("#locationID").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#address").value = "";
        document.querySelector("#city").value = "";
        document.querySelector("#province").value = "";
        document.querySelector("#postalCode").value = "";
        document.querySelector("#country").value = "";
        document.querySelector("#locationTypeID").value = "";
        document.querySelector("#deliveryDay").value = "";
        document.querySelector("#active").value = null;
    } else {
        document.querySelector("#locationID").value = locationID;
        document.querySelector("#description").value = description;
        document.querySelector("#address").value = address;
        document.querySelector("#city").value = city;
        document.querySelector("#province").value = province;
        document.querySelector("#postalCode").value = postalCode;
        document.querySelector("#country").value = country;
        document.querySelector("#locationTypeID").value = locationTypeID;
        document.querySelector("#deliveryDay").value = deliveryDay;
        document.querySelector("#active").value = active;
    }
}

function processForm() {
    document.querySelector("#records").innerHTML = "";

    let locationID = document.querySelector("#locationID").value;
    let description = document.querySelector("#description").value;
    let address = document.querySelector("#address").value;
    let city = document.querySelector("#city").value;
    let province = document.querySelector("#province").value;
    let postalCode = document.querySelector("#postalCode").value;
    let country = document.querySelector("#country").value;
    let locationTypeID = document.querySelector("#locationTypeID").value;
    let deliveryDay = document.querySelector("#deliveryDay").value;
    let active = document.querySelector("#active").value;
    let obj = {
        locationID: locationID,
        description: description,
        address: address,
        city: city,
        province: province,
        postalCode: postalCode,
        country: country,
        locationTypeID: locationTypeID,
        deliveryDay: deliveryDay,
        active: active
    };
    console.log(obj);
    var url = "LocationServlet/" + locationID;
    var method = (addOrUpdate === "add") ? "POST" : "PUT";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resp = xmlhttp.responseText;
            console.log(resp);
            if (resp != 1) {
                alert('Location ID: ' + locationID + ' was NOT succesfully updated');
                getLocations();
            } else {
                alert('Location ID: ' + locationID + ' was succesfully updated');
                getLocations();
            }
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send(JSON.stringify(obj));
}

function changeActive() {
    if (isHighlighted == true) {
        let row = document.querySelector(".highlighted");
        let locationID = row.querySelectorAll("td")[0].innerHTML;
        let active = row.querySelectorAll("td")[9].innerHTML;
        if (active == "NO") {
            active = 1;
        } else if (active == "YES") {
            active = 0
        }
        let url = "LocationServlet/" + locationID + "/" + active;
        let method = "DELETE";
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                let resp = xmlhttp.responseText;
                console.log(resp);
                if (resp != 1) {
                    alert('Location ID: ' + locationID + ' was NOT Changed');
                    getLocations();
                } else {
                    alert('Location ID: ' + locationID + ' was Changed');
                    getLocations();
                }
            }
        };
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    } else {
        alert("Please select a Location");
    }
}

function accessToButtons() {
    let x = JSON.parse(Permissions);
    console.log(roleID);
    console.log(x);
    for (var i = 0; i < x.length; i++) {
        if (x[i] == "CREATE LOCATION") {
            toggleHidden("#addButton");
        }
        if (x[i] == "READ LOCATION") {

        }
        if (x[i] == "UPDATE LOCATION") {
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

function printUser() {
    let location = document.querySelector("#userName");
    location.innerHTML = userName;
}