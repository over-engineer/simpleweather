$(document).ready(function() {

	var updateWeatherInfo = function(fiveDayURL,currentURL) {
		// This function gets json from openweathermap's api and updates html with data
		// Would probably be better to have retrieving data and updating html as separate functions

		$.getJSON(fiveDayURL, function(jsonData) {
			// Assign wanted data to vars
			var city = jsonData.city.name;
			var weatherType = jsonData.list[0].weather[0].main;
			var avgTemp = Math.round(jsonData.list[0].temp.day);
			var minTemp = Math.round(jsonData.list[0].temp.min);
			var maxTemp = Math.round(jsonData.list[0].temp.max);

			// Update appropriate HTML classes
			$(".weather-output-city").html(city);
			$(".weather-output-weather-type").html(weatherType);
			$(".weather-details-wrapper").prepend('<img src="images/weather-icons/Sun.svg">');
			$(".weather-output-avg-temp").append(avgTemp + "&deg;C");
			$(".weather-output-min-temp").append(minTemp + "&deg;C");
			$(".weather-output-max-temp").append(maxTemp + "&deg;C");

		});

		// Gets and updates html with current weather info
		$.getJSON(currentURL, function(jsonData) {
			var currentTemp = Math.round(jsonData.main.temp);
			$(".weather-output-current-temp").html(currentTemp + "&deg;C");
		});

	}

	// Get weather info from api in JSON format
	// Current day only
	var sydneyCurrentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=Sydney,au&units=metric&APPID=43589e78e8e7987b96a7f3a86a6ae84c";
	// 5 day forecast
	var sydneyForecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Sydney,au&cnt=5&units=metric&APPID=43589e78e8e7987b96a7f3a86a6ae84c";
	// Call the function
	updateWeatherInfo(sydneyForecastURL,sydneyCurrentWeatherURL);
});