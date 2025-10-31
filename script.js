const API_KEY = "331e8e1033c9a5ed77d4105a9ae89494";

// Function to get full country name
const getCountryName = async (countryCode) => {
    const countryUrl = `https://restcountries.com/v3.1/alpha/${countryCode}`;
    const response = await fetch(countryUrl);
    const countryData = await response.json();
    return countryData[0].name.common;  // Full country name
};

const getWeatherData = async (city) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    if (data.cod === 200) {
        return data;
    } else {
        alert("City not found or error fetching data.");
        return null;
    }
};

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);  // Convert to milliseconds
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    // 12-hour format with AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return { date: formattedDate, time: formattedTime };
};

const displayWeather = async (event) => {
    event.preventDefault();

    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const weatherData = await getWeatherData(city);
    if (weatherData) {
        const cityName = weatherData.name;
        const countryCode = weatherData.sys.country; // Country code fetched from API
        const temperature = weatherData.main.temp.toFixed(1);
        const minTemp = weatherData.main.temp_min.toFixed(1);
        const maxTemp = weatherData.main.temp_max.toFixed(1);
        const realFeel = weatherData.main.feels_like.toFixed(1);
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        const pressure = weatherData.main.pressure;
        const condition = weatherData.weather[0].description;
        const timestamp = weatherData.dt; // Current weather timestamp

        // Get full country name
        const countryName = await getCountryName(countryCode);

        // Get formatted date and time
        const { date, time } = formatDateTime(timestamp);

        // Update the DOM with the weather data and current time
        document.getElementById("location").textContent = `${cityName}, ${countryName}`;
        document.getElementById("weather-condition").textContent = condition;
        document.getElementById("temperature").textContent = `${temperature}°C`;
        document.getElementById("min-max").textContent = `Min: ${minTemp}° Max: ${maxTemp}°`;
        document.getElementById("real-feel").textContent = `${realFeel}°`;
        document.getElementById("humidity").textContent = `${humidity}%`;
        document.getElementById("wind").textContent = `${windSpeed} m/s`;
        document.getElementById("pressure").textContent = `${pressure} hPa`;

        // Display the current date and time
        document.getElementById("date-time").textContent = `${date}, ${time}`;

        // Clear the input field and focus on it for the next search
        document.getElementById("city").value = "";
        document.getElementById("city").focus();
    }
};

// Add event listener for form submission
document.getElementById("form").addEventListener("submit", displayWeather);
