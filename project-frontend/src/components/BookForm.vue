<template>
  <Form ref="form" :validation-schema="schema" class="row g-4">
    <div class="col-md-3">
      <label class="form-label fw-semibold">Mã sách</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-barcode"></i>
        </span>
        <Field name="MaSach" v-model="sachLocal.MaSach" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="VD: S001"
          />
        </Field>
      </div>
      <ErrorMessage name="MaSach" class="text-danger small" />
    </div>

    <div class="col-md-3">
      <label class="form-label fw-semibold">Tên sách</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-book"></i>
        </span>
        <Field name="TenSach" v-model="sachLocal.TenSach" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="Nhập tên sách"
          />
        </Field>
      </div>
      <ErrorMessage name="TenSach" class="text-danger small" />
    </div>

    <div class="col-md-3">
      <label class="form-label fw-semibold">Đơn giá</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-money-bill-wave"></i>
        </span>
        <Field name="DonGia" v-model="sachLocal.DonGia" v-slot="{ field }">
          <input
            v-bind="field"
            type="number"
            class="form-control"
            placeholder="VD: 50000"
          />
        </Field>
      </div>
      <ErrorMessage name="DonGia" class="text-danger small" />
    </div>

    <div class="col-md-3">
      <label class="form-label fw-semibold">Số quyển</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-layer-group"></i>
        </span>
        <Field name="SoQuyen" v-model="sachLocal.SoQuyen" v-slot="{ field }">
          <input
            v-bind="field"
            type="number"
            class="form-control"
            placeholder="VD: 10"
          />
        </Field>
      </div>
      <ErrorMessage name="SoQuyen" class="text-danger small" />
    </div>

    <div class="col-md-3">
      <label class="form-label fw-semibold">Năm xuất bản</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-days"></i>
        </span>
        <Field
          name="NamXuatBan"
          v-model="sachLocal.NamXuatBan"
          v-slot="{ field }"
        >
          <input
            v-bind="field"
            type="number"
            class="form-control"
            placeholder="VD: 2023"
          />
        </Field>
      </div>
      <ErrorMessage name="NamXuatBan" class="text-danger small" />
    </div>

    <div class="col-md-3">
      <label class="form-label fw-semibold">Nhà xuất bản</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-building"></i>
        </span>
        <Field name="MaNXB" v-model="sachLocal.MaNXB" v-slot="{ field }">
          <select v-bind="field" class="form-select">
            <option disabled value="">-- Chọn nhà xuất bản --</option>
            <option v-for="nxb in dsNXB" :key="nxb.MaNXB" :value="nxb.MaNXB">
              {{ nxb.TenNXB }} ({{ nxb.MaNXB }})
            </option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="MaNXB" class="text-danger small" />
    </div>

    <div class="col-md-3">
      <label class="form-label fw-semibold">Nguồn gốc / Tác giả</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-pen-nib"></i>
        </span>
        <Field name="NguonGoc" v-model="sachLocal.NguonGoc" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="Nhập tên tác giả hoặc nguồn gốc"
          />
        </Field>
      </div>
      <ErrorMessage name="NguonGoc" class="text-danger small" />
    </div>

    <div class="col-12 mt-4 d-flex justify-content-end gap-2">
      <button
        v-if="sachLocal._id"
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
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: { Form, Field, ErrorMessage },
  props: {
    sach: { type: Object, required: true },
    dsNXB: { type: Array, required: true },
  },
  emits: ["them", "capnhat", "cancel"],
  data() {
    return {
      sachLocal: {},
      schema: yup.object({
        MaSach: yup.string().required("Mã sách là bắt buộc."),
        TenSach: yup.string().required("Tên sách là bắt buộc."),
        DonGia: yup
          .number()
          .typeError("Đơn giá phải là số")
          .positive()
          .nullable(),
        SoQuyen: yup
          .number()
          .typeError("Số quyển phải là số")
          .integer()
          .min(0)
          .nullable(),
        NamXuatBan: yup
          .number()
          .typeError("Năm xuất bản phải là số")
          .min(1000)
          .max(new Date().getFullYear())
          .nullable(),
        MaNXB: yup.string().required("Mã NXB là bắt buộc."),
        NguonGoc: yup.string().nullable(),
      }),
    };
  },
  watch: {
    sach: {
      immediate: true,
      handler(newVal) {
        this.sachLocal = { ...newVal };
      },
    },
  },
  methods: {
    themMoi() {
      this.$emit("them", this.sachLocal);
      this.$refs.form.resetForm();
    },
    capNhat() {
      this.$emit("capnhat", this.sachLocal);
      this.$refs.form.resetForm();
    },
    cancel() {
      this.$refs.form.resetForm();
      this.$emit("cancel");
    },
  },
};
</script>
