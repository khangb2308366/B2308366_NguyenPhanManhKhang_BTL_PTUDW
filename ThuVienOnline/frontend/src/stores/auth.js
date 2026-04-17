import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null, 
    role: null, 
    token: null, 
  }),

  getters: {
    isAdmin: (state) => state.role == 3,
    isStaff: (state) => state.role == 2,
    isUser: (state) => state.role == 1,
  },

  actions: {
    login(data) {
      this.isLoggedIn = true;
      this.user = data.user;
      this.role = data.user.role;
      this.token = data.token; 
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