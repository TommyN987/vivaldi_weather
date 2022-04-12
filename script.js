// *******************************************************
// GET DOM ELEMENTS
// *******************************************************

const body = document.querySelector('body');
const time = document.getElementById('time');
const date = document.getElementById('date');
const timezone = document.getElementById('time-zone');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const currentTemp = document.getElementById('current-temp');
const sky = document.getElementById('sky');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// *******************************************************
// GLOBAL VARIABLES
// *******************************************************

const API_KEY = 'c55b2f992c145e0b6c4f202c68a74305';
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// *******************************************************
// GET CURRENT TIME AND DATE
// *******************************************************

(function getTimeAndDate() {
  setInterval(() => {
    const currentTime = new Date();
    const month = currentTime.getMonth();
    const currentdate = currentTime.getDate();
    const day = currentTime.getDay();
    const hour = currentTime.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = currentTime.getMinutes();

    time.innerHTML = `${
      hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat
    }:${
      minutes < 10 ? '0' + minutes : minutes
    } <span id="am-pm">${ampm}</span>`;

    date.innerHTML = `${days[day]}, ${currentdate} ${months[month]}`;
  }, 1000);
})();

// *******************************************************
// CURRENT LOCAL WEATHER
// *******************************************************

const showLocalWeather = (data) => {
  timezone.innerText = data.timezone;
  currentTemp.innerText = `${data.current.temp} °C`;
  sky.innerText = data.current.weather[0].main;
  windSpeed.innerText = `${data.current.wind_speed} m/s`;
  humidity.innerText = `${data.current.humidity}%`;
  pressure.innerText = data.current.pressure;
  sunrise.innerText = window
    .moment(data.current.sunrise * 1000)
    .format('HH:mm a');
  sunset.innerText = window
    .moment(data.current.sunset * 1000)
    .format('HH:mm a');
};

const showLocalWeatherForecast = (data) => {
  
};

const getLocalWeather = () => {
  navigator.geolocation.getCurrentPosition((success) => {

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${success.coords.latitude}&lon=${success.coords.longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((resolution) => resolution.json())
      .then((data) => {
        console.log(data);
        showLocalWeather(data);
      });
  });
};

getLocalWeather();

// *******************************************************
// CURRENT WEATHER FOR USER-SPECIFIED CITY
// *******************************************************

// RETRIEVE DATA FROM API
async function getUserSearchedWeather (city) {
  const resolution = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
  const data = await resolution.json();
  const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`);
  const forecastData = await forecastRes.json();
  return { data, forecastData }
}

// DISPLAY API DATA
function displayUserSearchedWeather (data) {
  timezone.innerText = data.name + ', ' + data.sys.country;
  currentTemp.innerText = `${data.main.temp} °C`;
  sky.innerText = data.weather[0].main;
  windSpeed.innerText = `${data.wind.speed} m/s`;
  humidity.innerText = `${data.main.humidity}%`;
  pressure.innerText = data.main.pressure;
  sunrise.innerText = window
    .moment(data.sys.sunrise * 1000)
    .format('HH:mm a');
  sunset.innerText = window
    .moment(data.sys.sunset * 1000)
    .format('HH:mm a');
  searchInput.value = '';
}

// EVENT LISTENERS
btnSearch.addEventListener('click', () => {
  getUserSearchedWeather(searchInput.value)
    .then((result) => {
      console.log(result);
      displayUserSearchedWeather(result.data);
    });
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getUserSearchedWeather(searchInput.value)
    .then((result) => {
      console.log(result);
      displayUserSearchedWeather(result.data);
    });
  }
});

// *******************************************************
// WEATHER FORECAST FOR USER-SPECIFIED CITY
// *******************************************************

