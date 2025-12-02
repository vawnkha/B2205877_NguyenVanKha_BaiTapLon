<template>
  <div>
    <h4>Quản lý sách</h4>

    <InputSearch v-model="searchText" @submit="timKiemSach" />

    <SachForm
      :sach="sach"
      :dsNXB="dsNXB"
      @them="themSach"
      @capnhat="capNhatSach"
      @cancel="resetForm"
    />

    <table class="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>Mã sách</th>
          <th>Tên sách</th>
          <th>Giá</th>
          <th>Số quyển</th>
          <th>Năm XB</th>
          <th>Mã NXB</th>
          <th>Tác giả</th>
          <th>Thao tác</th>
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
            <button class="btn btn-sm btn-warning me-2" @click="editSach(s)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteSach(s.MaSach)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SachForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";
import InputSearch from "@/components/InputSearch.vue";

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
  },
  mounted() {
    this.fetchSachs();
    this.fetchNXBs();
  },
};
</script>
