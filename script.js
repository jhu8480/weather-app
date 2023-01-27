const searchBtn = $('#search-button');
const localStorageKey = 'search_history_data';


searchBtn.on('click', function(e) {
  e.preventDefault();
  const searchInput = $('#search-input').val();
  renderWeather(searchInput);
  renderFiveDays(searchInput);
  saveToLocalStorage(searchInput);
  renderSearchHistory();
});

renderWeather('Shanghai');
renderFiveDays('Shanghai');
renderSearchHistory();

async function getCityGeoLocation(cityname) {
  try {
    const cityData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=10&appid=3ee036a4b94af4c4f30dba029d912c48`);
    const response = await cityData.json();
    const result = {
      cityname: response[0].name,
      latitude: response[0].lat,
      longitude: response[0].lon
  }
    return result;
  } catch(e) {
    console.log(e);
    console.log('Cannot find this city');
  }
}

async function getWeatherBylocation(cityname) {
  try {
    const geoLocation = await getCityGeoLocation(cityname);
    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geoLocation.latitude}&lon=${geoLocation.longitude}&units=metric&appid=3ee036a4b94af4c4f30dba029d912c48`);
    const response = await weatherData.json();
    return {data: response, name: geoLocation.cityname};
  } catch(e) {
    console.log(e);
    $('#city-info').html('<h2>There seems something went wrong, please try again</h2>');
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
  }
}

async function renderFiveDays(searchInput) {
  const weatherData = await getWeatherBylocation(searchInput);
  const response = await weatherData.data;
  const fiveDaysDiv = $('.one-day');
  let j = 0;
  
  for (let i = 0; i < fiveDaysDiv.length; i++) {
    fiveDaysDiv[i].innerHTML = `<h6>${getCurrentTime(response.list[j].dt_txt)}</h6><p>Temp: ${response.list[j].main.temp} °C<p> <p>Wind: ${response.list[j].wind.speed} m/s</p> <p>Humidity: ${response.list[j].main.humidity}%</p>`;
    j += 8;
  }
}

function getCurrentTime(time) {
  const now = dayjs(time);
  const month = now.format('MM');
  const day = now.format('DD');
  const year = now.format('YYYY');
  return `${month}/${day}/${year}`;
}

function getLocalStorage() {
  return localStorage.getItem(localStorageKey) == null ? [] : JSON.parse(localStorage.getItem(localStorageKey));
}

function saveToLocalStorage(item) {
  const dataArray = getLocalStorage();

  const checkIfItemExist = dataArray.find((el) => el === item);
  if (!checkIfItemExist) {
    dataArray.push(item);
    localStorage.setItem(localStorageKey, JSON.stringify(dataArray));
  } else return;
}


function removeItemFromLocalStorage(text) {
  const storageArr = getLocalStorage();
  const index = storageArr.findIndex((el) => el === text);
  storageArr.splice(index, 1);
  localStorage.setItem(localStorageKey, JSON.stringify(storageArr));
  renderSearchHistory();
}


function renderSearchHistory() {
  const dataArray = getLocalStorage();

  const ul = document.getElementById('search-history');
  ul.innerHTML = '';
  for (let key of dataArray) {
    const listItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'delete-button');
    listItem.innerText = key;
    listItem.append(deleteButton);

    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetText = e.target.parentNode.textContent;
      removeItemFromLocalStorage(targetText);
    })

    listItem.addEventListener('click', (e) => {
      e.preventDefault();
      const searchInput = e.target.innerText;
      renderWeather(searchInput);
      renderFiveDays(searchInput);
    });
  ul.append(listItem);
  }

}

$( function() {
  $( "#search-history" ).sortable();
} );



$( function() {
  var availableTags = [
    "Hangzhou",
    "Jinyun",
    "Guangzhou",
    "Shanghai",
    "Toronto",
    "Tokyo",
    "Dubai",
    "New Delhi",
    "New York",
    "Scarborough",
    "London",
    "Paris",
    "Istanbul",
    "Kyoto",
    "Singapore",
    "Bangkok",
    "Chiangmai",
    "Kyiv",
    "Seoul",
    "Dublin",
    "Stockholm",
    "Warsaw",
    "Cairo"
  ];
  $( "#search-input" ).autocomplete({
    source: availableTags
  });
} );