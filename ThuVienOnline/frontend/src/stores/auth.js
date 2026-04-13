import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null, // chứa HoTen, role, id từ backend
    role: null, // 1: Độc giả, 2: Nhân viên, 3: Admin
    token: null, // BẮT BUỘC PHẢI CÓ ĐỂ GỌI API BẢO MẬT
  }),

  getters: {
    isAdmin: (state) => state.role == 3,
    isStaff: (state) => state.role == 2,
    isUser: (state) => state.role == 1,
  },

  actions: {
    // Sửa lại nhận data từ api login
    login(data) {
      this.isLoggedIn = true;
      this.user = data.user;
      this.role = data.user.role;
      this.token = data.token; // Lưu lại token
    },

    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.role = null;
      this.token = null;
    },
  },

  persist: true,
});

export const useFilterStore = defineStore("filterStore", {
  state: () => ({
    nxb: "",
    minPrice: 0,
    maxPrice: 1000000,
    theloai: "",
  }),
  actions: {
    resetFilters() {
      this.nxb = "";
      this.theloai = "";
      this.minPrice = 0;
      this.maxPrice = 1000000;
    },
  },
});