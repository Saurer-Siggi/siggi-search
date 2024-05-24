<!-- src/App.vue -->
<template>
    <v-app>
      <v-app-bar app>
        <v-toolbar-title>Shop Locator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/">Home</v-btn>
        <v-btn text to="/admin">Admin</v-btn>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { RouterView } from 'vue-router';
  </script>
  
  <style>
  /* Your styles here */
  </style>
  