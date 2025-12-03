<template>
  <Form ref="form" :validation-schema="schema" class="row g-4">
    <div class="col-md-4">
      <label class="form-label fw-semibold">Mã độc giả</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-hashtag"></i>
        </span>
        <Field
          name="MaDocGia"
          v-model="docGiaLocal.MaDocGia"
          v-slot="{ field }"
        >
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="VD: DG001"
          />
        </Field>
      </div>
      <ErrorMessage name="MaDocGia" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Họ</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-user"></i>
        </span>
        <Field name="HoLot" v-model="docGiaLocal.HoLot" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="Nhập họ"
          />
        </Field>
      </div>
      <ErrorMessage name="HoLot" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Tên</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-user"></i>
        </span>
        <Field name="Ten" v-model="docGiaLocal.Ten" v-slot="{ field }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="Nhập tên"
          />
        </Field>
      </div>
      <ErrorMessage name="Ten" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Ngày sinh</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-days"></i>
        </span>
        <Field
          name="NgaySinh"
          v-model="docGiaLocal.NgaySinh"
          v-slot="{ field }"
        >
          <input v-bind="field" type="date" class="form-control" />
        </Field>
      </div>
      <ErrorMessage name="NgaySinh" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Phái</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-venus-mars"></i>
        </span>
        <Field name="Phai" v-model="docGiaLocal.Phai" v-slot="{ field }">
          <select v-bind="field" class="form-select">
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="Phai" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Địa chỉ</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-location-dot"></i>
        </span>
        <Field name="DiaChi" v-model="docGiaLocal.DiaChi" v-slot="{ field }">
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

    <div class="col-md-4">
      <label class="form-label fw-semibold">Điện thoại</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-phone"></i>
        </span>
        <Field
          name="DienThoai"
          v-model="docGiaLocal.DienThoai"
          v-slot="{ field }"
        >
          <input
            v-bind="field"
            type="text"
            class="form-control"
            placeholder="VD: 0987654321"
          />
        </Field>
      </div>
      <ErrorMessage name="DienThoai" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Mật khẩu</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-lock"></i>
        </span>
        <Field
          name="Password"
          v-model="docGiaLocal.Password"
          v-slot="{ field }"
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

    <div class="col-12 mt-4 d-flex justify-content-end gap-2">
      <button
        v-if="docGiaLocal._id"
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
    docgia: { type: Object, required: true },
  },
  emits: ["them", "capnhat", "cancel"],
  data() {
    return {
      docGiaLocal: {},
      schema: yup.object({
        MaDocGia: yup.string().required("Mã độc giả là bắt buộc."),
        HoLot: yup.string().required("Họ lót là bắt buộc."),
        Ten: yup.string().required("Tên là bắt buộc."),
        NgaySinh: yup.string().nullable(),
        Phai: yup.string().required(),
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
  watch: {
    docgia: {
      immediate: true,
      handler(newVal) {
        this.docGiaLocal = { ...newVal };
      },
    },
  },
  methods: {
    capNhat() {
      this.$emit("capnhat", this.docGiaLocal);
      this.$refs.form.resetForm();
    },
    themMoi() {
      this.$emit("them", this.docGiaLocal);
      this.$refs.form.resetForm();
    },
    cancel() {
      this.$refs.form.resetForm();
      this.$emit("cancel");
    },
  },
};
</script>
