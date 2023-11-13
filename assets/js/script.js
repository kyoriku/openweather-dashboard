var searchCityBtnEl = $('#search-city-btn');
var clearStorageBtnEl = $('#clear-storage-btn'); 
var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

$(document).ready(function () {
  searchCityBtnEl.on('click', function (event) {
    event.preventDefault();
    var city = $('#city-input').val().trim();
    if (city === "") {
      displayErrorMessage("Please enter a city name");
      return;
    }
    displayWeatherForCity(city);
  });

  function displayWeatherForCity(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    fetchCurrentWeather(currentWeatherUrl, city);
    fetchForecast(forecastUrl);
  }

  function fetchCurrentWeather(url) {
    fetchWeatherData(url)
      .then(function (currentWeatherData) {
        updateCurrentWeatherUI(currentWeatherData);
        updateSearchedCities(currentWeatherData.name);
      })
      .catch(function (error) {
        handleWeatherError(error);
      });
  }

  function fetchForecast(url) {
    fetchWeatherData(url)
      .then(function (forecastData) {
        updateForecastUI(forecastData);
      })
      .catch(function (error) {
        handleWeatherError(error);
      });
  }

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

    var currentWeatherHtml = `
      <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
      <p>${formattedDate}</p>
      <p>Temp: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;
    $('#current-weather').html(currentWeatherHtml);
    $('#city-input').val('');

    if (addToSearchedCities && !searchedCities.includes(cityName)) {
      searchedCities.push(cityName);
      localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
      displaySearchedCities();
    }
  }

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

  function updateSearchedCities() {
    var citiesList = $('#searched-cities-list');
    citiesList.empty();

    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      citiesList.append(listItem);
    });
  }

  function handleWeatherError(error) {
    console.log(error);
    displayErrorMessage(error.message);
  }

  function displaySearchedCities() {
    var citiesList = $('#searched-cities-list');
    citiesList.empty();

    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      citiesList.append(listItem);
    });

    if (searchedCities.length > 0) {
      $('#clear-storage-btn').show();
    } else {
      $('#clear-storage-btn').hide();
    }
  }

  function clearLocalStorage() {
    localStorage.clear();
    searchedCities = [];
    displaySearchedCities();
  };

  clearStorageBtnEl.on('click', function (event) {
    event.preventDefault();
    clearLocalStorage();
  });

  $(document).on('click', '.searched-city-link', function (event) {
    event.preventDefault();
    var clickedCity = $(this).text();
    displayWeatherForCity(clickedCity);
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
    clearErrorMessage();
  });

  var cities = [
    'Toronto', 'Ottawa', 'Barrie','Hamilton', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Saskatoon', 'Winnipeg', 
    'New York', 'San Francisco', 'San Diego', 'Los Angeles', 'Las Vegas', 'Chicago', 'Boston', 'Austin', 'Orlando', 'Miami',
  ];

  var randomCity = getRandomCity(cities);
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${randomCity}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

  fetchRandomCityWeather(apiUrl);

  function getRandomCity(cityList) {
    return cityList[Math.floor(Math.random() * cityList.length)];
  }

  function fetchRandomCityWeather(url) {
    fetchWeatherData(url)
      .then(function (currentWeatherData) {
        updateCurrentWeatherUI(currentWeatherData, false);
      })
      .catch(function (error) {
        handleWeatherError(error);
      });
  }

  function displayErrorMessage(message) {
    $('#error-message').text(message);
  }

  function clearErrorMessage() {
    $('#error-message').empty();
  }

  displaySearchedCities();
});