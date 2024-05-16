document.addEventListener('DOMContentLoaded', async function () {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    const addressInput = document.getElementById('address-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', handleAddressSearch);

    // Function to handle address search
    async function handleAddressSearch() {
        const address = addressInput.value;
        if (address) {
            try {
                const userLocation = await geocodeAddress(address);
                await fetchAndDisplayShops(userLocation);
            } catch (error) {
                console.error('Error searching for address:', error);
            }
        }
    }

    // Function to geocode address using OpenStreetMap's Nominatim service
    async function geocodeAddress(address) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return L.latLng(lat, lon);
        } else {
            throw new Error('No location found for the provided address.');
        }
    }

    // Function to fetch shop locations from the backend API and display them on the map
    async function fetchAndDisplayShops(userLocation) {
        try {
            const { lat, lng } = userLocation;
            const response = await fetch(`http://localhost:8000/shops/?latitude=${lat}&longitude=${lng}`);
            const shops = await response.json();

            shops.forEach(shop => {
                L.marker([shop.latitude, shop.longitude])
                    .addTo(map)
                    .bindPopup(`
                        <b>${shop.name}</b><br>
                        ${shop.address}<br>
                        <a href="${shop.google_maps_link}" target="_blank">View on Google Maps</a>
                    `);
            });

            const bounds = L.latLngBounds([userLocation, ...shops.map(shop => [shop.latitude, shop.longitude])]);
            map.fitBounds(bounds);
        } catch (error) {
            console.error('Error fetching shop locations:', error);
        }
    }

    // Function to handle geolocation
    async function handleGeolocation() {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;
                const userLocation = L.latLng(latitude, longitude);
                await fetchAndDisplayShops(userLocation);
            } catch (error) {
                console.error('Error getting user location:', error);
            }
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    // Call the geolocation function
    handleGeolocation();
});