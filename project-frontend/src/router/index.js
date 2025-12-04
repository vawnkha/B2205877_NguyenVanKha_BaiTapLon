import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import UserLayout from "@/layouts/UserLayout.vue";

import NhanVienManager from "@/views/Admin/EmployeeManager.vue";
import DocGiaManager from "@/views/Admin/ReaderManager.vue";
import SachManager from "@/views/Admin/BookManager.vue";
import NXBManager from "@/views/Admin/PublisherManager.vue";
import MuonSachManager from "@/views/Admin/BorrowBookManager.vue";
import TraSachManager from "@/views/Admin/ReturnBookManager.vue";
import BookList from "@/views/User/BookList.vue";
import BorrowHistory from "@/views/User/BorrowHistory.vue";

const routes = [
  {
    path: "/",
    name: "/",
    meta: { requiresAuth: true, role: "user" },
    component: UserLayout,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/SigupReaderView.vue"),
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "nhan-vien", component: NhanVienManager },
      { path: "doc-gia", component: DocGiaManager },
      { path: "sach", component: SachManager },
      { path: "nha-xuat-ban", component: NXBManager },
      { path: "muon-sach", component: MuonSachManager },
      { path: "tra-sach", component: TraSachManager },
      { path: "", redirect: "/admin/nhan-vien" },
    ],
  },
  {
    path: "/user",
    component: UserLayout,
    meta: { requiresAuth: true, role: "user" },
    children: [
      { path: "books", component: BookList },
      { path: "history", component: BorrowHistory },
      { path: "", redirect: "/user/books" },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth) {
    if (!user) {
      return next({ name: "login" });
    }

    if (to.meta.role && to.meta.role !== user.role) {
      return next({ name: "login" });
    }
  }

  next();
});

export default router;
