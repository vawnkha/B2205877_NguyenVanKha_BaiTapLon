<template>
  <div>
    <h4>Quản lý nhà xuất bản</h4>

    <InputSearch v-model="searchText" @submit="timKiem" />

    <NXBForm
      :nxb="nxb"
      @them="themNXB"
      @capnhat="capNhatNXB"
      @cancel="resetForm"
    />

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Mã NXB</th>
          <th>Tên NXB</th>
          <th>Địa chỉ</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in danhSachNXB" :key="p._id">
          <td>{{ p.MaNXB }}</td>
          <td>{{ p.TenNXB }}</td>
          <td>{{ p.DiaChi }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editNXB(p)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="xoaNXB(p.MaNXB)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import NXBForm from "@/components/PublisherForm.vue";
import NhaXuatBanService from "@/services/publisher.service";
import InputSearch from "@/components/InputSearch.vue";

export default {
  components: { NXBForm, InputSearch },
  data() {
    return {
      searchText: "",
      allNXBs: [],
      danhSachNXB: [],
      nxb: {
        MaNXB: "",
        TenNXB: "",
        DiaChi: "",
        old: "",
      },
    };
  },
  methods: {
    async fetchNXBs() {
      this.allNXBs = await NhaXuatBanService.getAll();
      this.danhSachNXB = [...this.allNXBs];
    },
    timKiem() {
      const tuKhoa = this.searchText.trim().toLowerCase();
      if (!tuKhoa) {
        this.danhSachNXB = this.allNXBs;
      } else {
        this.danhSachNXB = this.allNXBs.filter(
          (nxb) =>
            nxb.MaNXB?.toLowerCase().includes(tuKhoa) ||
            nxb.TenNXB?.toLowerCase().includes(tuKhoa)
        );
      }
    },
    async themNXB(data) {
      try {
        await NhaXuatBanService.create(data);
        this.$toast?.success?.("Thêm thành công!") || alert("Đã thêm.");
        this.fetchNXBs();
      } catch (err) {
        if (err.response?.status === 409) {
          this.$toast?.error?.("Mã NXB đã tồn tại!") || alert("Mã đã tồn tại.");
        } else {
          this.$toast?.error?.("Lỗi khi thêm!") || alert("Thêm thất bại.");
        }
      }
    },
    async capNhatNXB(data) {
      try {
        const payload = { ...data };

        if (!payload.Password || payload.Password.trim() === "") {
          delete payload.Password;
        }

        await NhaXuatBanService.update(this.nxb.old, payload);

        this.$toast?.success?.("Cập nhật thành công!") || alert("Đã cập nhật.");

        this.fetchNXBs();
        this.nxb.old = data.MaNXB;
      } catch (err) {
        this.$toast?.error?.("Lỗi khi cập nhật!") ||
          alert("Cập nhật thất bại.");
      }
    },
    editNXB(nxb) {
      this.nxb = {
        ...nxb,
        Password: "",
        old: nxb.MaNXB,
        oldPassword: nxb.Password,
      };
    },
    async xoaNXB(id) {
      if (confirm("Bạn có chắc muốn xoá không?")) {
        await NhaXuatBanService.delete(id);
        this.fetchNXBs();
      }
    },
    resetForm() {
      this.nxb = {
        MaNXB: "",
        TenNXB: "",
        DiaChi: "",
      };
    },
  },
  mounted() {
    this.fetchNXBs();
  },
};
</script>
