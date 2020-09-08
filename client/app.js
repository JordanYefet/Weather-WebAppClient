// Tutorial by http://youtube.com/CodeExplained
// api key: e48d6386ded64c871cda8182550175ea

class DayInForcastWeather {
  objectId;
  iconId;
  temperature;
  description;
  date;

  //Initial constructor
  constructor(objectId) {
    this.objectId = objectId;
    this.iconId = "null";
    this.temperature = 0;
    this.description = "null";
    this.date = "null";
  }

  //Getters and Setters
  get objectId() {
    return this.objectId;
  }
  get iconId() {
    return this.iconId;
  }
  get temperature() {
    return this.temperature;
  }
  get description() {
    return this.description;
  }
  get date() {
    return this.date;
  }
  set iconId(iconId) {
    this.iconId = iconId;
  }
  set temperature(temperature) {
    this.temperature = temperature;
  }
  set description(description) {
    this.description = description;
  }
  set date(date) {
    this.date = date;
  }
}

class elementObject {
  iconForcastElement;
  tempForcastElement;
  descForcastElement;
  dateForcastElement;
  constructor() {}
}

let elementArrayObject = [];

// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

for (let i = 0; i < 3; i++) {
  elementArrayObject[i] = new elementObject();
  elementArrayObject[i].iconForcastElement = document
    .getElementById(`${i}`)
    .querySelector(".weather-icon");
  elementArrayObject[i].tempForcastElement = document
    .getElementById(`${i}`)
    .querySelector(".temperature-value p");
  elementArrayObject[i].descForcastElement = document
    .getElementById(`${i}`)
    .querySelector(".temperature-description p");
  elementArrayObject[i].dateForcastElement = document
    .getElementById(`${i}`)
    .querySelector(".date p");
}
console.log(elementArrayObject);

//App data
let weather = {};
weather.temperature = {
  unit: "celsius",
};

//test with array objects
let forcast = [];
for (let i = 0; i < 3; i++) {
  forcast[i] = new DayInForcastWeather(i);
}
// console.log(forcast);

//APP CONSTS AND VARS
const KELVIN = 273;
//API KEY
const key = "e48d6386ded64c871cda8182550175ea";

//CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

//SET USER'S POSITION
function setPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeather(lat, lon);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GELOCATION SERVICE
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//GET WEATHER FROM API PROVIDER
function getWeather(lat, lon) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
  let forcastApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&appid=${key}`;

  //api call for current weather
  let data1 = fetch(api)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      // unixToDate();
    });

  //api call for forcast weather
  let data2 = fetch(forcastApi)
    .then((res) => res.json())
    .then((data) => {
      let tempData = data;

      for (let i = 0; i < 3; i++) {
        forcast[i].temperature = Math.floor(
          tempData.daily[i + 1].temp.day - KELVIN
        );
        forcast[i].description = tempData.daily[i + 1].weather[0].description;
        forcast[i].iconId = tempData.daily[i + 1].weather[0].icon;
        forcast[i].date = tempData.daily[i + 1].dt;
      }
    });

  Promise.all([data1, data2]).then(() => displayWeather());

  // let dt = Math.round(new Date().getTime() / 1000);
}

// DISPLAY WEATHER TO UI
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;

  for (let i = 0; i < 3; i++) {
    elementArrayObject[
      i
    ].iconForcastElement.innerHTML = `<img src="icons/${forcast[i].iconId}.png"/>`;
    elementArrayObject[
      i
    ].tempForcastElement.innerHTML = `${forcast[i].temperature}°<span>C</span>`;
    elementArrayObject[
      i
    ].descForcastElement.innerHTML = `<p>${forcast[i].description}</p>`;
    elementArrayObject[i].dateForcastElement.innerHTML = `<p>${unixToDate(
      forcast[i].date
    )}</p>`;
  }
}

//
function unixToDate(unix_timestamp) {
  const milliseconds = unix_timestamp * 1000; // 1575909015000
  const dateObject = new Date(milliseconds);
  const day = `${dateObject.toLocaleString("en-US", { weekday: "long" })}`; // Monday
  //const humanDateFormat = dateObject.toLocaleString(); //2019-12-9 10:30:15
  // dateObject.toLocaleString("en-US", { month: "long" }); // December
  // dateObject.toLocaleString("en-US", { day: "numeric" }); // 9
  // dateObject.toLocaleString("en-US", { year: "numeric" }); // 2019
  // dateObject.toLocaleString("en-US", { hour: "numeric" }); // 10 AM
  // dateObject.toLocaleString("en-US", { minute: "numeric" }); // 30
  // dateObject.toLocaleString("en-US", { second: "numeric" }); // 15
  // dateObject.toLocaleString("en-US", { timeZoneName: "short" }); // 12/9/2019, 10:30:15 AM CST
  return day;
  console.log(day);
}
