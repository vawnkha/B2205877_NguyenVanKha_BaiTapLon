<template>
  <div
    class="sidebar d-flex flex-column justify-content-between text-white p-4"
  >
    <div>
      <div class="text-center mb-4">
        <img :src="logo" class="img-fluid w-75 mt-2 mb-3 logo" alt="Logo" />
        <p class="fs-5 fw-semibold">{{ currentUserName }}</p>
      </div>

      <ul class="list-unstyled fs-5">
        <li v-for="item in menu" :key="item.text" class="menu-item mb-2">
          <router-link
            :to="item.to"
            class="text-decoration-none text-white d-flex align-items-center gap-3 px-3 py-2"
          >
            <i :class="item.icon" class="me-2"></i>
            <span>{{ item.text }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div>
      <button
        @click="logout"
        class="btn btn-outline-light w-100 py-2 fw-semibold logout-btn"
      >
        Đăng xuất
      </button>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/logo.webp";

export default {
  data() {
    return {
      logo,
      menu: [
        {
          text: "Nhân viên",
          to: "/admin/nhan-vien",
          icon: "fa-solid fa-user-tie",
        },
        { text: "Độc giả", to: "/admin/doc-gia", icon: "fa-solid fa-user" },
        { text: "Sách", to: "/admin/sach", icon: "fa-solid fa-book-open" },
        {
          text: "NXB",
          to: "/admin/nha-xuat-ban",
          icon: "fa-solid fa-newspaper",
        },
        {
          text: "Phiếu Mượn",
          to: "/admin/muon-sach",
          icon: "fa-solid fa-file-signature",
        },
        {
          text: "Trả Sách",
          to: "/admin/tra-sach",
          icon: "fa-solid fa-arrow-rotate-left",
        },
      ],
    };
  },
  computed: {
    currentUserName() {
      const data = JSON.parse(localStorage.getItem("user"));
      return data?.user?.HoTenNV || "Admin";
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

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 16.666%;
  background: linear-gradient(180deg, #0747c6, #312949);
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
}

.logo {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.menu-item a {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item a:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.logout-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
</style>
