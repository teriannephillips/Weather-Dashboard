
var formEl = document.querySelector('form');
var formSubmit = function (event) {
    event.preventDefault();
    var cityNameEl = document.getElementById('city');
    var countryNameEl = document.getElementById('country');
    var cityName = cityNameEl.value.trim();
    var countryName = countryNameEl.value.trim();
    if (!countryName) {
        if (cityName) {
            getLatLong(cityName);
            // TODO: fix line below
            city.textContent = "";
        } 
        else {
            alert('Please enter a city name');
        }
    }
    else { 
        var data;
        fetch('./assets/script/countrycodes.json')
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        getAlpha2(data, countryName);
                    });
                } else {
                    alert('Error: ' + response.statusText);
                }
            });
        var getAlpha2 = function (data, countryName) {
            console.log(countryName);
            for (var i = 0; i < data.length; i++) {
                if (countryName == data[i].name) {
                    console.log(data[i].iso_3166.alpha2);
                    var alpha2 = data[i].iso_3166.alpha2;
                }
            }
        }
    }
}
    var getLatLong = function (cityName) {
        requestGeoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + ',&appid=ee49752bfcbda8b1754a678bc148b71a';
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
                getCurrentCityData(lat, lon);
            });
        var getCurrentCityData = function (lat, lon) {
            requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=ee49752bfcbda8b1754a678bc148b71a';
            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0');
                    var yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;
                    document.getElementById("current-city").innerHTML = cityName + " " + today;
                    document.getElementById("current-temp").innerHTML = "Temperature " + data.main.temp + " C";
                    document.getElementById("current-wind").innerHTML = "Wind  " + data.wind.speed + " m/s";
                    document.getElementById("current-humidity").innerHTML = "Humidity  " + data.main.humidity + " %";
                    console.log(data.main.humidity);
                });
        }
}
    formEl.addEventListener('submit', formSubmit);
    //requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=ee49752bfcbda8b1754a678bc148b71a';