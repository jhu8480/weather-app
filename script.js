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
  console.log(response[0]); // TODO: remove console.log
  return {
    cityname: response[0].name,
    latitude: response[0].lat,
    longitude: response[0].lon
  }
  } catch(e) {
    console.log(e); //TODO: handle error
  }
}

async function getWeatherBylocation(cityname) {
  try {
    const geoLocation = await getCityGeoLocation(cityname);
    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geoLocation.latitude}&lon=${geoLocation.longitude}&appid=3ee036a4b94af4c4f30dba029d912c48`);
    const response = await weatherData.json();
    console.log(response); // TODO: remove console.log
    return response;
  } catch(e) {
    console.log(e); //TODO: handle error
  }
}

async function renderWeather(searchInput) {
  const weatherData = await getWeatherBylocation(searchInput);
  if (weatherData) {
    $('#city-name').text(`${weatherData.city.name}  ${getCurrentTime()}`);
  } else {
    console.log('No result');
  }
}

function getCurrentTime() {
  const now = dayjs();
  const month = now.format('MM');
  const day = now.format('DD');
  const year = now.format('YYYY');
  return `${month}/${day}/${year}`;
}