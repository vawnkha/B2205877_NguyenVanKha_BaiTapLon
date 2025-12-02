<template>
  <div class="container-fluid">
    <div class="row d-flex" style="height: 100vh">
      <AdminSidebar />

      <div class="col-10 p-3" style="margin-left: 16.666%; overflow-y: auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/components/AdminSidebar.vue";

export default {
  components: { AdminSidebar },
};
</script>

<style scoped></style>
