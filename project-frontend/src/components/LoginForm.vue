<template>
  <div class="container mt-5 d-flex justify-content-center">
    <div
      class="card shadow p-4 rounded-3"
      style="max-width: 420px; width: 100%"
    >
      <h3 class="mb-3 text-center text-primary fw-bold">Đăng nhập</h3>

      <div v-if="error" class="alert alert-danger text-center py-2">
        {{ error }}
      </div>

      <form @submit.prevent="onLogin" class="mt-3">
        <div class="mb-3">
          <label for="username" class="form-label fw-semibold"
            >Mã đăng nhập</label
          >
          <input
            v-model="form.username"
            type="text"
            id="username"
            class="form-control shadow-sm"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-semibold">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="form-control shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 py-2 shadow-sm fw-semibold mt-2"
        >
          Đăng nhập
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary w-100 py-2 fw-semibold mt-2"
          @click="$emit('go-register')"
        >
          Đăng ký tài khoản độc giả
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: String,
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    onLogin() {
      this.$emit("login", this.form);
    },
  },
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 14px;
}
input {
  border-radius: 8px !important;
}
button {
  border-radius: 8px !important;
}
</style>
