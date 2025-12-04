<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 class="mb-0 d-flex align-items-center">
        <i class="fa-solid fa-building me-2"></i> Quản lý nhà xuất bản
      </h4>
      <button class="btn btn-success" @click="exportExcel">
        <i class="fa-solid fa-file-excel me-1"></i> Xuất Excel
      </button>
    </div>

    <div class="mb-3">
      <InputSearch v-model="searchText" @submit="timKiem" />
    </div>

    <div class="card shadow-sm mb-4">
      <div
        class="card-header bg-primary text-white py-2 d-flex align-items-center justify-content-between"
        style="cursor: pointer"
        @click="toggleForm"
      >
        <strong>
          <i class="fa-solid fa-pencil me-1"></i>
          {{ nxb.old ? "Cập nhật NXB" : "Thêm NXB" }}
        </strong>

        <i class="fa-solid" :class="isFormVisible ? 'fa-minus' : 'fa-plus'"></i>
      </div>

      <div class="card-body" v-show="isFormVisible">
        <NXBForm
          :nxb="nxb"
          @them="themNXB"
          @capnhat="capNhatNXB"
          @cancel="closeForm"
        />
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white py-2">
        <strong> <i class="fa-solid fa-list me-1"></i> Danh sách NXB </strong>
      </div>

      <div class="card-body p-0">
        <table class="table table-bordered table-striped mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã NXB</th>
              <th>Tên NXB</th>
              <th>Địa chỉ</th>
              <th style="width: 110px">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in danhSachNXB" :key="p._id">
              <td>{{ p.MaNXB }}</td>
              <td>{{ p.TenNXB }}</td>
              <td>{{ p.DiaChi }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-1" @click="editNXB(p)">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="xoaNXB(p.MaNXB)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="danhSachNXB.length === 0">
              <td colspan="4" class="text-center py-3 text-muted">
                Không có nhà xuất bản nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import NXBForm from "@/components/PublisherForm.vue";
import NhaXuatBanService from "@/services/publisher.service";
import InputSearch from "@/components/InputSearch.vue";
import * as XLSX from "xlsx";

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
      isFormVisible: false,
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
        await NhaXuatBanService.update(this.nxb.old, data);
        this.$toast?.success?.("Cập nhật thành công!") || alert("Đã cập nhật.");
        this.fetchNXBs();
        this.nxb.old = data.MaNXB;
      } catch (err) {
        this.$toast?.error?.("Lỗi khi cập nhật!") ||
          alert("Cập nhật thất bại.");
      }
    },
    editNXB(nxb) {
      this.nxb = { ...nxb, old: nxb.MaNXB };
      this.isFormVisible = true;
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
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
    },

    closeForm() {
      this.resetForm();
      this.isFormVisible = false;
    },

    exportExcel() {
      const data = this.danhSachNXB.map((p) => ({
        "Mã NXB": p.MaNXB,
        "Tên NXB": p.TenNXB,
        "Địa chỉ": p.DiaChi,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachNXB");

      XLSX.writeFile(workbook, "DanhSachNXB.xlsx");
    },
  },
  mounted() {
    this.fetchNXBs();
  },
};
</script>
