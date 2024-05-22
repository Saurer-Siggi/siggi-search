<template>
    <v-list>
      <v-list-item v-for="shop in shops" :key="shop.id">
        <v-list-item-title>{{ shop.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ shop.address }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </template>
  
  <script>
  export default {
    name: 'ShopList',
    data() {
      return {
        shops: [
          { id: 1, name: 'Shop 1', address: '123 Main St' },
          { id: 2, name: 'Shop 2', address: '456 Elm St' },
          // Add more shop objects as needed
        ],
      };
    },
  };
  </script>