<template>
  <Form :validation-schema="schema" @submit="onSubmit" class="row g-3">
    <div class="col-md-6">
      <label class="form-label fw-semibold">Mã Độc Giả</label>
      <Field name="MaDocGia" v-model="form.MaDocGia" v-slot="{ field }">
        <input
          v-bind="field"
          type="text"
          class="form-control shadow-sm"
          placeholder="Nhập mã độc giả"
        />
      </Field>
      <ErrorMessage name="MaDocGia" class="text-danger small" />
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold">Họ lót</label>
      <Field name="HoLot" v-model="form.HoLot" v-slot="{ field }">
        <input
          v-bind="field"
          type="text"
          class="form-control shadow-sm"
          placeholder="Nhập họ lót"
        />
      </Field>
      <ErrorMessage name="HoLot" class="text-danger small" />
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold">Tên</label>
      <Field name="Ten" v-model="form.Ten" v-slot="{ field }">
        <input
          v-bind="field"
          type="text"
          class="form-control shadow-sm"
          placeholder="Nhập tên"
        />
      </Field>
      <ErrorMessage name="Ten" class="text-danger small" />
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold">Ngày sinh</label>
      <Field name="NgaySinh" v-model="form.NgaySinh" v-slot="{ field }">
        <input v-bind="field" type="date" class="form-control shadow-sm" />
      </Field>
      <ErrorMessage name="NgaySinh" class="text-danger small" />
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold">Phái</label>
      <Field name="Phai" v-model="form.Phai" v-slot="{ field }">
        <select v-bind="field" class="form-select shadow-sm">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </Field>
      <ErrorMessage name="Phai" class="text-danger small" />
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold">Địa chỉ</label>
      <Field name="DiaChi" v-model="form.DiaChi" v-slot="{ field }">
        <input
          v-bind="field"
          type="text"
          class="form-control shadow-sm"
          placeholder="Nhập địa chỉ"
        />
      </Field>
      <ErrorMessage name="DiaChi" class="text-danger small" />
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold">Điện thoại</label>
      <Field name="DienThoai" v-model="form.DienThoai" v-slot="{ field }">
        <input
          v-bind="field"
          type="text"
          class="form-control shadow-sm"
          placeholder="Số điện thoại"
        />
      </Field>
      <ErrorMessage name="DienThoai" class="text-danger small" />
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold">Mật khẩu</label>
      <Field name="Password" v-model="form.Password" v-slot="{ field }">
        <input
          v-bind="field"
          type="password"
          class="form-control shadow-sm"
          placeholder="Nhập mật khẩu"
        />
      </Field>
      <ErrorMessage name="Password" class="text-danger small" />
    </div>
    <div class="col-12 mt-3">
      <button
        type="submit"
        class="btn btn-primary w-100 py-2 shadow-sm fw-semibold"
      >
        Đăng ký
      </button>
    </div>
    <div class="col-12 mt-2">
      <router-link
        to="/login"
        class="btn btn-outline-secondary w-100 py-2 shadow-sm fw-semibold"
      >
        Trở về Đăng nhập
      </router-link>
    </div>
  </Form>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  components: { Form, Field, ErrorMessage },
  props: { modelValue: { type: Object, required: true } },
  emits: ["update:modelValue", "submit"],
  computed: {
    form: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  data() {
    return {
      schema: yup.object({
        MaDocGia: yup.string().required("Mã độc giả là bắt buộc."),
        HoLot: yup.string().required("Họ lót là bắt buộc."),
        Ten: yup.string().required("Tên là bắt buộc."),
        NgaySinh: yup.string().nullable(),
        Phai: yup.string().required("Phái là bắt buộc."),
        DiaChi: yup.string().nullable(),
        DienThoai: yup
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
  methods: {
    onSubmit() {
      this.$emit("submit");
    },
  },
};
</script>
<style scoped>
input,
select {
  border-radius: 8px !important;
}
</style>
