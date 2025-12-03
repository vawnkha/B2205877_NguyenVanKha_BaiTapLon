<template>
  <div>
    <h4><i class="fa-solid fa-book-open"></i> Danh sách sách</h4>

    <InputSearch v-model="searchText" @submit="timKiemSach" />

    <div class="row">
      <div v-for="book in books" :key="book.MaSach" class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ book.TenSach }}</h5>
            <p class="card-text">
              Tác giả: {{ book.NguonGoc }}<br />
              Năm xuất bản: {{ book.NamXuatBan }}<br />
              Số lượng: {{ book.SoQuyen }}
            </p>
            <button
              class="btn btn-primary w-100"
              @click="muonSach(book.MaSach)"
              :disabled="book.SoQuyen <= 0"
            >
              Mượn sách
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="muonSachModal"
      tabindex="-1"
      aria-hidden="true"
      ref="modalMuonSach"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thông tin mượn sách</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              @click="close"
            ></button>
          </div>

          <div class="modal-body">
            <label>Ngày mượn:</label>
            <input
              type="date"
              v-model="formNgayMuon"
              class="form-control mb-3"
            />

            <label>Ngày trả dự kiến:</label>
            <input type="date" v-model="formNgayTra" class="form-control" />
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="close"
            >
              Hủy
            </button>
            <button class="btn btn-primary" @click="xacNhanMuonSach">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import BookService from "@/services/book.service";
import BorrowBookService from "@/services/borrow_book.service";
import { Modal } from "bootstrap";

export default {
  components: { InputSearch },

  data() {
    return {
      searchText: "",
      allBooks: [],
      books: [],

      maSachDangMuon: null,
      formNgayMuon: "",
      formNgayTra: "",
      modalMuonSach: null,
    };
  },

  async mounted() {
    await this.fetchBooks();

    this.modalMuonSach = new Modal(this.$refs.modalMuonSach);
  },

  methods: {
    async fetchBooks() {
      try {
        const data = await BookService.getAll();
        this.allBooks = data;
        this.books = data;
      } catch (err) {
        console.error("Lỗi khi tải sách:", err);
      }
    },

    timKiemSach() {
      const tuKhoa = this.searchText.trim().toLowerCase();
      if (!tuKhoa) {
        this.books = this.allBooks;
        return;
      }

      this.books = this.allBooks.filter(
        (b) =>
          b.TenSach?.toLowerCase().includes(tuKhoa) ||
          b.NguonGoc?.toLowerCase().includes(tuKhoa)
      );
    },

    async muonSach(maSach) {
      const docGia = JSON.parse(localStorage.getItem("user"));
      if (!docGia || !docGia.user?.MaDocGia) {
        alert("Bạn cần đăng nhập để mượn sách.");
        return;
      }

      const maDocGia = docGia.user.MaDocGia;

      try {
        const danhSachPhieu = await BorrowBookService.findByMaDocGia(maDocGia);

        const daMuon = danhSachPhieu.find(
          (p) => p.MaSach === maSach && p.TrangThai !== "Đã trả"
        );

        if (daMuon) {
          if (daMuon.TrangThai === "Chờ duyệt") {
            alert("Bạn đã đăng ký mượn sách này và đang chờ duyệt.");
          } else if (["Đã mượn", "Đã duyệt"].includes(daMuon.TrangThai)) {
            alert("Bạn đang mượn sách này.");
          }
          return;
        }

        this.maSachDangMuon = maSach;
        this.formNgayMuon = "";
        this.formNgayTra = "";
        this.modalMuonSach.show();
      } catch (err) {
        console.error(err);
        alert("Không thể đăng ký mượn sách.");
      }
    },

    async xacNhanMuonSach() {
      if (!this.formNgayMuon || !this.formNgayTra) {
        alert("Vui lòng chọn ngày mượn và ngày trả!");
        return;
      }

      if (this.formNgayTra < this.formNgayMuon) {
        alert("Ngày trả phải lớn hơn ngày mượn!");
        return;
      }

      const docGia = JSON.parse(localStorage.getItem("user"));
      const maDocGia = docGia.user.MaDocGia;

      try {
        await BorrowBookService.create({
          MaDocGia: maDocGia,
          MaSach: this.maSachDangMuon,
          TrangThai: "Chờ duyệt",
          NgayMuon: this.formNgayMuon,
          NgayTra: this.formNgayTra,
          NgayTraThuc: "",
          TienPhatTreHan: 0,
        });

        this.modalMuonSach.hide();
        alert("Đăng ký mượn thành công. Vui lòng chờ duyệt!");
      } catch (err) {
        console.error(err);
        alert("Lỗi khi đăng ký mượn sách.");
      }
    },
    close() {
      if (this.modalMuonSach) this.modalMuonSach.hide();
    },
  },
};
</script>

<style scoped></style>
