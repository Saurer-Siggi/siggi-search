<!-- src/components/AddressSearch.vue -->
<template>
    <div>
      <v-text-field label="Search address" outlined v-model="searchAddress"></v-text-field>
      <v-btn color="primary" @click="searchShops">Search</v-btn>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AddressSearch',
    data() {
      return {
        searchAddress: '',
      };
    },
    methods: {
      searchShops() {
        // Add your search functionality here
        console.log('Searching for shops near:', this.searchAddress);
      },
    },
  };
  </script>