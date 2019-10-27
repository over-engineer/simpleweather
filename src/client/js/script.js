(($, Cookies) => {
  const appID = '3fc654da627fd43dff92f97e7b90b23f';
  let weatherLocation;

  const userCurrentWeatherURLBegin = 'http://api.openweathermap.org/data/2.5/find?q=';
  const userCurrentWeatherURLEnd = `&units=metric&APPID=${appID}`;
  let userCurrentWeatherURL = userCurrentWeatherURLBegin
    + weatherLocation
    + userCurrentWeatherURLEnd;

  const userForecastURLBegin = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=';
  const userForecastURLEnd = `&cnt=5&units=metric&APPID=${appID}`;
  let userForecastURL = userForecastURLBegin + weatherLocation + userForecastURLEnd;

  $(() => {
    const convertToF = (c) => Math.round((c * (9 / 5)) + 32);

    const updateWeatherInfo = (fiveDayURL, currentURL) => {
      // This function gets json from openweathermap's api and updates html with data
      // This function gets json from openweathermap's api and updates html with data
      fetch(fiveDayURL)
        .then((response) => response.json())
        .then((jsonData) => {
          // Assign wanted data to vars
          const avgTemp = Math.round(jsonData.list[0].temp.day);
          const minTemp = Math.round(jsonData.list[0].temp.min);
          const maxTemp = Math.round(jsonData.list[0].temp.max);

          $('.weather-output-avg-temp').html(`Average: ${avgTemp}&deg;C/${convertToF(avgTemp)}&deg;F`);
          $('.weather-output-min-temp').html(`Min:     ${minTemp}&deg;C/${convertToF(minTemp)}&deg;F`);
          $('.weather-output-max-temp').html(`Max:     ${maxTemp}&deg;C/${convertToF(maxTemp)}&deg;F`);
        });

      // Gets and updates html with current weather info
      fetch(currentURL)
        .then((response) => response.json())
        .then((jsonData) => {
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

      fetch(userCurrentWeatherURL)
        .then((response) => response.json())
        .then((jsonData) => {
          const searchResultsElem = $('#location-search-results');

          if (jsonData.count === 0) {
            // This should be a results div
            searchResultsElem.append('<div class="search-error-message">Location not found!</div>');
          } else {
            // This should be a results div
            jsonData.list.forEach((location, i) => {
              const { name } = location;
              const { country } = location.sys;
              searchResultsElem.append(`<button class="location-choice" id="location-choice" type="button" ${i}>${name}, ${country}</button>`);
            });
          }
        });
    };

    // Update site based on location search by user
    $('.location-search-form').submit((event) => {
      weatherLocation = $('#location-search-bar').val();
      userCurrentWeatherURL = userCurrentWeatherURLBegin
        + weatherLocation
        + userCurrentWeatherURLEnd;
      showLocationChoices();

      // Prevents default form submit behaviour (page refresh on submit)
      event.preventDefault();
    });

    // Using the .on() method like this allows for event listening
    // for elements that don't exist yet. ie, .location-choice divs
    // eslint-disable-next-line func-names
    $('#location-search-results').on('click', '.location-choice', (event) => {
      weatherLocation = $(event.currentTarget).html();
      userCurrentWeatherURL = userCurrentWeatherURLBegin
        + weatherLocation
        + userCurrentWeatherURLEnd;
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
