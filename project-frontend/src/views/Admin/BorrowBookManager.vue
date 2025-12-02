<template>
  <div>
    <h4>Quản lý phiếu mượn sách</h4>

    <InputSearch v-model="searchText" @submit="timKiem" />

    <FormMuonSach
      :phieu="phieu"
      @them="themPhieu"
      @capnhat="capNhatPhieu"
      @cancel="resetForm"
    />

    <table class="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>Mã độc giả</th>
          <th>Mã sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
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
            <button class="btn btn-sm btn-info me-2" @click="editPhieu(p)">
              Xem
            </button>
            <button class="btn btn-sm btn-danger" @click="xoaPhieu(p._id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import FormMuonSach from "@/components/BorrowBookForm.vue";
import InputSearch from "@/components/InputSearch.vue";
import MuonSachService from "@/services/borrow_book.service";
import Sach from "@/services/book.service";

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
    };
  },
  methods: {
    async fetchPhieus() {
      this.allPhieus = await MuonSachService.getAll();
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
        await MuonSachService.create(data);
        if (data.TrangThai == "Đã duyệt") {
          await Sach.updateNumber(data.MaSach, { soLuong: 1 });
        }
        alert("Thêm phiếu thành công");
        this.fetchPhieus();
      } catch (err) {
        alert("Lỗi khi thêm phiếu");
      }
    },
    async capNhatPhieu(data) {
      try {
        await MuonSachService.update(data._id, data);
        if (
          data.TrangThai == "Đã duyệt" &&
          this.phieu.TrangThai != "Đã duyệt"
        ) {
          await Sach.updateNumber(data.MaSach, { soLuong: 1 });
        }
        alert("Cập nhật thành công");
        this.fetchPhieus();
      } catch (err) {
        alert("Lỗi khi cập nhật");
      }
    },
    editPhieu(p) {
      this.phieu = { ...p, oldAct: p.TrangThai };
    },
    async xoaPhieu(id) {
      if (confirm("Bạn có chắc muốn xóa phiếu mượn này?")) {
        try {
          await MuonSachService.delete(id);
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
  },
  mounted() {
    this.fetchPhieus();
  },
};
</script>
