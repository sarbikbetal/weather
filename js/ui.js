var root = document.querySelector(':root');

// React to theme radio button
// Get theme data from LocalStorage if available
if (typeof (Storage) !== "undefined") {
  var theme = localStorage.getItem('theme');
  if (theme) {
    themer(theme);
  }
}

// Theme managing function
function themer(theme) {
  if (!theme) {
    if (document.getElementsByName("theme")[1].checked) {
      theme = "dark"
    } else {
      theme = "light"
    }
  }
  if (theme == 'dark') {
    document.getElementsByName("theme")[1].checked = true;
  }
  paintTheme(theme);
  if (typeof (Storage) !== "undefined") {
    updateLocalStorage('theme', theme);
  }
}

// Function to actually apply the styles
function paintTheme(theme) {
  if (document.getElementsByName("theme")[1].checked || theme == 'dark') {
    //dark
    root.style.setProperty('--body', '#3d3d3dd1');
    root.style.setProperty('--widget', '#06b87c');
    root.style.setProperty('--highlight', '#f3f3f3');
    root.style.setProperty('--theme', '#00acc1');
    root.style.setProperty('--selected', '#2b2b2b');
    root.style.setProperty('--base', '#3d3d3d');
    root.style.setProperty('--text', '#ececec');
    root.style.setProperty('--listtext', '#bfbfbf');
    root.style.setProperty('--elevation', '#ffffff14');
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
    root.style.setProperty('--listtext', '#757575');
    root.style.setProperty('--elevation', '#ededeb66');
    Chart.defaults.global.defaultFontColor = '#585858';
  }
}


// Add Location Fab Animation
const addLocTextField = document.getElementById("addLocation");
const addLocFab = document.getElementById("fab");

addLocTextField.addEventListener('focusin', function () {
  if (addLocTextField.value == "") {
    toggleClass(addLocFab, 'scale-out');
  }
});

addLocTextField.addEventListener('focusout', function () {
  if (addLocTextField.value == "") {
    toggleClass(addLocFab, 'scale-out');
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

// Background Gradient setting function
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


// Main Function to update Data in UI
function updateUI(weatherData, unit = 'metric') {

  // Units Definition
  if (unit == "metric") {
    tu = "&degC";
    su = "m/s";
  } else {
    tu = "&degF";
    su = "Mph";
  }

  // if (p == 1) {
  //   addSuccess(weatherData.name);
  // }

  // Hide Preloaders
  hideLoader();
  hidecLoad();
  //Set Gradient
  gradient(weatherData.weather[0].id);

  document.getElementById("location").innerHTML = weatherData.name + " Forecast";
  document.getElementById("country").innerHTML = "<i class=\"material-icons\">location_on</i>" + weatherData.name + ", " + weatherData.sys.country;

  document.getElementById("title").innerHTML = "<b>" + weatherData.weather[0].main + "</b>";
  document.getElementById("desc").innerHTML = weatherData.weather[0].description.toUpperCase();
  document.getElementById("temp").innerHTML = weatherData.main.temp.toFixed(0) + tu;
  document.getElementById("mainIcon").setAttribute("class", "wi wi-owm-" + weatherData.weather[0].id);

  document.getElementById("humid").innerHTML = weatherData.main.humidity + "%";
  document.getElementById("humidBar").style.width = weatherData.main.humidity + "%";

  document.getElementById("wind").innerHTML = weatherData.wind.speed.toFixed(1) + "&nbsp;<span>" + su + "</span>";

  //document.getElementById("windDir").setAttribute("class", "wi wi-wind towards-" + weatherData.wind.deg.toFixed(0) + "-deg");
  //document.getElementById("pressure").innerHTML = weatherData.main.pressure.toFixed(1) + "&nbsp;<h6 style=\"float: right\">hPa</h6>";

  document.getElementById("cloudCover").innerHTML = weatherData.clouds.all + "%";
  document.getElementById("cloudBar").style.width = weatherData.clouds.all + "%";

  //Sunrise & Sunset
  var sr = new Date(weatherData.sys.sunrise * 1000);
  var srf = tmFrmt(sr.getHours()) + ":" + tmFrmt(sr.getMinutes());
  document.getElementById("sr").innerHTML = "Sunrise:  " + srf;

  var ss = new Date(weatherData.sys.sunset * 1000);
  var ssf = tmFrmt(ss.getHours()) + ":" + tmFrmt(ss.getMinutes());
  document.getElementById("ss").innerHTML = "Sunset:  " + ssf;

  //date widget

  var ts = weatherData.dt;
  var date = new Date(ts * 1000);
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  document.getElementById("time").innerHTML = tmFrmt(date.getHours()) + ":" + tmFrmt(date.getMinutes());
  document.getElementById("wday").innerHTML = days[date.getDay()].toUpperCase();
  document.getElementById("mdate").innerHTML = date.getDate();
  document.getElementById("month").innerHTML = months[date.getMonth()];
  document.getElementById("year").innerHTML = date.getFullYear();


  // //Flags
  // p = 0;
  // console.log(weatherData);
  // if (f == 1) {
  //   lstore();
  // }
  // sstore();
}

// request data from API
fetchData({ city: 'kolkata' })
  .then((data, unit) => {
    updateUI(data, unit);
  }).catch(err => {
    console.log(err);
  })


