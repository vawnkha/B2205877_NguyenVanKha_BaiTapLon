<template>
  <Form :validation-schema="schema" class="row g-3 mb-4">
    <!-- Mã độc giả -->
    <div class="col-md-4">
      <label>Mã độc giả</label>
      <Field name="MaDocGia" v-model="local.MaDocGia" v-slot="{ field }">
        <input v-bind="field" class="form-control" disabled />
      </Field>
    </div>

    <!-- Mã sách -->
    <div class="col-md-4">
      <label>Mã sách</label>
      <Field name="MaSach" v-model="local.MaSach" v-slot="{ field }">
        <input v-bind="field" class="form-control" disabled />
      </Field>
    </div>

    <!-- Ngày mượn -->
    <div class="col-md-4">
      <label>Ngày mượn</label>
      <Field name="NgayMuon" v-model="local.NgayMuon" v-slot="{ field }">
        <input v-bind="field" class="form-control" disabled />
      </Field>
    </div>

    <!-- Ngày trả -->
    <div class="col-md-4">
      <label>Ngày trả</label>
      <Field name="NgayTra" v-model="local.NgayTra" v-slot="{ field }">
        <input v-bind="field" class="form-control" disabled />
      </Field>
    </div>

    <!-- Ngày trả thực -->
    <div class="col-md-4">
      <label>Ngày trả thực</label>
      <Field name="NgayTraThuc" v-model="local.NgayTraThuc" v-slot="{ field }">
        <input v-bind="field" type="date" class="form-control" />
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
        <input v-bind="field" class="form-control" disabled />
      </Field>
    </div>

    <!-- Nút thao tác -->
    <div class="col-12">
      <button class="btn btn-success" type="button" @click="xacNhanTra">
        Xác nhận trả
      </button>
      <button
        class="btn btn-secondary ms-2"
        type="button"
        @click="$emit('cancel')"
      >
        Hủy
      </button>
    </div>
  </Form>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";

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
      handler(newVal) {
        const today = new Date().toISOString().split("T")[0];
        this.local = {
          ...newVal,
          NgayTraThuc: newVal.NgayTraThuc || today,
        };
      },
    },
  },
  methods: {
    xacNhanTra() {
      const today = new Date(this.local.NgayTraThuc || new Date());
      const ngayTra = new Date(this.local.NgayTra);
      const diffTime = today.getTime() - ngayTra.getTime();
      const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.local.TienPhatTreHan = lateDays > 0 ? lateDays * 3000 : 0;

      this.$emit("xacnhan", this.local);
    },
  },
};
</script>
