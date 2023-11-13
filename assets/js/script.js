// Global Variables
var searchCityBtnEl = $('#search-city-btn');
var clearStorageBtnEl = $('#clear-storage-btn');
var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

$(document).ready(function () {
  // Predefined list of cities and fetching weather data from API for a random city
  var cities = [
    'Toronto', 'Ottawa', 'Barrie', 'Hamilton', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Saskatoon', 'Winnipeg',
    'New York', 'San Francisco', 'San Diego', 'Los Angeles', 'Las Vegas', 'Chicago', 'Boston', 'Austin', 'Orlando', 'Miami',
  ];
  var randomCity = getRandomCity(cities);
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${randomCity}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

  // Function to display weather for a given city
  function displayWeatherForCity(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    // Fetch current weather and forecast data for the given city
    fetchCurrentWeather(currentWeatherUrl, city);
    fetchForecast(forecastUrl);
  }

  // Function to fetch current weather data
  function fetchCurrentWeather(url, city) {
    // Fetch current weather data from the API
    fetchWeatherData(url)
      .then(function (currentWeatherData) {
        console.log(currentWeatherData);
        // Update the UI with the current weather information
        updateCurrentWeatherUI(currentWeatherData);
        // Update the list of searched cities and local storage
        updateSearchedCities(currentWeatherData.name);
      })
      .catch(function (error) {
        console.log(error);
        // Handle errors related to fetching current weather data
        handleWeatherError(error);
      });
  }

  // Function to fetch forecast data
  function fetchForecast(url) {
    // Fetch forecast data from the API
    fetchWeatherData(url)
      .then(function (forecastData) {
        console.log(forecastData);
        // Update the UI with 5-day forecast information
        updateForecastUI(forecastData);
      })
      .catch(function (error) {
        console.log(error);
        // Handle errors related to fetching forecast data
        handleWeatherError(error);
      });
  }

  // Function to fetch weather data from the API
  function fetchWeatherData(url) {
    // Use the Fetch API to retrieve data from the specified URL
    return fetch(url)
      .then(function (response) {
        // Check if the response is successful (status code 200-299)
        if (response.ok) {
          // Parse and return the JSON data from the response
          return response.json();
        } else {
          // If the response is not successful, throw an error with details
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      });
  }

  // Function to update the UI with current weather information
  function updateCurrentWeatherUI(data, addToSearchedCities = true) {
    // Extract relevant data from the API response
    var cityName = data.name;
    var temperature = Math.round(data.main.temp);
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var weatherIcon = data.weather[0].icon;
    var timestamp = data.dt * 1000;
    var date = new Date(timestamp);
    var formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create HTML to display the current weather
    var currentWeatherHtml = `
      <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
      <p>${formattedDate}</p>
      <p>Temp: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    // Update the UI elements with the current weather information
    $('#current-weather').html(currentWeatherHtml);
    $('#city-input').val('');

    // Add the city to the searched cities list and update local storage
    if (addToSearchedCities && !searchedCities.includes(cityName)) {
      searchedCities.push(cityName);
      localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
      // Display the updated list of searched cities
      displaySearchedCities();
    }
  }

  // Function to update the UI with 5-day forecast information
  function updateForecastUI(data) {
    // Clear existing forecast information
    $('#five-day-forecast').empty();
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');

    // Extract relevant forecast data and indices to display
    var forecasts = data.list;
    var indicesToDisplay = [6, 14, 22, 30, 38];

    // Iterate over selected indices and update the UI for each forecast day
    indicesToDisplay.forEach(function (index) {
      var forecast = forecasts[index];
      var temperature = Math.round(forecast.main.temp);
      var humidity = forecast.main.humidity;
      var windSpeed = forecast.wind.speed;
      var weatherIcon = forecast.weather[0].icon;
      var timestamp = forecast.dt * 1000;
      var date = new Date(timestamp);
      var formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Create HTML for the 5-day forecast
      var forecastHtml = `
        <div class="weather-box-small">
          <p>${formattedDate}</p>
          <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
          <p>Temp: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind: ${windSpeed} m/s</p>
        </div>
      `;

      // Update the UI with the 5-day forecast information
      $('#five-day-forecast').append(forecastHtml);
    });
  }

  // Function to update the list of searched cities
  function updateSearchedCities() {
    // Get the container for searched cities list
    var citiesList = $('#searched-cities-list');
    // Clear the existing list
    citiesList.empty();

    // Iterate over searched cities and create links for each
    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      // Add the link to the list container
      citiesList.append(listItem);
    });
  }

  // Function to display searched cities
  function displaySearchedCities() {
    // Get the container for searched cities list
    var citiesList = $('#searched-cities-list');
    // Clear the existing list
    citiesList.empty();

    // Iterate over searched cities and create links for each
    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      // Add the link to the list container
      citiesList.append(listItem);
    });

    // Show or hide the clear storage button based on the number of searched cities
    if (searchedCities.length > 0) {
      $('#clear-storage-btn').show();
    } else {
      $('#clear-storage-btn').hide();
    }
  }

  // Function to clear local storage and reset the searched cities list
  function clearLocalStorage() {
    // Clear local storage
    localStorage.clear();
    // Reset the searched cities array
    searchedCities = [];
    // Display the updated list of searched cities
    displaySearchedCities();
  };

  // Function to get a random city from the list
  function getRandomCity(cityList) {
    // Generate a random index to select a random city from the list
    return cityList[Math.floor(Math.random() * cityList.length)];
  }

  // Function to fetch and display weather for a random city
  function fetchRandomCityWeather(url) {
    // Fetch weather data for a random city
    fetchWeatherData(url)
      .then(function (currentWeatherData) {
        // Update the UI with weather information for the random city
        updateCurrentWeatherUI(currentWeatherData, false);
      })
      .catch(function (error) {
        // Handle errors related to fetching weather for the random city
        handleWeatherError(error);
      });
  }

  // Function to handle errors
  function handleWeatherError(error) {
    console.log(error);
    // Display an error message to the user
    displayErrorMessage(error.message);
  }

  // Function to display an error message
  function displayErrorMessage(message) {
    // Get the error message container and set the text
    $('#error-message').text(message);
  }

  // Function to clear the error message
  function clearErrorMessage() {
    // Clear the error message container
    $('#error-message').empty();
  }

  // Event handler for clicking the search button
  searchCityBtnEl.on('click', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Get the value entered in the city input field
    var city = $('#city-input').val().trim();
    // Check if the input is empty
    if (city === "") {
      // Display an error message if the input is empty
      displayErrorMessage("Please enter a city name");
      return;
    }
    // Display weather information for the entered city
    displayWeatherForCity(city);
  });

  // Event handler for clicking a city on the list
  $(document).on('click', '.searched-city-link', function (event) {
    // Prevent the default link click behavior
    event.preventDefault();
    // Get the text (city name) of the clicked link
    var clickedCity = $(this).text();
    // Display weather information for the clicked city
    displayWeatherForCity(clickedCity);
    // Clear the 5-day forecast and error message
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
    clearErrorMessage();
  });

  // Event handler for clicking the clear button
  clearStorageBtnEl.on('click', function (event) {
    // Prevent the default button click behavior
    event.preventDefault();
    // Clear local storage and reset the searched cities list
    clearLocalStorage();
  });

  // Fetch API data for a predefined "random" city to display when the page is loaded
  fetchRandomCityWeather(apiUrl);
  // Display the searched cities when the page is loaded
  displaySearchedCities();
});