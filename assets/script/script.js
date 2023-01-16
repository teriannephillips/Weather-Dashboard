//hides the 5 day forecast "cards" for later use
var forecastVar;
for (var i = 0; i < 5; i++) {
    forecastVar = "forecast-" + i;
    columnHide = document.getElementById(forecastVar);
    columnHide.setAttribute("style", "background-color: rgb(67, 1, 67)");
}
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
            // TODO: fix line below
            city.textContent = "";
        }
        else {
            alert('Please enter a city name');
        }
    }
    else {
        // TODO: fix line below
        country.textContent = "";
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
    requestGeoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + ',' + countryName + '&appid=ee49752bfcbda8b1754a678bc148b71a';
    fetch(requestGeoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            if (data.length == 0) {
                alert('Please enter a valid city name');
            }
            else {
                var lat = data[0].lat;
                var lon = data[0].lon;
                var dataCity = data[0].name;
                var dataCountry = data[0].country;
                //  console.log(lat);
                //  console.log(lon);
                //  console.log(dataCity);
                //  console.log(dataCountry);
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
            // console.log(data);
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            document.getElementById("current-city").innerHTML = dataCity + " " + dataCountry + " " + today;
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
            var tempCode = "temp-" + newIndex;
            var windCode = "wind-" + newIndex;
            var humidityCode = "humidity-" + newIndex;
            //  console.log(data);
            //   console.log(data.list[i].main.temp)
            newIndex++;
            var dateEl = document.getElementById(dateCode);
            var tempEl = document.getElementById(tempCode);
            var windEl = document.getElementById(windCode);
            var humidityEl = document.getElementById(humidityCode);
            dateEl.innerHTML = date;
            tempEl.innerHTML = "Temp: " + data.list[i].main.temp + " C";
            windEl.innerHTML = "Wind: " + data.list[i].wind.speed + " m/s";
            humidityEl.innerHTML = "Humidity: " + data.list[i].main.humidity + " %"
        }
    }
}
function recentSearches(dataCity, dataCountry) {
    //TODO: local storage of recent searches and display them on the screen  
    var recentSearch = JSON.parse(localStorage.getItem('recentSearch')) || [];
    var arrayCheck = true;
    for (var i = 0; i < recentSearch.length; i++){
        if (recentSearch[i].city == dataCity && recentSearch[i].country == dataCountry) {
            console.log ("already submitted");
           arrayCheck = false;
        }
    }
if (arrayCheck){
    console.log("added to array")
    recentSearch.push({ city: dataCity, country: dataCountry });
    localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
}
    // for (let i = 0; i < highScores.length; i++) {
    //     answerP.setAttribute("style", "margin-left: 40vh; text-align:left");
    //     answerP.innerHTML += highScores[i].initials + " " + highScores[i].score + "<br/>";
    // }
    // submit = document.getElementById("submit-button");
    // submit.className = "button-styling";
    // return false;
}
