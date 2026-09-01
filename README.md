# 🌤️ Weather App — Real-Time Weather Dashboard

<div align="center">

![Weather App Banner](https://img.shields.io/badge/Weather_App-Professional-6C63FF?style=for-the-badge&logo=cloudflare&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap_API-FF6B35?style=for-the-badge&logo=icloud&logoColor=white)

**A modern, responsive weather application that fetches real-time weather data using the OpenWeatherMap API. Built with vanilla HTML, CSS, and JavaScript featuring Dark/Light theme support, glassmorphism UI, and professional-grade design.**

[Live Demo](#-live-demo) • [Features](#-features) • [Setup](#️-setup--installation) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## 📌 Project Information

| Detail | Info |
|--------|------|
| **Project** | Weather App — Real-Time Weather Dashboard |
| **Internship** | SYNTECXHUB Web Development Internship |
| **Task** | Task 4 — Project 1 |
| **Developer** | KaBeeR SooMRo |
| **Status** | ✅ Complete |

---

## 🚀 Live Demo

> 🔗 **[Click here to view the Live Demo](https://kabirsoomro.github.io/Syntexhub_WeatherApp/)**

---

## ✨ Features

### 🌍 Core Features
- **Real-Time Weather Data** — Fetches live weather data from OpenWeatherMap API
- **City Search with Live Autocomplete** — Type a city name to see instant dropdown suggestions (powered by Geocoding API)
- **Enter Key Support** — Press Enter to search, no need to click the button
- **Weather Details** — Temperature, Humidity, Wind Speed, Pressure, Visibility, Sunrise time
- **Weather Icons** — Dynamic weather icons from OpenWeatherMap with emoji fallback
- **Feels Like Temperature** — Shows perceived temperature alongside actual

### 🎨 Dark / Light Mode
- **Toggle Switch** — Beautiful toggle with ☀️ Sun and 🌙 Moon icons
- **CSS Variables** — All colors managed through CSS custom properties
- **localStorage Persistence** — Theme preference saved and restored automatically
- **Smooth Transitions** — 0.3s ease transitions on all color changes

### 📍 Geolocation Support
- **"Use My Location" Button** — Automatically detects user's city using browser Geolocation API
- **Smart Input Update** — Automatically populates the search bar with your detected location
- **Permission Handling** — Graceful error messages if location access is denied
- **High Accuracy** — Uses `enableHighAccuracy: true` for precise location

### 🌡️ Temperature Unit Toggle
- **Celsius ↔ Fahrenheit** — Switch between °C and °F with one click
- **Preference Saved** — Unit preference stored in localStorage

### 💾 Smart Memory
- **Last Searched City** — Remembers and auto-loads your last searched city
- **Default City** — Shows Karachi weather on first visit
- **Theme Memory** — Remembers dark/light preference across sessions

### 🎯 UX Enhancements
- **Time-Based Greeting** — Good Morning / Afternoon / Evening / Night with emojis
- **Live Date & Time** — Current date and time, updates every minute
- **Loading Spinner** — Animated spinner while fetching data
- **Error Handling** — Friendly error messages for invalid cities, network issues, API errors
- **Weather Emojis** — Contextual emojis (⛈️ 🌧️ ☀️ ❄️ ☁️) based on weather condition
- **Debounce Optimization** — Smart API calling that waits for you to finish typing to save API requests

### 📱 Fully Responsive
- **4 Breakpoints** — Desktop (1024px+), Tablet (768-1024px), Mobile (480-768px), Small Mobile (320-480px)
- **Glassmorphism Header** — Semi-transparent header with backdrop blur effect
- **Sticky Header** — Header stays visible while scrolling on larger screens

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic page structure and accessibility |
| **CSS3** | Styling, CSS Variables (theming), Grid, Flexbox, Animations |
| **JavaScript (ES6+)** | API calls (async/await), DOM manipulation, localStorage |
| **OpenWeatherMap API** | Real-time weather data source |
| **Google Fonts (Inter)** | Modern typography |

---

## 📁 Project Structure

```
Weather_App/
│
├── index.html          # Main HTML file — App structure and layout
├── style.css           # Stylesheet — Themes, responsive design, animations
├── script.js           # JavaScript — API calls, theme toggle, localStorage
└── README.md           # Documentation — You are here!
```

---

## ⚙️ Setup & Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- An internet connection (for API calls and Google Fonts)
- A free OpenWeatherMap API key

### Step 1: Clone the Repository

```bash
git clone https://github.com/KabirSoomro/Syntexhub_WeatherApp.git
cd Syntexhub_WeatherApp
```

### Step 2: Get Your API Key (Free)

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click **"Sign Up"** and create a free account
3. After login, navigate to **"My API Keys"** section
4. Copy your default API key

> ⚠️ **Note:** New API keys take **2-3 hours** to activate after account creation. This is normal.

### Step 3: Add Your API Key

Open `script.js` and replace the API key on **line 10**:

```javascript
const config = {
    apiKey: 'YOUR_API_KEY_HERE',  // ← Paste your key here
    // ...
};
```

### Step 4: Open the App

Simply open `index.html` in your browser:

```bash
# Option 1: Double-click index.html in your file explorer

# Option 2: Use VS Code Live Server extension

# Option 3: Use Python's built-in server
python -m http.server 8000
# Then open http://localhost:8000
```

---

## 📸 Screenshots

### ☀️ Light Mode
> *Screenshot of the app in light theme showing weather data*

### 🌙 Dark Mode
> *Screenshot of the app in dark theme showing weather data*

### 📱 Mobile View
> *Screenshot of the responsive mobile layout*

### ⚠️ Error State
> *Screenshot showing error handling for invalid city*

*(Add your own screenshots here after the API key activates)*

---

## 🌐 API Reference

This app uses the **OpenWeatherMap Current Weather Data API**.

### Endpoint
```
GET https://api.openweathermap.org/data/2.5/weather
```

### Parameters Used

| Parameter | Value | Description |
|-----------|-------|-------------|
| `q` | City name | The city to fetch weather for |
| `appid` | API Key | Your OpenWeatherMap API key |
| `units` | `metric` | Returns temperature in Celsius |
| `lang` | `en` | English weather descriptions |
| `lat` / `lon` | Coordinates | Used for geolocation-based search |

### Sample Response

```json
{
    "name": "Karachi",
    "main": {
        "temp": 32.5,
        "feels_like": 35.2,
        "humidity": 65,
        "pressure": 1008
    },
    "weather": [{
        "description": "clear sky",
        "icon": "01d",
        "id": 800
    }],
    "wind": { "speed": 5.2 },
    "visibility": 10000,
    "sys": {
        "country": "PK",
        "sunrise": 1693450200
    }
}
```

### Error Codes Handled

| Code | Meaning | App Response |
|------|---------|-------------|
| `200` | Success | Display weather data |
| `401` | Invalid API Key | Show API key error message |
| `404` | City Not Found | Show city not found message |
| `429` | Rate Limited | Show rate limit message |
| `5xx` | Server Error | Show generic error message |

---

## 🎨 Design System

### Color Palette

#### Light Theme
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#F0F4F8` | Page background |
| Card | `#FFFFFF` | Weather card, header |
| Primary | `#6C63FF` | Buttons, accents, brand |
| Secondary | `#00D4FF` | Cyan highlights |
| Text | `#2D3436` | Primary text |
| Error | `#FF6B6B` | Error messages |

#### Dark Theme
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0D1117` | Page background |
| Card | `#161B22` | Weather card, header |
| Primary | `#6C63FF` | Buttons, accents, brand |
| Secondary | `#00D4FF` | Cyan highlights |
| Text | `#F0F6FC` | Primary text |
| Error | `#FF6B6B` | Error messages |

### Typography
- **Font Family:** Inter (Google Fonts) with system fallbacks
- **Weights Used:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)

### Responsive Breakpoints

| Breakpoint | Screen Size | Layout Changes |
|------------|-------------|----------------|
| Desktop | 1024px+ | Full layout, max-width 620px card |
| Tablet | 768px - 1024px | Slightly reduced padding and font sizes |
| Mobile | 480px - 768px | Compact layout, smaller fonts |
| Small Mobile | 320px - 480px | Minimal padding, simplified layout, non-sticky header |

---

## 🧠 JavaScript Architecture

### Module Overview

```
script.js
│
├── Config           → API key, base URL, units
├── DOM References   → All getElementById selections
├── State Variables  → isCelsius, currentWeatherData
│
├── localStorage     → saveToLocalStorage(), getFromLocalStorage()
├── Theme            → initTheme(), toggleTheme()
├── Date/Time        → updateGreeting(), updateDateTime()
├── UI States        → showLoading(), hideLoading(), showError(), hideError()
│
├── API Functions    → fetchWeather(), fetchWeatherByCoords()
├── Display          → displayWeather(), getWeatherEmoji()
├── Helpers          → convertUnixToTime(), celsiusToFahrenheit()
├── Geolocation      → getUserLocation()
│
├── Event Listeners  → click, keydown, change events
└── Initialization   → initApp() on DOMContentLoaded
```

### Key Design Decisions

| Decision | Reason |
|----------|--------|
| `async/await` over `.then()` | Cleaner, more readable asynchronous code |
| CSS Variables for theming | Single source of truth for all colors |
| `data-theme` attribute | Easy theme switching without class juggling |
| `localStorage` for persistence | Theme, unit, and last city survive page refreshes |
| Emoji fallback for icons | Graceful degradation if API icons fail to load |

---

## 📝 Code Comments

Every single line of code in all 3 files has a **first-person comment** explaining why it was added. This follows the SYNTECXHUB requirement for thorough code documentation.

### Example:
```javascript
// I selected the search button so I can add a click event listener
const searchBtn = document.getElementById('searchBtn');

// I added a click event listener to the search button
searchBtn.addEventListener('click', () => {
    // I called the handleSearch function when the search button is clicked
    handleSearch();
});
```

---

## 🔮 Future Enhancements

- [ ] 📅 **5-Day Forecast** — Show extended weather forecast
- [ ] 🌈 **Dynamic Backgrounds** — Change background based on weather condition
- [ ] 🗺️ **Weather Map** — Interactive map showing weather patterns
- [ ] 📊 **Weather Charts** — Temperature trends using Chart.js
- [ ] 🔔 **Weather Alerts** — Push notifications for severe weather
- [ ] 🌍 **Multi-Language** — Support for Urdu, Arabic, Hindi
- [ ] ⭐ **Favorites** — Save multiple cities for quick access

---

## 🤝 Contributing

This is an internship project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **[SYNTECXHUB](https://syntecxhub.com/)** — For the Web Development Internship opportunity
- **[OpenWeatherMap](https://openweathermap.org/)** — For the free Weather API
- **[Google Fonts](https://fonts.google.com/)** — For the Inter font family

---

<div align="center">

**Built with ❤️ by KaBeeR SooMRo for SYNTECXHUB Web Development Internship**

![Made with Love](https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge)
![Task 4](https://img.shields.io/badge/Task_4-Project_1-6C63FF?style=for-the-badge)

</div>
