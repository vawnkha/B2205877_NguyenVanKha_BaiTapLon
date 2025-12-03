<template>
  <div>
    <h4>Quản lý trả sách</h4>

    <InputSearch v-model="searchText" @submit="timKiem" />

    <TraSachForm :phieu="phieu" @xacnhan="xacNhanTraSach" @cancel="resetForm" />

    <table class="table table-bordered mt-3">
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
            <button class="btn btn-sm btn-info" @click="editPhieu(p)">
              Xem
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import TraSachForm from "@/components/ReturnBookForm.vue";
import BorrowBookService from "@/services/borrow_book.service";
import BookService from "@/services/book.service";

export default {
  components: { InputSearch, TraSachForm },
  data() {
    return {
      searchText: "",
      allPhieus: [],
      phieus: [],
      phieu: {},
    };
  },
  methods: {
    async fetchPhieus() {
      const all = await BorrowBookService.getAll();
      this.allPhieus = all.filter(
        (p) => p.TrangThai === "Đã duyệt" && !p.NgayTraThuc
      );
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
    editPhieu(p) {
      this.phieu = { ...p };
    },
    resetForm() {
      this.phieu = {};
    },
    async xacNhanTraSach(data) {
      if (!data.NgayMuon || !data.NgayTra) {
        alert("Phiếu mượn chưa có đầy đủ thông tin (Ngày mượn, Ngày trả).");
        return;
      }
      const ngayTraThuc = new Date(data.NgayTraThuc);
      const ngayTra = new Date(data.NgayTra);

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLate = Math.max(
        0,
        Math.floor((ngayTraThuc - ngayTra) / msPerDay)
      );
      const tienPhat = daysLate * 3000;

      const payload = {
        ...data,
        NgayTraThuc: ngayTraThuc.toISOString().slice(0, 10),
        TienPhatTreHan: tienPhat,
        TrangThai: "Đã trả",
      };

      try {
        await BorrowBookService.update(data._id, payload);
        await BookService.addQuantity(data.MaSach, { quantity: 1 });
        alert("Xác nhận trả sách thành công.");
        this.fetchPhieus();
        this.resetForm();
      } catch (err) {
        alert("Lỗi khi xác nhận trả sách.");
      }
    },
  },
  mounted() {
    this.fetchPhieus();
  },
};
</script>
