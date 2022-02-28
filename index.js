
window.addEventListener("DOMContentLoaded", init);

async function init() {
  const { city, temp, descriptions, icons } = await getWeather();
  const date = formattedDate();
  const time = formattedTime();
  const cityEl = document.getElementById("city");
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");
  const tempEl = document.getElementById("temp");

  cityEl.textContent = city;
  dateEl.textContent = date;
  timeEl.textContent = time;
  tempEl.textContent = Math.round(temp);
  displayIcons(icons);
  displayDescriptions(descriptions);
}

async function getWeather() {
  const apiKey = "d54e835f889375664780bac7f3fc49e6";
  const lat = 40.7127281;
  const lon = -74.0060152;
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  const {
    weather,
    main: { temp },
    name: city = "",
  } = data ?? {};

  const icons = weather.map(({ icon }) => {
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    return iconUrl;
  });
  const descriptions = weather.map(({ description }) => description);

  return { city, temp, descriptions, icons };
}

function displayIcons(icons = []) {
    const [iconContainer] = document.getElementsByClassName("icon-container");
    icons.forEach(icon => {
      const img = new Image(300);
      img.src = icon;
      img.classList.add("icon");
      iconContainer.appendChild(img);
    });
}

function displayDescriptions(descriptions = []) {
  const [descriptionsEl] = document.getElementsByClassName("descriptions");
  descriptions.forEach(desc => {
    const li = document.createElement("li");
    li.classList.add("description");
    li.textContent = desc.capitalize();
    descriptionsEl.appendChild(li);
  })
}

function formattedDate() {
  const date = new Date();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en", { month: "short" });
  const day = date.getDate();
  return `${weekday}, ${month}. ${day.ordinal()}`;
}

function formattedTime() {
  const date = new Date();
  const noSeconds = date.toLocaleTimeString("en-US", { timeStyle: "short" });
  return noSeconds.toLowerCase();
}

Number.prototype.ordinal = function () {
  if (this % 1) return this;
  const n = this % 100;
  if (n > 3 && n < 21) return `${this}th`;
  switch (n % 10) {
    case 1:
      return `${this}st`;
    case 2:
      return `${this}nd`;
    case 3:
      return `${this}rd`;
    default:
      return `${this}th`;
  }
};

String.prototype.capitalize = function() {
  return `${this.charAt(0).toUpperCase()}${this.slice(1)}`;
}