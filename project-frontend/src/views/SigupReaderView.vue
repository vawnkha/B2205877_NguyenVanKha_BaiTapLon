<template>
  <div class="user-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div class="container-fluid d-flex justify-content-between">
        <div class="navbar-brand fw-bold text-light">Thư viện Online</div>
      </div>
    </nav>

    <main class="p-1">
      <div class="container mt-4 d-flex justify-content-center">
        <div
          class="card shadow p-4 rounded-3"
          style="max-width: 600px; width: 100%"
        >
          <h3 class="mb-3 text-center text-primary fw-bold">
            Đăng ký tài khoản độc giả
          </h3>

          <div v-if="error" class="alert alert-danger text-center py-2">
            {{ error }}
          </div>

          <div v-if="success" class="alert alert-success text-center py-2">
            {{ success }}
            <div class="mt-3">
              <router-link to="/login" class="btn btn-outline-primary px-4">
                Trở về Đăng nhập
              </router-link>
            </div>
          </div>

          <FormDangKyDocGia v-if="!success" v-model="form" @submit="register" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import FormDangKyDocGia from "@/components/SigupForm.vue";
import ReaderService from "@/services/reader.service";

export default {
  components: { FormDangKyDocGia },
  data() {
    return {
      form: {
        MaDocGia: "",
        HoLot: "",
        Ten: "",
        NgaySinh: "",
        Phai: "Nam",
        DiaChi: "",
        DienThoai: "",
        Password: "",
      },
      error: "",
      success: "",
    };
  },
  methods: {
    async register() {
      this.error = "";
      this.success = "";
      try {
        await ReaderService.create(this.form);
        this.success = "Đăng ký thành công! Bạn có thể đăng nhập.";
      } catch (err) {
        this.error = err.response?.data?.message || "Đăng ký thất bại.";
      }
    },
  },
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 14px;
}
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
