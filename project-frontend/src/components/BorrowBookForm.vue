<template>
  <Form ref="form" :validation-schema="schema" class="row g-3 mb-4">
    <!-- Mã độc giả -->
    <div class="col-md-4">
      <label>Mã độc giả</label>
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
      <ErrorMessage name="MaDocGia" class="text-danger" />
    </div>

    <!-- Mã sách -->
    <div class="col-md-4">
      <label>Mã sách</label>
      <Field name="MaSach" v-model="local.MaSach" v-slot="{ field }">
        <select v-bind="field" class="form-select">
          <option value="">-- Chọn sách --</option>
          <option v-for="sach in sachs" :key="sach.MaSach" :value="sach.MaSach">
            {{ sach.MaSach }} - {{ sach.TenSach }}
          </option>
        </select>
      </Field>
      <ErrorMessage name="MaSach" class="text-danger" />
    </div>

    <!-- Ngày mượn -->
    <div class="col-md-4">
      <label>Ngày mượn</label>
      <Field name="NgayMuon" v-model="local.NgayMuon" v-slot="{ field }">
        <input v-bind="field" type="date" class="form-control" />
      </Field>
      <ErrorMessage name="NgayMuon" class="text-danger" />
    </div>

    <!-- Ngày trả -->
    <div class="col-md-4">
      <label>Ngày trả</label>
      <Field name="NgayTra" v-model="local.NgayTra" v-slot="{ field }">
        <input v-bind="field" type="date" class="form-control" />
      </Field>
      <ErrorMessage name="NgayTra" class="text-danger" />
    </div>

    <!-- Trạng thái -->
    <div class="col-md-4">
      <label>Trạng thái</label>
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
      <ErrorMessage name="TrangThai" class="text-danger" />
    </div>

    <!-- Ngày trả thực -->
    <div class="col-md-4">
      <label>Ngày trả thực</label>
      <Field name="NgayTraThuc" v-model="local.NgayKetThuc" v-slot="{ field }">
        <input v-bind="field" type="date" class="form-control" disabled />
      </Field>
    </div>

    <!-- Tiền phạt trễ hạn -->
    <div class="col-md-4">
      <label>Tiền phạt trễ hạn</label>
      <Field
        name="TienPhatTreHan"
        v-model="local.TienPhatTreHan"
        v-slot="{ field }"
      >
        <input v-bind="field" type="number" class="form-control" disabled />
      </Field>
    </div>

    <!-- Nút thao tác -->
    <div class="col-12">
      <template v-if="local._id">
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
      return this.local.TrangThai === "Đã trả";
    },
    trangThaiOptions() {
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
