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
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div id="map" style="height: 80vh; width: 100%;"></div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import 'leaflet/dist/leaflet.css';
  import * as L from 'leaflet';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'Map',
    setup() {
      const searchQuery = ref('');
      const locations = ref([]);
      const filteredLocations = ref([]);
      let map: L.Map;
      let markers: L.LayerGroup;
  
      const fetchLocations = async () => {
        try {
          const response = await axios.get('http://localhost:8000/shops');
          locations.value = response.data.map(location => ({
            ...location,
            lat: location.latitude,
            lng: location.longitude
          }));
          filteredLocations.value = locations.value;
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
          const marker = L.marker([location.lat, location.lng]).addTo(markers);
          marker.bindPopup(location.name);
        });
      };
  
      const filterLocations = () => {
        filteredLocations.value = locations.value.filter((location) =>
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
            map.setView([latitude, longitude], 13);
          });
        }
      };
  
      onMounted(() => {
        map = L.map('map').setView([48.783333, 9.183333], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
  
        fetchLocations();
        setUserLocation();
      });
  
      return {
        searchQuery,
        handleSearch,
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
  