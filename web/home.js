var user = "";
var userType = "";
var tableOnOff = false;
var isHighlighted = false;
var hideButtons = false;
var idCount;
var addOrUpdate;
var Permissions = localStorage.getItem("Permissions");
var userName = localStorage.getItem("userID");
var locationID = localStorage.getItem("locationID");
var roleID = localStorage.getItem("roleID");

window.onload = function() {
    readUser();
    if (locationID == "WARE" || roleID == "DB Admin") {
        window.location.href = "WarehouseManagerHome.html";
    }
    if (locationID == "STJN" && roleID != "DB Admin") {
        window.location.href = "StoreHome.html";
    }
    if (locationID == "MIRA") {
        window.location.href = "StoreHome.html";
    }
    if (locationID == "VHCL") {
        window.location.href = "home.html";
    }
    if (locationID == "CORP") {
        window.location.href = "home.html";
    }
    if (locationID == "DIEP") {
        window.location.href = "StoreHome.html";
    }
    if (locationID == "SUSX") {
        window.location.href = "StoreHome.html";
    }
    if (locationID == "MCTN") {
        window.location.href = "StoreHome.html";
    }
    if (locationID == "OROM") {
        window.location.href = "StoreHome.html";
    }
    if (locationID == "FRED") {
        window.location.href = "StoreHome.html";
    }
};

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
    printUser();
}

function printUser() {
    let location = document.querySelector("#userName");
    location.innerHTML = userName;
    console.log(document.getElementById("userName").innnerHTML);
}