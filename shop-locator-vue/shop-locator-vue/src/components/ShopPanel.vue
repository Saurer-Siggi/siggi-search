<!-- src/components/ShopPanel.vue -->
<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h2>Nearest Shops</h2>
          <v-alert v-if="!userLocation" type="info">Determining your location...</v-alert>
          <v-alert v-if="userLocation && nearestShops.length === 0" type="info">No shops found nearby.</v-alert>
          <v-row v-if="nearestShops.length > 0">
            <v-col v-for="shop in nearestShops" :key="shop.id" cols="12">
              <v-card>
                <v-card-title>{{ shop.name }}</v-card-title>
                <v-card-subtitle>{{ shop.address }}</v-card-subtitle>
                <v-card-text>Distance: {{ shop.distance.toFixed(2) }} km</v-card-text>
                <v-card-actions>
                  <v-btn :href="shop.google_maps_link" target="_blank">View on Map</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  
  interface Location {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    google_maps_link: string;
    id: number;
    distance?: number; // Distance in kilometers
  }
  
  export default defineComponent({
    name: 'ShopPanel',
    props: {
      shops: {
        type: Array as () => Location[],
        required: true,
      },
      userLocation: {
        type: Object as () => { latitude: number; longitude: number } | null,
        required: true,
      },
    },
    setup(props) {
      const nearestShops = computed(() => {
        if (!props.userLocation) return [];
        return props.shops
          .map(shop => ({
            ...shop,
            distance: getDistanceFromLatLonInKm(
              props.userLocation!.latitude,
              props.userLocation!.longitude,
              shop.latitude,
              shop.longitude
            ),
          }))
          .sort((a, b) => a.distance! - b.distance!);
      });
  
      const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };
  
      const deg2rad = (deg: number): number => {
        return deg * (Math.PI / 180);
      };
  
      return {
        nearestShops,
      };
    },
  });
  </script>
  
  <style scoped>
  h2 {
    margin-top: 0;
  }
  </style>
  