<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center mb-3">
      <h4 class="mb-0">
        <i class="fa-solid fa-users-gear me-2"></i> Quản lý nhân viên
      </h4>
    </div>

    <div class="mb-3">
      <InputSearch v-model="searchText" @submit="timKiemNhanVien" />
    </div>

    <div class="card shadow-sm mb-4">
      <div
        class="card-header bg-primary text-white py-2 d-flex align-items-center justify-content-between"
        style="cursor: pointer"
        @click="toggleForm"
      >
        <strong>
          <i class="fa-solid fa-user-plus me-1"></i>
          {{ nhanvien.oldMSNV ? "Cập nhật nhân viên" : "Thêm nhân viên" }}
        </strong>

        <i class="fa-solid" :class="isFormVisible ? 'fa-minus' : 'fa-plus'"></i>
      </div>

      <div class="card-body" v-show="isFormVisible">
        <NhanVienForm
          :nhanvien="nhanvien"
          @them="themNhanVien"
          @capnhat="capNhatNhanVien"
          @cancel="closeForm"
        />
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white py-2">
        <strong
          ><i class="fa-solid fa-list me-1"></i> Danh sách nhân viên</strong
        >
      </div>

      <div class="card-body p-0">
        <table class="table table-bordered table-striped mb-0">
          <thead class="table-light">
            <tr>
              <th>MSNV</th>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th style="width: 110px">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="nv in nhanviens" :key="nv.MSNV">
              <td>{{ nv.MSNV }}</td>
              <td>{{ nv.HoTenNV }}</td>
              <td>{{ nv.Chucvu }}</td>
              <td>{{ nv.Diachi }}</td>
              <td>{{ nv.SoDienThoai }}</td>
              <td>
                <button
                  class="btn btn-sm btn-warning me-1"
                  @click="editNhanVien(nv)"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>

                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteNhanVien(nv.MSNV)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="nhanviens.length === 0">
              <td colspan="6" class="text-center py-3 text-muted">
                Không có nhân viên nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import NhanVienForm from "@/components/EmployeeForm.vue";
import EmployeeService from "@/services/employee.service";
import InputSearch from "@/components/InputSearch.vue";

export default {
  components: { NhanVienForm, InputSearch },
  data() {
    return {
      searchText: "",
      allNhanViens: [],
      nhanviens: [],
      nhanvien: {
        HoTenNV: "",
        MSNV: "",
        Chucvu: "",
        Diachi: "",
        SoDienThoai: "",
        Password: "",
        oldMSNV: "",
      },
      isFormVisible: false,
    };
  },
  methods: {
    async fetchNhanViens() {
      const data = await EmployeeService.getAll();
      this.allNhanViens = data;
      this.nhanviens = data;
    },

    timKiemNhanVien() {
      const tuKhoa = this.searchText.trim().toLowerCase();
      if (!tuKhoa) {
        this.nhanviens = this.allNhanViens;
        return;
      }

      this.nhanviens = this.allNhanViens.filter(
        (nv) =>
          nv.HoTenNV?.toLowerCase().includes(tuKhoa) ||
          nv.MSNV?.toLowerCase().includes(tuKhoa)
      );
    },

    async themNhanVien(data) {
      try {
        await EmployeeService.create(data);
        this.$toast?.success?.("Thêm nhân viên thành công!") ||
          alert("Đã thêm nhân viên.");
        this.fetchNhanViens();
      } catch (error) {
        if (error.response?.status === 409) {
          this.$toast?.error?.("Mã nhân viên đã tồn tại!") ||
            alert("Mã nhân viên đã tồn tại!");
        } else {
          this.$toast?.error?.("Lỗi khi thêm nhân viên!") ||
            alert("Lỗi khi thêm nhân viên.");
          console.error(error);
        }
      }
    },

    async capNhatNhanVien(data) {
      try {
        const payload = { ...data };

        if (!payload.Password || payload.Password.trim() === "") {
          delete payload.Password;
        }

        await EmployeeService.update(this.nhanvien.oldMSNV, payload);

        this.$toast?.success?.("Cập nhật nhân viên thành công!") ||
          alert("Đã cập nhật.");
        this.fetchNhanViens();
        this.nhanvien.oldMSNV = data.MSNV;
      } catch (error) {
        this.$toast?.error?.("Lỗi khi cập nhật nhân viên!") ||
          alert("Lỗi khi cập nhật.");
        console.error(error);
      }
    },

    editNhanVien(nv) {
      this.nhanvien = {
        ...nv,
        Password: "",
        oldMSNV: nv.MSNV,
      };
      this.isFormVisible = true;
    },

    async deleteNhanVien(id) {
      if (confirm("Xóa nhân viên này?")) {
        try {
          await EmployeeService.delete(id);
          this.fetchNhanViens();
        } catch (error) {
          this.$toast?.error?.("Lỗi khi xoá!") || alert("Xoá thất bại.");
        }
      }
    },

    resetForm() {
      this.nhanvien = {
        HoTenNV: "",
        MSNV: "",
        Chucvu: "",
        Diachi: "",
        SoDienThoai: "",
        Password: "",
      };
    },
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
    },

    openEditForm(nv) {
      this.editNhanVien(nv);
      this.isFormVisible = true;
    },

    closeForm() {
      this.resetForm();
      this.isFormVisible = false;
    },
  },
  mounted() {
    this.fetchNhanViens();
  },
};
</script>
