const searchBtn = $('#search-button');
searchBtn.on('click', function(e) {
  e.preventDefault();
  const searchInput = $('#search-input').val();
  renderWeather(searchInput);
});

renderWeather('Toronto');
getCurrentTime(); // TODO: Delete this later

async function getCityGeoLocation(cityname) {
  try {
    const cityData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=10&appid=3ee036a4b94af4c4f30dba029d912c48`);
    const response = await cityData.json();
    const result = {
      cityname: response[0].name,
      latitude: response[0].lat,
      longitude: response[0].lon
  }
    console.log(result); // TODO: remove console.log
    return result;
  } catch(e) {
    console.log(e); //TODO: handle error
  }
}

async function getWeatherBylocation(cityname) {
  try {
    const geoLocation = await getCityGeoLocation(cityname);
    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geoLocation.latitude}&lon=${geoLocation.longitude}&units=metric&appid=3ee036a4b94af4c4f30dba029d912c48`);
    const response = await weatherData.json();
    console.log(response); // TODO: remove console.log
    return {data: response, name: geoLocation.cityname};
  } catch(e) {
    console.log(e); //TODO: handle error
  }
}

async function renderWeather(searchInput) {
  const weatherData = await getWeatherBylocation(searchInput);
  const time = await weatherData.data.list[0].dt_txt;
  if (weatherData) {
    const dataList = weatherData.data.list;
    $('#city-name').text(`${weatherData.name}  ${getCurrentTime(time)}`);
    $('#city-temp').text(`Temperatuere: ${dataList[0].main.temp} °C`);
    $('#city-wind').text(`Wind: ${dataList[0].wind.speed} m/s`);
    $('#city-humidity').text(`Humidity: ${dataList[0].main.humidity}%`);
    $('#city-feels-like').text(`Feels like: ${dataList[0].main.feels_like} °C`);
  } else {
    $('#city-info').html('<h2>Something went wrong, try again</h2>');
  }
}

function getCurrentTime(time) {
  const now = dayjs(time);
  const month = now.format('MM');
  const day = now.format('DD');
  const year = now.format('YYYY');
  return `${month}/${day}/${year}`;
}