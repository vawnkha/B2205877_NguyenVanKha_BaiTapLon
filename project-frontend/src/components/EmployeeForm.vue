<template>
  <Form ref="form" :validation-schema="schema">
    <div class="row g-4">
      <!-- MSNV -->
      <div class="col-md-4">
        <label class="form-label fw-semibold">Mã nhân viên</label>
        <div class="input-group">
          <span class="input-group-text bg-light">
            <i class="fa-solid fa-hashtag"></i>
          </span>
          <Field name="MSNV" v-slot="{ field }" v-model="nhanvienLocal.MSNV">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              placeholder="VD: NV001"
            />
          </Field>
        </div>
        <ErrorMessage name="MSNV" class="text-danger small" />
      </div>

      <!-- Họ tên -->
      <div class="col-md-4">
        <label class="form-label fw-semibold">Họ tên</label>
        <div class="input-group">
          <span class="input-group-text bg-light">
            <i class="fa-solid fa-user"></i>
          </span>
          <Field
            name="HoTenNV"
            v-slot="{ field }"
            v-model="nhanvienLocal.HoTenNV"
          >
            <input
              v-bind="field"
              type="text"
              class="form-control"
              placeholder="Nhập họ tên nhân viên"
            />
          </Field>
        </div>
        <ErrorMessage name="HoTenNV" class="text-danger small" />
      </div>

      <!-- Chức vụ -->
      <div class="col-md-4">
        <label class="form-label fw-semibold">Chức vụ</label>
        <div class="input-group">
          <span class="input-group-text bg-light">
            <i class="fa-solid fa-briefcase"></i>
          </span>
          <Field
            name="Chucvu"
            v-slot="{ field }"
            v-model="nhanvienLocal.Chucvu"
          >
            <input
              v-bind="field"
              type="text"
              class="form-control"
              placeholder="VD: Quản lý, Nhân viên"
            />
          </Field>
        </div>
        <ErrorMessage name="Chucvu" class="text-danger small" />
      </div>

      <!-- Địa chỉ -->
      <div class="col-md-4">
        <label class="form-label fw-semibold">Địa chỉ</label>
        <div class="input-group">
          <span class="input-group-text bg-light">
            <i class="fa-solid fa-location-dot"></i>
          </span>
          <Field
            name="Diachi"
            v-slot="{ field }"
            v-model="nhanvienLocal.Diachi"
          >
            <input
              v-bind="field"
              type="text"
              class="form-control"
              placeholder="Nhập địa chỉ nhân viên"
            />
          </Field>
        </div>
        <ErrorMessage name="Diachi" class="text-danger small" />
      </div>

      <!-- Số điện thoại -->
      <div class="col-md-4">
        <label class="form-label fw-semibold">Số điện thoại</label>
        <div class="input-group">
          <span class="input-group-text bg-light">
            <i class="fa-solid fa-phone"></i>
          </span>
          <Field
            name="SoDienThoai"
            v-slot="{ field }"
            v-model="nhanvienLocal.SoDienThoai"
          >
            <input
              v-bind="field"
              type="text"
              class="form-control"
              placeholder="VD: 0987654321"
            />
          </Field>
        </div>
        <ErrorMessage name="SoDienThoai" class="text-danger small" />
      </div>

      <!-- Mật khẩu -->
      <div class="col-md-4">
        <label class="form-label fw-semibold">Mật khẩu</label>
        <div class="input-group">
          <span class="input-group-text bg-light">
            <i class="fa-solid fa-lock"></i>
          </span>
          <Field
            name="Password"
            v-slot="{ field }"
            v-model="nhanvienLocal.Password"
          >
            <input
              v-bind="field"
              type="password"
              class="form-control"
              placeholder="Tối thiểu 4 ký tự"
            />
          </Field>
        </div>
        <ErrorMessage name="Password" class="text-danger small" />
      </div>

      <!-- Buttons -->
      <div class="col-12 mt-4 d-flex justify-content-end gap-2">
        <button
          v-if="nhanvienLocal._id"
          type="button"
          class="btn btn-warning d-flex align-items-center px-4"
          @click="capNhat"
        >
          <i class="fa-solid fa-pen-to-square me-2"></i>
          Cập nhật
        </button>

        <button
          v-else
          type="button"
          class="btn btn-success d-flex align-items-center px-4"
          @click="themMoi"
        >
          <i class="fa-solid fa-plus me-2"></i>
          Thêm mới
        </button>

        <button
          type="button"
          class="btn btn-secondary d-flex align-items-center px-4"
          @click="cancel"
        >
          <i class="fa-solid fa-xmark me-2"></i>
          Hủy
        </button>
      </div>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    nhanvien: { type: Object, required: true },
  },
  emits: ["them", "capnhat", "cancel"],
  data() {
    return {
      nhanvienLocal: {},
      schema: yup.object({
        MSNV: yup.string().required("Mã nhân viên là bắt buộc."),
        HoTenNV: yup.string().required("Họ tên là bắt buộc."),
        Chucvu: yup.string(),
        Diachi: yup.string(),
        SoDienThoai: yup
          .string()
          .matches(/^(\+?\d{10,11})$/, "Số điện thoại không hợp lệ.")
          .nullable(),
        Password: yup
          .string()
          .required("Mật khẩu là bắt buộc.")
          .min(4, "Mật khẩu phải ít nhất 4 ký tự."),
      }),
    };
  },
  watch: {
    nhanvien: {
      immediate: true,
      handler(newVal) {
        this.nhanvienLocal = { ...newVal };
      },
    },
  },
  methods: {
    capNhat() {
      this.$emit("capnhat", this.nhanvienLocal);
      this.$refs.form.resetForm();
    },
    themMoi() {
      this.$emit("them", this.nhanvienLocal);
      this.$refs.form.resetForm();
    },
    cancel() {
      this.$refs.form.resetForm();
      this.$emit("cancel");
    },
  },
};
</script>
