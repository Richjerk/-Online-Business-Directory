// main.js

// Helper function to handle form submissions
async function handleFormSubmit(formId, endpoint, successMessage, failureMessage, callback = null) {
  document.getElementById(formId).addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(successMessage);
        if (callback) callback(); // Execute additional logic if provided
      } else {
        alert(failureMessage);
      }
    } catch (error) {
      console.error(`Error submitting form: ${error}`);
      alert(failureMessage);
    }
  });
}

// Geo-location functionality
function initGeoLocation(buttonId) {
  document.getElementById(buttonId).addEventListener('click', () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`Location: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          alert('Error retrieving location.');
        }
      );
    } else {
      alert('Geo-location not supported in this browser.');
    }
  });
}

// Fetch and display registered businesses
async function loadBusinesses() {
  try {
    const response = await fetch('/api/businesses');
    const businesses = await response.json();

    const businessList = document.getElementById('businessList');
    businessList.innerHTML = ''; // Clear previous list

    businesses.forEach((business) => {
      const businessItem = document.createElement('div');
      businessItem.innerHTML = `
        <h3>${business.name}</h3>
        <p>${business.description}</p>
        <p><strong>Address:</strong> ${business.address}</p>
        <p><strong>Phone:</strong> ${business.phone}</p>
        <img src="${business.image}" alt="${business.name}" style="width:100px; height:100px;" />
      `;
      businessList.appendChild(businessItem);
    });
  } catch (error) {
    console.error('Error loading businesses:', error);
  }
}

// Chatbot functionality
function initChatbot(inputId, buttonId, chatWindowId) {
  document.getElementById(buttonId).addEventListener('click', async () => {
    const chatInput = document.getElementById(inputId);
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message to chat window
    const chatWindow = document.getElementById(chatWindowId);
    const userMessage = document.createElement('p');
    userMessage.textContent = `You: ${message}`;
    chatWindow.appendChild(userMessage);

    // Send message to chatbot API
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      // Display chatbot response
      const botMessage = document.createElement('p');
      botMessage.textContent = `Bot: ${data.response}`;
      chatWindow.appendChild(botMessage);

      chatInput.value = ''; // Clear input
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
    }
  });
}

// Initialize map (using Leaflet.js)
function initMap(mapId) {
  const map = L.map(mapId).setView([-26.2041, 28.0473], 10); // Example: Johannesburg coordinates

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Optionally, load business locations from API
  fetch('/api/businesses/locations')
    .then((response) => response.json())
    .then((locations) => {
      locations.forEach((location) => {
        L.marker([location.latitude, location.longitude])
          .addTo(map)
          .bindPopup(`<b>${location.name}</b><br>${location.address}`);
      });
    })
    .catch((error) => console.error('Error loading locations:', error));
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Attach form submissions
  handleFormSubmit('businessForm', '/api/businesses', 'Business registered successfully!', 'Failed to register business.', loadBusinesses);
  handleFormSubmit('userForm', '/api/users', 'User registered successfully!', 'Failed to register user.');
  handleFormSubmit('contactForm', '/api/contact', 'Message sent successfully!', 'Failed to send message.');

  // Initialize geo-location
  initGeoLocation('geoLocationBtn');

  // Initialize chatbot
  initChatbot('chatInput', 'sendChat', 'chatWindow');

  // Initialize map
  initMap('map-container');

  // Load initial business list
  loadBusinesses();
});



