<!-- src/components/LoginForm.vue -->
<template>
    <div>
      <v-form @submit.prevent="login">
        <v-text-field label="Username" outlined v-model="username"></v-text-field>
        <v-text-field label="Password" type="password" outlined v-model="password"></v-text-field>
        <v-btn color="primary" type="submit">Login</v-btn>
      </v-form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginForm',
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      login() {
        // Add your login functionality here
        console.log('Login with username:', this.username);
        console.log('Password:', this.password);
      },
    },
  };
  </script>