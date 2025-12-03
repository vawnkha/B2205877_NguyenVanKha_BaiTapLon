<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center mb-3">
      <h4 class="mb-0">
        <i class="fa-solid fa-rotate-left me-2"></i> Quản lý trả sách
      </h4>
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
          {{ phieu.old ? "Xác nhận trả sách" : "Xác nhận trả sách" }}
        </strong>

        <i class="fa-solid" :class="isFormVisible ? 'fa-minus' : 'fa-plus'"></i>
      </div>

      <div class="card-body" v-show="isFormVisible">
        <TraSachForm
          :phieu="phieu"
          @xacnhan="xacNhanTraSach"
          @cancel="closeForm"
        />
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white py-2">
        <strong>
          <i class="fa-solid fa-list me-1"></i> Danh sách phiếu trả
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
                <button class="btn btn-sm btn-info" @click="editPhieu(p)">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </td>
            </tr>

            <tr v-if="phieus.length === 0">
              <td colspan="6" class="text-center py-3 text-muted">
                Không có phiếu trả nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
      isFormVisible: false,
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
      this.isFormVisible = true;
    },
    resetForm() {
      this.phieu = {};
    },
    async xacNhanTraSach(data) {
      if (!data.NgayMuon || !data.NgayTra) {
        alert("Phiếu mượn chưa có đầy đủ thông tin (Ngày mượn, Ngày trả).");
        return;
      }
      const ngayTraThuc = new Date();
      const ngayTra = new Date(data.NgayTra);

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLate = Math.max(
        0,
        Math.floor((ngayTraThuc - ngayTra) / msPerDay)
      );
      const tienPhat = daysLate * 3000;

      const payload = {
        ...data,
        NgayKetThuc: ngayTraThuc.toISOString().slice(0, 10),
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
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
    },
    closeForm() {
      this.resetForm();
      this.isFormVisible = false;
    },
  },
  mounted() {
    this.fetchPhieus();
  },
};
</script>
