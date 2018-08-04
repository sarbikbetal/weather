var myHeaders = new Headers();

var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
};

var myRequest = new Request('https://api.openweathermap.org/data/2.5/weather?q=mahishadal,in&units=metric&appid=17a6438b1d63d5b05f7039e7cb52cde7', myInit);

unit = "metric";

fetch(myRequest).then(function (response) {
    return response.json();
}).then(function (myJson) {
    pFormat(myJson);
});


// React to theme radio button
var root = document.querySelector(':root');

function themer() {

    if (document.getElementsByName("theme")[1].checked) {
        //dark
        root.style.setProperty('--body', '#3d3d3dd1');
        root.style.setProperty('--widget', '#4caf50e6');
        root.style.setProperty('--highlight', '#f3f3f3');
        root.style.setProperty('--theme', '#00acc1');
        root.style.setProperty('--selected', '#2b2b2b');
        root.style.setProperty('--base', '#3d3d3d');
        root.style.setProperty('--text', '#ececec');
        root.style.setProperty('--listtext', '#bfbfbf');
        root.style.setProperty('--elevation', '#ffffff14');
        Chart.defaults.global.defaultFontColor = '#ececec';
    }
    else {
        //light - default
        root.style.setProperty('--body', '#efefef');
        root.style.setProperty('--widget', '#009688');
        root.style.setProperty('--highlight', '#424242');
        root.style.setProperty('--theme', '#4fa584');
        root.style.setProperty('--selected', '#ededeb');
        root.style.setProperty('--base', '#fafafa');
        root.style.setProperty('--text', '#585858');
        root.style.setProperty('--listtext', '#757575');
        root.style.setProperty('--elevation', '#ededeb66');
        Chart.defaults.global.defaultFontColor = '#585858';
    }
}


addClass(document.querySelectorAll('.location-link')[0], "z-depth-1-half");
document.querySelectorAll('.location-link')[0].style.setProperty('background-color', 'var(--elevation)')
var f = 0;
var p = 0;

function locFormat(loc) {
    loc = loc;
    dataFormat();
    f = 1;
}

if (f == 0) {
    loc = document.querySelectorAll('.location-link')[0].getAttribute("place");
}

// react to units radio button
function dataFormat() {


    if (document.getElementsByName("tempunit")[0].checked) {
        unit = "metric";
    }
    else {
        unit = "imperial";
    }

    var myRequest = new Request("https://api.openweathermap.org/data/2.5/weather?q=" + loc + ",in&units=" + unit + "&appid=17a6438b1d63d5b05f7039e7cb52cde7", myInit);

    /*fetch(myRequest)
        .then(function (response) {
            return response.json();
        }).then(function (myJson) {
            pFormat(myJson);
        }).catch(function (err) {
            console.log(err);
        });*/

        fetch(myRequest).then(function (response) {
            if (response.ok) {
                return response;
            }
            throw Error(response.statusText);
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            pFormat(json);
        }).catch(function (error) {
           console.log('Request failed:', error.message);
           M.toast({html: 'Location not found', classes: 'rounded'});
        });
    

};

var locList = document.querySelectorAll('.location-link');

locList.forEach(function (locationList) {

    locationList.addEventListener('click', function (e) {
        loc = e.target.getAttribute("place");
        if (loc != null) {
            locFormat(loc);
            locList.forEach(function (locList) {
                removeClass(locList, "z-depth-1-half");
                locList.style.setProperty('background-color', 'transparent')
            });
            addClass(locationList, "z-depth-1-half");
            locationList.style.setProperty('background-color', 'var(--elevation)')
        }
    })

    locationList.querySelector('i').addEventListener('click', function (c) {
        c.target.parentNode.remove(0);
        //document.querySelector('.page-content').innerHTML = "<h1>Click on a location or add a new location to view Weather Info.</h1>"
    });
});



// main function
function pFormat(weatherData) {

    // Units Definition
    if (unit == "metric") {
        tu = "&degC";
        su = "m/s";
    }

    else {
        tu = "&degF";
        su = "Mph";
    }

    if (p==1) {
        addSuccess(weatherData.name);
    }

    //var weatherData = JSON.parse(xhr.responseText);
    document.getElementById("location").innerHTML = weatherData.name + " Forecast";

    document.getElementById("title").innerHTML = weatherData.weather[0].main;
    //document.getElementById("desc").innerHTML = weatherData.weather[0].description.toUpperCase();
    document.getElementById("temp").innerHTML = weatherData.main.temp.toFixed(0) + tu;
    document.getElementById("mainIcon").setAttribute("class", "wi wi-owm-" + weatherData.weather[0].id);

    document.getElementById("humid").innerHTML = weatherData.main.humidity + "%";
    document.getElementById("humidBar").style.width = weatherData.main.humidity + "%";

    document.getElementById("wind").innerHTML = weatherData.wind.speed.toFixed(1) + "&nbsp;<h6 style=\"float: right\">" + su + "</h6>";
    document.getElementById("windDir").setAttribute("class", "wi wi-wind towards-" + weatherData.wind.deg.toFixed(0) + "-deg");

    document.getElementById("pressure").innerHTML = weatherData.main.pressure.toFixed(1) + "&nbsp;<h6 style=\"float: right\">hPa</h6>";

    //document.getElementById("card").innerHTML = htmlCode;

    document.getElementById("cloudCover").innerHTML = weatherData.clouds.all + "%";
    document.getElementById("cloudBar").style.width = weatherData.clouds.all + "%";
    p = 0;
    console.log(weatherData);
}


// add location

document.getElementById('fab').addEventListener('click', function (e) {
    loc = document.getElementById('addLocation').value;
    console.log(loc);
    p = 1;
    locFormat(loc);

    //Fab animations
    toggleClass(document.getElementById('addLocation'), 'valid');
    removeClass(document.getElementById('addLocation').nextElementSibling, 'active');
    document.getElementById('addLocation').value = "";
    toggle();

});

//Location added

function addSuccess(nm){
    var locNode = document.getElementById('locationList');
    var newItem = document.createElement("a");
    var close = document.createElement('i');

    //adding new location
    var newLocName = document.createTextNode(nm.toProperCase());
    newItem.appendChild(newLocName);
    locNode.insertBefore(newItem, locNode.childNodes[0]);
    addClass(locNode.childNodes[0], "mdl-navigation__link location-link");
    var attr = document.createAttribute("place");
    attr.value = nm;
    locNode.childNodes[0].setAttributeNode(attr);
   
    //adding the close button

    newItem.appendChild(close);
    addClass(locNode.childNodes[0].querySelector('i'), "material-icons");
    locNode.childNodes[0].querySelector('i').appendChild(document.createTextNode("close"));

    locList = document.querySelectorAll('.location-link');
    locList.forEach(function (locList) {
        removeClass(locList, "z-depth-1-half");
        locList.style.setProperty('background-color', 'transparent')
    });

    addClass(locNode.childNodes[0], "z-depth-1-half");
    locNode.childNodes[0].style.setProperty('background-color', 'var(--elevation)')

    locNode.childNodes[0].addEventListener('click', function (e) {
        loc = e.target.getAttribute("place");
        if (loc != null) {
            locFormat(loc);
            locList.forEach(function (locList) {
                removeClass(locList, "z-depth-1-half");
                locList.style.setProperty('background-color', 'transparent')
            });
            addClass(e.target, "z-depth-1-half");
            e.target.style.setProperty('background-color', 'var(--elevation)')
        }
    })
    locNode.childNodes[0].querySelector('i').addEventListener('click', function (c) {
        c.target.parentNode.remove(0);
    });
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

// toggle class functions


function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

function addClass(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

function removeClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

function toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}


function toggle() {
    toggleClass(document.getElementById("fab"), 'scale-out');
}


document.getElementById("addLocation").addEventListener('focusin', function () {
    if (document.getElementById('addLocation').value == "") {
        toggle();
    }
});
document.getElementById("addLocation").addEventListener('focusout', function () {
    if (document.getElementById('addLocation').value == "") {
        toggle();
    }
});


// Graphing Functions

var xhrg = new XMLHttpRequest();
xhrg.open("GET", "http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&zip=721628,in&appid=17a6438b1d63d5b05f7039e7cb52cde7&cnt=7", true);
xhrg.send();

xhrg.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

        var graphData = JSON.parse(xhrg.responseText);
        console.log(graphData);

        var maxTempArray = new Array();
        for (let i = 0; i <= 6; i++) {
            maxTempArray.push(graphData.list[i].temp.max);
        };

        var minTempArray = new Array();
        for (let i = 0; i <= 6; i++) {
            minTempArray.push(graphData.list[i].temp.min);
        };

        var dayArray = new Array();
        for (let i = 0; i <= 6; i++) {
            var timestamp = graphData.list[i].dt;
            var date = new Date(timestamp * 1000);
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            dayArray.push(days[date.getDay()]);
        };

        var dateArray = new Array();
        for (let i = 0; i <= 6; i++) {
            var timestamp = graphData.list[i].dt;
            var date = new Date(timestamp * 1000);
            dateArray.push(date.getDate() + ' / ' + date.getMonth());
        };

        var ccArray = new Array();
        for (let i = 0; i <= 6; i++) {
            ccArray.push(graphData.list[i].clouds);
        };

        
        var config = {
            type: 'line',
            data: {
                labels: dayArray,
                datasets: [{
                    label: 'Max Temp',
                    backgroundColor: 'rgba(77, 182, 172, 1)',
                    borderColor: 'rgba(77, 182, 172, 1)',
                    data: maxTempArray,
                    fill: false,
                    lineTension: 0,
                }, {
                    label: 'Min Temp',
                    fill: false,
                    backgroundColor: 'rgba(79, 195, 247, 1)',
                    borderColor: 'rgba(79, 195, 247, 1)',
                    data: minTempArray,
                    lineTension: 0,
                }]
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: ''
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature'
                        }
                    }]
                }
            }
        };

        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config);

        // Cloud chart

        var cloudConfig = {
            type: 'line',
            data: {
                labels: dateArray,
                datasets: [{
                    label: 'Cloud cover',
                    backgroundColor: 'rgba(251, 140, 0, 1)',
                    borderColor: 'rgba(251, 140, 0, 1)',
                    data: ccArray,
                    fill: false,
                }]
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Percentage'
                        }
                    }]
                }
            }
        };

        var cld = document.getElementById('cloudCanvas').getContext('2d');
        window.myLine = new Chart(cld, cloudConfig);

    }
}; 
