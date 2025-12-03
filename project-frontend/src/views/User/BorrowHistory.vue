<template>
  <div>
    <h3 class="mb-4 text-primary fw-bold">
      <i class="fa-solid fa-clock-rotate-left me-2"></i> Lịch sử mượn sách
    </h3>

    <div class="table-responsive shadow-sm rounded-3 overflow-hidden">
      <table
        class="table table-bordered table-hover align-middle history-table"
      >
        <thead class="table-primary text-center">
          <tr>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả dự kiến</th>
            <th>Ngày trả thực tế</th>
            <th>Trạng thái</th>
            <th>Tiền phạt</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="history.length === 0">
            <td colspan="6" class="text-center py-3 text-muted fst-italic">
              Không có dữ liệu.
            </td>
          </tr>

          <tr v-for="record in history" :key="record._id">
            <td class="fw-semibold">
              {{ record.TenSach || "(Không rõ tên sách)" }}
            </td>

            <td>{{ formatDate(record.NgayMuon) }}</td>

            <td>{{ formatDate(record.NgayTra) }}</td>

            <td>
              <span class="text-dark">
                {{ formatDate(record.NgayKetThuc) || "Chưa trả" }}
              </span>
            </td>

            <td class="text-center">
              <span
                class="badge status-badge px-3 py-2"
                :class="{
                  'bg-warning text-dark': record.TrangThai === 'Chờ duyệt',
                  'bg-success':
                    record.TrangThai === 'Đã mượn' ||
                    record.TrangThai === 'Đã duyệt',
                  'bg-secondary': record.TrangThai === 'Đã trả',
                  'bg-danger': record.TrangThai === 'Từ chối',
                }"
              >
                {{ record.TrangThai }}
              </span>
            </td>

            <td
              class="fw-bold text-end"
              :class="
                record.TienPhatTreHan && record.TienPhatTreHan > 0
                  ? 'text-danger'
                  : 'text-muted'
              "
            >
              {{ formatMoney(record.TienPhatTreHan) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import BorrowBookService from "@/services/borrow_book.service";

export default {
  data() {
    return {
      history: [],
    };
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },

    formatMoney(amount) {
      if (!amount || amount === 0) return "0 đ";
      return Number(amount).toLocaleString("vi-VN") + " đ";
    },

    async fetchHistory() {
      const docGia = JSON.parse(localStorage.getItem("user"));
      if (!docGia || !docGia.user?.MaDocGia) {
        alert("Bạn cần đăng nhập để xem lịch sử mượn sách.");
        return;
      }

      try {
        const data = await BorrowBookService.findByMaDocGia(
          docGia.user.MaDocGia
        );
        this.history = data;
      } catch (err) {
        console.error(err);
        alert("Không thể tải lịch sử mượn sách.");
      }
    },
  },
  mounted() {
    this.fetchHistory();
  },
};
</script>

<style scoped>
.history-table th {
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.95rem;
}

.history-table td {
  padding: 12px 10px;
}

.history-table tbody tr:hover {
  background-color: #f7faff !important;
  transition: 0.2s ease;
}

.status-badge {
  font-size: 0.85rem;
  border-radius: 12px;
}

.table-bordered {
  border-color: #d5dbe0 !important;
}

.table thead tr th {
  padding: 14px 10px !important;
}
</style>
