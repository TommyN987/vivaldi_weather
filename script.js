// *******************************************************
// GET DOM ELEMENTS
// *******************************************************

const body = document.querySelector('body');
const time = document.getElementById('time');
const date = document.getElementById('date');
const timezone = document.getElementById('time-zone');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
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

    fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${success.coords.latitude}&lon=${success.coords.longitude}&limit=5&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((geo) => {
        console.log(geo);
        timezone.innerText = geo[0].name + ', ' + geo[0].country;
      })
  });
};

// *******************************************************
// GET WEATHER DATA FOR USER-SPECIFIED CITY
// *******************************************************

// GET API DATA
async function getUserSearchedWeather (city) {
  
  // GET COORDINATES
  const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`);
  const geoData = await res.json();
  console.log(geoData);
  
  // FORECAST DATA
  const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${geoData[0].lat}&lon=${geoData[0].lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`);
  const forecastData = await forecastRes.json();
  console.log(forecastData);
  return { geoData, forecastData };
}

// *******************************************************
// DISPLAY API DATA
// *******************************************************

function displayCurrentWeather (data) {
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
    document.getElementById(`icon-day-${i}`).src = `http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png`;
  }
};

function setMood(data) {
  // SET BACKGROUND IMAGE
  if (data.current.weather[0].main === 'Snow' || data.current.temp < 0) {
    body.style.backgroundImage = `url(../img/snowy.jpg)`
  } else if (data.current.weather[0].main === 'Clouds') {
    body.style.backgroundImage = `url(../img/cloudy.jpg)`
  } else if (data.current.weather[0].main === 'Clear') {
    body.style.backgroundImage = `url(../img/sunny.jpg)`
  } else if (data.current.weather[0].main === 'Rain' || data.current.weather[0].main === 'Drizzle') {
    body.style.backgroundImage = `url(../img/rainy.jpg)`
  } else if (data.current.weather[0].main === 'Thunderstorm') {
    body.style.backgroundImage = `url(../img/stormy.jpg)`
  } else if (data.current.weather[0].main === 'Mist' || data.current.weather[0].main === 'Haze' || data.current.weather[0].main === 'Fog') {
    body.style.backgroundImage = `url(../img/misty.jpg)`
  } else {
    body.style.backgroundImage = `url(../img/default.jpg)`
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
  timezone.innerText = data.geoData[0].name + ', ' + data.geoData[0].country;
  setMood(data.forecastData);
  displayCurrentWeather(data.forecastData);
  displayWeatherForecast(data.forecastData.daily);
}

// *******************************************************
// EVENT LISTENERS
// *******************************************************

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

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getUserSearchedWeather(searchInput.value)
    .then((result) => {
      searchInput.value = '';
      renderAll(result);
    })
    .catch((error) => {
      alert(`Couldn't retrieve data for ${searchInput.value}:
      ${error}`);
    });;
  }
});

btnStop.addEventListener('click', () => {
  audio.pause();
})

// getLocalWeather();