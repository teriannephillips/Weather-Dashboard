var formEl = document.querySelector('form');
var formSubmit = function (event) {
    event.preventDefault();
    var cityNameEl = document.getElementById('city');
    var cityName = cityNameEl.value.trim();
    if (cityName) {
        getLatLong(cityName);
        cityNameEl.textContent = '';
    } else {
        alert('Please enter a city name');
    }
}
var getLatLong = function (cityName) {
    console.log("success");
    requestGeoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + ',CA&appid=ee49752bfcbda8b1754a678bc148b71a';
   
    fetch(requestGeoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log(lat);
            console.log(lon);
            getCityData (lat,lon);
            
        });
var getCityData = function (lat, lon)   {
    requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=ee49752bfcbda8b1754a678bc148b71a';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}
}
formEl.addEventListener('submit', formSubmit);
