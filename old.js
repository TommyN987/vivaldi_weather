const time = document.getElementById('time');
const date = document.getElementById('date');
const currentWeatherItems = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const futureForecastContainer = document.getElementById(
  'future-forecast-container'
);
const currentTemp = document.getElementById('current-temp');

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

const API_KEY = 'c55b2f992c145e0b6c4f202c68a74305';

setInterval(() => {
  const currentTime = new Date();
  const month = currentTime.getMonth();
  const currentdate = currentTime.getDate();
  const day = currentTime.getDay();
  const hour = currentTime.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = currentTime.getMinutes();

  time.innerHTML = `${(hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat)}:${(minutes < 10 ? '0' + minutes : minutes)} <span id="am-pm">${ampm}</span>`;

  date.innerHTML = `${days[day]}, ${currentdate} ${months[month]}`;
}, 1000);

const getWeatherData = () => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=munich&units=metric&appid=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    });
  
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    console.log(success);
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
};

function showWeatherData (data) {
  let { humidity, pressure, temp, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;

  currentWeatherItems.innerHTML =
    `<div class="weather-item">
      <div>Temperature</div>
      <div>${temp} &#176;C</div>
    </div>
    <div class="weather-item">
      <div>Sky</div>
      <div>${data.current.weather[0].main}</div>
    </div>
    <div class="weather-item">
      <div>Wind speed</div>
      <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
      <div>Humidity</div>
      <div>${humidity}%</div>
    </div>
    <div class="weather-item">
      <div>Pressure</div>
      <div>${pressure}</div>
    </div>
    <div class="weather-item">
      <div>Sunrise</div>
      <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`;

    let otherDayForecast = '';

    data.daily.forEach((day, index) => {
      if (index === 0) {
        currentTemp.innerHTML = `
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
            alt="Weather Icon"
            class="w-icon"
          />
          <div class="other">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}day</div>
            <div class="temp">Day - ${day.temp.day} &#176;C</div>
            <div class="temp">Night - ${day.temp.night} &#176;C</div>
          </div>`
      } else {
        otherDayForecast += `
        <div class="future-forecast-item">
          <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="Weather icon"
            class="w-icon"
          />
          <div class="temp">Day - ${day.temp.day} &#176;C</div>
          <div class="temp">Night - ${day.temp.night} &#176;C</div>
        </div>`
      }
    })

    futureForecastContainer.innerHTML = otherDayForecast;
};

getWeatherData();

