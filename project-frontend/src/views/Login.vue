<template>
  <div class="user-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div class="container-fluid d-flex justify-content-between">
        <div class="navbar-brand fw-bold text-light">Thư viện Online</div>
      </div>
    </nav>

    <main class="p-1">
      <LoginForm
        :error="error"
        @login="handleLogin"
        @go-register="goToRegister"
      />
    </main>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import LoginService from "@/services/login.service";

export default {
  components: { LoginForm },
  data() {
    return {
      error: "",
    };
  },
  methods: {
    async handleLogin(form) {
      try {
        const res = await LoginService.login(form.username, form.password);
        const user = res;

        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "admin") {
          this.$router.push("/admin");
        } else if (user.role === "user") {
          this.$router.push("/user");
        } else {
          this.error = "Không xác định được vai trò người dùng.";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Đăng nhập thất bại";
      }
    },
    goToRegister() {
      this.$router.push("/register");
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
</style>
