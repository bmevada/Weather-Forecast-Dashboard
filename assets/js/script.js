//Search function for weather by location

var cityName = document.querySelector("#searchInput");
var searchForm = document.querySelector("#searchForm");
var todayArea = document.querySelector("#today");
var forecast = document.querySelector("#forecast");
var historyBtn = document.querySelector("#history");
var submitBtn = document.querySelector("#submit");
var weatherArea = document.querySelector("#container-left-columns");
var todayContainer = document.querySelector('#today');
var humidityEl;
var humidity;
var cityHistory = [];

var historyContainer = document.querySelector("#history")
var forecastContainer = document.getElementById("forecast");

// var apiKey = "531a6a316996024b38400dc9373b220d"
var apiKey = "d91f911bcf2c0f925fb6535547a5ddc9"
var api = "https://api.openweathermap.org"


// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

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
            console.log(data);
            if (!data[0]) {
                alert("Location not found");
            }
            else {
                //send to local storage, carry along coordinates info
                createHistory(city);
                //carry geo coordinates to carry data to get weather in next function
                weatherFetch(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

function weatherFetch(location) {
    var { lat, lon } = location;
    console.log(lat);
    console.log(lon);
    console.log(location);
    var city = location.name;
    console.log(city);
    var apiUrl = `${api}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            weatherData(city, data);
        })
        // .catch(function (err) {
        //     console.error(err);
        // });
}

function weatherData(city, data) {
    todaysWeatherRender(city, data.current, data.timezone);
    console.log(data.timezone);
    forecastRender(data.daily, data.timezone);
    console.log(data.timezone);
}

    // weather.current
    function todaysWeatherRender(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('DD/MM/YYYY');
    console.log(date);
    var tempc = weather.temp;
    console.log(tempc);
    var windmph = weather.wind_speed;
    var uvi = weather.uvi;
    var humidity = weather.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var cardtitle = document.createElement("h3");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var uviEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var uviBadgeEl = document.createElement("button");
    var weathericonEl = document.createElement('img');
    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);
    cardtitle.setAttribute("class", "h3 card-title");
    cardtitle.classList.add("row-blue");
    tempEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");
    weathericonEl.setAttribute("src", iconUrl);
    weathericonEl.setAttribute("alt", iconDescription);
    weathericonEl.setAttribute("class", "weather-img");
    cardtitle.textContent = `${city} (${date})`;
    windEl.textContent = `Wind: ${windmph}`;
    humidityEl.textContent = `Humidity: ${humidity}`;
    tempEl.textContent = `Temp: ${tempc}`;
    cardBody.append(cardtitle, tempEl, windEl, humidityEl);

    // true and false for the uvi
    uviEl.textContent = 'uv index';
    uviBadgeEl.classList.add('btn', 'btn-sm');
    if (uvi < 3) {
        uviBadgeEl.classList.add('btn-success');
    } else if (uvi < 7) {
        uviBadgeEl.classList.add('btn-warning');

    } else {
        uviBadgeEl.classList.add('btn-danger');
    }
    uviBadgeEl.textContent = uvi;
    uviEl.append(uviBadgeEl);
    cardBody.append(uviEl);

    // var todayContainer = document.querySelector('.today');
    todayContainer.innerHTML = '';
    todayContainer.append(card);
    console.log(cardBody);
    console.log(tempc);
}
// var forecastContainer = document.getElementById("forecast");


function forecastRender(dailyForecast, timezone) {
    // create time zone - this will require a start and end - 2 variables. use days js. 
    // Create div first and h4 element - title El
    // 5 day forecast 
    var startDt = dayjs().tz(timezone).add(1, "day").startOf("day").unix();
    var endDt = dayjs().tz(timezone).add(6, "day").startOf("day").unix();

    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');
  
    headingCol.setAttribute('class', 'col-12');
    heading.classList.add('row-blue');
    heading.textContent = 'Weather Forecast for 5 Days:';
    headingCol.append(heading);
    forecastContainer.innerHTML = '';

    forecastContainer.append(headingCol);
    for (let i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            forecastCard(dailyForecast[i], timezone);
        }
    }
}
// Call function dynamically
function forecastCard(forecast, timeZone) {
    //Pull each of the data - var tempc=forecast.temp.day - as API
    // forecast.temp// 
    // after calling out data, create elements for the cards- card body and card title and card text - append the data and card to the html.
    var unixTs = forecast.dt;
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempc = forecast.temp.day;
    var { humidity } = forecast;
    var windmph = forecast.wind_speed;
    var col = document.createElement("div");
    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var cardtitle = document.createElement("h5");
    var weathericon = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardtitle, weathericon, tempEl, windEl, humidityEl);
    col.setAttribute("class", "col-md");
    col.classList.add("5-day-card");
    card.setAttribute("class", "card bg-primary h-100 text-white");
    cardBody.setAttribute("class", "card-body p-2");
    cardtitle.setAttribute("class", "card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");

    cardtitle.textContent = dayjs.unix(unixTs).tz(timeZone).format("DD/MM/YYYY");
    weathericon.setAttribute("src", iconUrl);
    weathericon.setAttribute("alt", iconDescription);
    windEl.textContent = `Wind: ${windmph}`;
    humidityEl.textContent = `Humidity: ${humidity}`;
    tempEl.textContent = `Temp: ${tempc}`;
    forecastContainer.append(col);


}

// Obtain city input and validate city name
submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    //if nothing entered, but button pressed -- return null
    if (!cityName.value) {
        return;
    }
    //create var from submission
    var city = cityName.value.trim();
    console.log(cityName);
    coordsFetch(city);
    console.log(city);
    city.value = '';

})

initCityHistory();
// Obtain city input and validate city name
historyContainer.addEventListener("click", function (e) {
   // Don't do search if current elements is not a search history button
   if (!e.target.matches('.btn-history')) {
    return;
  }

  var btn = e.target;
  var city = btn.getAttribute('data-search');
  coordsFetch(city);

})

// Function to update history in local storage then updates displayed history.
  function createHistory(city) {
    // If there is no search term return the function
    if (cityHistory.indexOf(city) !== -1) {
      return;
    }
    cityHistory.push(city);
    console.log(city);
    console.log(cityHistory);

  
    localStorage.setItem('city-history', JSON.stringify(cityHistory));
    displayHistory();
  }


// Function to display the search history list.
    function displayHistory() {
    historyContainer.innerHTML = '';
  
    // Start at end of history array and count down to show the most recent at the top.
    for (var i = cityHistory.length - 1; i >= 0; i--) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-controls', 'today forecast');
      btn.classList.add('history-btn', 'btn-history');
  
      // `data-search` allows access to city name when click handler is invoked
      btn.setAttribute('data-search', cityHistory[i]);
      btn.textContent = cityHistory[i];
     historyContainer.append(btn);
    }
  }
  

  
  // Function to get search history from local storage
  function initCityHistory() {
    var storedHistory = localStorage.getItem('city-history');
    console.log(storedHistory)
    if (storedHistory) {
      cityHistory = JSON.parse(storedHistory);
      console.log(cityHistory)
    }
    displayHistory();
  }


// // for loop- 5 cards to put the data to - function: card which will go through 5 times
// function getForecastWeather(city) {
//     console.log('inside function' + city);
//     //Get data from OpenWeather URL using API Key: 
//     fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=531a6a316996024b38400dc9373b220d")
//         .then((response) => response.json())
//         // .then(function (response)
//         .then((data) => {

//             console.log(data);

//             // Display weather forecast for today
//             //todayweatherEl.classList.remove("d-none");

//             // Parse response to display current weather
//             for (let i = 0; i <= 5; i++) {
//                 // const currentDate = new Date(data.list[i].dt * 1000);
//                 // const day = currentDate.getDate();
//                 // const month = currentDate.getMonth() + 1;
//                 // const year = currentDate.getFullYear();
//                 // let currentDateEl = document.querySelector("#day-one-date-day" + i);
//                 // currentDateEl.innerHTML = data.city.name + " (" + day + "/" + month + "/" + year + ") ";;
//                 // let weatherPic = data.list[i].weather[0].icon;
//                 // let currentPicEl = document.querySelector("#day" + i);
//                 // currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
//                 // currentPicEl.setAttribute("alt", data.list[i].weather[0].description);
//                 // let currentTempEl = document.querySelector("#day-one-temperature-day" + i);
//                 // //Convert from F to C
//                 // currentTempEl.innerHTML = "Temperature: " + data.list[i].main.temp + " &#176F";
//                 // let currentHumidityEl = document.querySelector("#day-one-humidity-day" + i);
//                 // currentHumidityEl.innerHTML = "Humidity: " + data.list[i].main.humidity + "%";
//                 // let currentWindEl = document.querySelector("#day-one-wind-day" + i);
//                 // currentWindEl.innerHTML = "Wind Speed: " + data.list[i].wind.speed + " MPH";
//             }


//         })
//     //TODO: save local storage in an multimensional array where city and weather data are linked.
//     if (city == null) {
//         city = [];
//         city.push(city.searchHistory()
//         );
//         localStorage.setItem("cityname", JSON.stringify(city));
//         addToList(city);
//     }
//     else {
//         if (find(city) > 0) {
//             city.push(city.searchHistory());
//             localStorage.setItem("cityname", JSON.stringify(city));
//             addToList(city);
//         }
//     }

// }

// // view recently searched cities
// function loadlastCity() {
//     $("ul").empty();
//     var city = JSON.parse(localStorage.getItem("cityname"));
//     if (city !== null) {
//         city = JSON.parse(localStorage.getItem("cityname"));
//         for (i = 0; i.city.length; i++) {
//             addToList(city[i]);
//         }
//         city = city[i - 1];
//         currentWeather(city);
//     }

// }

// // Store data in local storage
// function checkLocalStorage() {
//     var storedData = localStorage.getItem('queries');
//     var dataArray = [];
//     if (!storedData) {
//         console.log("no data stored");
//     } else {
//         storedData.trim();
//         dataArray = storedData.split(',');
//         for (var i = 0; i < dataArray.length; i++) {
//             createRecentSearchBtn(dataArray[i]);
//         }
//     }
// };



// // Function to Set data in Local storage
// // function saveToLocalStorage(q) {
// //     var data = localStorage.getItem('queries');
// //     if (data) {
// //         console.log(data, q)

// //     } else {
// //         data = q;
// //         localStorage.setItem('queries', data);
// //     }
// //     if (data.indexOf(q) === -1) {
// //         data = data + ',' + q;
// //         localStorage.setItem('queries', data);
// //         createRecentSearchBtn(q);
// //     }
// // }

// // Retreive data from local storage
// // searchEl.addEventListener("click", function () {
// //     const searchTerm = cityEl.value;
// //     getWeather(searchTerm);
// //     searchHistory.push(searchTerm);
// //     localStorage.setItem("search", JSON.stringify(searchHistory));
// //     renderSearchHistory();
// // })

// //Clear search history
// // clearEl.addEventListener("click", function () {
// //     localStorage.clear();
// //     searchHistory = [];
// //     renderSearchHistory();
// // })
