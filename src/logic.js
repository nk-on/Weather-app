const backgroundElement = document.querySelector('body');
const locationElement = document.querySelector('.location');
const dateElement = document.querySelector('.date');
const timeElement = document.querySelector('.time');
const temperatureElement = document.querySelector('.temperature');
const weatherConditionElement = document.querySelector('.weather-condition');
const weatherCondtionIcon = document.querySelector('.icon');
const humidityElement = document.querySelector('.humidity');
const windSpeedElement = document.querySelector('.wind-speed');
const searchLocationInput = document.querySelector('#search-location');
const searchButton = document.querySelector('#Search-buton');
const switchUnitButton = document.querySelector('.switch-unit');
const APIkey = '8f899912ad562b53558fa04e91536303';
function renderTimeAndDate() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  dateElement.textContent = date.toLocaleDateString();
  timeElement.textContent = `${hour}:${minute}:${second}`;
}
function setBackgroundImage(weatherCondtion) {
  switch (weatherCondtion) {
    case 'Clouds':
      backgroundElement.style.backgroundImage = 'url("assets/clouds.jpg")';
      break;
    case 'Rain':
      backgroundElement.style.backgroundImage = 'url("assets/Rain.jpg")';
      break;
    case 'Thunderstorm':
      backgroundElement.style.backgroundImage = 'url("assets/thunder.jpg")';
      break;
    case 'Snow':
      backgroundElement.style.backgroundImage = 'url("assets/snow.jpg")';
      break;
    case 'Clear':
      backgroundElement.style.backgroundImage = 'url("assets/clear-sky.jpg")';
      break;
    default:
      backgroundElement.style.backgroundImage = 'url("assets/mist.jpg")';
  }
}
// Displaying fetched JSON data inside weather-data section
function renderData(weatherData, unit) {
  const iconCode = weatherData.weather[0].icon;
  const iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;
  let speedUnit;
  let tempUnit;
  if (unit === 'Metric') {
    speedUnit = 'kph';
    tempUnit = '°C';
  } else {
    speedUnit = 'mph';
    tempUnit = '°F';
  }
  const {
    main: { humidity },
  } = weatherData;
  const {
    sys: { country },
  } = weatherData;
  const {
    main: { temp },
  } = weatherData;
  const {
    wind: { speed: windSpeed },
  } = weatherData;
  const weatherCondtion = weatherData.weather[0].main;
  const city = weatherData.name;
  locationElement.textContent = `${city},${country}`;
  setInterval(renderTimeAndDate, 1000);
  temperatureElement.textContent = `${temp} ${tempUnit}`;
  weatherConditionElement.textContent = weatherCondtion;
  weatherCondtionIcon.setAttribute('src', iconURL);
  humidityElement.textContent = `Humidity:${humidity}%`;
  windSpeedElement.textContent = `${windSpeed} ${speedUnit}`;
  setBackgroundImage(weatherCondtion);
}
async function getWeather(location, unit) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIkey}&units=${unit}`;
  try {
    const data = await fetch(url);
    const res = await data.json();
    renderData(res, unit);
  } catch {
    alert(`Failed to fetch`);
  }
}
function searchByLocation(event) {
  event.preventDefault();
  const location = searchLocationInput.value;
  if (location.length === 0) {
    return;
  }
  const unit = switchUnitButton.textContent === 'Imperial' ? 'Metric' : 'Imperial';
  getWeather(location, unit);
}
function switchUnit(event) {
  event.preventDefault();
  const unit = this.textContent;
  const location = locationElement.textContent;
  if (this.textContent === 'Metric') {
    this.textContent = 'Imperial';
  } else {
    this.textContent = 'Metric';
  }
  getWeather(location, unit);
}
function getCityByUsersLocation(position) {
  const {
    coords: { latitude },
  } = position;
  const {
    coords: { longitude },
  } = position;
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${APIkey}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const city = data[0].name;
      getWeather(city, 'Metric');
    });
}
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getCityByUsersLocation);
}
switchUnitButton.addEventListener('click', switchUnit);
searchButton.addEventListener('click', searchByLocation);
document.addEventListener('keyup', (e) => {
  if (e.code === 'Enter') {
    searchByLocation(e);
  }
});
