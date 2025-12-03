<template>
  <Form ref="form" :validation-schema="schema" class="row g-4">
    <div class="col-md-4">
      <label class="form-label fw-semibold">Mã NXB</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-hashtag"></i>
        </span>
        <Field name="MaNXB" v-model="nxbLocal.MaNXB" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="VD: NXB001"
          />
        </Field>
      </div>
      <ErrorMessage name="MaNXB" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Tên NXB</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-building"></i>
        </span>
        <Field name="TenNXB" v-model="nxbLocal.TenNXB" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="Nhập tên nhà xuất bản"
          />
        </Field>
      </div>
      <ErrorMessage name="TenNXB" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Địa chỉ</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-location-dot"></i>
        </span>
        <Field name="DiaChi" v-model="nxbLocal.DiaChi" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="Nhập địa chỉ"
          />
        </Field>
      </div>
      <ErrorMessage name="DiaChi" class="text-danger small" />
    </div>

    <div class="col-12 mt-4 d-flex justify-content-end gap-2">
      <button
        v-if="nxbLocal._id"
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
    nxb: { type: Object, required: true },
  },
  emits: ["them", "capnhat", "cancel"],
  data() {
    return {
      nxbLocal: {},
      schema: yup.object({
        MaNXB: yup.string().required("Mã NXB là bắt buộc."),
        TenNXB: yup.string().required("Tên NXB là bắt buộc."),
        DiaChi: yup.string().nullable(),
      }),
    };
  },
  watch: {
    nxb: {
      immediate: true,
      handler(newVal) {
        this.nxbLocal = { ...newVal };
      },
    },
  },
  methods: {
    themMoi() {
      this.$emit("them", this.nxbLocal);
      this.$refs.form.resetForm();
    },
    capNhat() {
      this.$emit("capnhat", this.nxbLocal);
      this.$refs.form.resetForm();
    },
    cancel() {
      this.$refs.form.resetForm();
      this.$emit("cancel");
    },
  },
};
</script>
