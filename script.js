//var location = "mahishadal"
var xhr = new XMLHttpRequest();

xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=mahishadal,in&units=metric&appid=17a6438b1d63d5b05f7039e7cb52cde7", true);
xhr.send();

unit = "metric"
xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        pFormat();
    }
};

//var gunit = "metric";
//var ajaxTimer = window.setInterval(apiCall, 5000, gunit);

// React to theme radio button
var root = document.querySelector(':root');

function themer(){

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

    }    
}

// react to units radio button
function dataFormat(loc) {
    if (document.getElementsByName("tempunit")[0].checked) {
        unit = "metric";
    }
    else {
        unit = "imperial";
    }
    
    xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?q="+loc+",in&units="+unit+"&appid=17a6438b1d63d5b05f7039e7cb52cde7", true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            pFormat();
        }
    };

};

var locationList = document.querySelectorAll('.location-link');

locationList.forEach(function(locationList) {
    locationList.addEventListener('click', function(e){
        loc = e.target.innerHTML;
        dataFormat(loc);
    })
});

// main function
function pFormat() {
    
    // Units Definition
    if (unit == "metric") {
        tu = "&degC";
        su = "m/s";
    }
    else {
        tu = "&degF";
        su = "Mph";
    }

    
    var weatherData = JSON.parse(xhr.responseText);
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
    
    //document.getElementById("cloudCover").innerHTML = weatherData.clouds.all + "%";
    //document.getElementById("cloudBar").style.width = weatherData.clouds.all + "%"
    
    console.log(weatherData);
}


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
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

function toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace( ' ' + className + ' ' , ' ' );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}


function toggle(){
    toggleClass( document.getElementById("scale"), 'scale-out');
}


document.getElementById("addLocation").addEventListener('focusin', function(){
   toggle();
});
document.getElementById("addLocation").addEventListener('focusout', function(){
    toggle();
 });

// Graphing Functions

/* var xhrg = new XMLHttpRequest();
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

        Chart.defaults.global.defaultFontColor = 'white';
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
                }, {
                    label: 'Min Temp',
                    fill: false,
                    backgroundColor: 'rgba(79, 195, 247, 1)',
                    borderColor: 'rgba(79, 195, 247, 1)',
                    data: minTempArray,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Temperature variation over the next 7 days'
                },
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

        Chart.defaults.global.defaultFontColor = 'white';
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
                responsive: true,
                title: {
                    display: true,
                    text: 'Cloud cover over the next 7 days'
                },
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
};  */