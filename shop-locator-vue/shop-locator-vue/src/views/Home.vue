<!-- src/views/Home.vue -->
<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h1>Welcome to the Shop Locator</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <Map />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import Map from '@/components/Map.vue';
  
  export default {
    name: 'Home',
    components: {
      Map,
    },
  };
  </script>
  