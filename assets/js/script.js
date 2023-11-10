$(document).ready(function () {

  // --- Current weather --- //
  var btnEl = $('#city-name');

  btnEl.on('click', function (event) {
    event.preventDefault();

    // Get the value from the input field with id 'city-input'
    var city = $('#city-input').val().trim(); // Trim to remove leading and trailing spaces

    // Check if the input is empty
    if (city === "") {
      displayErrorMessage("Please enter a city name");
      return;
    }

    // Construct the API URL for current weather using OpenWeatherMap API
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

    // Fetch data from the API
    var cityName = fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        } else {
          displayErrorMessage("Error fetching data from the server");
          throw new Error("Server response not OK");
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        clearErrorMessage();
        // Extract relevant information from the API response
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

        // Create HTML content with the extracted information
        var html = `
          <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
          <p>${formattedDate}</p>
          <p>Temp: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        `;
        // Update the HTML content of an element with id 'current-weather'
        $('#current-weather').html(html);
        // Clear the input field
        $('#city-input').val('');

        // Update the list of searched cities and display them
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
  // Event handler for the same button ('#city-name') as above
  btnEl.on('click', function (event) {
    event.preventDefault();
    // Get the value from the input field with id 'city-input'
    var city = $('#city-input').val().trim(); // Trim to remove leading and trailing spaces

    if (city === "") {
      displayErrorMessage("Please enter a city name");
      return;
    }

    // Construct the API URL for the five-day forecast using OpenWeatherMap API
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    // Fetch data from the API
    var fiveDayForecast = fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        clearErrorMessage();
        // Clear the existing content in the element with id 'five-day-forecast'
        $('#five-day-forecast').empty();
        $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
        // Extract relevant information for each day from the API response
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

          // Create HTML content for each day's forecast
          var html = `
            <div class="weather-box-small">
              <p>${formattedDate}</p>
              <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
              <p>Temp: ${temperature}°C</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind: ${windSpeed} m/s</p>
            </div>
          `;
          // Append the HTML content to the element with id 'five-day-forecast'
          $('#five-day-forecast').append(html);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  });

  // --- Current weather of random city --- //
  // List of predefined cities
  var cities = [
    'Toronto', 'Ottawa', 'Barrie', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Victoria', 'Saskatoon', 'Winnipeg',
    'New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'London', 'Paris', 'Berlin', 'Tokyo', 'Hong Kong',
  ];

  // Randomly select a city from the predefined list
  var randomCity = cities[Math.floor(Math.random() * cities.length)];
  // Construct the API URL for the current weather of the randomly selected city
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?&q=${randomCity}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;

  // Fetch data from the API
  var randomCityName = fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // Extract relevant information from the API response
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

      // Create HTML content with the extracted information
      var html = `
        <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
        <p>${formattedDate}</p>
        <p>Temp: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
      // Update the HTML content of an element with id 'current-weather'
      $('#current-weather').html(html);
    })
    .catch(function (error) {
      console.error(error);
    });

  // --- List of searched cities --- //
  // Retrieve the list of searched cities from local storage, or use an empty array if it doesn't exist
  var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

  // Call the function to display the searched cities
  displaySearchedCities();

  // Function to display the searched cities
  function displaySearchedCities() {
    var citiesList = $('#searched-cities-list');
    citiesList.empty();

    // Loop through the searched cities and create links for each
    searchedCities.forEach(function (city) {
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      citiesList.append(listItem);
    });
  }

  // Event handler for clicking on a searched city link
  $(document).on('click', '.searched-city-link', function (event) {
    event.preventDefault();
    // Get the text of the clicked city link
    var clickedCity = $(this).text();
    // Display the weather for the clicked city
    displayWeatherForCity(clickedCity);
    // Clear the existing content in the element with class 'day-forecast'
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
  });

  // Function to display the weather for a specific city
  function displayWeatherForCity(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    // Fetch and display the current weather for the specified city
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

        // Create HTML content for the current weather
        var currentWeatherHtml = `
          <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
          <p>${formattedDate}</p>
          <p>Temp: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        `;
        // Update the HTML content of an element with id 'current-weather'
        $('#current-weather').html(currentWeatherHtml);
      })
      .catch(function (error) {
        console.error(error);
      });

    // Fetch and display the five-day forecast for the specified city
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

          // Create HTML content for each day's forecast
          var forecastHtml = `
            <div class="weather-box-small">
              <p>${formattedDate}</p>
              <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
              <p>Temp: ${temperature}°C</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind: ${windSpeed} m/s</p>
            </div>
          `;
          // Append the HTML content to the element with id 'five-day-forecast'
          $('#five-day-forecast').append(forecastHtml);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // Function to display error message
  function displayErrorMessage(message) {
    $('#error-message').text(message);
  }

  // Function to clear error message
  function clearErrorMessage() {
    $('#error-message').empty();
  }
});