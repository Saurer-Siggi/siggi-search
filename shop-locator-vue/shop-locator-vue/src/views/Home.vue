<!-- src/views/Home.vue -->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Welcome to the Shop Locator</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <Map :shops="shops" @update-shops="updateShops" @set-user-location="setUserLocation" />
      </v-col>
      <v-col cols="3">
        <ShopPanel :shops="shops" :userLocation="userLocation" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Map from '@/components/Map.vue';
import ShopPanel from '@/components/ShopPanel.vue';

export default {
  name: 'Home',
  components: {
    Map,
    ShopPanel,
  },
  data() {
    return {
      shops: [],
      userLocation: null,
    };
  },
  methods: {
    updateShops(shops) {
      this.shops = shops;
    },
    setUserLocation(location) {
      this.userLocation = location;
    },
  },
};
</script>

<style scoped>
h1 {
  margin-top: 0;
}
</style>
