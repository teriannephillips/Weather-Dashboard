//hides the 5 day forecast "cards" for later use
var forecastVar;
for (var i = 0; i < 5; i++) {
    forecastVar = "forecast-" + i;
    columnHide = document.getElementById(forecastVar);
    columnHide.setAttribute("style", "background-color: rgb(67, 1, 67)");
}
recentSearchDisplay();
recentSearchButtonClicked();
// pulls the user data from cityname and optional country name and runs the function to get the data from the api
var formEl = document.querySelector('form');
var formSubmit = function (event) {
    event.preventDefault();
    var cityNameEl = document.getElementById('city');
    var countryNameEl = document.getElementById('country');
    var cityName = cityNameEl.value.trim();
    var countryName = countryNameEl.value.trim();
    if (!countryName) {
        if (cityName) {
            getLatLong(cityName, countryName);
            cityNameEl.value = "";
        }
        else {
            alert('Please enter a city name');
        }
    }
    else {
        cityNameEl.value = "";
        countryNameEl.value = "";
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
            // console.log(countryName);
            var countryValid = false;
            for (var i = 0; i < data.length; i++) {
                if (countryName == data[i].name) {
                    var alpha2 = data[i].iso_3166.alpha2;
                    countryValid = true;
                    getLatLong(cityName, alpha2);
                }
            }
            if (!countryValid) {
                alert('Please enter a valid country name');
            }
        }
    }
}
var getLatLong = function (cityName, countryName) {
    requestGeoUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + ',' + countryName + '&appid=ee49752bfcbda8b1754a678bc148b71a';
    fetch(requestGeoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length == 0) {
                alert('Please enter a valid city name');
            }
            else {
                var lat = data[0].lat;
                var lon = data[0].lon;
                var dataCity = data[0].name;
                var dataCountry = data[0].country;
                getCurrentCityData(lat, lon, dataCity, dataCountry);
                getForecastData(lat, lon);
                recentSearches(dataCity, dataCountry);


            }
        });
}
var getCurrentCityData = function (lat, lon, dataCity, dataCountry) {
    requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=ee49752bfcbda8b1754a678bc148b71a';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            var icon = data.weather[0].icon;
            document.getElementById("current-city").innerHTML = dataCity + " " + dataCountry + " " + today;
            document.getElementById("current-icon").src = "https://openweathermap.org/img/w/" + icon + ".png";
            document.getElementById("current-temp").innerHTML = "Temperature " + data.main.temp + " C";
            document.getElementById("current-wind").innerHTML = "Wind  " + data.wind.speed + " m/s";
            document.getElementById("current-humidity").innerHTML = "Humidity  " + data.main.humidity + " %";

        });
}
formEl.addEventListener('submit', formSubmit);



// get 5 day weather data 
var getForecastData = function (lat, lon) {
    requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid=ee49752bfcbda8b1754a678bc148b71a';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            extractForecastData(data);
        });
}
//shows the 5 days weather data elements
var extractForecastData = function (data) {
    var forecastVar;
    for (var i = 0; i < 5; i++) {
        forecastVar = "forecast-" + i;
        columnShow = document.getElementById(forecastVar);
        columnShow.setAttribute("style", "backgroundcolor:white");
    }
    var forecast = document.getElementById("ForecastTitle");
    forecast.innerHTML = "5 day Forecast";
    newIndex = 0;
    for (var i = 0; i < data.list.length; i++) {
        var dt = data.list[i].dt_txt;
        var time = dt.split(' ')[1];
        var date = dt.split(' ')[0];
        //since 5 day weather data gives information in 3 hour increments was advised by TA to pick one time for each day and display that info only
        if (time == "09:00:00") {
            var dateCode = "date-" + newIndex;
            var iconCode = "icon-" + newIndex;
            var tempCode = "temp-" + newIndex;
            var windCode = "wind-" + newIndex;
            var humidityCode = "humidity-" + newIndex;
            var icon = data.list[i].weather[0].icon;
            newIndex++;
            var dateEl = document.getElementById(dateCode);
            var iconEl = document.getElementById(iconCode);
            var tempEl = document.getElementById(tempCode);
            var windEl = document.getElementById(windCode);
            var humidityEl = document.getElementById(humidityCode);
            dateEl.innerHTML = date;
            iconEl.src = "https://openweathermap.org/img/w/" + icon + ".png";
            tempEl.innerHTML = "Temp: " + data.list[i].main.temp + " C";
            windEl.innerHTML = "Wind: " + data.list[i].wind.speed + " m/s";
            humidityEl.innerHTML = "Humidity: " + data.list[i].main.humidity + " %"
        }
    }
}
//function that creates the recent searches and saves to local storage
function recentSearches(dataCity, dataCountry) { 
    var recentSearch = JSON.parse(localStorage.getItem('recentSearch')) || [];
    var arrayCheck = true;
    for (var i = 0; i < recentSearch.length; i++) {
        if (recentSearch[i].city == dataCity && recentSearch[i].country == dataCountry) {
            arrayCheck = false;
        }
    }
    if (arrayCheck) {
        recentSearch.push({ city: dataCity, country: dataCountry });
        localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
        var recentSearchesEl = document.getElementById("recent-searches")
        var recentEl = document.createElement('button');
        recentEl.className = "button";
        recentEl.innerHTML = dataCity + ", " + dataCountry;
        recentSearchesEl.appendChild(recentEl);
    }
}
// function to display the recent searches
function recentSearchDisplay() {
    var recentSearch = JSON.parse(localStorage.getItem('recentSearch')) || [];
    var recentSearchesEl = document.getElementById("recent-searches")
    for (let i = 0; i < recentSearch.length; i++) {
        var recentEl = document.createElement('button');
        recentEl.innerHTML = recentSearch[i].city + ", " + recentSearch[i].country;
        recentEl.className = "button"
        recentSearchesEl.appendChild(recentEl);
    }
}
//function to pull up data from a previous search
function recentSearchButtonClicked() {
    document.addEventListener("click", function (event) {
        if (event.target.matches("button")) {
            dataString = event.target.innerHTML;
            var city = dataString.split(', ')[0];
            var country = dataString.split(', ')[1];
            getLatLong(city, country);
        }
    });
}