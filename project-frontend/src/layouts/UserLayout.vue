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
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
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
.user-layout {
  background-color: #f2f2f2;
  min-height: 100vh;
}

.bg-dark {
  background: linear-gradient(180deg, #312949, #0747c6);
}

.navbar-brand {
  font-size: 1.3rem;
}

.nav-btn {
  border-radius: 18px !important;
  border: 1px solid #bfbfbf !important;
  color: #e0e0e0 !important;
  background-color: #077bff !important;
  padding: 6px 14px !important;
  transition: 0.2s ease !important;
  font-weight: 500 !important;
}

.nav-btn:hover {
  background-color: #0056b3 !important;
  border-color: #d6d6d6 !important;
  color: white !important;
}

.logout {
  background-color: white !important;
  color: black !important;
}
.logout:hover {
  background-color: rgb(223, 2, 2) !important;
}
</style>
