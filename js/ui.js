var root = document.querySelector(':root');

// React to theme switch
// Get theme data from LocalStorage if available
if (typeof (Storage) !== "undefined") {
  var theme = localStorage.getItem('theme');
  if (theme) {
    themer(theme);
  }
  var unit = localStorage.getItem('unit');
  if (unit) {
    if (unit == 'imperial') {
      document.getElementsByName("tempunit")[1].checked = true;
    }
  }
}

// Theme managing function
function themer(theme) {
  if (!theme) {
    if (document.getElementsByName("theme")[0].checked) {
      theme = "dark"
    } else {
      theme = "light"
    }
  }
  if (theme == 'dark') {
    document.getElementsByName("theme")[0].checked = true;
  }
  paintTheme(theme);
  if (typeof (Storage) !== "undefined") {
    updateLocalStorage('theme', theme);
  }
}

// Function to actually apply the styles
function paintTheme(theme) {
  if (document.getElementsByName("theme")[0].checked || theme == 'dark') {
    //dark
    root.style.setProperty('--body', '#121212');
    root.style.setProperty('--widget', '#06b87c');
    root.style.setProperty('--highlight', '#f3f3f3');
    root.style.setProperty('--theme', '#00acc1');
    root.style.setProperty('--selected', '#2b2b2b');
    root.style.setProperty('--base', '#1e1e1e');
    root.style.setProperty('--text', '#ececec');
    root.style.setProperty('--elevation', '#272727');
    Chart.defaults.global.defaultFontColor = '#ececec';
  } else {
    //light - default
    root.style.setProperty('--body', '#efefef');
    root.style.setProperty('--widget', '#52a3db');
    root.style.setProperty('--highlight', '#424242');
    root.style.setProperty('--theme', '#4fa584');
    root.style.setProperty('--selected', '#ededeb');
    root.style.setProperty('--base', '#fafafa');
    root.style.setProperty('--text', '#585858');
    root.style.setProperty('--elevation', '#fff');
    Chart.defaults.global.defaultFontColor = '#585858';
  }
}
// unit changing function
const changeUnit = () => {
  var unit;
  if (document.getElementsByName("tempunit")[0].checked)
    unit = "metric";
  else
    unit = "imperial";

  if (typeof (Storage) !== "undefined") {
    localStorage.setItem("unit", unit);
  }

  weatherByCity(choosedLocation);
}

//Refresh Button
const refresh = () => {
  weatherByCity(choosedLocation);
}


// Add Location Fab Animation
const addLocTextField = document.getElementById("addLocation");
const addLocFab = document.getElementById("fab");

addLocTextField.addEventListener('focusin', function () {
  if (addLocTextField.value == "") {
    removeClass(addLocFab, 'scale-out');
  }
});

addLocTextField.addEventListener('focusout', function () {
  if (addLocTextField.value == "") {
    addClass(addLocFab, 'scale-out');
  }
});

/////////////////////////////////  Preloaders  ///////////////////////////////////

function loading() {
  removeClass(document.getElementById("loader"), 'hide');
  // addClass(document.getElementById("content"), 'hide');
  // addClass(document.getElementById("mainIcon"), 'hide');
  // addClass(document.getElementById("temp"), 'hide');
};

function hideLoader() {
  addClass(document.getElementById("loader"), 'hide');
  removeClass(document.getElementById("content"), 'hide');
  removeClass(document.getElementById("mainIcon"), 'hide');
  removeClass(document.getElementById("temp"), 'hide');
};

function cload() {
  removeClass(document.getElementById("cload"), 'hide');
  // addClass(document.getElementById("graph"), 'hide');
};

function hidecLoad() {
  addClass(document.getElementById("cload"), 'hide');
  removeClass(document.getElementById("graph"), 'hide');
};

//////////////////////////// Background Gradient setting function  //////////////////////////////
const gradient = (wc) => {
  var bg1, bg2;

  if (wc >= 200 & wc < 300) {
    bg2 = '#859398';
    bg1 = '#360033';
  } else if (wc >= 300 & wc < 400) {
    bg2 = '#26a0da';
    bg1 = '#314755';
  } else if (wc >= 500 & wc < 600) {
    bg2 = '#4b6cb7';
    bg1 = '#182848';
  } else if (wc >= 600 & wc < 700) {
    bg2 = '#076585';
    bg1 = '#fff';
  } else if (wc >= 700 & wc < 800) {
    bg2 = '#2c3e50';
    bg1 = '#bdc3c7';
  } else if (wc > 800 & wc < 900) {
    bg2 = '#8e9eab';
    bg1 = '#2F80ED';
  } else {
    bg2 = '#56CCF2';
    bg1 = '#2F80ED';
  }

  root.style.setProperty('--bg1', bg1);
  root.style.setProperty('--bg2', bg2);
}

///// Function to append the User Locations List to //////
// corresponding navigation drawer based on screen size //
var currentLocs = document.getElementById('locationList');
var mobLoc = document.getElementById('mobileLocation');

function populateLocs(x) {
  if (x.matches)  // If media query matches
    mobLoc.appendChild(currentLocs);
  else
    document.getElementById('rightNav').appendChild(currentLocs);
};

var x = window.matchMedia("(max-width: 720px)");
populateLocs(x);
x.addListener(populateLocs);



// Global array of locations set by user 
var userLocations = [];
var choosedLocation;

/////////////////////////////////////////
// Main Function to update Data in UI
/////////////////////////////////////////
function updateUI(data) {
  var tu, su;
  if (document.getElementsByName("tempunit")[0].checked) {
    tu = "&degC";
    su = "m/s";
  } else {
    tu = "&degF";
    su = "Mph";
  }
  var locationIndex = userLocations.indexOf(data.name);
  if (locationIndex == -1) {
    addToLocationList(data.name);
  } else {
    locList = document.querySelectorAll('.location-link');
    locList.forEach(function (locList) {
      removeClass(locList, "z-depth-1-half");
      locList.style.setProperty('background-color', 'transparent')
    });
    addClass(locList[locationIndex], "z-depth-1-half");
    locList[locationIndex].style.setProperty('background-color', 'var(--elevation)')
  }

  // Hide Preloaders
  hideLoader();
  hidecLoad();

  //Set Gradient
  gradient(data.weather[0].id);
  document.getElementById("country").innerHTML = data.name + ", " + data.sys.country;

  document.getElementById("title").innerHTML = "<b>" + data.weather[0].main + "</b>";
  document.getElementById("desc").innerHTML = data.weather[0].description.toUpperCase();
  document.getElementById("temp").innerHTML = data.main.temp.toFixed(0) + tu;
  document.getElementById("mainIcon").setAttribute("class", "wi wi-owm-" + data.weather[0].id);

  document.getElementById("humid").innerHTML = data.main.humidity + "%";
  document.getElementById("humidBar").style.width = data.main.humidity + "%";

  document.getElementById("wind").innerHTML = data.wind.speed.toFixed(1) + "&nbsp;<span>" + su + "</span>";

  //document.getElementById("windDir").setAttribute("class", "wi wi-wind towards-" + data.wind.deg.toFixed(0) + "-deg");
  //document.getElementById("pressure").innerHTML = data.main.pressure.toFixed(1) + "&nbsp;<h6 style=\"float: right\">hPa</h6>";

  document.getElementById("cloudCover").innerHTML = data.clouds.all + "%";
  document.getElementById("cloudBar").style.width = data.clouds.all + "%";

  //Sunrise & Sunset
  var sr = new Date(data.sys.sunrise * 1000);
  var srf = tmFrmt(sr.getHours()) + ":" + tmFrmt(sr.getMinutes());
  document.getElementById("sr").innerHTML = "Sunrise:  " + srf;

  var ss = new Date(data.sys.sunset * 1000);
  var ssf = tmFrmt(ss.getHours()) + ":" + tmFrmt(ss.getMinutes());
  document.getElementById("ss").innerHTML = "Sunset:  " + ssf;

  //date widget

  var ts = data.dt;
  var date = new Date(ts * 1000);
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  document.getElementById("time").innerHTML = tmFrmt(date.getHours()) + ":" + tmFrmt(date.getMinutes());
  document.getElementById("wday").innerHTML = days[date.getDay()].toUpperCase();
  document.getElementById("mdate").innerHTML = date.getDate();
  document.getElementById("month").innerHTML = months[date.getMonth()];
  document.getElementById("year").innerHTML = date.getFullYear();
}

// Function to add new city to location list
const addToLocationList = (city) => {
  var newItem = document.createElement("a");
  var close = document.createElement('i');

  //adding new location
  var newLocName = document.createTextNode(city.toProperCase());
  newItem.appendChild(newLocName);
  currentLocs.insertBefore(newItem, currentLocs.childNodes[0]);
  addClass(currentLocs.childNodes[0], "mdl-navigation__link location-link");
  var attr = document.createAttribute("place");
  attr.value = city;
  currentLocs.childNodes[0].setAttributeNode(attr);

  //adding the close button
  newItem.appendChild(close);
  addClass(currentLocs.childNodes[0].querySelector('i'), "material-icons");
  currentLocs.childNodes[0].querySelector('i').appendChild(document.createTextNode("close"));

  locList = document.querySelectorAll('.location-link');

  locList.forEach(function (locList) {
    removeClass(locList, "z-depth-1-half");
    locList.style.setProperty('background-color', 'transparent')
  });

  addClass(currentLocs.childNodes[0], "z-depth-1-half");
  currentLocs.childNodes[0].style.setProperty('background-color', 'var(--elevation)')

  currentLocs.childNodes[0].addEventListener('click', function (e) {
    loc = e.target.getAttribute("place");
    if (loc != null) {
      weatherByCity(loc);
      locList.forEach(function (locList) {
        removeClass(locList, "z-depth-1-half");
        locList.style.setProperty('background-color', 'transparent')
      });
      addClass(e.target, "z-depth-1-half");
      e.target.style.setProperty('background-color', 'var(--elevation)')
    }
  })

  currentLocs.childNodes[0].querySelector('i').addEventListener('click', function (c) {
    c.target.parentNode.remove(0);
    storeLocations();
  });

  storeLocations();
}

function storeLocations() {
  var avlLoc = document.querySelectorAll('.location-link');
  var len = avlLoc.length;
  userLocations = [];
  for (i = 0; i < len; i++) {
    userLocations[i] = avlLoc[i].getAttribute("place");
  }
  if (typeof (Storage) !== "undefined") {
    updateLocalStorage("locations", JSON.stringify(userLocations));
  }
}

//////////////////////////////////////////
// Main Function to update Graphs in UI
/////////////////////////////////////////
function plot(graphData) {
  document.getElementById("chart-container").innerHTML = '<canvas id="canvas"></canvas>';
  document.getElementById("cloud-chart-container").innerHTML = '<canvas id="cloudCanvas"></canvas>';

  var maxTempArray = new Array();
  var minTempArray = new Array();
  var dayArray = new Array();
  var dateArray = new Array();
  var ccArray = new Array();
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  graphData.list.forEach(data => {
    maxTempArray.push(data.temp.max);
    minTempArray.push(data.temp.min);

    var timestamp = data.dt;
    var date = new Date(timestamp * 1000);
    dayArray.push(days[date.getDay()]);

    var timestamp = data.dt;
    var date = new Date(timestamp * 1000);
    dateArray.push(date.getDate());

    ccArray.push(data.clouds);
  });

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
  var tempChart = new Chart(ctx, config);

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
  new Chart(cld, cloudConfig);
};


/////////////////// Add new Location  ///////////////////////
window.addEventListener('keydown', function (e) {
  if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
    if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
      e.preventDefault();
      return false;
    }
  }
}, true);

addLocFab.addEventListener('click', function (e) {
  fabPushed();
});

addLocTextField.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    fabPushed();
  }
}, false);

const fabPushed = () => {
  loc = addLocTextField.value;
  weatherByCity(loc)

  //Fab animations
  toggleClass(addLocTextField, 'valid');
  removeClass(addLocTextField.nextElementSibling, 'active');
  addLocTextField.value = "";
  addLocTextField.blur();
  addClass(addLocFab, 'scale-out');
}

// Functiom to distribute and set data
const setData = (data) => {
  updateUI(data[0]);
  plot(data[1]);
  choosedLocation = data[0].name;
  if (typeof (Storage) !== "undefined") {
    updateLocalStorage('lastloc', data[0].name);
  }
}

// request data from API by city name
const weatherByCity = (city) => {

  locList = document.querySelectorAll('.location-link');

  // Disable all location buttons
  locList.forEach(locList => addClass(locList, "disabled"));
  // start showing preloaders
  loading();
  cload();

  if (document.getElementsByName("tempunit")[0].checked) {
    unit = 'metric';
  } else {
    unit = 'imperial';
  }
  fetchData({ city: city, unit: unit })
    .then((data) => {
      locList.forEach(locList => removeClass(locList, "disabled"));
      setData(data);
    }).catch(err => {
      console.log(err);
      M.toast({ html: err.message });

      locList.forEach(locList => removeClass(locList, "disabled")); //enable buttons
      // Hide Preloaders
      hideLoader();
      hidecLoad();
    })
}

/////////////////////////////  GeoLocation  //////////////////////////////

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPos, showError);
  } else {
    console.warn("Geolocation is not supported by this browser.");
  }
};

async function showPos(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  M.toast({
    html: "Latitude: " + lat + "<br>Longitude: " + lon
  });

  var unit;
  if (document.getElementsByName("tempunit")[0].checked) {
    unit = 'metric';
  } else {
    unit = 'imperial';
  }
  // request data from API by latitude and longitude
  fetchData({ lat: lat, lon: lon, unit: unit })
    .then((data) => {
      setData(data);
    }).catch(err => {
      console.log(err);
      M.toast({ html: err.message, classes: 'red' });

      // Hide Preloaders
      hideLoader();
      hidecLoad();
    })
};

function showError(error) {
  let text;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      text = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      text = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      text = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      text = "An unknown error occurred.";
      break;
  }
  M.toast({ html: text, classes: 'red' });
  weatherByCity('Kolkata');
};

// Get Location data from local storage
if (typeof (Storage) !== "undefined") {
  if (localStorage.getItem("locations")) {
    var locStore = JSON.parse(localStorage.getItem("locations"));

    if (locStore.length != 0) {
      console.log("Data Found");
      locStore.slice().reverse().forEach(loc => {
        addToLocationList(loc);
      })
      // for (i = locStore.length - 1; i >= 0; i--) {
      //   addToLocationList(locStore[i]);
      // };

      var lastLoc = localStorage.getItem('lastloc');
      // Chackif lastloc is there
      if (lastLoc) {
        var locationIndex = userLocations.indexOf(lastLoc);
        // Check if lastloc exists in the existing location list
        if (locationIndex == -1) {
          localStorage.removeItem('lastloc')
          lastLoc = userLocations[0];
        }
      }
      choosedLocation = lastLoc || userLocations[0];
      weatherByCity(lastLoc || userLocations[0]);

    } else // If no locations are stored in locations
      getLocation();
  } else // If the locations key is not there
    getLocation();
} else {
  weatherByCity('Kolkata');
};