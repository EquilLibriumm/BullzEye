var roleID = localStorage.getItem("roleID");
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");
var addOrUpdate;
var isHighlighted = false;
var hideButtons = false;

window.onload = function() {
    readUser();
    getUsers();
    document.querySelector("body").addEventListener("click", handleRowClick);
    document.querySelector("#tablediv").addEventListener("click", updateUser);
    document.querySelector("#updateButton").addEventListener("click", updateHideToggle);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#addButton").addEventListener("click", insertUser);
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

function getUsers() {
    let url = "User"; // file name or server-side process name
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

function insertUser() {
    addOrUpdate = "add";
    showUpdatePanel();
    updateHideToggle("AddUpdatePanel");
    toggleHidden("#firstPassword");
    toggleHidden("#confirmPassword");
    document.querySelector("#active").disabled = false;
    document.querySelector("#userID").disabled = false;
    document.querySelector("#password").disabled = false;
    document.querySelector("#password1").disabled = false;
}

function buildTable(text) {
    let arr = JSON.parse(text);
    let html = "<table id='users' class='table'><tr><th onclick=sortTable()>User ID</th><th onclick='sortTable()'>location ID</th>" +
        "<th onclick='sortTable()'>Role ID</th><th onclick='sortTable()'>Active</th></thead</tr>";
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        html += "<tr>";
        html += "<td>" + row.userID + "</td>";
        html += "<td>" + row.locationID + "</td>";
        html += "<td>" + row.roleID + "</td>";
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

function updateUser(ev) {
    if (ev.target.tagName == "TH") {

    } else {
        let target = ev.target;
        handleRowClick(ev);
        addOrUpdate = "update";
        let row = document.querySelector(".highlighted");
        let userID = row.querySelectorAll("td")[0].innerHTML;
        let locationID = row.querySelectorAll("td")[1].innerHTML;
        let roleID = row.querySelectorAll("td")[2].innerHTML;
        let active = 0;
        if (row.querySelectorAll("td")[3].innerHTML == "YES") {
            active = 1;
        }
        showUpdatePanel(userID, locationID, roleID, active);
    }
}

function updateHideToggle() {
    toggleHidden("#AddUpdatePanel");
    document.querySelector("#active").disabled = true;
    document.querySelector("#password").disabled = true;
    document.querySelector("#userID").disabled = true;
}

function toggleHidden(id) {
    let element = document.querySelector(id);
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function showUpdatePanel(userID, locationID, roleID, active) {
    if (addOrUpdate == "add") {
        document.querySelector("#userID").value = "";
        document.querySelector("#password").value = "";
        document.querySelector("#password").disabled = false;
        document.querySelector("#locationID").value = "";
        document.querySelector("#roleID").value = "";
        document.querySelector("#active").value = null;
    } else {
        document.querySelector("#userID").value = userID;
        document.querySelector("#locationID").value = locationID;
        document.querySelector("#roleID").value = roleID;
        document.querySelector("#active").value = active;
    }
}

function processForm() {
    document.querySelector("#records").innerHTML = "";
    let password;
    let passwordTwo;
    let userID = document.querySelector("#userID").value;
    if (addOrUpdate == "add") {
        password = document.querySelector("#password").value;
        passwordTwo = document.querySelector("#passwordTwo").value;
        console.log(passwordTwo);
    } else if (addOrUpdate == "update") {
        password = localStorage.getItem("password");
    }
    if (addOrUpdate == "add") {
        if (password != passwordTwo) {
            alert("Paswords Must Match!");
        } else {
            let locationID = document.querySelector("#locationID").value;
            let roleID = document.querySelector("#roleID").value;
            let active = document.querySelector("#active").value;
            let obj = {
                userID: userID,
                password: password,
                locationID: locationID,
                roleID: roleID,
                active: active
            };
            console.log(obj);
            var url = "User/" + userID;
            var method = (addOrUpdate === "add") ? "POST" : "PUT";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var resp = xmlhttp.responseText;
                    console.log(resp);
                    if (resp != 1) {
                        alert('User ID:' + userID + ' was NOT succesfully added');
                        getUsers();
                    } else {
                        alert('User ID:' + userID + ' was succesfully addedd');
                        getUsers();
                    }
                }
            };
            xmlhttp.open(method, url, true);
            xmlhttp.send(JSON.stringify(obj));
        }
    } else {
        let locationID = document.querySelector("#locationID").value;
        let roleID = document.querySelector("#roleID").value;
        let active = document.querySelector("#active").value;
        let obj = {
            userID: userID,
            password: password,
            locationID: locationID,
            roleID: roleID,
            active: active
        };
        console.log(obj);
        var url = "User/" + userID;
        var method = (addOrUpdate === "add") ? "POST" : "PUT";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var resp = xmlhttp.responseText;
                console.log(resp);
                if (resp != 1) {
                    alert('User ID:' + userID + ' was NOT succesfully updated');
                    getUsers();
                } else {
                    alert('User ID:' + userID + ' was succesfully updated');
                    getUsers();
                }
            }
        };
        xmlhttp.open(method, url, true);
        xmlhttp.send(JSON.stringify(obj));
    }
}

function changeActive() {
    if (isHighlighted == true) {
        let row = document.querySelector(".highlighted");
        let userID = row.querySelectorAll("td")[0].innerHTML;
        let active = row.querySelectorAll("td")[3].innerHTML;
        if (active == "NO") {
            active = 1;
        } else if (active == "YES") {
            active = 0
        }
        let url = "User/" + userID + "/" + active;
        let method = "DELETE";
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                let resp = xmlhttp.responseText;
                console.log(resp);
                if (resp != 1) {
                    alert('User ID: ' + userID + ' was NOT Changed');
                    getUsers();
                } else {
                    alert('User ID: ' + userID + ' was Changed');
                    getUsers();
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
        if (x[i] == "CREATE USER") {}
        if (x[i] == "READ USER") {

        }
        if (x[i] == "UPDATE USER") {}
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