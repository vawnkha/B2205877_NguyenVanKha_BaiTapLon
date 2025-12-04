<template>
  <Form :validation-schema="schema" class="row g-4">
    <div class="col-md-4">
      <label class="form-label fw-semibold">Độc giả</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-user"></i>
        </span>
        <Field name="MaDocGia" v-model="local.MaDocGia" v-slot="{ field }">
          <input v-bind="field" class="form-control" disabled />
        </Field>
      </div>
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Sách</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-book"></i>
        </span>
        <Field name="MaSach" v-model="local.MaSach" v-slot="{ field }">
          <input v-bind="field" class="form-control" disabled />
        </Field>
      </div>
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Ngày mượn</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-days"></i>
        </span>
        <Field name="NgayMuon" v-model="local.NgayMuon" v-slot="{ field }">
          <input v-bind="field" type="date" class="form-control" disabled />
        </Field>
      </div>
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Ngày trả</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-days"></i>
        </span>
        <Field name="NgayTra" v-model="local.NgayTra" v-slot="{ field }">
          <input v-bind="field" type="date" class="form-control" disabled />
        </Field>
      </div>
    </div>

    <div class="col-md-4">
      <label class="form-label fw-semibold">Ngày trả thực</label>
      <div class="input-group">
        <span class="input-group-text bg-light">
          <i class="fa-solid fa-calendar-check"></i>
        </span>
        <Field
          name="NgayTraThuc"
          v-model="local.NgayTraThuc"
          v-slot="{ field }"
        >
          <input v-bind="field" type="date" class="form-control" />
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
          <input v-bind="field" class="form-control" disabled />
        </Field>
      </div>
    </div>

    <div class="col-12 mt-4 d-flex justify-content-end gap-2">
      <button
        class="btn btn-success d-flex align-items-center px-4"
        type="button"
        @click="xacNhanTra"
      >
        <i class="fa-solid fa-check me-2"></i>
        Xác nhận trả
      </button>

      <button
        class="btn btn-secondary d-flex align-items-center px-4"
        type="button"
        @click="$emit('cancel')"
      >
        <i class="fa-solid fa-xmark me-2"></i>
        Hủy
      </button>
    </div>
  </Form>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import BookService from "@/services/book.service";

export default {
  components: { Form, Field },
  props: {
    phieu: { type: Object, required: true },
  },
  emits: ["xacnhan", "cancel"],
  data() {
    return {
      local: {},
      schema: yup.object({
        MaDocGia: yup.string().required(),
        MaSach: yup.string().required(),
        NgayMuon: yup.string().required(),
        NgayTra: yup.string().required(),
        NgayTraThuc: yup.string().required(),
      }),
    };
  },
  watch: {
    phieu: {
      immediate: true,
      async handler(newVal) {
        this.local = { ...newVal };

        if (!this.local.NgayTraThuc) {
          this.local.NgayTraThuc = new Date().toISOString().split("T")[0];
        }

        await this.tinhTienPhat();
      },
    },
    "local.NgayTraThuc": {
      async handler() {
        await this.tinhTienPhat();
      },
    },
  },
  methods: {
    async tinhTienPhat() {
      if (!this.local.NgayTraThuc || !this.local.NgayTra) return;

      try {
        const book = await BookService.get(this.local.MaSach);
        const giaSach = book?.DonGia;

        const today = new Date(this.local.NgayTraThuc);
        const ngayTra = new Date(this.local.NgayTra);
        const diffTime = today.getTime() - ngayTra.getTime();
        const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.local.TienPhatTreHan =
          lateDays > 0 ? lateDays * giaSach * 0.05 : 0;
      } catch (error) {
        console.error("Không thể lấy thông tin sách:", error);
        this.local.TienPhatTreHan = 0;
      }
    },
    async xacNhanTra() {
      await this.tinhTienPhat();
      this.$emit("xacnhan", this.local);
    },
  },
};
</script>
