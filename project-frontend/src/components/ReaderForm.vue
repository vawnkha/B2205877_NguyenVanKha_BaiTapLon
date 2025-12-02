<template>
  <Form ref="form" :validation-schema="schema" class="row g-3 mb-4">
    <div class="col-md-4">
      <label>Mã độc giả</label>
      <Field name="MaDocGia" v-model="docGiaLocal.MaDocGia" v-slot="{ field }">
        <input v-bind="field" type="text" class="form-control" />
      </Field>
      <ErrorMessage name="MaDocGia" class="text-danger" />
    </div>

    <div class="col-md-4">
      <label>Họ lót</label>
      <Field name="HoLot" v-model="docGiaLocal.HoLot" v-slot="{ field }">
        <input v-bind="field" type="text" class="form-control" />
      </Field>
      <ErrorMessage name="HoLot" class="text-danger" />
    </div>

    <div class="col-md-4">
      <label>Tên</label>
      <Field name="Ten" v-model="docGiaLocal.Ten" v-slot="{ field }">
        <input v-bind="field" type="text" class="form-control" />
      </Field>
      <ErrorMessage name="Ten" class="text-danger" />
    </div>

    <div class="col-md-4">
      <label>Ngày sinh</label>
      <Field name="NgaySinh" v-model="docGiaLocal.NgaySinh" v-slot="{ field }">
        <input v-bind="field" type="date" class="form-control" />
      </Field>
      <ErrorMessage name="NgaySinh" class="text-danger" />
    </div>

    <div class="col-md-4">
      <label>Phái</label>
      <Field name="Phai" v-model="docGiaLocal.Phai" v-slot="{ field }">
        <select v-bind="field" class="form-select">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </Field>
      <ErrorMessage name="Phai" class="text-danger" />
    </div>

    <div class="col-md-4">
      <label>Địa chỉ</label>
      <Field name="DiaChi" v-model="docGiaLocal.DiaChi" v-slot="{ field }">
        <input v-bind="field" type="text" class="form-control" />
      </Field>
      <ErrorMessage name="DiaChi" class="text-danger" />
    </div>

    <div class="col-md-4">
      <label>Điện thoại</label>
      <Field
        name="DienThoai"
        v-model="docGiaLocal.DienThoai"
        v-slot="{ field }"
      >
        <input v-bind="field" type="text" class="form-control" />
      </Field>
      <ErrorMessage name="DienThoai" class="text-danger" />
    </div>

    <div class="col-md-4">
      <label>Mật khẩu</label>
      <Field name="Password" v-model="docGiaLocal.Password" v-slot="{ field }">
        <input v-bind="field" type="password" class="form-control" />
      </Field>
      <ErrorMessage name="Password" class="text-danger" />
    </div>

    <div class="col-12">
      <template v-if="docGiaLocal._id">
        <button type="button" class="btn btn-warning" @click="capNhat">
          Cập nhật
        </button>
      </template>
      <template v-else>
        <button type="button" class="btn btn-success" @click="themMoi">
          Thêm mới
        </button>
      </template>
      <button type="button" class="btn btn-secondary ms-2" @click="cancel">
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
