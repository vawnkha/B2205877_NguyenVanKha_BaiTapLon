<template>
  <div class="user-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div class="container-fluid d-flex justify-content-between">
        <router-link to="/" class="navbar-brand fw-bold text-light">
          Thư viện Online
        </router-link>

        <div class="d-flex align-items-center gap-2">
          <router-link to="/user/books" class="btn nav-btn">
            Danh sách sách
          </router-link>

          <router-link to="/user/history" class="btn nav-btn">
            Lịch sử mượn
          </router-link>

          <template v-if="isLoggedIn">
            <button @click="logout" class="btn nav-btn logout">
              Đăng xuất
            </button>
          </template>

          <template v-else>
            <router-link to="/login" class="btn nav-btn">
              Đăng nhập
            </router-link>
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
  name: "UserLayout",

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

<style>
/* Toàn bộ khung layout */
.user-layout {
  background-color: #f2f2f2;
  min-height: 100vh;
}

/* Navbar màu xám đậm */
.bg-dark {
  background-color: #3a3a3a !important;
}

/* Logo thương hiệu */
.navbar-brand {
  font-size: 1.3rem;
}

/* Button hiện đại tông xám */
.nav-btn {
  border-radius: 8px !important;
  border: 1px solid #bfbfbf !important;
  color: #e0e0e0 !important;
  background-color: #4d4d4d !important;
  padding: 6px 14px !important;
  transition: 0.2s ease !important;
  font-weight: 500 !important;
}

.nav-btn:hover {
  background-color: #6b6b6b !important;
  border-color: #d6d6d6 !important;
  color: white !important;
}

/* Nút đăng xuất dễ nhận biết hơn */
.logout {
  background-color: #595959 !important;
}
</style>
