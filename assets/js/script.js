//Search function for weather by location

var cityName = document.querySelector("#searchInput");
var searchForm = document.querySelector("#searchForm");
var todayArea = document.querySelector("#today");
var forecast = document.querySelector("#forecast");
var historyBtn = document.querySelector("#history");
var submitBtn = document.querySelector("#submit");
var weatherArea = document.querySelector("#container-left-columns");
weatherArea.style.display === "none";

// var apiKey = "531a6a316996024b38400dc9373b220d"
var apiKey = "d91f911bcf2c0f925fb6535547a5ddc9"
var api = "https://api.openweathermap.org"

//Current date and time display in header
// var currentDateToday = now.format('Do MMMM YYYY || h:mm a');
// $("#currentDay").text(currentDateToday);

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
                // weatherArea.style.display === "block";
                // getForecastWeather(city);
                // createHistory(city);
                weatherFetch(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
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
            weatherData(cityLocation, data);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function weatherData(cityLocation, data) {
    todaysWeatherRender(cityLocation, data.current, data.timezone);
    forecastRender(data.daily, data.timezone);
}

function todaysWeatherRender(cityLocation, weather, timezone) {
    var date = dayjs().tz(timezone).format('MM/DD/YYYY');
    var tempc = weather.temp;
    console.log(tempc);
    var windmph = weather.wind_speed;
    var uvi = weather.uvi;
    // weather.current
    var humidity = weather.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement("div");
    var cardbody = document.createElement("div");
    var cardtitle = document.createElement("h3");
    var tempEl = document.createElement("p");
    var windEL = document.createElement("p");
    var uviEl = document.createElement("p");
    var humidityEL = document.createElement("p");
    var uviBadgeEl = document.createElement("button");
    card.setAttribute("class", "card");
    cardbody.setAttribute("class", "card-body");
    card.append(cardbody);
    cardtitle.setAttribute("class", "h3 card-title");

    tempEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");
    weathericonEl.setAttribute("src", iconUrl);
    weathericonEl.setAttribute("alt", iconDescription);
    weathericonEl.setAttribute("class", "weather-img");
    cardtitle.textContent = `${city} (${date})`;
    windEL.textContent = `Wind: ${windmph}`;
    humidityEL.textContent = `Humidity: ${humidity}`;
    tempEL.textContent = `Temp: ${tempc}`;
    cardbody.append(cardtitle, tempEL, windEL, humidityEL);

    // true and false for the uvi
    uviEl.textContent = 'uv index';
    uviBadge.classList.add('btn', 'btn-sm');
    if (uvi < 3) {
        uviBadge.classList.add('btn-success');
    } else if (uvi < 7) {
        uviBadge.classList.add('btn-warning');

    } else {
        uviBadge.classList.add('btn-danger');
    }
    uviBadge.textContent = uvi;
    uvEl.append(uviBadge);
    cardBody.append(uvEl);
    var todayContainer = document.querySelector('.today');
    todayContainer.innerHTML = '';

    todayContainer.append(card);
    console.log(cardBody);
    console.log(tempc);
}
var forecastContainer=document.getElementById("forecast");


function forecastRender(dailyForecast, timeZone) {
    // create time zone - this will require a start and end - 2 variables. use days js. 
    // Create div first and h4 element - title El
    // 5 day forecast 
    var startDt=dayjs().tz(timeZone).add(1, "day").startOf("day").unix();
    var endDt=dayjs().tz(timeZone).add(6, "day").startOf("day").unix();

    forecastContainer.innerHTML="";

    for (let i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            forecastCard(dailyForecast[i], timeZone);
        }
    }
}
// Call function dynamically
function forecastCard(forecast, timeZone) {
    //Pull each of the data - var tempc=forecast.temp.day - as API
    // forecast.temp// 
    // after calling out data, create elements for the cards- card body and card title and card text - append the data and card to the html.
    var unixTs=forecast.dt;
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempc=forecast.temp.day;
    var {humidity}=forecast;
    var windmph=forecast.wind_speed;
    var col= document.createElement("div");
    var card= document.createElement("div");
    var cardBody= document.createElement("div");
    var cardtitle= document.createElement("h5");
    var weathericon= document.createElement("img");
    var tempEL= document.createElement("p");
    var windEL= document.createElement("p");
    var humidityEL= document.createElement("p");
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardtitle, weathericon, tempEL, windEL, humidityEL);
    col.setAttribute("class", "col-md");
    col.classList.add("5-day-card");
    card.setAttribute("class", "card bg-primary h-100 text-white");
    cardbody.setAttribute("class", "card-body p-2");
    cardtitle.setAttribute("class", "card-title");
    tempEL.setAttribute("class", "card-text");
    windEL.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");

    cardtitle.textContent=dayjs.unix(unixTs).tz(timeZone).format("MM/DD/YYYY");
    weathericon.setAttribute("src", iconUrl);
    weathericon.setAttribute("alt", iconDescription);
    windEL.textContent = `Wind: ${windmph}`;
    humidityEL.textContent = `Humidity: ${humidity}`;
    tempEL.textContent = `Temp: ${tempc}`;
    forecastContainer.append(col);
    

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
                // const currentDate = new Date(data.list[i].dt * 1000);
                // const day = currentDate.getDate();
                // const month = currentDate.getMonth() + 1;
                // const year = currentDate.getFullYear();
                // let currentDateEl = document.querySelector("#day-one-date-day" + i);
                // currentDateEl.innerHTML = data.city.name + " (" + day + "/" + month + "/" + year + ") ";;
                // let weatherPic = data.list[i].weather[0].icon;
                // let currentPicEl = document.querySelector("#day" + i);
                // currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                // currentPicEl.setAttribute("alt", data.list[i].weather[0].description);
                // let currentTempEl = document.querySelector("#day-one-temperature-day" + i);
                // //Convert from F to C
                // currentTempEl.innerHTML = "Temperature: " + data.list[i].main.temp + " &#176F";
                // let currentHumidityEl = document.querySelector("#day-one-humidity-day" + i);
                // currentHumidityEl.innerHTML = "Humidity: " + data.list[i].main.humidity + "%";
                // let currentWindEl = document.querySelector("#day-one-wind-day" + i);
                // currentWindEl.innerHTML = "Wind Speed: " + data.list[i].wind.speed + " MPH";
            }


        })
    //TODO: save local storage in an multimensional array where city and weather data are linked.
    if (city == null) {
        city = [];
        city.push(city.searchHistory()
        );
        localStorage.setItem("cityname", JSON.stringify(city));
        addToList(city);
    }
    else {
        if (find(city) > 0) {
            city.push(city.searchHistory());
            localStorage.setItem("cityname", JSON.stringify(city));
            addToList(city);
        }
    }

}

// view recently searched cities
function loadlastCity() {
    $("ul").empty();
    var city = JSON.parse(localStorage.getItem("cityname"));
    if (city !== null) {
        city = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i.city.length; i++) {
            addToList(city[i]);
        }
        city = city[i - 1];
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
