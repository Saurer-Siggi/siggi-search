<!-- src/views/Admin.vue -->
<template>
    <div>
      <h1>Admin</h1>
      <AdminDashboard />
    </div>
  </template>
  
  <script>
  import AdminDashboard from '@/components/AdminDashboard.vue';
  
  export default {
    name: 'Admin',
    components: {
      AdminDashboard,
    },
  };
  </script>