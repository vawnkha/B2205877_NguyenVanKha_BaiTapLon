<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 class="mb-0 d-flex align-items-center">
        <i class="fa-solid fa-users-viewfinder me-2"></i> Quản lý độc giả
      </h4>
      <button class="btn btn-success" @click="exportExcel">
        <i class="fa-solid fa-file-excel me-1"></i> Xuất Excel
      </button>
    </div>

    <div class="mb-3">
      <InputSearch v-model="searchText" @submit="timKiemDocGia" />
    </div>

    <div class="card shadow-sm mb-4">
      <div
        class="card-header bg-primary text-white py-2 d-flex align-items-center justify-content-between"
        style="cursor: pointer"
        @click="toggleForm"
      >
        <strong>
          <i class="fa-solid fa-user-pen me-1"></i>
          {{ docgia.old ? "Cập nhật độc giả" : "Thêm độc giả" }}
        </strong>

        <i class="fa-solid" :class="isFormVisible ? 'fa-minus' : 'fa-plus'"></i>
      </div>

      <div class="card-body" v-show="isFormVisible">
        <DocGiaForm
          :docgia="docgia"
          @them="themDocGia"
          @capnhat="capNhatDocGia"
          @cancel="closeForm"
        />
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white py-2">
        <strong>
          <i class="fa-solid fa-list me-1"></i> Danh sách độc giả
        </strong>
      </div>

      <div class="card-body p-0">
        <table class="table table-bordered table-striped mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Phái</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th style="width: 110px">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="dg in docgias" :key="dg.MaDocGia">
              <td>{{ dg.MaDocGia }}</td>
              <td>{{ dg.HoLot }} {{ dg.Ten }}</td>
              <td>{{ dg.NgaySinh }}</td>
              <td>{{ dg.Phai }}</td>
              <td>{{ dg.DiaChi }}</td>
              <td>{{ dg.DienThoai }}</td>

              <td>
                <button
                  class="btn btn-sm btn-warning me-1"
                  @click="editDocGia(dg)"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>

                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteDocGia(dg.MaDocGia)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="docgias.length === 0">
              <td colspan="7" class="text-center py-3 text-muted">
                Không có độc giả nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import DocGiaForm from "@/components/ReaderForm.vue";
import ReaderService from "@/services/reader.service";
import InputSearch from "@/components/InputSearch.vue";
import * as XLSX from "xlsx";

export default {
  components: {
    DocGiaForm,
    InputSearch,
  },
  data() {
    return {
      searchText: "",
      allDocGias: [],
      docgias: [],
      docgia: {
        MaDocGia: "",
        HoLot: "",
        Ten: "",
        NgaySinh: "",
        Phai: "",
        DiaChi: "",
        DienThoai: "",
        Password: "",
        old: "",
      },
      isFormVisible: false,
    };
  },
  methods: {
    async fetchDocGias() {
      const data = await ReaderService.getAll();
      this.allDocGias = data;
      this.docgias = data;
    },
    timKiemDocGia() {
      const tuKhoa = this.searchText.trim().toLowerCase();
      if (!tuKhoa) {
        this.docgias = this.allDocGias;
        return;
      }

      this.docgias = this.allDocGias.filter(
        (dg) =>
          (dg.HoLot + " " + dg.Ten).toLowerCase().includes(tuKhoa) ||
          dg.MaDocGia?.toLowerCase().includes(tuKhoa)
      );
    },
    async themDocGia(data) {
      try {
        await ReaderService.create(data);
        this.$toast?.success?.("Thêm độc giả thành công!") ||
          alert("Đã thêm độc giả.");
        this.fetchDocGias();
      } catch (error) {
        if (error.response?.status === 409) {
          this.$toast?.error?.("Mã độc giả đã tồn tại!") ||
            alert("Mã độc giả đã tồn tại!");
        } else {
          this.$toast?.error?.("Lỗi khi thêm độc giả!") ||
            alert("Lỗi khi thêm độc giả.");
          console.error(error);
        }
      }
    },
    async capNhatDocGia(data) {
      try {
        const payload = { ...data };

        if (!payload.Password || payload.Password.trim() === "") {
          delete payload.Password;
        }

        await ReaderService.update(this.docgia.old, payload);

        this.$toast?.success?.("Cập nhật độc giả thành công!") ||
          alert("Đã cập nhật.");
        this.fetchDocGias();
        this.docgia.old = data.MaDocGia;
      } catch (error) {
        this.$toast?.error?.("Lỗi khi cập nhật độc giả!") ||
          alert("Lỗi khi cập nhật.");
        console.error(error);
      }
    },
    editDocGia(dg) {
      this.docgia = {
        ...dg,
        Password: "",
        old: dg.MaDocGia,
        oldPassword: dg.Password,
      };
      this.isFormVisible = true;
    },
    async deleteDocGia(id) {
      if (confirm("Xóa độc giả này?")) {
        try {
          await ReaderService.delete(id);
          this.resetForm();
          this.fetchDocGias();
        } catch (error) {
          this.$toast?.error?.("Lỗi khi xoá!") || alert("Xoá thất bại.");
        }
      }
    },
    resetForm() {
      this.docgia = {
        MaDocGia: "",
        HoLot: "",
        Ten: "",
        NgaySinh: "",
        Phai: "",
        DiaChi: "",
        DienThoai: "",
        Password: "",
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
      const data = this.docgias.map((dg) => ({
        "Mã độc giả": dg.MaDocGia,
        "Họ tên": dg.HoLot + " " + dg.Ten,
        "Ngày sinh": dg.NgaySinh,
        Phái: dg.Phai,
        "Địa chỉ": dg.DiaChi,
        "Số điện thoại": dg.DienThoai,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDocGia");

      XLSX.writeFile(workbook, "DanhSachDocGia.xlsx");
    },
  },
  mounted() {
    this.fetchDocGias();
  },
};
</script>
