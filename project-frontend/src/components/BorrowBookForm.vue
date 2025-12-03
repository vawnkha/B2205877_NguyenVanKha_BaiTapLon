<template>
  <Form ref="form" :validation-schema="schema" class="row g-4">
    <div class="col-md-4">
      <label class="form-label fw-semibold">Độc giả</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-user"></i>
        </span>
        <Field name="MaDocGia" v-model="local.MaDocGia" v-slot="{ field }">
          <select v-bind="field" class="form-select">
            <option value="">-- Chọn độc giả --</option>
            <option
              v-for="docGia in docGias"
              :key="docGia.MaDocGia"
              :value="docGia.MaDocGia"
            >
              {{ docGia.MaDocGia }} - {{ docGia.HoLot }} {{ docGia.Ten }}
            </option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="MaDocGia" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Sách</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-book"></i>
        </span>
        <Field name="MaSach" v-model="local.MaSach" v-slot="{ field }">
          <select v-bind="field" class="form-select">
            <option value="">-- Chọn sách --</option>
            <option
              v-for="sach in sachs"
              :key="sach.MaSach"
              :value="sach.MaSach"
            >
              {{ sach.MaSach }} - {{ sach.TenSach }}
            </option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="MaSach" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Ngày mượn</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-days"></i>
        </span>
        <Field name="NgayMuon" v-model="local.NgayMuon" v-slot="{ field }">
          <input v-bind="field" type="date" class="form-control" />
        </Field>
      </div>
      <ErrorMessage name="NgayMuon" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Ngày trả</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-days"></i>
        </span>
        <Field name="NgayTra" v-model="local.NgayTra" v-slot="{ field }">
          <input v-bind="field" type="date" class="form-control" />
        </Field>
      </div>
      <ErrorMessage name="NgayTra" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Trạng thái</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-info-circle"></i>
        </span>
        <Field name="TrangThai" v-model="local.TrangThai" v-slot="{ field }">
          <select
            v-bind="field"
            class="form-select"
            :disabled="isTrangThaiDisabled"
          >
            <option
              v-for="trangThai in trangThaiOptions"
              :key="trangThai"
              :value="trangThai"
            >
              {{ trangThai }}
            </option>
          </select>
        </Field>
      </div>
      <ErrorMessage name="TrangThai" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Ngày trả thực</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-check"></i>
        </span>
        <Field
          name="NgayTraThuc"
          v-model="local.NgayKetThuc"
          v-slot="{ field }"
        >
          <input v-bind="field" type="date" class="form-control" disabled />
        </Field>
      </div>
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Tiền phạt</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-money-bill-wave"></i>
        </span>
        <Field
          name="TienPhatTreHan"
          v-model="local.TienPhatTreHan"
          v-slot="{ field }"
        >
          <input v-bind="field" type="number" class="form-control" disabled />
        </Field>
      </div>
    </div>

    <div class="col-12 mt-4 d-flex justify-content-end gap-2">
      <button
        v-if="local._id"
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
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";

export default {
  components: { Form, Field, ErrorMessage },
  props: {
    phieu: { type: Object, required: true },
  },
  emits: ["them", "capnhat", "cancel"],
  data() {
    return {
      local: {},
      docGias: [],
      sachs: [],
      schema: yup.object({
        MaDocGia: yup.string().required("Mã độc giả là bắt buộc."),
        MaSach: yup.string().required("Mã sách là bắt buộc."),
        NgayMuon: yup.string().required("Ngày mượn là bắt buộc."),
        NgayTra: yup.string().required("Ngày trả là bắt buộc."),
        TrangThai: yup.string().required("Trạng thái là bắt buộc."),
      }),
    };
  },
  computed: {
    isTrangThaiDisabled() {
      if (!this.local._id) return false;
      return this.local.TrangThai === "Đã trả";
    },

    trangThaiOptions() {
      if (!this.local._id) {
        return ["Đã duyệt", "Từ chối"];
      }

      const current = this.local.TrangThai;

      if (current === "Chờ duyệt") return ["Đã duyệt", "Từ chối"];
      if (current === "Chờ trả") return ["Đã trả", "Từ chối"];

      return [current];
    },
  },
  watch: {
    phieu: {
      immediate: true,
      handler(newVal) {
        this.local = { ...newVal };
      },
    },
  },
  async mounted() {
    this.docGias = await ReaderService.getAll();
    this.sachs = await BookService.getAll();
  },
  methods: {
    themMoi() {
      this.$emit("them", this.local);
      this.$refs.form.resetForm();
    },
    capNhat() {
      this.$emit("capnhat", this.local);
      this.$refs.form.resetForm();
    },
    cancel() {
      this.$refs.form.resetForm();
      this.$emit("cancel");
    },
  },
};
</script>
