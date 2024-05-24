<!-- src/views/Admin.vue -->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Admin Panel</h1>
        <ShopForm @shop-added="handleShopAdded" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert v-if="successMessage" type="success">{{ successMessage }}</v-alert>
        <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ShopForm from '@/components/ShopForm.vue';

export default {
  name: 'Admin',
  components: {
    ShopForm,
  },
  data() {
    return {
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    handleShopAdded(shop) {
      this.successMessage = 'Shop added successfully!';
      this.errorMessage = '';
      // Handle the newly added shop if needed
    },
  },
};
</script>

<style scoped>
h1 {
  margin-top: 0;
}
</style>
