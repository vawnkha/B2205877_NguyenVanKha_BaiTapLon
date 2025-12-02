<template>
  <Form ref="form" :validation-schema="schema" class="row g-3 mb-4">
    <!-- Mã độc giả -->
    <div class="col-md-4">
      <label>Mã độc giả</label>
      <Field name="MaDocGia" v-slot="{ field }">
        <input
          v-bind="field"
          class="form-control"
          :value="local.MaDocGia"
          disabled
        />
      </Field>
    </div>

    <!-- Mã sách -->
    <div class="col-md-4">
      <label>Mã sách</label>
      <Field name="MaSach" v-slot="{ field }">
        <input
          v-bind="field"
          class="form-control"
          :value="local.MaSach"
          disabled
        />
      </Field>
    </div>

    <!-- Ngày mượn -->
    <div class="col-md-4">
      <label>Ngày mượn</label>
      <Field name="NgayMuon" v-slot="{ field }">
        <input
          v-bind="field"
          class="form-control"
          :value="local.NgayMuon"
          disabled
        />
      </Field>
    </div>

    <!-- Ngày trả -->
    <div class="col-md-4">
      <label>Ngày trả</label>
      <Field name="NgayTra" v-slot="{ field }">
        <input
          v-bind="field"
          class="form-control"
          :value="local.NgayTra"
          disabled
        />
      </Field>
    </div>

    <!-- Ngày trả thực -->
    <div class="col-md-4">
      <label>Ngày trả thực</label>
      <Field name="NgayTraThuc" v-slot="{ field }">
        <input
          type="date"
          class="form-control"
          :value="local.NgayTraThuc"
          @input="local.NgayTraThuc = $event.target.value"
        />
      </Field>
    </div>

    <!-- Tiền phạt trễ hạn -->
    <div class="col-md-4">
      <label>Tiền phạt trễ hạn</label>
      <Field name="TienPhatTreHan" v-slot="{ field }">
        <input
          v-bind="field"
          class="form-control"
          :value="local.TienPhatTreHan"
          disabled
        />
      </Field>
    </div>

    <!-- Buttons -->
    <div class="col-12">
      <button class="btn btn-success" type="button" @click="xacNhanTra">
        Xác nhận trả
      </button>
      <button class="btn btn-secondary ms-2" type="button" @click="cancel">
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
        if (!newVal) {
          this.local = {};
          return;
        }

        const today = new Date().toISOString().split("T")[0];

        this.local = {
          ...newVal,
          NgayTraThuc: newVal.NgayTraThuc || today,
          TienPhatTreHan: newVal.TienPhatTreHan || 0,
        };
      },
    },
  },

  methods: {
    xacNhanTra() {
      const ngayTraThuc = new Date(this.local.NgayTraThuc);
      const ngayTra = new Date(this.local.NgayTra);

      const diffTime = ngayTraThuc.getTime() - ngayTra.getTime();
      const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      this.local.TienPhatTreHan = lateDays > 0 ? lateDays * 3000 : 0;

      this.$emit("xacnhan", this.local);
      this.$refs.form.resetForm();
    },

    cancel() {
      this.$refs.form.resetForm();
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped></style>
