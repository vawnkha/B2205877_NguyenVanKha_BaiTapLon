<template>
  <div class="user-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">Thư viện Online</router-link>
        <div>
          <router-link to="/user/books" class="btn btn-outline-light me-2"
            >Danh sách sách</router-link
          >
          <router-link to="/user/history" class="btn btn-outline-light"
            >Lịch sử mượn</router-link
          >

          <template v-if="isLoggedIn">
            <button @click="logout" class="btn btn-outline-light ms-2">
              Đăng xuất
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-light ms-2"
              >Đăng nhập</router-link
            >
          </template>
        </div>
      </div>
    </nav>

    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("user");
    },
  },
  methods: {
    logout() {
      const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
      if (confirmLogout) {
        localStorage.removeItem("user");
        this.$router.push("/login");
      }
    },
  },
};
</script>
