var btnEl = $('#city-name');

$(document).ready(function() {
  btnEl.on('click', function(event) {
    event.preventDefault();
    var city = $('#city-input');
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.val()}&appid=f6b141e534d676de278407d71aeb88e4`;
    var cityName = fetch(apiUrl).then(function(response) {
      if (response.ok)
      console.log(response);
    return response.json();
    }).then(function(data){
      console.log(data)
    })
  });
});