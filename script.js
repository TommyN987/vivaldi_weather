// ******************************************************* 
// GET DOM ELEMENTS
// *******************************************************

const time = document.getElementById('time');
const date = document.getElementById('date');
const currentTemp = document.getElementById('current-temp');
const sky = document.getElementById('sky');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const timezone = document.getElementById('time-zone');

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
  'Saturday'
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
  'Dec'
];

// ******************************************************* 
// GET CURRENT TIME AND DATE
// *******************************************************

(function getTimeAndDate () {
  setInterval(() => {
    const currentTime = new Date();
    const month = currentTime.getMonth();
    const currentdate = currentTime.getDate();
    const day = currentTime.getDay();
    const hour = currentTime.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = currentTime.getMinutes();

    time.innerHTML = `${hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat}:${(minutes < 10 ? '0' + minutes : minutes)} <span id="am-pm">${ampm}</span>`

    date.innerHTML = `${days[day]}, ${currentdate} ${months[month]}`;
  }, 1000)
})();

const showCurrentWeatherData = (data) => {
  timezone.innerText = data.timezone;
  currentTemp.innerText = `${data.current.temp} °C`;
  sky.innerText = data.current.weather[0].main;
  windSpeed.innerText = `${data.current.wind_speed} m/s`;
  humidity.innerText = `${data.current.humidity}%`;
  pressure.innerText = data.current.pressure;
  sunrise.innerText = window.moment(data.current.sunrise * 1000).format('HH:mm a');
  sunset.innerText = window.moment(data.current.sunset * 1000).format('HH:mm a');
}

const getCurrentWeatherData = () => {
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);
    
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${success.coords.latitude}&lon=${success.coords.longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
      .then((resolution) => resolution.json())
      .then((data) => {
        console.log(data);
        showCurrentWeatherData(data);
      })
  })
}

getCurrentWeatherData();