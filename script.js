const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const API_KEY ='7ff32ce7cc5837f3701339a9f1fed916';

let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


// LIVE CLOCK
setInterval(() => {

    const time = moment().tz(currentTimezone);

    timeEl.innerHTML =
        time.format("hh:mm") +
        ' <span id="am-pm">' +
        time.format("A") +
        "</span>";

    dateEl.innerHTML =
        time.format("dddd, D MMM");

}, 1000);


// GET WEATHER DATA
getWeatherData();

function getWeatherData() {

    if (!navigator.geolocation) {
        alert("Location access required for weather data.");
        return;
    }

    navigator.geolocation.getCurrentPosition(success => {

        let { latitude, longitude } = success.coords;

        fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
        )
        .then(res => res.json())
        .then(data => {

            currentTimezone = data.timezone;

            showWeatherData(data);

        });

    });

}


// SHOW WEATHER DATA
function showWeatherData(data){

    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezoneEl.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + "°N " + data.lon + "°E";


    currentWeatherItemsEl.innerHTML =

    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>

    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} hPa</div>
    </div>

    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${moment.unix(sunrise).tz(data.timezone).format("hh:mm A")}</div>
    </div>

    <div class="weather-item">
        <div>Sunset</div>
        <div>${moment.unix(sunset).tz(data.timezone).format("hh:mm A")}</div>
    </div>`;


    let otherDayForecast = "";


    data.daily.forEach((day, idx) => {

        if(idx === 0){

            currentTempEl.innerHTML =

            `<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
            class="w-icon">

            <div class="other">

                <div class="day">
                    ${moment.unix(day.dt).tz(data.timezone).format("dddd")}
                </div>

                <div class="temp">
                    Night - ${day.temp.night}°C
                </div>

                <div class="temp">
                    Day - ${day.temp.day}°C
                </div>

            </div>`;

        } else {

            otherDayForecast +=

            `<div class="weather-forecast-item">

                <div class="day">
                    ${moment.unix(day.dt).tz(data.timezone).format("ddd")}
                </div>

                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                class="w-icon">

                <div class="temp">
                    Night - ${day.temp.night}°C
                </div>

                <div class="temp">
                    Day - ${day.temp.day}°C
                </div>

            </div>`;
        }

    });


    weatherForecastEl.innerHTML = otherDayForecast;

}
