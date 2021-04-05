var userName = localStorage.getItem("userID");
var Permissions = localStorage.getItem("Permissions");
var orderAllArray;
var totalWeight = 0;
var locationID = "";
var routeArray;

var SaintJohnlat = 45.2733;
var SaintJohnlong = -66.0633;
var Monctonlat = 46.0878;
var Monctonlong = -64.7782;
var Dieppelat = 46.0953;
var Dieppelong = -64.7487;
var Frederictonlat = 45.964993;
var Frederictonlong = -66.646332;
var Miramichilat = 47.030156;
var Miramichilong = -65.491084;
var Oramoctolat = 48.005001;
var Oramoctolong = -66.673058;
var Sussexlat = 45.7236;
var Sussexlong = -65.5109;


var startlat;
var startlng;
var middlelat = "";
var middlelng = "";
var endlat;
var endlng;

var weightTwo;


window.onload = function() {
    readUser();
    printUser();
    routeArray();
    this.getAllStoreOrders();
    document.querySelector("#back").addEventListener("click", goBack);

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
            console.log(y[i]);
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
}

function goBack() {
    orders();
    document.querySelector("#back").classList.add("hidden");
    document.querySelector("#totalWeight").innerHTML = "";
    document.querySelector("#vehicle").innerHTML = "";
    document.querySelector("#map").classList.add("hidden");
}

function routeArray() {
    var url = "WeightServlet"; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
            } else {
                let temp = JSON.parse(resp);
                routeArray = temp;
                console.log(routeArray);
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send();
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
                orderAllArray = JSON.parse(resp);
                orders();
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function orders() {
    let arr = orderAllArray;
    let html = "<table id='ordersTable' class='table'><tr><th scope='col' onclick=sortTable()>Transaction ID</th><th onclick='sortTable()'>Transaction Status</th>" +
        "<th onclick='sortTable()'>Location ID</th><th onclick='sortTable()'>Creation Date</th></tr>";
    let id = 0;
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        console.log(row.transaction.transactionID, row.transaction.trasnactionStatus);
        if (row.transaction.transactionID != id) {
            if (row.transaction.trasnactionStatus == "READY") {


                html += "<tr>";
                html += "<td>" + row.transaction.transactionID + "</td>";
                html += "<td>" + row.transaction.trasnactionStatus + "</td>";
                html += "<td>" + row.transaction.originalLocationID + "</td>";
                html += "<td>" + row.transaction.creationDate + "</td>";
                id = row.transaction.transactionID;
                if (row.transaction.transactionType == "EMERGENCY") {
                    emergency = false;
                }
            }
        }
    }
    html += "</table>";
    document.querySelector("#orderdiv").innerHTML = html;
    this.document.querySelector("#ordersTable").addEventListener('dblclick', buildOrderTable);

}

function buildOrderTable(ev) {
    let arr = orderAllArray;
    let transactionID = ev.target.closest("tr").querySelectorAll("td")[0].innerHTML;
    let html = "<table id='orderTable' class='table'><tr><th scope='col' onclick=sortTable()>Transaction ID</th>" +
        "<th onclick='sortTable()'>Location ID</th><th onclick='sortTable()'>Creation Date</th>" +
        "<th>Notes</th><th>Item ID</th>" +
        "<th>Quantity</th></tr>";
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i];
        if (row.transaction.transactionID == transactionID) {
            html += "<tr>";
            html += "<td>" + row.transaction.transactionID + "</td>";
            html += "<td>" + row.transaction.originalLocationID + "</td>";
            locationID = row.transaction.originalLocationID;
            html += "<td>" + row.transaction.creationDate + "</td>";
            html += "<td>" + row.transaction.notes + "</td>";
            html += "<td>" + row.transactionline.itemID + "</td>";
            html += "<td>" + row.transactionline.quantity + "</td>";
        }
    }

    html += "</tr></table>";
    document.querySelector("#orderdiv").innerHTML = html;
    document.querySelector("#back").classList.remove("hidden");
    getWeights();
}

function getTwoWeights(string) {
    //Get weight by item IDs
    let route = string.split("-");
    console.log(route);
    var url = "WeightServlet/" + IDs; // file name or server-side process name
    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp == "0") {
                console.log(resp);
            } else {
                //Do Work Here
                let weight = parseFloat(resp);
                weightTwo += weight;
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getWeights() {
    totalWeight = 0;
    let itemIDs = document.querySelectorAll("tr");
    let IDs = "";
    console.log(itemIDs);
    //url itemIDs
    for (let i = 1; i < itemIDs.length; i++) {
        if (i != itemIDs.length - 1) {
            IDs += itemIDs[i].childNodes[4].innerHTML + "/";
        } else {
            IDs += itemIDs[i].childNodes[4].innerHTML + ",";
        }
    }
    //url Quantitys
    for (let i = 1; i < itemIDs.length; i++) {
        if (i != itemIDs.length - 1) {
            IDs += itemIDs[i].childNodes[5].innerHTML + ",";
        } else {
            IDs += itemIDs[i].childNodes[5].innerHTML;
        }
    }
    console.log(IDs);

    for (let i = 0; i < orderAllArray.length; i++) {
        if (orderAllArray[i].transaction.originalLocationID == "DIEP") {
            getTwoWeights("WARE-MCTN");
            console.log(orderAllArray);
        }
        if (orderAllArray[i].transaction.originalLocationID == "OROM") {
            getTwoWeights("WARE-FRED");
            console.log(weightTwo);
        }
        //Get weight by item IDs
        var url = "WeightServlet/" + IDs; // file name or server-side process name
        console.log(url);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                let resp = xmlhttp.responseText;
                if (resp == "0") {} else {
                    //Do Work Here
                    let weight = parseFloat(resp);
                    totalWeight += weight;



                    document.querySelector("#totalWeight").innerHTML = "The total weight of this order: " + totalWeight + " kgs<br><br>";

                    if (totalWeight < 852.76) {
                        document.querySelector("#vehicle").innerHTML = "Required vehicle: VAN";
                    } else if (totalWeight < 1292.75) {
                        document.querySelector("#vehicle").innerHTML = "\nRequired vehicle: LIGHT";
                    } else if (totalWeight < 4086.88) {
                        document.querySelector("#vehicle").innerHTML = "\nRequired vehicle: MEDIUM";
                    } else if (totalWeight > 4086.87) {
                        document.querySelector("#vehicle").innerHTML = "\nRequired vehicle: HEAVY";
                    }

                    document.querySelector("#orderdiv").innerHTML = "";

                    for (let i = 0; i < routeArray.length; i++) {
                        if (routeArray[i].destinationLocationID == locationID) {
                            if (routeArray[i].routeID == "WARE-DIEP" || routeArray[i].routeID == "WARE-OROM") {
                                break;
                            }
                            if (routeArray[i].startLocationID != "WARE") {
                                console.log("****************");
                                console.log(routeArray[i].routeID);
                                if (routeArray[i].routeID == "MCTN-DIEP") {
                                    document.querySelector("#vehicle").innerHTML += "<br>Route ID: " + routeArray[i].routeID + "<br>Starting Location: " + routeArray[i].startLocationID + "<br>Destination: " +
                                        locationID + "<br> Route Time: " + routeArray[i].routeTime + "<br>Distance: " + routeArray[i].distance + " Km";
                                    startLat = SaintJohnlat;
                                    startLng = SaintJohnlong;
                                    middlelat = Monctonlat;
                                    middlelng = Monctonlong;
                                    endLat = Dieppelat;
                                    endLng = Dieppelong;
                                }
                                if (routeArray[i].routeID == "FRED-OROM") {
                                    document.querySelector("#vehicle").innerHTML += "<br>Route ID: " + routeArray[i].routeID + "<br>Starting Location: " + routeArray[i].startLocationID + "<br>Destination: " +
                                        locationID + "<br> Route Time: " + routeArray[i].routeTime + "<br>Distance: " + routeArray[i].distance + " Km";
                                    startLat = SaintJohnlat;
                                    startLng = SaintJohnlong;
                                    middlelat = Frederictonlat;
                                    middlelng = Frederictonlong;
                                    endLat = Oramoctolat;
                                    endLng = Oramoctolong;
                                }
                            } else {

                                document.querySelector("#vehicle").innerHTML += "<br>Route ID: " + routeArray[i].routeID + "<br>Starting Location: " + routeArray[i].startLocationID + "<br>Destination: " +
                                    locationID + "<br> Route Time: " + routeArray[i].routeTime + "<br>Distance: " + routeArray[i].distance + " Km";
                                console.log(routeArray[i].routeID);

                                switch (routeArray[i].routeID) {
                                    case "WARE-MIRA":
                                        startLat = SaintJohnlat;
                                        startLng = SaintJohnlong;
                                        endLat = Miramichilat;
                                        endLng = Miramichilong;
                                        break;

                                    case "WARE-DIEP":
                                        startLat = SaintJohnlat;
                                        startLng = SaintJohnlong;
                                        endLat = Dieppelat;
                                        endLng = Dieppelong;
                                        break;

                                    case "WARE-FRED":
                                        startLat = SaintJohnlat;
                                        startLng = SaintJohnlong;
                                        endLat = Frederictonlat;
                                        endLng = Frederictonlong;
                                        break;
                                    case "WARE-MCTN":
                                        startLat = SaintJohnlat;
                                        startLng = SaintJohnlong;
                                        endLat = Monctonlat;
                                        endLng = Monctonlong;
                                        break;
                                    case "WARE-OROM":
                                        startLat = SaintJohnlat;
                                        startLng = SaintJohnlong;
                                        endLat = Oramoctolat;
                                        endLng = Oramoctolong;
                                        break;
                                    case "WARE-STJN":
                                        startLat = SaintJohnlat;
                                        startLng = SaintJohnlong;
                                        endLat = SaintJohnlat;
                                        endLng = SaintJohnlong;
                                        break;
                                    case "WARE-SUSX":
                                        startLat = SaintJohnlat;
                                        startLng = SaintJohnlong;
                                        endLat = Sussexlat;
                                        endLng = Sussexlong;
                                        break;
                                    case "MCTN-DIEP":
                                        startLat = Monctonlat;
                                        startLng = Monctonlong;
                                        endLat = Dieppelat;
                                        endLng = Dieppelong;
                                        break;
                                    case "FRED-OROM":
                                        startLat = Frederictonlat;
                                        startLng = Frederictonlong;
                                        endLat = Oramoctolat;
                                        endLng = Oramoctolong;
                                        break;
                                }


                            }

                        }
                    }
                    initMap(startLat, startLng, endLat, endLng);
                    document.querySelector("#map").classList.remove("hidden");
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();




    }

}

var map;

function initMap(startLat, startLng, endLat, endLng) {
    console.log(startlat === undefined);
    if (startLat != undefined) {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 46.498390,
                lng: -66.159668
            },
            zoom: 7
        });
        var markerstart = new google.maps.Marker({
            // The below line is equivalent to writing:
            // position: new google.maps.LatLng(-34.397, 150.644)
            position: {
                lat: startLat,
                lng: startLng
            },
            map: map
        });

        var markerend = new google.maps.Marker({
            // The below line is equivalent to writing:
            // position: new google.maps.LatLng(-34.397, 150.644)
            position: {
                lat: endLat,
                lng: endLng
            },
            map: map
        });
        if (middlelat != "") {
            var markerend = new google.maps.Marker({
                // The below line is equivalent to writing:
                // position: new google.maps.LatLng(-34.397, 150.644)
                position: {
                    lat: middlelat,
                    lng: middlelng
                },
                map: map
            });
        }
    }
}