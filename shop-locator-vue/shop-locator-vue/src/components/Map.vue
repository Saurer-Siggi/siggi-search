<!-- src/components/Map.vue -->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Search locations or address"
          @keyup.enter="handleSearch"
        />
        <div id="map" style="height: 80vh; width: 100%;"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import axios from 'axios';

interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  google_maps_link: string;
  id: number;
}

export default defineComponent({
  name: 'Map',
  props: {
    shops: {
      type: Array as () => Location[],
      required: true,
    },
  },
  emits: ['update-shops', 'set-user-location'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const locations = ref<Location[]>([]);
    const filteredLocations = ref<Location[]>([]);
    const userLocation = ref<{ latitude: number; longitude: number } | null>(null);
    let map: L.Map;
    let markers: L.LayerGroup;
    let userMarker: L.Marker | null = null;

    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/shops');
        locations.value = response.data.map((location: any) => ({
          ...location,
          lat: location.latitude,
          lng: location.longitude,
        }));
        filteredLocations.value = locations.value;
        emit('update-shops', locations.value);  // Emit the update-shops event
        updateMarkers();
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const updateMarkers = () => {
      if (markers) {
        markers.clearLayers();
      } else {
        markers = L.layerGroup().addTo(map);
      }

      filteredLocations.value.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude]).addTo(markers);
        marker.bindPopup(location.name);
      });
    };

    const filterLocations = () => {
      filteredLocations.value = locations.value.filter(location =>
        location.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
      updateMarkers();
    };

    const handleSearch = async () => {
      const query = searchQuery.value.trim();
      if (query) {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        try {
          const response = await axios.get(geocodeUrl);
          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            map.setView([lat, lon], 13);
          } else {
            alert('Address not found!');
          }
        } catch (error) {
          console.error('Error geocoding address:', error);
        }
      } else {
        filterLocations();
      }
    };

    const setUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          userLocation.value = { latitude, longitude };
          emit('set-user-location', userLocation.value);  // Emit the set-user-location event
          map.setView([latitude, longitude], 13);
          if (userMarker) {
            userMarker.setLatLng([latitude, longitude]);
          } else {
            userMarker = L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
                shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
                iconSize: [38, 95],
                shadowSize: [50, 64],
                iconAnchor: [22, 94],
                shadowAnchor: [4, 62],
                popupAnchor: [-3, -76],
              }),
            }).addTo(map);
            userMarker.bindPopup('You are here').openPopup();
          }
        });
      }
    };

    onMounted(() => {
      map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      fetchLocations();
      setUserLocation();
    });

    return {
      searchQuery,
      handleSearch,
      filteredLocations,
      userLocation,
    };
  },
});
</script>

<style>
#map {
  height: 80vh;
  width: 100%;
}
</style>
