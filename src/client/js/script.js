(($, Cookies) => {
  const appID = '3fc654da627fd43dff92f97e7b90b23f';
  let weatherLocation;

  const userCurrentWeatherURLBegin = 'http://api.openweathermap.org/data/2.5/find?q=';
  const userCurrentWeatherURLEnd = `&units=metric&APPID=${appID}`;
  let userCurrentWeatherURL = userCurrentWeatherURLBegin + weatherLocation + userCurrentWeatherURLEnd;

  const userForecastURLBegin = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=';
  const userForecastURLEnd = `&cnt=5&units=metric&APPID=${appID}`;
  let userForecastURL = userForecastURLBegin + weatherLocation + userForecastURLEnd;

  $(document).ready(() => {
    const convertToF = (c) => Math.round((c * (9 / 5)) + 32);

    const updateWeatherInfo = (fiveDayURL, currentURL) => {
      // This function gets json from openweathermap's api and updates html with data
      $.getJSON(fiveDayURL, (jsonData) => {
        // Assign wanted data to vars
        const avgTemp = Math.round(jsonData.list[0].temp.day);
        const minTemp = Math.round(jsonData.list[0].temp.min);
        const maxTemp = Math.round(jsonData.list[0].temp.max);

        $('.weather-output-avg-temp').html(`Average: ${avgTemp}&deg;C/${convertToF(avgTemp)}&deg;F`);
        $('.weather-output-min-temp').html(`Min:     ${minTemp}&deg;C/${convertToF(minTemp)}&deg;F`);
        $('.weather-output-max-temp').html(`Max:     ${maxTemp}&deg;C/${convertToF(maxTemp)}&deg;F`);
      });

      // Gets and updates html with current weather info
      $.getJSON(currentURL, (jsonData) => {
        const city = jsonData.list[0].name;
        const { country } = jsonData.list[0].sys;
        const currentTemp = Math.round(jsonData.list[0].main.temp);
        const weatherType = jsonData.list[0].weather[0].main;
        let weatherIcon = jsonData.list[0].weather[0].icon;
        const weatherIconList = ['01d', '01n', '02d', '02n', '03d', '03n', '04d', '04n', '09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n', '50d', '50n'];

        if (weatherIconList.indexOf(weatherIcon) === -1) {
          // eslint-disable-next-line no-console
          console.log('Icon for weather type not found!');
          weatherIcon = '04d';
        }

        $('.weather-output-city').html(city);
        $('.weather-output-country').html(country);
        $('.weather-output-current-temp').html(`${currentTemp}&deg;C/${convertToF(currentTemp)}&deg;F`);
        $('.weather-output-weather-type').html(weatherType);
        $('.weather-type-img-wrapper').html(`<img src="images/weather-icons/${weatherIcon}.svg" alt="${weatherType} weather icon">`);
      });
    };

    const showLocationChoices = () => {
      $('.location-choice').remove();
      $('.search-error-message').remove();
      $.getJSON(userCurrentWeatherURL, (jsonData) => {
        if (jsonData.count === 0) {
          // This should be a results div
          $('#location-search-results').append('<div class="search-error-message">Location not found!</div>');
        } else {
          // This should be a results div
          for (i in jsonData.list) {
            $("#location-search-results").append("<button class='location-choice' id='location-choice' type='button'" + i
              + ">" + jsonData.list[i].name + ", " + jsonData.list[i].sys.country + "</button>");
          }
        }
      });
    };

    // This is useless, can delete
    const changeLocation = () => {
      // Won't need AJAX call here
      $.getJSON(userCurrentWeatherURL, (jsonData) => {
        const city = jsonData.list[0].name;
        const { country } = jsonData.list[0].sys;
        weatherLocation = `${city}, ${country}`;
        // Forecast data loaded here so location for current and forecast data are the same
        userForecastURL = userForecastURLBegin + weatherLocation + userForecastURLEnd;
      });
    };

    // Update site based on location search by user
    $('.location-search-form').submit((event) => {
      weatherLocation = $('#location-search-bar').val();
      userCurrentWeatherURL = userCurrentWeatherURLBegin + weatherLocation + userCurrentWeatherURLEnd;
      showLocationChoices();

      // Prevents default form submit behaviour (page refresh on submit)
      event.preventDefault();
    });

    // Using the .on() method like this allows for event listening
    // for elements that don't exist yet. ie, .location-choice divs
    $('#location-search-results').on('click', '.location-choice', () => {
      weatherLocation = $(this).html();
      userCurrentWeatherURL = userCurrentWeatherURLBegin + weatherLocation + userCurrentWeatherURLEnd;
      userForecastURL = userForecastURLBegin + weatherLocation + userForecastURLEnd;

      // Store location
      Cookies.set('weatherLocation', weatherLocation);
      updateWeatherInfo(userForecastURL, userCurrentWeatherURL);

      $('#location-search-bar').val('');
      $('.location-choice').remove();
    });

    // Get location from cookie and refresh
    weatherLocation = Cookies.get('weatherLocation');
    userCurrentWeatherURL = userCurrentWeatherURLBegin + weatherLocation + userCurrentWeatherURLEnd;
    userForecastURL = userForecastURLBegin + weatherLocation + userForecastURLEnd;
    updateWeatherInfo(userForecastURL, userCurrentWeatherURL);

    // Refresh page every 10 minutes
    setTimeout(() => {
      updateWeatherInfo(userForecastURL, userCurrentWeatherURL);
    }, 600000);
  });
})(jQuery, Cookies);
