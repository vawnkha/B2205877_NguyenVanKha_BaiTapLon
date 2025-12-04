<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 class="mb-0 d-flex align-items-center">
        <i class="fa-solid fa-book-reader me-2"></i>
        Quản lý phiếu mượn sách
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
          {{ phieu.old ? "Cập nhật phiếu mượn" : "Thêm phiếu mượn" }}
        </strong>

        <i class="fa-solid" :class="isFormVisible ? 'fa-minus' : 'fa-plus'"></i>
      </div>

      <div class="card-body" v-show="isFormVisible">
        <FormMuonSach
          :phieu="phieu"
          @them="themPhieu"
          @capnhat="capNhatPhieu"
          @cancel="closeForm"
        />
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white py-2">
        <strong>
          <i class="fa-solid fa-list me-1"></i> Danh sách phiếu mượn
        </strong>
      </div>

      <div class="card-body p-0">
        <table class="table table-bordered table-striped mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã độc giả</th>
              <th>Mã sách</th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th style="width: 110px">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in phieus" :key="p._id">
              <td>{{ p.MaDocGia }}</td>
              <td>{{ p.MaSach }}</td>
              <td>{{ p.NgayMuon }}</td>
              <td>{{ p.NgayTra }}</td>
              <td>{{ p.TrangThai }}</td>
              <td>
                <button class="btn btn-sm btn-info me-1" @click="editPhieu(p)">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="xoaPhieu(p._id)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="phieus.length === 0">
              <td colspan="6" class="text-center py-3 text-muted">
                Không có phiếu mượn nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import FormMuonSach from "@/components/BorrowBookForm.vue";
import InputSearch from "@/components/InputSearch.vue";
import BorrowBookService from "@/services/borrow_book.service";
import BookService from "@/services/book.service";
import * as XLSX from "xlsx";

export default {
  components: { FormMuonSach, InputSearch },
  data() {
    return {
      searchText: "",
      allPhieus: [],
      phieus: [],
      phieu: {
        MaDocGia: "",
        MaSach: "",
        NgayMuon: "",
        NgayTra: "",
        TrangThai: "Chờ duyệt",
        _id: null,
        oldAct: "",
      },
      isFormVisible: false,
    };
  },
  methods: {
    async fetchPhieus() {
      this.allPhieus = await BorrowBookService.getAll();
      this.phieus = this.allPhieus;
    },
    timKiem() {
      const tuKhoa = this.searchText.toLowerCase().trim();
      this.phieus = this.allPhieus.filter(
        (p) =>
          p.MaDocGia?.toLowerCase().includes(tuKhoa) ||
          p.MaSach?.toLowerCase().includes(tuKhoa)
      );
    },
    async themPhieu(data) {
      try {
        await BorrowBookService.create(data);
        if (data.TrangThai == "Đã duyệt") {
          await BookService.deductQuantity(data.MaSach, { quantity: 1 });
        }
        alert("Thêm phiếu thành công");
        this.fetchPhieus();
      } catch (err) {
        alert("Lỗi khi thêm phiếu");
      }
    },
    async capNhatPhieu(data) {
      try {
        await BorrowBookService.update(data._id, data);
        if (
          data.TrangThai == "Đã duyệt" &&
          this.phieu.TrangThai != "Đã duyệt"
        ) {
          await BookService.deductQuantity(data.MaSach, { quantity: 1 });
        }
        alert("Cập nhật thành công");
        this.fetchPhieus();
      } catch (err) {
        alert("Lỗi khi cập nhật");
      }
    },
    editPhieu(p) {
      this.phieu = { ...p, oldAct: p.TrangThai };
      this.isFormVisible = true;
    },
    async xoaPhieu(id) {
      if (confirm("Bạn có chắc muốn xóa phiếu mượn này?")) {
        try {
          await BorrowBookService.delete(id);
          alert("Đã xóa thành công");
          this.fetchPhieus();
          this.resetForm();
        } catch (err) {
          alert("Lỗi khi xóa phiếu mượn");
        }
      }
    },
    resetForm() {
      this.phieu = {
        MaDocGia: "",
        MaSach: "",
        NgayMuon: "",
        NgayTra: "",
        TrangThai: "Chờ duyệt",
        _id: null,
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
      const data = this.phieus.map((p) => ({
        "Mã độc giả": p.MaDocGia,
        "Mã sách": p.MaSach,
        "Ngày mượn": p.NgayMuon,
        "Ngày trả": p.NgayTra,
        "Trạng thái": p.TrangThai,
        "Tiền phạt": p.TienPhatTreHan,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PhieuMuon");

      XLSX.writeFile(workbook, "DanhSachPhieuMuon.xlsx");
    },
  },
  mounted() {
    this.fetchPhieus();
  },
};
</script>
