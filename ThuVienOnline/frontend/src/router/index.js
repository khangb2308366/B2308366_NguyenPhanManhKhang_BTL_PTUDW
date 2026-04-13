import { createRouter, createWebHistory } from "vue-router";

// Import các components từ thư mục components
import Home from "../components/Home.vue"; 
import Admin from "../components/Admin.vue";

// Import các components từ thư mục views
import Login from "../views/NguoiDung/Login.vue";
import Book from "../views/Books/Book.vue";
import History from "../views/NguoiDung/History.vue";
import Profile from "../views/NguoiDung/Profile.vue";

// Trang quản lý sách
import AddBook from "../views/Books/AddBook.vue";
import BookDetail from "../views/Books/BookDetail.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/book", name: "Book", component: Book },
  
  // Trang chi tiết sách (Sử dụng tham số động :id)
  { path: "/book/:id", name: "BookDetail", component: BookDetail },
  
  // Trang thêm sách mới (Dùng nếu bạn không dùng Modal ở trang Admin)
  { path: "/addbook", name: "AddBook", component: AddBook },

  { path: "/admin", name: "Admin", component: Admin },
  { path: "/history", name: "History", component: History },
  { path: "/profile", name: "Profile", component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Giúp trang luôn tự cuộn lên đầu khi chuyển hướng
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;