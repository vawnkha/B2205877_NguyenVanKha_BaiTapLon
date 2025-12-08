<template>
  <div>
    <h4 class="mb-4 text-primary fw-bold">
      <i class="fa-solid fa-book-open me-2"></i> Danh sách sách
    </h4>

    <div class="mb-4">
      <InputSearch v-model="searchText" @submit="timKiemSach" />
    </div>

    <div class="row g-4">
      <div
        v-for="book in books"
        :key="book.MaSach"
        class="col-sm-6 col-md-4 col-lg-3"
      >
        <div class="card shadow-sm border-0 h-100 book-card">
          <div
            class="card-body d-flex flex-column align-items-center text-center"
          >
            <h5 class="card-title fw-bold mb-3 book-title">
              {{ book.TenSach }}
            </h5>

            <ul
              class="list-unstyled small text-muted flex-grow-1 text-start w-100"
            >
              <li>
                <i class="fa-solid fa-user-pen me-1"></i> Tác giả:
                <b>{{ book.NguonGoc }}</b>
              </li>
              <li>
                <i class="fa-solid fa-calendar-day me-1"></i> Năm XB:
                <b>{{ book.NamXuatBan }}</b>
              </li>
              <li>
                <i class="fa-solid fa-layer-group me-1"></i> Số lượng:
                <b>{{ book.SoQuyen }}</b>
              </li>
            </ul>

            <button
              class="btn btn-primary mt-auto w-100 rounded-pill btn-muon"
              @click="muonSach(book.MaSach)"
              :disabled="book.SoQuyen <= 0"
            >
              <i class="fa-solid fa-book-open me-1"></i>
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
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-3 shadow-lg">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="fa-solid fa-handshake-simple me-1"></i>
              Thông tin mượn sách
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              @click="close"
            ></button>
          </div>

          <div class="modal-body">
            <label class="fw-semibold mb-1">Ngày mượn:</label>
            <input
              type="date"
              v-model="formNgayMuon"
              class="form-control mb-3"
              :min="today"
            />

            <label class="fw-semibold mb-1">Ngày trả dự kiến:</label>
            <input
              type="date"
              v-model="formNgayTra"
              class="form-control"
              :min="formNgayMuon || today"
            />
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-secondary rounded-pill px-4"
              data-bs-dismiss="modal"
              @click="close"
            >
              Hủy
            </button>
            <button
              class="btn btn-primary rounded-pill px-4"
              @click="xacNhanMuonSach"
            >
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
      today: new Date().toISOString().split("T")[0],
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
          (p) =>
            p.MaSach === maSach &&
            ["Chờ duyệt", "Đã duyệt", "Đã mượn"].includes(p.TrangThai)
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
      if (this.formNgayMuon < this.today) {
        alert("Ngày mượn phải từ hôm nay trở đi!");
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

<style scoped>
.book-card {
  transition: 0.25s ease;
  border-radius: 14px !important;
  padding-top: 6px;
  text-align: center;
}

.book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
}

.book-title {
  font-size: 1.2rem;
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.btn-muon {
  font-weight: 600;
  padding: 10px 0;
  transition: 0.25s;
}

.btn-muon:disabled {
  background-color: #bfbfbf !important;
  border: none;
}

.btn-muon:not(:disabled):hover {
  opacity: 0.9;
}

.modal-content {
  border-radius: 16px !important;
}
</style>
