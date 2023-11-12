$(document).ready(function () {

  var btnEl = $('#city-name');

  // <----- Current weather -----> //
  btnEl.on('click', function (event) {
    event.preventDefault();

    var city = $('#city-input').val().trim();

    if (city === "") {
      displayErrorMessage("Please enter a city name");
      return;
    }

    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

    fetch(currentWeatherUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        } else {
          throw new Error("Error fetching data. Please try again.");
        }
        return response.json();
      })
      .then(function (currentWeatherData) {
        console.log(currentWeatherData)
        var cityName = currentWeatherData.name;
        var temperature = Math.round(currentWeatherData.main.temp);
        var humidity = currentWeatherData.main.humidity;
        var windSpeed = currentWeatherData.wind.speed;
        var weatherIcon = currentWeatherData.weather[0].icon;
        var timestamp = currentWeatherData.dt * 1000;
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

        if (!searchedCities.includes(currentWeatherData.name)) {
          searchedCities.push(currentWeatherData.name);
          localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
          displaySearchedCities();
        }
      })
      .catch(function (error) {
        console.error(error);
        displayErrorMessage(error.message);
      });

    // <----- Five day forecast -----> //
    var fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    fetch(fiveDayForecastUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
      } else {
        throw new Error("Error fetching data. Please try again.");
      }
      return response.json();
    })
    .then(function (forecastData) {
      console.log(forecastData)
      $('#five-day-forecast').empty();
      $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
      var forecasts = forecastData.list;
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
    })
    .catch(function (error) {
      console.log(error);
    });
  });

  // <----- List of searched cities -----> //
  var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

  displaySearchedCities();

  function displaySearchedCities() {
    var citiesList = $('#searched-cities-list');
    citiesList.empty();

    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      citiesList.append(listItem);
    });
  }

  $(document).on('click', '.searched-city-link', function (event) {
    event.preventDefault();
    var clickedCity = $(this).text();
    displayWeatherForCity(clickedCity);
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
    clearErrorMessage();
  });

  // Function to display the weather for a specific city
  function displayWeatherForCity(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    fetch(currentWeatherUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        } else {
          throw new Error("Error fetching data. Please try again.");
        }
        return response.json();
      })
      .then(function (currentWeatherData) {
        var cityName = currentWeatherData.name;
        var temperature = Math.round(currentWeatherData.main.temp);
        var humidity = currentWeatherData.main.humidity;
        var windSpeed = currentWeatherData.wind.speed;
        var weatherIcon = currentWeatherData.weather[0].icon;
        var timestamp = currentWeatherData.dt * 1000;
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
      })
      .catch(function (error) {
        console.log(error);
      });

    fetch(forecastUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        } else {
          throw new Error("Error fetching data. Please try again.");
        }
        return response.json();
      })
      .then(function (forecastData) {
        $('#five-day-forecast').empty();
        $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
        var forecasts = forecastData.list;
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
      })
      .catch(function (error) {
        console.log(error);
      });
  }

   // <----- Current weather of random predefined city -----> //
   var cities = [
    'Toronto', 'Ottawa', 'Barrie', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Victoria', 'Saskatoon', 'Winnipeg',
    'New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'London', 'Paris', 'Berlin', 'Tokyo', 'Hong Kong',
  ];

  var randomCity = cities[Math.floor(Math.random() * cities.length)];
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?&q=${randomCity}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

  var randomCityWeather = fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
      } else {
        throw new Error("Error fetching data. Please try again.");
      }
      return response.json();
    })
    .then(function (data) {
      var cityName = data.city.name;
      var temperature = Math.round(data.list[0].main.temp);
      var humidity = data.list[0].main.humidity;
      var windSpeed = data.list[0].wind.speed;
      var weatherIcon = data.list[0].weather[0].icon;
      var timestamp = data.list[0].dt * 1000;
      var date = new Date(timestamp);
      var formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      var html = `
        <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
        <p>${formattedDate}</p>
        <p>Temp: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
      $('#current-weather').html(html);
    })
    .catch(function (error) {
      console.log(error);
    });

  // Function to display error message
  function displayErrorMessage(message) {
    $('#error-message').text(message);
  }

  // Function to clear error message
  function clearErrorMessage() {
    $('#error-message').empty();
  }
});