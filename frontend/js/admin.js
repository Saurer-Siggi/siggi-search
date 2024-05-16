import { isAuthenticated, logout } from './auth.js';

// Check if the user is authenticated
if (!isAuthenticated()) {
  // Redirect to the login page if not authenticated
  window.location.href = 'login.html';
}

const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () => {
  logout();
  // Redirect to the login page after logout
  window.location.href = 'login.html';
});

const addShopForm = document.getElementById('addShopForm');

addShopForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const googleMapsLink = document.getElementById('googleMapsLink').value;

  const shopData = {
    name,
    address,
    latitude,
    longitude,
    google_maps_link: googleMapsLink
  };

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/shops/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shopData),
    });

    if (response.ok) {
      alert('Shop added successfully');
      addShopForm.reset();
    } else {
      throw new Error('Failed to add shop');
    }
  } catch (error) {
    console.error('Error adding shop:', error);
    alert('Failed to add shop. Please try again.');
  }
});