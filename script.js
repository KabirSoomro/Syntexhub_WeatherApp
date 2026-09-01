// ============================================= //
// I created this JavaScript file to handle all   //
// Weather App functionality including API calls, //
// theme toggling, localStorage, and DOM updates  //
// ============================================= //

// ===== API CONFIGURATION ===== //

// I created this config object to store API key and base URL for easy access
const config = {
    // I set the API key — user needs to replace with their own key from https://openweathermap.org/api
    apiKey: '9928232d89f5fdb18c21e39f3cfeee98',
    // I set the base URL for the OpenWeatherMap current weather API
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
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
// I selected the suggestions list container
const suggestionsList = document.getElementById('suggestionsList');
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
// I selected the retry button in the error container
const retryBtn = document.getElementById('retryBtn');

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
// I selected all quick city buttons for click events
const quickCityBtns = document.querySelectorAll('.quick-city-btn');

// ===== STATE VARIABLES ===== //

// I created a variable to track the current temperature unit (celsius by default)
let isCelsius = true;
// I created a variable to store the raw weather data for unit conversion
let currentWeatherData = null;
// I created a variable to store the last searched city for retry functionality
let lastSearchedCity = 'Karachi';
// I created a flag to track if we've successfully loaded data at least once
let hasLoadedData = false;

// ===== DEMO DATA ===== //

// I created demo data so the app never looks empty, even before API key activates
const demoData = {
    name: 'Karachi',
    sys: { country: 'PK', sunrise: 1693450200 },
    weather: [{ description: 'clear sky', icon: '01d', id: 800 }],
    main: { temp: 33, feels_like: 36, humidity: 62, pressure: 1008 },
    wind: { speed: 4.5 },
    visibility: 8000,
    timezone: 18000
};

// ===== LOCALSTORAGE MANAGEMENT ===== //

// I created this function to save data to localStorage with JSON serialization
function saveToLocalStorage(key, value) {
    // I used try-catch to handle potential localStorage errors
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
        // I applied the dark theme to the document element
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
    // I hid the weather card only if we haven't loaded data yet
    if (!hasLoadedData) {
        weatherCard.style.display = 'none';
    }
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
    // I updated the error message text with the provided message
    errorMessage.textContent = message;
    // I showed the error container by adding the 'visible' class
    errorContainer.classList.add('visible');
    // I kept the weather card visible if we have data (shows last known data)
    if (!hasLoadedData) {
        // I show the card with demo data if no real data has loaded
        displayWeather(demoData, true);
    }
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
        // I returned a thunderstorm emoji for thunderstorm conditions
        return '⛈️';
    } else if (weatherId >= 300 && weatherId < 400) {
        // I returned a drizzle emoji for drizzle conditions
        return '🌦️';
    } else if (weatherId >= 500 && weatherId < 600) {
        // I returned a rain emoji for rain conditions
        return '🌧️';
    } else if (weatherId >= 600 && weatherId < 700) {
        // I returned a snow emoji for snow conditions
        return '❄️';
    } else if (weatherId >= 700 && weatherId < 800) {
        // I returned a fog emoji for atmospheric conditions
        return '🌫️';
    } else if (weatherId === 800) {
        // I returned a sun emoji for clear sky
        return '☀️';
    } else if (weatherId === 801) {
        // I returned a partly cloudy emoji
        return '⛅';
    } else if (weatherId >= 802 && weatherId <= 804) {
        // I returned a cloudy emoji for overcast
        return '☁️';
    } else {
        // I returned a default weather emoji
        return '🌤️';
    }
}

// ===== TIME CONVERSION HELPER ===== //

// I created this function to convert Unix timestamp to a readable time string
function convertUnixToTime(unixTimestamp, timezoneOffset) {
    // I created a new Date object from the Unix timestamp
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    // I extracted the hours in UTC
    const hours = date.getUTCHours();
    // I extracted the minutes
    const minutes = date.getUTCMinutes();
    // I determined AM or PM
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

    // I saved the city name for retry functionality
    lastSearchedCity = city;
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
                showError('🔑 API key is still activating. New keys take 2-3 hours to activate. Please wait and try again!');
            } else if (response.status === 429) {
                // I showed a rate limit error message
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
        // I set the flag that we have successfully loaded data
        hasLoadedData = true;
        // I called the display function to update the UI with the weather data
        displayWeather(data, false);
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
    // I checked if the API key has been set
    if (config.apiKey === 'YOUR_API_KEY') {
        showError('⚠️ Please add your OpenWeatherMap API key in script.js');
        return;
    }

    // I showed the loading spinner
    showLoading();
    // I hid any previous error messages
    hideError();

    // I used try-catch to handle errors
    try {
        // I constructed the API URL using latitude and longitude
        const url = `${config.baseUrl}?lat=${lat}&lon=${lon}&appid=${config.apiKey}&units=${config.units}&lang=${config.lang}`;
        // I made the HTTP GET request
        const response = await fetch(url);

        // I checked if the response was not successful
        if (!response.ok) {
            if (response.status === 401) {
                showError('🔑 API key is still activating. New keys take 2-3 hours to activate. Please wait and try again!');
            } else {
                showError(`❌ Error: Unable to fetch weather data (${response.status})`);
            }
            return;
        }

        // I parsed the JSON response
        const data = await response.json();
        // I stored the raw data
        currentWeatherData = data;
        // I set the loaded flag
        hasLoadedData = true;
        // I updated the UI
        displayWeather(data, false);
        // I updated the input field with the detected city name
        cityInput.value = data.name;
        // I saved the city name
        saveToLocalStorage('lastSearchedCity', data.name);
    } catch (error) {
        console.error('I encountered an error fetching weather by coordinates:', error);
        showError('🌐 Network error. Please check your internet connection.');
    }
}

// ===== WEATHER DATA DISPLAY ===== //

// I created this function to update the UI with weather data
function displayWeather(data, isDemo) {
    // I hid the loading spinner since data has been received
    hideLoading();

    // I extracted the city name from the API response
    const cityName = data.name;
    // I extracted the country code
    const country = data.sys.country;
    // I extracted the weather description
    const description = data.weather[0].description;
    // I extracted the weather condition ID for emoji mapping
    const weatherId = data.weather[0].id;
    // I extracted the weather icon code
    const iconCode = data.weather[0].icon;
    // I extracted and rounded the current temperature
    const temp = Math.round(data.main.temp);
    // I extracted and rounded the feels-like temperature
    const feelsLike = Math.round(data.main.feels_like);
    // I extracted the humidity percentage
    const humidity = data.main.humidity;
    // I extracted and converted wind speed from m/s to km/h
    const windSpeed = Math.round(data.wind.speed * 3.6);
    // I extracted the atmospheric pressure
    const pressure = data.main.pressure;
    // I extracted and converted visibility to km
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    // I extracted the sunrise timestamp
    const sunrise = data.sys.sunrise;
    // I extracted the timezone offset
    const timezone = data.timezone;

    // I updated the city name in the UI
    cityNameEl.textContent = cityName;
    // I updated the country code badge
    countryCodeEl.textContent = country;
    // I updated the weather description text
    weatherDescriptionEl.textContent = description;

    // I set the weather emoji based on condition
    const emoji = getWeatherEmoji(weatherId);
    weatherEmojiEl.textContent = emoji;

    // I checked if this is demo data or real API data
    if (!isDemo) {
        // I constructed the OpenWeatherMap icon URL for real data
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        // I set the weather icon image source
        weatherIconEl.src = iconUrl;
        // I set the alt text for accessibility
        weatherIconEl.alt = description;
        // I showed the icon image
        weatherIconEl.style.display = 'block';
        // I hid the emoji since we have an icon
        weatherEmojiEl.style.display = 'none';

        // I added an error handler in case the icon fails to load
        weatherIconEl.onerror = () => {
            // I hid the broken icon image
            weatherIconEl.style.display = 'none';
            // I showed the emoji fallback
            weatherEmojiEl.style.display = 'block';
        };
    } else {
        // I showed the emoji for demo data since we don't have a real icon URL
        weatherIconEl.style.display = 'none';
        weatherEmojiEl.style.display = 'block';
    }

    // I checked if the user is viewing in Celsius or Fahrenheit
    if (isCelsius) {
        // I displayed the temperature in Celsius
        temperatureEl.textContent = temp;
        tempUnitEl.textContent = '°C';
        feelsLikeEl.textContent = `${feelsLike}°C`;
        unitToggle.textContent = 'Switch to °F';
    } else {
        // I converted and displayed the temperature in Fahrenheit
        temperatureEl.textContent = celsiusToFahrenheit(temp);
        tempUnitEl.textContent = '°F';
        feelsLikeEl.textContent = `${celsiusToFahrenheit(feelsLike)}°F`;
        unitToggle.textContent = 'Switch to °C';
    }

    // I updated all the detail values
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} km/h`;
    pressureEl.textContent = `${pressure} hPa`;
    visibilityEl.textContent = `${visibilityKm} km`;
    sunriseEl.textContent = convertUnixToTime(sunrise, timezone);

    // I showed the weather card
    weatherCard.style.display = 'block';
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
        displayWeather(currentWeatherData, false);
    } else {
        // I re-displayed demo data with the new unit
        displayWeather(demoData, true);
    }
}

// ===== GEOLOCATION SUPPORT ===== //

// I created this function to get the user's current location
function getUserLocation() {
    // I checked if the browser supports the Geolocation API
    if (navigator.geolocation) {
        // I showed a loading state
        showLoading();
        // I called getCurrentPosition to get coordinates
        navigator.geolocation.getCurrentPosition(
            // I defined the success callback
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            // I defined the error callback
            (error) => {
                console.error('I encountered a geolocation error:', error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        showError('📍 Location access denied. Please allow location access or search manually.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showError('📍 Location unavailable. Please try searching manually.');
                        break;
                    case error.TIMEOUT:
                        showError('📍 Location request timed out. Please try again.');
                        break;
                    default:
                        showError('📍 Unable to get your location. Please search manually.');
                        break;
                }
            },
            // I set geolocation options
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
        );
    } else {
        showError('📍 Geolocation is not supported by your browser.');
    }
}

// ===== SEARCH FUNCTIONALITY ===== //

// I created this function to handle the search action
function handleSearch() {
    // I got the city name from the input field and trimmed whitespace
    const city = cityInput.value.trim();
    // I checked if the city name is not empty
    if (city) {
        fetchWeather(city);
        cityInput.blur();
        // I hid the suggestions list on search
        suggestionsList.classList.remove('visible');
    } else {
        showError('📝 Please enter a city name to search.');
    }
}

// ===== DEBOUNCE UTILITY ===== //

// I created a debounce function to limit API calls while typing
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// ===== AUTOCOMPLETE SUGGESTIONS ===== //

// I created this async function to fetch city suggestions
async function fetchSuggestions(query) {
    // I checked if the query is empty
    if (!query) {
        // I hid the suggestions list if the input is empty
        suggestionsList.classList.remove('visible');
        return;
    }

    try {
        // I used the OpenWeatherMap Geocoding API to get city suggestions
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${config.apiKey}`;
        const response = await fetch(url);
        
        // I checked if the response is ok
        if (!response.ok) return;

        // I parsed the JSON response
        const cities = await response.json();
        
        // I checked if there are any results
        if (cities.length === 0) {
            // I hid the suggestions list if no cities found
            suggestionsList.classList.remove('visible');
            return;
        }

        // I cleared the previous suggestions
        suggestionsList.innerHTML = '';

        // I looped through the returned cities to create suggestion items
        cities.forEach(city => {
            // I created a new list item element
            const li = document.createElement('li');
            li.classList.add('suggestion-item');
            
            // I constructed the display text (City, State if available)
            const stateText = city.state ? `, ${city.state}` : '';
            // I set the HTML content of the suggestion item
            li.innerHTML = `
                <div class="suggestion-info">
                    <span>📍</span>
                    <span>${city.name}${stateText}</span>
                </div>
                <span class="suggestion-country">${city.country}</span>
            `;

            // I added a click event to fetch weather for the selected city
            li.addEventListener('click', () => {
                // I updated the input field with the selected city name
                cityInput.value = city.name;
                // I hid the suggestions list
                suggestionsList.classList.remove('visible');
                // I fetched the weather for the selected city
                fetchWeather(city.name);
            });

            // I appended the suggestion item to the list
            suggestionsList.appendChild(li);
        });

        // I made the suggestions list visible
        suggestionsList.classList.add('visible');
    } catch (error) {
        // I logged the error for debugging
        console.error('I encountered an error fetching suggestions:', error);
    }
}

// I wrapped the fetchSuggestions function with debounce (300ms delay)
const debouncedFetchSuggestions = debounce((query) => {
    fetchSuggestions(query);
}, 300);

// ===== EVENT LISTENERS ===== //

// I added a change event listener to the theme toggle
themeToggle.addEventListener('change', () => {
    toggleTheme();
});

// I added a click event listener to the search button
searchBtn.addEventListener('click', () => {
    handleSearch();
});

// I added a keydown event listener for Enter key support
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});

// I added an input event listener to the city input field for autocomplete
cityInput.addEventListener('input', (event) => {
    // I got the query and trimmed it
    const query = event.target.value.trim();
    // I called the debounced function
    debouncedFetchSuggestions(query);
});

// I added a click event listener to the document to hide suggestions when clicking outside
document.addEventListener('click', (event) => {
    // I checked if the click was outside the input and suggestions list
    if (suggestionsList && !cityInput.contains(event.target) && !suggestionsList.contains(event.target)) {
        // I hid the suggestions list
        suggestionsList.classList.remove('visible');
    }
});

// I added a click event listener to the geolocation button
geoBtn.addEventListener('click', () => {
    getUserLocation();
});

// I added a click event listener to the unit toggle button
unitToggle.addEventListener('click', () => {
    toggleUnit();
});

// I added a click event listener to the retry button
retryBtn.addEventListener('click', () => {
    hideError();
    fetchWeather(lastSearchedCity);
});

// I added click event listeners to all quick city buttons
quickCityBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // I got the city name from the button's data attribute
        const city = btn.getAttribute('data-city');
        // I updated the input field with the city name
        cityInput.value = city;
        // I fetched weather for the selected city
        fetchWeather(city);
    });
});

// ===== INITIALIZATION ===== //

// I created this function to initialize the app when the page loads
function initApp() {
    // I initialized the theme from localStorage
    initTheme();
    // I updated the greeting based on time of day
    updateGreeting();
    // I displayed the current date and time
    updateDateTime();

    // I set up an interval to update date/time every minute
    setInterval(() => {
        updateDateTime();
        updateGreeting();
    }, 60000);

    // I loaded the saved unit preference
    const savedUnit = getFromLocalStorage('weatherAppUnit');
    if (savedUnit === 'fahrenheit') {
        isCelsius = false;
    }

    // I showed demo data immediately so the app never looks empty
    displayWeather(demoData, true);

    // I loaded the last searched city from localStorage
    const lastCity = getFromLocalStorage('lastSearchedCity');
    if (lastCity) {
        cityInput.value = lastCity;
        lastSearchedCity = lastCity;
        // I attempted to fetch real data (will show demo if API fails)
        fetchWeather(lastCity);
    } else {
        // I attempted to fetch weather for the default city
        fetchWeather('Karachi');
    }
}

// I called the initApp function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
