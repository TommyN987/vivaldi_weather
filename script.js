// *******************************************************
// GET DOM ELEMENTS
// *******************************************************

const body = document.querySelector('body');
const timezone = document.getElementById('time-zone');
const navbarToggler = document.getElementById('navbar-toggler');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const currentWeaherItems = document.getElementById('current-weather-items');
const locality = document.getElementById('locality');
const currentTemp = document.getElementById('current-temp');
const sky = document.getElementById('sky');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const audio = document.querySelector('audio');
const btnStop = document.getElementById('btn-stop-audio');
const image = document.getElementById('blob');

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

let toggler = false;

// *******************************************************
// GET LOCAL WEATHER DATA
// *******************************************************

function getLocalWeather () {
  
  // GET GEOLOCATION
  navigator.geolocation.getCurrentPosition((success) => {

    // GET API DATA BASE ON GEOLOCATION COORDINATES
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${success.coords.latitude}&lon=${success.coords.longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((resolution) => resolution.json())
      .then((data) => {
        setMood(data);
        displayCurrentWeather(data);
        displayWeatherForecast(data.daily);
      })
      .catch((error) => {
        alert(`Couldn't retrieve data for your location:
        ${error}`);  
      });
  });
};

// *******************************************************
// GET WEATHER DATA FOR USER-SPECIFIED CITY
// *******************************************************

// GET API DATA
async function getUserSearchedWeather (city) {
  
  // GET COORDINATES
  const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`);
  const geoData = await res.json();
  
  // FORECAST DATA
  const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${geoData[0].lat}&lon=${geoData[0].lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`);
  const forecastData = await forecastRes.json();
  return { geoData, forecastData };
}

// *******************************************************
// DISPLAY API DATA
// *******************************************************

function displayCurrentWeather (data) {
  timezone.innerText = data.timezone;
  currentTemp.innerText = `${data.current.temp} °C`;
  sky.innerText = data.current.weather[0].main;
  windSpeed.innerText = `${data.current.wind_speed} m/s`;
  humidity.innerText = `${data.current.humidity}%`;
  pressure.innerText = data.current.pressure;
  sunrise.innerText = window
    .moment((data.current.sunrise + data.timezone_offset - 7200) * 1000)
    .format('HH:mm a');
  sunset.innerText = window
    .moment((data.current.sunset + data.timezone_offset - 7200) * 1000)
    .format('HH:mm a');
};

function displayWeatherForecast (data) {
  for (let i = 0; i < (data.length - 1); i++) {
    document.getElementById(`day-name-${i}`).innerText = window.moment(data[i].dt*1000).format('ddd');
    document.getElementById(`day-temp-${i}`).innerText = data[i].temp.day;
    document.getElementById(`night-temp-${i}`).innerText = data[i].temp.night;
    document.getElementById(`icon-day-${i}`).src = `https://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png`;
  }
};

async function setBG(image) {
  const res = await fetch(`../img/${image}.jpg`);
  const blob = await res.blob();
  body.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
}

function setMood(data) {
  
  // SET BACKGROUND IMAGE
  if (data.current.weather[0].main === 'Snow' || data.current.temp < 0) {
    setBG('snowy');
  } else if (data.current.weather[0].main === 'Clouds') {
    setBG('cloudy');
  } else if (data.current.weather[0].main === 'Clear') {
    setBG('sunny');
  } else if (data.current.weather[0].main === 'Rain' || data.current.weather[0].main === 'Drizzle') {
    setBG('rainy');
  } else if (data.current.weather[0].main === 'Thunderstorm') {
    setBG('stormy');
  } else if (data.current.weather[0].main === 'Mist' || data.current.weather[0].main === 'Haze' || data.current.weather[0].main === 'Fog') {
    setBG('misty');
  } else {
    setBG('default');
  }

  // SET VIVALDI
  if (data.current.weather[0].main === 'Thunderstorm' || data.current.weather[0].main === 'Rain') {
    audio.src = './audio/storm.mp3';
  } else if (data.current.temp < 5) {
    audio.src = './audio/winter.mp3';
  } else if (data.current.temp < 15) {
    audio.src = './audio/autumn.mp3';
  } else if (data.current.temp < 25) {
    audio.src = './audio/spring.mp3';
  } else {
    audio.src = './audio/summer.mp3';
  }
  audio.autoplay = true;
  audio.muted = false;
  audio.play();
}

function renderAll(data) {
  locality.innerText = data.geoData[0].name + ', ' + data.geoData[0].country;
  setMood(data.forecastData);
  displayCurrentWeather(data.forecastData);
  displayWeatherForecast(data.forecastData.daily);
}

// *******************************************************
// EVENT LISTENERS
// *******************************************************

// SEARCH WITH CLICK
btnSearch.addEventListener('click', () => {
  getUserSearchedWeather(searchInput.value)
    .then((result) => {
      searchInput.value = '';
      renderAll(result);
    })
    .catch((error) => {
      alert(`Couldn't retrieve data for ${searchInput.value}:
      ${error}`);
    });
});

// SEARCH WITH ENTER
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getUserSearchedWeather(searchInput.value)
    .then((result) => {
      searchInput.value = '';
      renderAll(result)
    })
    .catch((error) => {
      alert(`Couldn't retrieve data for ${searchInput.value}:
      ${error}`);
    });;
  }
});

// STOP MUSIC
btnStop.addEventListener('click', () => {
  audio.pause();
})

// MAKES CURRENT WEATHER ITEMS CONTAINER INVISIBLE WHILE SO IT DOESN'T OVERLAP WITH THE SEARCH INPUT
navbarToggler.addEventListener('click', () => {
  if (toggler === false) {
    currentWeaherItems.style.visibility = 'hidden';
    toggler = true;
  } else {
    currentWeaherItems.style.visibility = 'visible';
    toggler = false;
  }
})

getLocalWeather();