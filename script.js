var weatherLocation;

$(document).ready(function() {

	var updateWeatherInfo = function(fiveDayURL,currentURL) {
		// This function gets json from openweathermap's api and updates html with data
		// Would probably be better to have retrieving data and updating html as separate functions

		$.getJSON(fiveDayURL, function(jsonData) {
			// Assign wanted data to vars
			var avgTemp = Math.round(jsonData.list[0].temp.day);
			var minTemp = Math.round(jsonData.list[0].temp.min);
			var maxTemp = Math.round(jsonData.list[0].temp.max);

			$(".weather-output-avg-temp").html('Average: ' + avgTemp + "&deg;C");
			$(".weather-output-min-temp").html('Min: ' + minTemp + "&deg;C");
			$(".weather-output-max-temp").html('Max: ' + maxTemp + "&deg;C");

		});

		// Gets and updates html with current weather info
		$.getJSON(currentURL, function(jsonData) {
			var city = jsonData.list[0].name;
			var country = jsonData.list[0].sys.country;
			var currentTemp = Math.round(jsonData.list[0].main.temp);
			var weatherType = jsonData.list[0].weather[0].main;
			var weatherIcon = jsonData.list[0].weather[0].icon;
			var weatherIconList = ['01d','01n','02d','02n','03d','03n','04d','04n','09d','09n','10d','10n','11d','11n','13d','13n','50d','50n'];

			if (weatherIconList.indexOf(weatherIcon) == -1) {
				console.log('Icon for weather type not found!');
				weatherIcon = '04d';
			}

			$(".weather-output-city").html(city);
			$(".weather-output-country").html(country);
			$(".weather-output-current-temp").html(currentTemp + "&deg;C");
			$(".weather-output-weather-type").html(weatherType);
			$(".weather-type-img-wrapper").html('<img src="images/weather-icons/' + weatherIcon + '.svg" alt="' + weatherType + ' weather icon">');
		});

		// $(".weather-output-wrapper").append("<br><br>" + Date());

	}

	// Update site based on location search by user
	$(".location-search-form").submit(function(event) {
		weatherLocation = $(".location-search-form input").val();
		
		userCurrentWeatherURL = "http://api.openweathermap.org/data/2.5/find?q=" + weatherLocation + "&units=metric&APPID=3fc654da627fd43dff92f97e7b90b23f";
		// AJAX call to get location name
		$.getJSON(userCurrentWeatherURL, function(jsonData){
			var city = jsonData.list[0].name;
			var country = jsonData.list[0].sys.country;
			weatherLocation = city + ", " + country;
			userForecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + weatherLocation + "&cnt=5&units=metric&APPID=3fc654da627fd43dff92f97e7b90b23f";
			console.log(weatherLocation);
		});
		
		updateWeatherInfo(userForecastURL,userCurrentWeatherURL);	

		// Prevents default form submit behaviour (page refresh on submit)
		event.preventDefault();
	});

	weatherLocation = "Sydney"; //TODO: remove this
	// Get weather info from api in JSON format
	// Current day only
	var userCurrentWeatherURL = "http://api.openweathermap.org/data/2.5/find?q=" + weatherLocation + "&units=metric&APPID=3fc654da627fd43dff92f97e7b90b23f";
	// 5 day forecast
	// find not working for forecast
	var userForecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + weatherLocation + "&cnt=5&units=metric&APPID=3fc654da627fd43dff92f97e7b90b23f";

	// Finally call the function
	updateWeatherInfo(userForecastURL,userCurrentWeatherURL);

});