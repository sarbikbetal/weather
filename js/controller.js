// Data fetching function
var reqOpts = {
  method: 'GET',
  mode: 'cors',
  cache: 'default'
};

const fetchData = ({ lat, lon, city, unit } = {}) => {

  var url = 'https://api.openweathermap.org/data/2.5/weather?';
  const key = '4595fa54578e530eb98a555b672f6185'

  return new Promise((resolve, reject) => {

    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `q=${city}`;
    } else {
      reject("No parameter related to location was passed onto the fetch function");
    }

    if (unit) {
      url += `&units=${unit}`;
    }

    url += `&appid=${key}`;

    var mainReq = new Request(url, reqOpts);

    fetch(mainReq).then(function (response) {
      return response.json();
    }).then(json => {
      console.log(json);
      resolve(json, unit);
    }).catch(err => {
      reject(err);
    })

  });
}














//////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////     Helper    //////////////////////////////////////////////////
////////////////////////////////////   Functions   //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

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

// Local storage wrapper
const updateLocalStorage = (name, data) => {
  localStorage.removeItem(name);
  localStorage.setItem(name, data);
}