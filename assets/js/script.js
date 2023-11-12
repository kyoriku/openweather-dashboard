$(document).ready(function () {

  // Select the button element with the ID 'city-name'
  var btnEl = $('#city-name');

  // Attach a click event handler to the button
  btnEl.on('click', function (event) {
    event.preventDefault();

    // Get the city input value and trim any leading or trailing spaces
    var city = $('#city-input').val().trim();

    // Check if the input is empty, and display an error message if so
    if (city === "") {
      displayErrorMessage("Please enter a city name");
      return;
    }

    // Display the weather for the entered city
    displayWeatherForCity(city);
  });

  // Function to display weather and forecast for a specific city
  function displayWeatherForCity(city) {
    // URLs for current weather and 5-day forecast using OpenWeatherMap API
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f6b141e534d676de278407d71aeb88e4`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=f6b141e534d676de278407d71aeb88e4`;

    // Fetch the current weather data
    fetch(currentWeatherUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(function (currentWeatherData) {
        // Extract relevant data from the response
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

        // Create HTML for displaying the current weather
        var currentWeatherHtml = `
          <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
          <p>${formattedDate}</p>
          <p>Temp: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        `;
        // Update the HTML of the element with ID 'current-weather'
        $('#current-weather').html(currentWeatherHtml);
        // Clear the city input field
        $('#city-input').val('');

        // Update the list of searched cities and display them
        if (!searchedCities.includes(currentWeatherData.name)) {
          searchedCities.push(currentWeatherData.name);
          localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
          displaySearchedCities();
        }
      })
      .catch(function (error) {
        console.log(error);
        displayErrorMessage(error.message);
      });

    // Fetch the 5-day forecast data
    fetch(forecastUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(function (forecastData) {
        // Clear previous forecast data
        $('#five-day-forecast').empty();
        $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
        clearErrorMessage()

        // Extract and display 5-day forecast data 
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

          // Create HTML for displaying the 5-day forecast
          var forecastHtml = `
            <div class="weather-box-small">
              <p>${formattedDate}</p>
              <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
              <p>Temp: ${temperature}°C</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind: ${windSpeed} m/s</p>
            </div>
          `;
          // Update the HTML of the element with ID 'five-day-forecast'
          $('#five-day-forecast').append(forecastHtml);
        });
      })
      .catch(function (error) {
        console.log(error);
        displayErrorMessage(error.message);
      });
  }

  // Retrieve searched cities from local storage or initialize an empty array
  var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

  // Function to display the list of searched cities
  function displaySearchedCities() {
    var citiesList = $('#searched-cities-list');
    citiesList.empty();

    searchedCities.forEach(function (city) {
      // Create a link for each searched city
      var link = $('<a>').text(city).attr('href', '#').addClass('searched-city-link');
      var listItem = $('<li>').append(link);
      citiesList.append(listItem);
    });

    // Check if there are cities in the searchedCities array
    if (searchedCities.length > 0) {
      // If there are cities, show the clear storage button
      $('#clear-storage-btn').show();
    } else {
      // If there are no cities, hide the clear storage button
      $('#clear-storage-btn').hide();
    }
  }

  // Attach a click event handler to the clear storage button
  $('#clear-storage-btn').on('click', function (event) {
    event.preventDefault();

    // Clear local storage
    localStorage.clear();
    // Clear the searchedCities array
    searchedCities = [];
    // Update the display of searched cities
    displaySearchedCities();
  });

  // Display the list of searched cities
  displaySearchedCities();

  // Event handler for clicking on a searched city link
  $(document).on('click', '.searched-city-link', function (event) {
    event.preventDefault();
    // Display weather for the clicked searched city
    var clickedCity = $(this).text();
    displayWeatherForCity(clickedCity);
    // Clear previous 5-day forecast and error message
    $('.day-forecast').empty().append('<h4>5-Day Forecast:</h4>');
    clearErrorMessage();
  });

  // Display the current weather of a random predefined city
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
      // Extract relevant data from the response
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

      // Create HTML for displaying the current weather of the random city
      var html = `
        <h2>${cityName}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"></h2>
        <p>${formattedDate}</p>
        <p>Temp: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
      // Update the HTML of the element with ID 'current-weather'
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