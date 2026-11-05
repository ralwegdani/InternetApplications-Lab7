
const ACCESS_KEY = "YUnJZg1-O4WEhw7ge5pjC-lOLgqsof3cR6pfQ5HKtdI";
const BASE_URL = "https://api.unsplash.com/search/photos";

const queryInput = document.getElementById("query");
const gallery = document.getElementById("gallery");
const statusText = document.getElementById("status");

function buildUrl() {
  const query = encodeURIComponent(queryInput.value.trim());
  return `${BASE_URL}?query=${query}&per_page=10&orientation=portrait`;
}

function showImages(data, method) {
  gallery.innerHTML = "";
  if (!data.results || data.results.length === 0) {
    statusText.textContent = "No results found.";
    return;
  }
  data.results.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo.urls.small;
    img.alt = photo.alt_description || "Unsplash photo";
    gallery.appendChild(img);
  });
  statusText.textContent = `${data.results.length} photos loaded using ${method}`;
}

function showError(error) {
  statusText.textContent = "Error: " + error;
}

// 1) XHR
function searchXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", buildUrl());
  xhr.setRequestHeader("Authorization", `Client-ID ${ACCESS_KEY}`);
  xhr.onload = function () {
    if (xhr.status === 200) {
      showImages(JSON.parse(xhr.responseText), "XHR");
    } else {
      showError(xhr.status);
    }
  };
  xhr.onerror = () => showError("Network error");
  xhr.send();
}

// 2) fetch with promises
function searchPromise() {
  fetch(buildUrl(), {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
  })
    .then(response => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(data => showImages(data, "fetch (promises)"))
    .catch(error => showError(error.message));
}

// 3) fetch with async/await
async function searchAsync() {
  try {
    const response = await fetch(buildUrl(), {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
    });
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();
    showImages(data, "fetch (async/await)");
  } catch (error) {
    showError(error.message);
  }
}

document.getElementById("btnXHR").addEventListener("click", searchXHR);
document.getElementById("btnPromise").addEventListener("click", searchPromise);
document.getElementById("btnAsync").addEventListener("click", searchAsync);