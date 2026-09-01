// ============================================= //
// I created this JavaScript file to handle all   //
// Weather App functionality including API calls, //
// theme toggling, localStorage, and DOM updates  //
// ============================================= //

// ===== API CONFIGURATION ===== //

// I created this config object to store API key and base URL for easy access
const config = {
    // I set the API key as a placeholder — user will replace with their own key from https://openweathermap.org/api
    apiKey: '9928232d89f5fdb18c21e39f3cfeee98',
    // I set the base URL for the OpenWeatherMap current weather API
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    // I set the forecast URL for 5-day weather forecast data
    forecastUrl: 'https://api.openweathermap.org/data/2.5/forecast',
    // I set units to metric so temperature is returned in Celsius
    units: 'metric',
    // I set the language to English for weather descriptions
    lang: 'en'
};

// ===== DOM ELEMENT REFERENCES ===== //

// I selected the theme toggle checkbox so I can listen for theme changes
const themeToggle = document.getElementById('themeToggle');
// I selected the city search input field so I can read the user's input
const cityInput = document.getElementById('cityInput');
// I selected the search button so I can add a click event listener
const searchBtn = document.getElementById('searchBtn');
// I selected the geolocation button so users can get weather by location
const geoBtn = document.getElementById('geoBtn');
// I selected the loading container so I can show/hide the loading spinner
const loadingContainer = document.getElementById('loadingContainer');
// I selected the error container so I can show/hide error messages
const errorContainer = document.getElementById('errorContainer');
// I selected the error message paragraph so I can update the error text
const errorMessage = document.getElementById('errorMessage');
// I selected the weather card so I can show/hide it when data loads
const weatherCard = document.getElementById('weatherCard');
// I selected the greeting paragraph so I can update it based on time of day
const greetingEl = document.getElementById('greeting');
// I selected the datetime paragraph so I can display the current date and time
const datetimeEl = document.getElementById('datetime');
// I selected the unit toggle button so users can switch between °C and °F
const unitToggle = document.getElementById('unitToggle');

// ===== WEATHER DISPLAY ELEMENTS ===== //

// I selected the city name heading to display the searched city
const cityNameEl = document.getElementById('cityName');
// I selected the country code span to display the country abbreviation
const countryCodeEl = document.getElementById('countryCode');
// I selected the weather description paragraph to display the weather condition
const weatherDescriptionEl = document.getElementById('weatherDescription');
// I selected the weather icon img element to display the weather icon
const weatherIconEl = document.getElementById('weatherIcon');
// I selected the weather emoji span as a visual enhancement
const weatherEmojiEl = document.getElementById('weatherEmoji');
// I selected the temperature span to display the current temperature
const temperatureEl = document.getElementById('temperature');
// I selected the temperature unit span to show °C or °F
const tempUnitEl = document.getElementById('tempUnit');
// I selected the feels like span to display the perceived temperature
const feelsLikeEl = document.getElementById('feelsLike');
// I selected the humidity span to display the humidity percentage
const humidityEl = document.getElementById('humidity');
// I selected the wind speed span to display wind speed in km/h
const windSpeedEl = document.getElementById('windSpeed');
// I selected the pressure span to display atmospheric pressure
const pressureEl = document.getElementById('pressure');
// I selected the visibility span to display visibility distance
const visibilityEl = document.getElementById('visibility');
// I selected the sunrise span to display the sunrise time
const sunriseEl = document.getElementById('sunrise');

// ===== STATE VARIABLES ===== //

// I created a variable to track the current temperature unit (celsius by default)
let isCelsius = true;
// I created a variable to store the raw weather data for unit conversion
let currentWeatherData = null;

// ===== LOCALSTORAGE MANAGEMENT ===== //

// I created this function to save data to localStorage with JSON serialization
function saveToLocalStorage(key, value) {
    // I used try-catch to handle potential localStorage errors (e.g., private browsing)
    try {
        // I serialized the value to JSON and stored it with the given key
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // I logged any localStorage errors for debugging
        console.warn('I caught a localStorage save error:', error);
    }
}

// I created this function to retrieve data from localStorage with JSON parsing
function getFromLocalStorage(key) {
    // I used try-catch to handle potential localStorage errors
    try {
        // I retrieved the item and parsed it from JSON
        const item = localStorage.getItem(key);
        // I returned the parsed value, or null if no item was found
        return item ? JSON.parse(item) : null;
    } catch (error) {
        // I logged any localStorage read errors for debugging
        console.warn('I caught a localStorage read error:', error);
        // I returned null as a safe fallback
        return null;
    }
}

// ===== THEME MANAGEMENT ===== //

// I created this function to initialize the theme from localStorage on page load
function initTheme() {
    // I retrieved the saved theme preference from localStorage
    const savedTheme = getFromLocalStorage('weatherAppTheme');
    // I checked if a saved theme exists
    if (savedTheme === 'dark') {
        // I applied the dark theme to the document body
        document.documentElement.setAttribute('data-theme', 'dark');
        // I set the toggle checkbox to checked state for dark mode
        themeToggle.checked = true;
    } else {
        // I applied the light theme as the default
        document.documentElement.setAttribute('data-theme', 'light');
        // I ensured the toggle checkbox is unchecked for light mode
        themeToggle.checked = false;
    }
}

// I created this function to toggle between dark and light themes
function toggleTheme() {
    // I checked the current theme by reading the data-theme attribute
    const currentTheme = document.documentElement.getAttribute('data-theme');
    // I determined the new theme based on the current one
    if (currentTheme === 'dark') {
        // I switched to light theme
        document.documentElement.setAttribute('data-theme', 'light');
        // I saved the light theme preference to localStorage
        saveToLocalStorage('weatherAppTheme', 'light');
    } else {
        // I switched to dark theme
        document.documentElement.setAttribute('data-theme', 'dark');
        // I saved the dark theme preference to localStorage
        saveToLocalStorage('weatherAppTheme', 'dark');
    }
}

// ===== DATE, TIME & GREETING ===== //

// I created this function to update the greeting based on the current time of day
function updateGreeting() {
    // I got the current hour from the Date object
    const hour = new Date().getHours();
    // I created a variable to hold the greeting text
    let greeting = '';
    // I checked the hour to determine the appropriate greeting
    if (hour >= 5 && hour < 12) {
        // I set the morning greeting for hours 5 AM to 11:59 AM
        greeting = 'Good Morning! 🌅';
    } else if (hour >= 12 && hour < 17) {
        // I set the afternoon greeting for hours 12 PM to 4:59 PM
        greeting = 'Good Afternoon! ☀️';
    } else if (hour >= 17 && hour < 21) {
        // I set the evening greeting for hours 5 PM to 8:59 PM
        greeting = 'Good Evening! 🌇';
    } else {
        // I set the night greeting for hours 9 PM to 4:59 AM
        greeting = 'Good Night! 🌙';
    }
    // I updated the greeting element with the appropriate text
    greetingEl.textContent = greeting;
}

// I created this function to update the date and time display
function updateDateTime() {
    // I created a new Date object for the current date and time
    const now = new Date();
    // I formatted the date using toLocaleDateString with a readable format
    const options = {
        // I included the full weekday name for clarity
        weekday: 'long',
        // I included the full year
        year: 'numeric',
        // I included the full month name
        month: 'long',
        // I included the numeric day
        day: 'numeric',
        // I included hours in the time
        hour: '2-digit',
        // I included minutes in the time
        minute: '2-digit'
    };
    // I formatted the date string using the browser's locale
    const dateTimeString = now.toLocaleDateString('en-US', options);
    // I updated the datetime element with the formatted string
    datetimeEl.textContent = dateTimeString;
}

// ===== UI STATE MANAGEMENT ===== //

// I created this function to show the loading spinner
function showLoading() {
    // I added the 'visible' class to show the loading container
    loadingContainer.classList.add('visible');
    // I removed the 'visible' class from the error container to hide any errors
    errorContainer.classList.remove('visible');
    // I removed the 'visible' class from the weather card to hide old data
    weatherCard.classList.remove('visible');
}

// I created this function to hide the loading spinner
function hideLoading() {
    // I removed the 'visible' class to hide the loading container
    loadingContainer.classList.remove('visible');
}

// I created this function to show an error message to the user
function showError(message) {
    // I hid the loading spinner first
    hideLoading();
    // I hid the weather card when showing an error
    weatherCard.classList.remove('visible');
    // I updated the error message text with the provided message
    errorMessage.textContent = message;
    // I showed the error container by adding the 'visible' class
    errorContainer.classList.add('visible');
}

// I created this function to hide the error message
function hideError() {
    // I removed the 'visible' class to hide the error container
    errorContainer.classList.remove('visible');
}

// ===== WEATHER EMOJI MAPPING ===== //

// I created this function to return a weather emoji based on the weather condition code
function getWeatherEmoji(weatherId) {
    // I checked the weather condition ID from OpenWeatherMap to map appropriate emojis
    if (weatherId >= 200 && weatherId < 300) {
        // I returned a thunderstorm emoji for thunderstorm conditions (200-299)
        return '⛈️';
    } else if (weatherId >= 300 && weatherId < 400) {
        // I returned a drizzle emoji for drizzle conditions (300-399)
        return '🌦️';
    } else if (weatherId >= 500 && weatherId < 600) {
        // I returned a rain emoji for rain conditions (500-599)
        return '🌧️';
    } else if (weatherId >= 600 && weatherId < 700) {
        // I returned a snow emoji for snow conditions (600-699)
        return '❄️';
    } else if (weatherId >= 700 && weatherId < 800) {
        // I returned a fog emoji for atmospheric conditions like mist/fog (700-799)
        return '🌫️';
    } else if (weatherId === 800) {
        // I returned a sun emoji for clear sky conditions (800)
        return '☀️';
    } else if (weatherId === 801) {
        // I returned a partly cloudy emoji for few clouds (801)
        return '⛅';
    } else if (weatherId >= 802 && weatherId <= 804) {
        // I returned a cloudy emoji for overcast/cloudy conditions (802-804)
        return '☁️';
    } else {
        // I returned a default weather emoji for unrecognized conditions
        return '🌤️';
    }
}

// ===== TIME CONVERSION HELPER ===== //

// I created this function to convert Unix timestamp to a readable time string
function convertUnixToTime(unixTimestamp, timezoneOffset) {
    // I created a new Date object from the Unix timestamp (in milliseconds)
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    // I extracted the hours in UTC (since we already applied the offset)
    const hours = date.getUTCHours();
    // I extracted the minutes
    const minutes = date.getUTCMinutes();
    // I determined if it's AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // I converted to 12-hour format
    const formattedHours = hours % 12 || 12;
    // I padded minutes with a leading zero if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    // I returned the formatted time string
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// ===== TEMPERATURE CONVERSION ===== //

// I created this function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    // I applied the conversion formula: (C × 9/5) + 32
    return Math.round((celsius * 9 / 5) + 32);
}

// ===== WEATHER DATA FETCHING ===== //

// I created this async function to fetch weather data from OpenWeatherMap API
async function fetchWeather(city) {
    // I checked if the API key has been set by the user
    if (config.apiKey === 'YOUR_API_KEY') {
        // I showed an error message prompting the user to add their API key
        showError('⚠️ Please add your OpenWeatherMap API key in script.js');
        // I returned early to prevent the API call
        return;
    }

    // I showed the loading spinner while data is being fetched
    showLoading();
    // I hid any previous error messages
    hideError();

    // I used try-catch to handle any errors during the API call
    try {
        // I constructed the API URL using template literals with the config values
        const url = `${config.baseUrl}?q=${encodeURIComponent(city)}&appid=${config.apiKey}&units=${config.units}&lang=${config.lang}`;
        // I used the fetch API with await to make the HTTP GET request
        const response = await fetch(url);

        // I checked if the response status indicates an error
        if (!response.ok) {
            // I checked for a 404 status (city not found)
            if (response.status === 404) {
                // I showed a city not found error message
                showError('🏙️ City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                // I showed an API key error message for 401 unauthorized
                showError('🔑 Invalid API key. Please check your OpenWeatherMap API key.');
            } else if (response.status === 429) {
                // I showed a rate limit error message for 429 too many requests
                showError('⏳ Too many requests. Please wait a moment and try again.');
            } else {
                // I showed a generic error message for other HTTP errors
                showError(`❌ Error: Unable to fetch weather data (${response.status})`);
            }
            // I returned early to stop further processing
            return;
        }

        // I parsed the JSON response from the API
        const data = await response.json();
        // I stored the raw data in the global variable for unit conversion
        currentWeatherData = data;
        // I called the display function to update the UI with the weather data
        displayWeather(data);
        // I saved the searched city to localStorage as the last searched city
        saveToLocalStorage('lastSearchedCity', city);
    } catch (error) {
        // I logged the error for debugging purposes
        console.error('I encountered an error fetching weather data:', error);
        // I showed a network error message to the user
        showError('🌐 Network error. Please check your internet connection.');
    }
}

// I created this async function to fetch weather by geographic coordinates
async function fetchWeatherByCoords(lat, lon) {
    // I checked if the API key has been set by the user
    if (config.apiKey === 'YOUR_API_KEY') {
        // I showed an error message prompting the user to add their API key
        showError('⚠️ Please add your OpenWeatherMap API key in script.js');
        // I returned early to prevent the API call
        return;
    }

    // I showed the loading spinner while data is being fetched
    showLoading();
    // I hid any previous error messages
    hideError();

    // I used try-catch to handle any errors during the API call
    try {
        // I constructed the API URL using latitude and longitude instead of city name
        const url = `${config.baseUrl}?lat=${lat}&lon=${lon}&appid=${config.apiKey}&units=${config.units}&lang=${config.lang}`;
        // I used the fetch API with await to make the HTTP GET request
        const response = await fetch(url);

        // I checked if the response was not successful
        if (!response.ok) {
            // I showed a generic error message
            showError(`❌ Error: Unable to fetch weather data (${response.status})`);
            // I returned early to stop further processing
            return;
        }

        // I parsed the JSON response from the API
        const data = await response.json();
        // I stored the raw data in the global variable for unit conversion
        currentWeatherData = data;
        // I called the display function to update the UI with the weather data
        displayWeather(data);
        // I saved the city name from the API response as the last searched city
        saveToLocalStorage('lastSearchedCity', data.name);
    } catch (error) {
        // I logged the error for debugging purposes
        console.error('I encountered an error fetching weather by coordinates:', error);
        // I showed a network error message to the user
        showError('🌐 Network error. Please check your internet connection.');
    }
}

// ===== WEATHER DATA DISPLAY ===== //

// I created this function to update the UI with weather data from the API response
function displayWeather(data) {
    // I hid the loading spinner since data has been received
    hideLoading();
    // I hid any error messages
    hideError();

    // I extracted the city name from the API response
    const cityName = data.name;
    // I extracted the country code from the sys object
    const country = data.sys.country;
    // I extracted the weather description and capitalized it
    const description = data.weather[0].description;
    // I extracted the weather condition ID for emoji mapping
    const weatherId = data.weather[0].id;
    // I extracted the weather icon code from the API response
    const iconCode = data.weather[0].icon;
    // I extracted the current temperature and rounded it
    const temp = Math.round(data.main.temp);
    // I extracted the feels-like temperature and rounded it
    const feelsLike = Math.round(data.main.feels_like);
    // I extracted the humidity percentage
    const humidity = data.main.humidity;
    // I extracted the wind speed and converted from m/s to km/h
    const windSpeed = Math.round(data.wind.speed * 3.6);
    // I extracted the atmospheric pressure
    const pressure = data.main.pressure;
    // I extracted the visibility and converted from meters to km
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    // I extracted the sunrise Unix timestamp
    const sunrise = data.sys.sunrise;
    // I extracted the timezone offset for proper time conversion
    const timezone = data.timezone;

    // I updated the city name in the UI
    cityNameEl.textContent = cityName;
    // I updated the country code badge
    countryCodeEl.textContent = country;
    // I updated the weather description text
    weatherDescriptionEl.textContent = description;

    // I constructed the OpenWeatherMap icon URL
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    // I set the weather icon image source
    weatherIconEl.src = iconUrl;
    // I set the alt text for accessibility
    weatherIconEl.alt = description;
    // I showed the icon image
    weatherIconEl.style.display = 'block';
    // I hid the emoji fallback since we have an icon
    weatherEmojiEl.style.display = 'none';

    // I added an error handler in case the icon fails to load
    weatherIconEl.onerror = () => {
        // I hid the broken icon image
        weatherIconEl.style.display = 'none';
        // I showed the emoji fallback instead
        weatherEmojiEl.style.display = 'block';
        // I set the emoji based on the weather condition
        weatherEmojiEl.textContent = getWeatherEmoji(weatherId);
    };

    // I checked if the user is viewing in Celsius or Fahrenheit
    if (isCelsius) {
        // I displayed the temperature in Celsius
        temperatureEl.textContent = temp;
        // I set the unit label to °C
        tempUnitEl.textContent = '°C';
        // I displayed the feels-like temperature in Celsius
        feelsLikeEl.textContent = `${feelsLike}°C`;
        // I updated the unit toggle button text
        unitToggle.textContent = 'Switch to °F';
    } else {
        // I converted and displayed the temperature in Fahrenheit
        temperatureEl.textContent = celsiusToFahrenheit(temp);
        // I set the unit label to °F
        tempUnitEl.textContent = '°F';
        // I converted and displayed the feels-like temperature in Fahrenheit
        feelsLikeEl.textContent = `${celsiusToFahrenheit(feelsLike)}°F`;
        // I updated the unit toggle button text
        unitToggle.textContent = 'Switch to °C';
    }

    // I updated the humidity value
    humidityEl.textContent = `${humidity}%`;
    // I updated the wind speed value in km/h
    windSpeedEl.textContent = `${windSpeed} km/h`;
    // I updated the pressure value in hPa
    pressureEl.textContent = `${pressure} hPa`;
    // I updated the visibility value in km
    visibilityEl.textContent = `${visibilityKm} km`;
    // I converted and displayed the sunrise time using the timezone offset
    sunriseEl.textContent = convertUnixToTime(sunrise, timezone);

    // I showed the weather card by adding the 'visible' class
    weatherCard.classList.add('visible');
}

// ===== UNIT TOGGLE FUNCTIONALITY ===== //

// I created this function to toggle between Celsius and Fahrenheit
function toggleUnit() {
    // I toggled the isCelsius flag
    isCelsius = !isCelsius;
    // I saved the unit preference to localStorage
    saveToLocalStorage('weatherAppUnit', isCelsius ? 'celsius' : 'fahrenheit');
    // I checked if we have weather data to re-display
    if (currentWeatherData) {
        // I re-displayed the weather data with the new unit
        displayWeather(currentWeatherData);
    }
}

// ===== GEOLOCATION SUPPORT ===== //

// I created this function to get the user's current location using the browser's Geolocation API
function getUserLocation() {
    // I checked if the browser supports the Geolocation API
    if (navigator.geolocation) {
        // I showed a loading state while getting the user's location
        showLoading();
        // I called getCurrentPosition to get the user's coordinates
        navigator.geolocation.getCurrentPosition(
            // I defined the success callback function
            (position) => {
                // I extracted the latitude from the position object
                const lat = position.coords.latitude;
                // I extracted the longitude from the position object
                const lon = position.coords.longitude;
                // I fetched the weather data using the coordinates
                fetchWeatherByCoords(lat, lon);
            },
            // I defined the error callback function
            (error) => {
                // I logged the geolocation error for debugging
                console.error('I encountered a geolocation error:', error);
                // I checked the error code to provide a specific message
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        // I showed an error message when the user denied location access
                        showError('📍 Location access denied. Please allow location access or search manually.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        // I showed an error message when position is unavailable
                        showError('📍 Location unavailable. Please try searching manually.');
                        break;
                    case error.TIMEOUT:
                        // I showed an error message when the request timed out
                        showError('📍 Location request timed out. Please try again.');
                        break;
                    default:
                        // I showed a generic location error message
                        showError('📍 Unable to get your location. Please search manually.');
                        break;
                }
            },
            // I set options for the geolocation request
            {
                // I enabled high accuracy for better location results
                enableHighAccuracy: true,
                // I set a timeout of 10 seconds for the request
                timeout: 10000,
                // I set the maximum age of a cached position to 10 minutes
                maximumAge: 600000
            }
        );
    } else {
        // I showed an error message if geolocation is not supported by the browser
        showError('📍 Geolocation is not supported by your browser.');
    }
}

// ===== SEARCH FUNCTIONALITY ===== //

// I created this function to handle the search action
function handleSearch() {
    // I got the city name from the input field and trimmed whitespace
    const city = cityInput.value.trim();
    // I checked if the city name is not empty before fetching
    if (city) {
        // I called the fetchWeather function with the city name
        fetchWeather(city);
        // I blurred the input field to hide the mobile keyboard
        cityInput.blur();
    } else {
        // I showed an error if the input is empty
        showError('📝 Please enter a city name to search.');
    }
}

// ===== EVENT LISTENERS ===== //

// I added a change event listener to the theme toggle checkbox
themeToggle.addEventListener('change', () => {
    // I called the toggleTheme function when the checkbox state changes
    toggleTheme();
});

// I added a click event listener to the search button
searchBtn.addEventListener('click', () => {
    // I called the handleSearch function when the search button is clicked
    handleSearch();
});

// I added a keydown event listener to the city input for Enter key support
cityInput.addEventListener('keydown', (event) => {
    // I checked if the pressed key is Enter
    if (event.key === 'Enter') {
        // I prevented the default form submission behavior
        event.preventDefault();
        // I called the handleSearch function when Enter is pressed
        handleSearch();
    }
});

// I added a click event listener to the geolocation button
geoBtn.addEventListener('click', () => {
    // I called the getUserLocation function when the geo button is clicked
    getUserLocation();
});

// I added a click event listener to the unit toggle button
unitToggle.addEventListener('click', () => {
    // I called the toggleUnit function when the button is clicked
    toggleUnit();
});

// ===== INITIALIZATION ===== //

// I created this function to initialize the app when the page loads
function initApp() {
    // I called initTheme to load the saved theme preference
    initTheme();
    // I called updateGreeting to show the time-based greeting
    updateGreeting();
    // I called updateDateTime to display the current date and time
    updateDateTime();

    // I set up an interval to update the date and time every minute
    setInterval(() => {
        // I called updateDateTime every 60 seconds to keep the time current
        updateDateTime();
        // I also updated the greeting in case the time period changed
        updateGreeting();
    }, 60000);

    // I loaded the saved unit preference from localStorage
    const savedUnit = getFromLocalStorage('weatherAppUnit');
    // I checked if a saved unit preference exists
    if (savedUnit === 'fahrenheit') {
        // I set the unit to Fahrenheit if that was the saved preference
        isCelsius = false;
    }

    // I loaded the last searched city from localStorage
    const lastCity = getFromLocalStorage('lastSearchedCity');
    // I checked if a last searched city exists
    if (lastCity) {
        // I set the input field to the last searched city
        cityInput.value = lastCity;
        // I fetched the weather for the last searched city
        fetchWeather(lastCity);
    } else {
        // I fetched weather for the default city (Karachi) on first load
        fetchWeather('Karachi');
    }
}

// I called the initApp function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // I triggered the app initialization
    initApp();
});
