<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 class="mb-0 d-flex align-items-center">
        <i class="fa-solid fa-book me-2"></i> Quản lý sách
      </h4>

      <button class="btn btn-success" @click="exportExcel">
        <i class="fa-solid fa-file-excel me-1"></i> Xuất Excel
      </button>
    </div>

    <div class="mb-3">
      <InputSearch v-model="searchText" @submit="timKiemSach" />
    </div>

    <div class="card shadow-sm mb-4">
      <div
        class="card-header bg-primary text-white py-2 d-flex justify-content-between align-items-center"
        style="cursor: pointer"
        @click="toggleForm"
      >
        <strong>
          <i class="fa-solid fa-book-bible me-2"></i>
          {{ sach.old ? "Cập nhật sách" : "Thêm sách" }}
        </strong>

        <i class="fa-solid" :class="isFormVisible ? 'fa-minus' : 'fa-plus'"></i>
      </div>

      <div class="card-body" v-show="isFormVisible">
        <SachForm
          :sach="sach"
          :dsNXB="dsNXB"
          @them="themSach"
          @capnhat="capNhatSach"
          @cancel="closeForm"
        />
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white py-2">
        <strong> <i class="fa-solid fa-list me-1"></i> Danh sách sách </strong>
      </div>

      <div class="card-body p-0">
        <table class="table table-bordered table-striped mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Giá</th>
              <th>Số quyển</th>
              <th>Năm XB</th>
              <th>NXB</th>
              <th>Tác giả</th>
              <th style="width: 110px">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="s in sachs" :key="s._id">
              <td>{{ s.MaSach }}</td>
              <td>{{ s.TenSach }}</td>
              <td>{{ s.DonGia }}</td>
              <td>{{ s.SoQuyen }}</td>
              <td>{{ s.NamXuatBan }}</td>
              <td>{{ s.MaNXB }}</td>
              <td>{{ s.NguonGoc }}</td>

              <td>
                <button
                  class="btn btn-sm btn-warning me-1"
                  @click="editSach(s)"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>

                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteSach(s.MaSach)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="sachs.length === 0">
              <td colspan="8" class="text-center py-3 text-muted">
                Không có sách nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import SachForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";
import InputSearch from "@/components/InputSearch.vue";
import * as XLSX from "xlsx";

export default {
  components: {
    SachForm,
    InputSearch,
  },
  data() {
    return {
      searchText: "",
      allSachs: [],
      sachs: [],
      dsNXB: [],
      sach: {
        TenSach: "",
        MaSach: "",
        DonGia: null,
        SoQuyen: null,
        NamXuatBan: "",
        MaNXB: "",
        NguonGoc: "",
        old: "",
      },
      isFormVisible: false,
    };
  },
  methods: {
    async fetchSachs() {
      const data = await BookService.getAll();
      this.allSachs = data;
      this.sachs = data;
    },
    async fetchNXBs() {
      try {
        this.dsNXB = await PublisherService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy NXB:", error);
      }
    },
    timKiemSach() {
      const tuKhoa = this.searchText.trim().toLowerCase();
      if (!tuKhoa) {
        this.sachs = this.allSachs;
        return;
      }

      this.sachs = this.allSachs.filter(
        (s) =>
          s.TenSach?.toLowerCase().includes(tuKhoa) ||
          s.MaNXB?.toLowerCase().includes(tuKhoa)
      );
    },
    async themSach(data) {
      try {
        await BookService.create(data);
        this.$toast?.success?.("Thêm sách thành công!") ||
          alert("Đã thêm sách.");
        this.fetchSachs();
      } catch (error) {
        this.$toast?.error?.("Lỗi khi thêm sách!") ||
          alert("Lỗi khi thêm sách.");
        console.error(error);
      }
    },
    async capNhatSach(data) {
      try {
        await BookService.update(this.sach.old, data);
        this.$toast?.success?.("Cập nhật sách thành công!") ||
          alert("Đã cập nhật.");
        this.fetchSachs();
        this.sach.old = data.MaSach;
      } catch (error) {
        this.$toast?.error?.("Lỗi khi cập nhật sách!") ||
          alert("Lỗi khi cập nhật.");
        console.error(error);
      }
    },
    editSach(s) {
      this.sach = { ...s, old: s.MaSach };
      this.isFormVisible = true;
    },
    async deleteSach(id) {
      if (confirm("Xóa sách này?")) {
        try {
          await BookService.delete(id);
          this.fetchSachs();
          this.resetForm();
        } catch (error) {
          this.$toast?.error?.("Lỗi khi xoá sách!") ||
            alert("Xoá sách thất bại.");
          console.error(error);
        }
      }
    },
    resetForm() {
      this.sach = {
        TenSach: "",
        MaSach: "",
        DonGia: null,
        SoQuyen: null,
        NamXuatBan: "",
        MaNXB: "",
        NguonGoc: "",
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
      const data = this.sachs.map((s) => ({
        "Mã sách": s.MaSach,
        "Tên sách": s.TenSach,
        Giá: s.DonGia,
        "Số quyển": s.SoQuyen,
        "Năm xuất bản": s.NamXuatBan,
        "Nhà xuất bản": s.MaNXB,
        "Tác giả": s.NguonGoc,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachSach");
      XLSX.writeFile(workbook, "DanhSachSach.xlsx");
    },
  },
  mounted() {
    this.fetchSachs();
    this.fetchNXBs();
  },
};
</script>
