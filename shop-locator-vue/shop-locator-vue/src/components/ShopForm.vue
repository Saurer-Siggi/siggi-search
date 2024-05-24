<!-- src/components/ShopForm.vue -->
<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-text-field v-model="shop.name" :rules="[v => !!v || 'Name is required']" label="Name" required></v-text-field>
    <v-text-field v-model="shop.address" :rules="[v => !!v || 'Address is required']" label="Address" required></v-text-field>
    <v-text-field v-model="shop.latitude" :rules="[v => !!v || 'Latitude is required']" label="Latitude" required></v-text-field>
    <v-text-field v-model="shop.longitude" :rules="[v => !!v || 'Longitude is required']" label="Longitude" required></v-text-field>
    <v-text-field v-model="shop.google_maps_link" :rules="[v => !!v || 'Google Maps link is required']" label="Google Maps Link" required></v-text-field>
    <v-btn :disabled="!valid" @click="submitForm">Add Shop</v-btn>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

interface Shop {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  google_maps_link: string;
}

export default defineComponent({
  name: 'ShopForm',
  emits: ['shop-added'],
  setup(_, { emit }) {
    const form = ref(null);
    const valid = ref(false);
    const shop = ref<Shop>({
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      google_maps_link: '',
    });
    const successMessage = ref('');
    const errorMessage = ref('');

    const submitForm = async () => {
      if (form.value && form.value.validate()) {
        try {
          await axios.post('http://localhost:8000/shops', shop.value);
          successMessage.value = 'Shop added successfully!';
          errorMessage.value = '';
          emit('shop-added', shop.value);
          shop.value = {
            name: '',
            address: '',
            latitude: 0,
            longitude: 0,
            google_maps_link: '',
          };
        } catch (error) {
          successMessage.value = '';
          errorMessage.value = 'Failed to add shop. Please try again.';
        }
      }
    };

    return {
      form,
      valid,
      shop,
      submitForm,
      successMessage,
      errorMessage,
    };
  },
});
</script>

<style scoped>
</style>
