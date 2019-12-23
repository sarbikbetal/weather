// Data fetching function
var reqOpts = {
  method: 'GET',
  mode: 'cors',
  cache: 'default'
};

const fetchData = ({ lat, lon, city, unit = 'metric' } = {}) => {

  var url = 'https://api.openweathermap.org/data/2.5/weather?';
  var graphUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily?';
  const key = '4595fa54578e530eb98a555b672f6185'

  return new Promise((resolve, reject) => {

    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
      graphUrl += `lat=${lat}&lon=${lon}`;
    }
    else if (city) {
      url += `q=${city}`;
      graphUrl += `q=${city}`;
    } else {
      reject({ message: "No location parameter was passed onto the fetch function" });
    }

    url += `&units=${unit}`;
    url += `&appid=${key}`;
    graphUrl += `&units=${unit}`;
    graphUrl += `&appid=${key}`;

    var mainReq = new Request(url, reqOpts);
    var graphReq = new Request(graphUrl, reqOpts);


    Promise.all([mainReq, graphReq].map(url => fetch(url)))
      .then((response) => {
        return Promise.all([response[0].json(), response[1].json()]);
      })
      .then((data) => {
        if (data[0].cod != 200)
          reject(data[0]);
        else {
          resolve(data);
        }
      })
      .catch(err => {
        reject(err);
      })

    // fetch(mainReq).then(function (response) {
    //   return response.json();
    // }).then(json => {
    //   if (json.cod != 200)
    //     reject(json);
    //   else
    //     resolve(json);
    // }).catch(err => {
    //   reject(err);
    // })
  });
}









///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////     Helper    ///////////////////////
////////////////////////////////////   Functions   ////////////////////////
///////////////////////////////////////////////////////////////////////////

// Toggle class functions

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

// String Formatter
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Time Formatter 
function tmFrmt(n) {
  if (n < 10) {
    n = "0" + n.toString()
  } else {
    n = n;
  }
  return n;
}

// Local storage wrapper
const updateLocalStorage = (name, data) => {
  localStorage.setItem(name, data);
}