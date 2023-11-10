$(document).ready(function () {

  // --- Current weather --- //
  var btnEl = $('#city-name');

  btnEl.on('click', function (event) {
    event.preventDefault();
    var city = $('#city-input');
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.val()}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

    var cityName = fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var cityName = data.city.name;
        var temperature = data.list[0].main.temp;
        temperature = Math.round(temperature);
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
          <p>Wind Speed: ${windSpeed} m/s</p>
          <p>Humidity: ${humidity}%</p>
        `;
        $('#current-weather').html(html);
        $('#city-input').val('');

        if (!searchedCities.includes(data.city.name)) {
          searchedCities.push(data.city.name);
          localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
          displaySearchedCities();
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  });

  // --- Five day forecast --- //
  var btnEl = $('#city-name');

  btnEl.on('click', function (event) {
    event.preventDefault();
    var city = $('#city-input');
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.val()}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    var fiveDayForecast = fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        $('#five-day-forecast').empty();
        var forecasts = data.list;
        var indicesToDisplay = [7, 15, 23, 31, 39];
        indicesToDisplay.forEach(function (index) {
          var forecast = forecasts[index];
          var cityName = data.city.name;
          var temperature = forecast.main.temp;
          temperature = Math.round(temperature);
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

          var html = `
            <div class="weather-box-small">
              <p>${formattedDate}</p>
              <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
              <p>Temp: ${temperature}°C</p>
              <p>Wind: ${windSpeed} m/s</p>
              <p>Humidity: ${humidity}%</p>
            </div>
          `;
          $('#five-day-forecast').append(html);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  });

  // --- Current weather of random city --- //
  var cities = [
    'Toronto', 'Ottawa', 'Barrie', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Victoria', 'Saskatoon', 'Winnipeg',
    'New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'London', 'Paris', 'Berlin', 'Tokyo', 'Hong Kong',
  ];

  var randomCity = cities[Math.floor(Math.random() * cities.length)];
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?&q=${randomCity}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

  var randomCityName = fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var cityName = data.city.name;
      var timestamp = data.list[0].dt * 1000;
      var date = new Date(timestamp);
      var formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      var temperature = data.list[0].main.temp;
      temperature = Math.round(temperature);
      var humidity = data.list[0].main.humidity;
      var windSpeed = data.list[0].wind.speed;
      var weatherIcon = data.list[0].weather[0].icon;

      var html = `
        <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
        <p>${formattedDate}</p>
        <p>Temp: ${temperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
      `;
      $('#current-weather').html(html);
    })
    .catch(function (error) {
      console.error(error);
    });

  // --- List of searched cities --- //
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
  });

  function displayWeatherForCity(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;
  
    fetch(currentWeatherUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('City not found');
        }
      })
      .then(function (currentWeatherData) {
        var cityName = currentWeatherData.name;
        var temperature = currentWeatherData.main.temp;
        temperature = Math.round(temperature);
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
          <p>Wind Speed: ${windSpeed} m/s</p>
          <p>Humidity: ${humidity}%</p>
        `;
        $('#current-weather').html(currentWeatherHtml);
      })
      .catch(function (error) {
        console.error(error);
      });
  
    fetch(forecastUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Forecast data not available');
        }
      })
      .then(function (forecastData) {
        $('#five-day-forecast').empty();
        var forecasts = forecastData.list;
        var indicesToDisplay = [7, 15, 23, 31, 39];
        indicesToDisplay.forEach(function (index) {
          var forecast = forecasts[index];
          var temperature = forecast.main.temp;
          temperature = Math.round(temperature);
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
              <p>Wind: ${windSpeed} m/s</p>
              <p>Humidity: ${humidity}%</p>
            </div>
          `;
          $('#five-day-forecast').append(forecastHtml);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});