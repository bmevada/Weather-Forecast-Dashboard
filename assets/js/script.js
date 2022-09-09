//Search function for weather by location
var city = "city"
var cityName = document.querySelector("#location")
var submitButton = document.querySelector("#submit");

submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    //create var from submission
    var city = locationName.value.trim();

    //save to local storage
    localStorage.setItem("city", JSON.stringify(city));
    console.log(city);

})

//Get data from OpenWeather URL using API Key: 
fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=531a6a316996024b38400dc9373b220d")
    .then(response) => response(json())
    // .then(function (response)
    .then((data)) {

        console.log(data);

        //Display weather forecast for today
        todayweatherEl.classList.remove("d-none");

        // Parse response to display current weather
        const currentDate = new Date(response.data.dt * 1000);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        nameEl.innerHTML = response.data.name + " (" + day + "/" + month + "/" + year + ") ";
        let weatherPic = response.data.weather[0].icon;
        currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        currentPicEl.setAttribute("alt", response.data.weather[0].description);
        currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
        currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";


    }

// Retreive data from local storage
searchEl.addEventListener("click", function () {
    const searchTerm = cityEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
})

//Clear search history
clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})
