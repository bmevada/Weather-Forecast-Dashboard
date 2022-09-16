$(window).on('load', function () {
    currentLocation();
    checkLocalStorage();
});

//Search function for weather by location

var cityName = document.querySelector("#searchInput");
var searchForm = document.querySelector("#searchForm");
var todayArea = document.querySelector("#today");
var forecast = document.querySelector("#forecast");
var historyBtn = document.querySelector("#history");
var submitBtn = document.querySelector("#submit");
var weatherArea = document.querySelector("#container-left-columns");
weatherArea.style.display === "none";

var apiKey = "531a6a316996024b38400dc9373b220d"
var api = "https://api.openweathermap.org"

//Current date and time display in header
var currentDateToday = now.format('Do MMMM YYYY || h:mm a');
$("#currentDay").text(currentDateToday);

// Obtain city input and validate city name
submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (!cityName.value) {
        return;
    }
    //create var from submission
    var city = cityName.value.trim();
    coordsFetch(city);
    city.value = '';

    //save to local storage
    // localStorage.setItem("city", city);
    //console.log(city);

})
// Fetch city cooridinates from location
function coordsFetch(city) {
    var apiUrl = `${api}/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert("Location not found");
            }
            else {
                weatherArea.style.display === "block";
                getForecastWeather(city);
                //createHistory(city);
                //weatherFetch(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        })
}

function weatherFetch(location) {
    var { lat, lon } = location;
    var cityLocation = location.name;
    var apiUrl = `${api}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            weatherData(city, data);
        })
        .catch(function (err) {
            console.error(err);
        })
}

function weatherData(city, data) {
    todaysWeatherRender(city, data.current, data.timeZone);
    forecastRender(data.daily, data.timeZone);
}

function todaysWeatherRender(city, weather, timeZone) {

}

function forecastRender(dailyForecast, timeZone) {
    // create time zone - this will require a start and end - 2 variables. use days js. 
    // Create div first and h4 element - title El
    // 5 day forecast 


    for (let i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            forecastCard(dailyForecast[i], timeZone);
        }
    }
}

function forecastCard(forecast, timeZone) {
    //Pull each of the data - var tempc=forecast.temp.day - as API
    // forecast.temp// 
    // after calling out data, create elements for the cards- card body and card title and card text - append the data and card to the html.

}




// for loop- 5 cards to put the data to - function: card which will go through 5 times
function getForecastWeather(city) {
    console.log('inside function' + city);
    //Get data from OpenWeather URL using API Key: 
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=531a6a316996024b38400dc9373b220d")
        .then((response) => response.json())
        // .then(function (response)
        .then((data) => {

            console.log(data);

            // Display weather forecast for today
            //todayweatherEl.classList.remove("d-none");

            // Parse response to display current weather
            for (let i = 0; i <= 5; i++) {
                const currentDate = new Date(data.list[i].dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                let currentDateEl = document.querySelector("#day-one-date-day" + i);
                currentDateEl.innerHTML = data.city.name + " (" + day + "/" + month + "/" + year + ") ";;
                let weatherPic = data.list[i].weather[0].icon;
                let currentPicEl = document.querySelector("#day" + i);
                currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.setAttribute("alt", data.list[i].weather[0].description);
                let currentTempEl = document.querySelector("#day-one-temperature-day" + i);
                currentTempEl.innerHTML = "Temperature: " + data.list[i].main.temp + " &#176F";
                let currentHumidityEl = document.querySelector("#day-one-humidity-day" + i);
                currentHumidityEl.innerHTML = "Humidity: " + data.list[i].main.humidity + "%";
                let currentWindEl = document.querySelector("#day-one-wind-day" + i);
                currentWindEl.innerHTML = "Wind Speed: " + data.list[i].wind.speed + " MPH";
            }


        })
    //TODO: save local storage in an multimensional array where city and weather data are linked.
    if (city==null){
        city=[];
        city.push(city.searchHistory()
        );
        localStorage.setItem("cityname",JSON.stringify(city));
        addToList(city);
    }
    else {
        if(find(city)>0){
            city.push(city.searchHistory());
            localStorage.setItem("cityname",JSON.stringify(city));
            addToList(city);
        }
    }

}

// view recently searched cities
function loadlastCity(){
    $("ul").empty();
    var city = JSON.parse(localStorage.getItem("cityname"));
    if(city!==null){
        city=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i.city.length;i++){
            addToList(city[i]);
        }
        city=city[i-1];
        currentWeather(city);
    }

}

// Store data in local storage
function checkLocalStorage() {
    var storedData = localStorage.getItem('queries');
    var dataArray = [];
    if (!storedData) {
        console.log("no data stored");
    } else {
        storedData.trim();
        dataArray = storedData.split(',');
        for (var i = 0; i < dataArray.length; i++) {
            createRecentSearchBtn(dataArray[i]);
        }
    }
};



// Function to Set data in Local storage
// function saveToLocalStorage(q) {
//     var data = localStorage.getItem('queries');
//     if (data) {
//         console.log(data, q)

//     } else {
//         data = q;
//         localStorage.setItem('queries', data);
//     }
//     if (data.indexOf(q) === -1) {
//         data = data + ',' + q;
//         localStorage.setItem('queries', data);
//         createRecentSearchBtn(q);
//     }
// }

// Retreive data from local storage
// searchEl.addEventListener("click", function () {
//     const searchTerm = cityEl.value;
//     getWeather(searchTerm);
//     searchHistory.push(searchTerm);
//     localStorage.setItem("search", JSON.stringify(searchHistory));
//     renderSearchHistory();
// })

//Clear search history
// clearEl.addEventListener("click", function () {
//     localStorage.clear();
//     searchHistory = [];
//     renderSearchHistory();
// })
