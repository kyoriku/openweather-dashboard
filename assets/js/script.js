var searchCityBtnEl = $('#search-city-btn');
var clearStorageBtnEl = $('#clear-storage-btn'); 
var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

$(document).ready(function () {

  // Event handler for the search button click
  searchCityBtnEl.on('click', function (event) {
    event.preventDefault();
    var city = $('#city-input').val().trim();
    if (city === "") {
      displayErrorMessage("Please enter a city name");
      return;
    }
    displayWeatherForCity(city);
  });

  // Function to display weather for a given city
  function displayWeatherForCity(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    fetchCurrentWeather(currentWeatherUrl, city);
    fetchForecast(forecastUrl);
  }

  // Function to fetch current weather data
  function fetchCurrentWeather(url) {
    fetchWeatherData(url)
      .then(function (currentWeatherData) {
        console.log(currentWeatherData)
        updateCurrentWeatherUI(currentWeatherData);
        updateSearchedCities(currentWeatherData.name);
      })
      .catch(function (error) {
        console.log(error)
        handleWeatherError(error);
      });
  }

  // Function to fetch forecast data
  function fetchForecast(url) {
    fetchWeatherData(url)
      .then(function (forecastData) {
        console.log(forecastData)
        updateForecastUI(forecastData);
      })
      .catch(function (error) {
        console.log(error)
        handleWeatherError(error);
      });
  }

  // Function to fetch weather data from the API
  function fetchWeatherData(url) {
    return fetch(url)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      });
  }

  // Function to update the UI with current weather information
  function updateCurrentWeatherUI(data, addToSearchedCities = true) {
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
    $('#current-weather').html(currentWeatherHtml);
    $('#city-input').val('');

    // Add the city to the searched cities list and update local storage
    if (addToSearchedCities && !searchedCities.includes(cityName)) {
      searchedCities.push(cityName);
      localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
      displaySearchedCities();
    }
  }

  // Function to update the UI with 5-day forecast information
  function updateForecastUI(data) {
    $('#five-day-forecast').empty();
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
    var forecasts = data.list;
    var indicesToDisplay = [6, 14, 22, 30, 38];
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
      $('#five-day-forecast').append(forecastHtml);
    });
  }

  // Function to update the list of searched cities
  function updateSearchedCities() {
    var citiesList = $('#searched-cities-list');
    citiesList.empty();

    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      citiesList.append(listItem);
    });
  }

  // Function to display searched cities
  function displaySearchedCities() {
    var citiesList = $('#searched-cities-list');
    citiesList.empty();

    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      citiesList.append(listItem);
    });

    // Show or hide the clear storage button based on the number of searched cities
    if (searchedCities.length > 0) {
      $('#clear-storage-btn').show();
    } else {
      $('#clear-storage-btn').hide();
    }
  }

  // Event handler for clicking on a searched city link
  $(document).on('click', '.searched-city-link', function (event) {
    event.preventDefault();
    var clickedCity = $(this).text();
    displayWeatherForCity(clickedCity);
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
    clearErrorMessage();
  });

  // Function to clear local storage and reset the searched cities list
  function clearLocalStorage() {
    localStorage.clear();
    searchedCities = [];
    displaySearchedCities();
  };

  // Event handler for clicking on the clear storage button
  clearStorageBtnEl.on('click', function (event) {
    event.preventDefault();
    clearLocalStorage();
  });

  // Predefined list of cities and fetching weather for a random city
  var cities = [
    'Toronto', 'Ottawa', 'Barrie','Hamilton', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Saskatoon', 'Winnipeg', 
    'New York', 'San Francisco', 'San Diego', 'Los Angeles', 'Las Vegas', 'Chicago', 'Boston', 'Austin', 'Orlando', 'Miami',
  ];

  var randomCity = getRandomCity(cities);
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${randomCity}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

  fetchRandomCityWeather(apiUrl);

  // Function to get a random city from the list
  function getRandomCity(cityList) {
    return cityList[Math.floor(Math.random() * cityList.length)];
  }

  // Function to fetch and display weather for a random city
  function fetchRandomCityWeather(url) {
    fetchWeatherData(url)
      .then(function (currentWeatherData) {
        updateCurrentWeatherUI(currentWeatherData, false);
      })
      .catch(function (error) {
        handleWeatherError(error);
      });
  }

  // Function to handle errors
  function handleWeatherError(error) {
    console.log(error);
    displayErrorMessage(error.message);
  }

  // Function to display an error message
  function displayErrorMessage(message) {
    $('#error-message').text(message);
  }

  // Function to clear the error message
  function clearErrorMessage() {
    $('#error-message').empty();
  }

  // Display the searched cities when the page is loaded
  displaySearchedCities();
});