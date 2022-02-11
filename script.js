let date = document.querySelector("#date");
let days = document.querySelector(".day-block");
let description = document.querySelector("#description");
let icon = document.querySelector(".weather-icon-today");
let place = document.querySelector("#city");
let precipitation = document.querySelector("#precipitation-probality");
let temperature = document.querySelector(".weather-temp-today");
let wind = document.querySelector("#wind-speed");
let refreshbutton = document.querySelector("#current-location-button");
let form = document.querySelector("#search-form");

let root = "https://api.openweathermap.org";
let apiKey = "0e0bdc81b41729dbd97352adacb8d445";

function friendlyDay(dayNumber) {
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayNumber];
}

function friendlyMinutes(minutesNumber) {
    if (minutesNumber < 10) {
        return "0" + minutesNumber;
    } else {
        return minutesNumber;
    }
}

function friendlyDate(date) {
    let day = friendlyDay(date.getDay());
    let hours = date.getHours();
    let minutes = friendlyMinutes(date.getMinutes());

    return day + " " + hours + ":" + minutes;
}

function refreshWeather(queryParams) {
    let apiParams = "appid=" + apiKey + "&units=metric";

    axios
        .get(root + "/data/2.5/weather?" + apiParams + "&" + queryParams)
        .then(function(response) {
            date.innerHTML = friendlyDate(new Date());
            place.innerHTML = response.data.name;
            description.innerHTML = response.data.weather[0].main;
            temperature.innerHTML = Math.round(response.data.main.temp);
            wind.innerHTML = Math.round(response.data.wind.speed) + "km/h";
            precipitation.innerHTML = Math.round(response.data.main.humidity) + "%";

            icon.setAttribute(
                "src",
                "http://openweathermap.org/img/w/" +
                response.data.weather[0].icon +
                ".png"
            );
        });

    axios
        .get(root + "/data/2.5/forecast?" + apiParams + "&" + queryParams)
        .then(function(response) {
            console.log(response);

            document
                .querySelectorAll(".day-block")
                .forEach(function(element, index) {
                    let day = new Date(response.data.list[index].dt_txt);
                    element.querySelector(".day-block-date").innerHTML =
                        friendlyDate(day);
                    element.querySelector(".day-block-temp").innerHTML = Math.round(
                        response.data.list[index].main.temp
                    );
                    element
                        .querySelector(".day-block-image")
                        .setAttribute(
                            "src",
                            "http://openweathermap.org/img/w/" +
                            response.data.list[index].weather[0].icon +
                            ".png"
                        );
                });
        });
}

form.addEventListener("click", function(event) {
    refreshWeather("q=" + form.querySelector("#city-input").value);
    event.preventDefault();
});

refreshbutton.addEventListener("click", function(event) {
    navigator.geolocation.getCurrentPosition(function(position) {
        refreshWeather(
            "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude
        );
    });
});

refreshWeather("q=Tehran");