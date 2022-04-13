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

const displayLocalWeather = (data) => {
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

const displayWeatherForecast = (data) => {
  for (let i = 0; i < (data.length - 1); i++) {
    document.getElementById(`day-name-${i}`).innerText = window.moment(data[i].dt*1000).format('ddd');
    document.getElementById(`day-temp-${i}`).innerText = data[i].temp.day;
    document.getElementById(`night-temp-${i}`).innerText = data[i].temp.night;
    document.getElementById(`icon-day-${i}`).src = `http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png`;
  }
};

const getLocalWeather = () => {
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${success.coords.latitude}&lon=${success.coords.longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((resolution) => resolution.json())
      .then((data) => {
        console.log(data);
        setMood(data);
        displayLocalWeather(data);
        displayWeatherForecast(data.daily);
      })
      .catch((error) => {
        alert(`Couldn't retrieve data for ${searchInput.value}:
        ${error}`);  
      });
  });
};

// getLocalWeather();

// *******************************************************
// WEATHER FOR USER-SPECIFIED CITY
// *******************************************************

// RETRIEVE DATA FROM API
async function getUserSearchedWeather (city) {
  
  // CURRENT WEATHER DATA
  const resolution = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
  const currentData = await resolution.json();
  
  // FORECAST DATA
  const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`);
  const forecastData = await forecastRes.json();
  return forecastData;
}

// EVENT LISTENERS
btnSearch.addEventListener('click', () => {
  getUserSearchedWeather(searchInput.value)
    .then((result) => {
      console.log(result);
      locality.innerText = searchInput.value.toUpperCase();
      searchInput.value = '';
      setMood(result);
      displayLocalWeather(result);
      displayWeatherForecast(result.daily);
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
      console.log(result);
      locality.innerText = searchInput.value.toUpperCase();
      searchInput.value = '';
      setMood(result);
      displayLocalWeather(result);
      displayWeatherForecast(result.daily);
    })
    .catch((error) => {
      alert(`Couldn't retrieve data for ${searchInput.value}:
      ${error}`);
    });;
  }
});

function setMood(data) {
  if (data.current.weather[0].main === 'Snow' || (data.current.temp * 1) < 0) {
    body.style.backgroundImage = `url(../img/snowy.jpg)`
  } else if (data.current.weather[0].main === 'Clouds') {
    body.style.backgroundImage = `url(../img/cloudy.jpg)`
  } else if (data.current.weather[0].main === 'Clear') {
    body.style.backgroundImage = `url(../img/sunny.jpg)`
  } else if (data.current.weather[0].main === 'Rain' || data.current.weather[0].main === 'Drizzle') {
    body.style.backgroundImage = `url(../img/rainy.jpg)`
  } else if (data.current.weather[0].main === 'Thunderstorm') {
    body.style.backgroundImage = `url(../img/stormy.jpg)`
  } else {
    body.style.backgroundImage = `url(../img/default.jpg)`
  }
}