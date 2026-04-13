<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useCartStore } from "../stores/cart";
import { ref } from "vue";
import Swal from 'sweetalert2';
import axios from 'axios';

const auth = useAuthStore();
const cart = useCartStore(); 
const router = useRouter();

const open = ref(false); 
const showCart = ref(false); 

const onLogout = () => {
  auth.logout();
  open.value = false;
  router.push("/login");
};

const submitBorrowRequest = async () => {
  if (!auth.isLoggedIn) {
    Swal.fire({
      title: 'Yêu cầu đăng nhập', 
      text: 'Vui lòng đăng nhập để gửi đơn mượn!', 
      icon: 'warning',
      customClass: { popup: 'rounded-[2rem]' }
    });
    router.push('/login');
    return;
  }

  const result = await Swal.fire({
    title: 'Gửi yêu cầu mượn?',
    text: `Bạn muốn gửi đơn mượn cho ${cart.totalItems} cuốn sách này?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Xác nhận mượn',
    cancelButtonText: 'Kiểm tra lại',
    customClass: { popup: 'rounded-[2rem]' }
  });

  if (result.isConfirmed) {
    try {
      const today = new Date();
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + 7);

      for (const item of cart.items) {
        await axios.post("http://localhost:3000/api/muon", {
          ngayMuon: today.toLocaleDateString('vi-VN'),
          NgayTra: returnDate,
          MaDocGia: auth.user.id || auth.user.user.id,
          MaSach: item._id,
          TrangThai: 0 
        });
      }

      Swal.fire({
        title: 'Thành công!', 
        text: 'Yêu cầu của bạn đã được gửi đến thủ thư.', 
        icon: 'success',
        customClass: { popup: 'rounded-[2rem]' }
      });
      cart.clearCart(); 
      showCart.value = false;
    } catch (error) {
      Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi gửi đơn!', 'error');
    }
  }
};
</script>

<template>
  <nav class="sticky top-0 z-[100] w-full bg-gray-800/95 backdrop-blur-md shadow-lg text-slate-200 border-b border-gray-700">
    <div class="container mx-auto px-4 md:px-10 flex justify-between items-center py-3">
      
      <div class="flex items-center gap-8 md:gap-12">
        <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
          <img src="/images/logo.png" class="h-16 md:h-20 w-auto object-contain" alt="Logo" />
        </RouterLink>

        <ul class="hidden md:flex items-center gap-6">
          <li class="font-bold hover:scale-105 transition-transform duration-300">
            <RouterLink class="px-5 py-2 rounded-lg border border-gray-400 text-gray-200 hover:border-green-500 hover:text-green-500 transition-all shadow-sm" to="/" active-class="!border-green-500 !text-green-500">
              Trang Chủ
            </RouterLink>
          </li>
          <li class="font-bold hover:scale-105 transition-transform duration-300">
            <router-link class="px-5 py-2 rounded-lg border border-gray-400 text-gray-200 hover:border-green-500 hover:text-green-500 transition-all shadow-sm" to="/book" active-class="!border-green-500 !text-green-500">
              Sách
            </router-link>
          </li>
        </ul>
      </div>

      <div class="relative flex items-center gap-4">
        <div class="relative mr-2">
          <button @click="showCart = true" class="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center border border-gray-600 hover:border-white transition-all text-white relative active:scale-95">
            <i class="fa-solid fa-basket-shopping text-xl"></i>
            <span v-if="cart.totalItems > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              {{ cart.totalItems }}
            </span>
          </button>
        </div>

        <RouterLink v-if="!auth.isLoggedIn" to="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2">
          <i class="fa-solid fa-right-to-bracket"></i>
          <span class="font-bold">Đăng nhập</span>
        </RouterLink>

        <div v-else class="relative">
          <button @click="open = !open" class="flex items-center gap-3 text-white px-4 py-2.5 rounded-xl font-bold border border-slate-500 hover:border-white transition-all bg-gray-700/50">
            <span class="max-w-[150px] truncate">{{ auth.user?.HoTen }}</span>
            <i class="fa-solid fa-caret-down transition-transform duration-300" :class="{ 'rotate-180': open }"></i>
          </button>

          <div v-if="open" class="absolute right-0 mt-3 flex flex-col p-2 bg-gray-900 border border-gray-700 w-56 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <router-link v-if="auth.role == 2 || auth.role == 3" to="/admin" class="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors" @click="open = false">
              <i class="fa-solid fa-gauge-high mr-3 text-blue-400"></i>Quản trị
            </router-link>
            <router-link v-if="auth.role == 1" to="/profile" class="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors" @click="open = false">
              <i class="fa-solid fa-circle-user mr-3 text-green-400"></i>Hồ sơ cá nhân
            </router-link>
            <router-link v-if="auth.role == 1" to="/history" class="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors" @click="open = false">
              <i class="fa-solid fa-clipboard-list mr-3 text-yellow-400"></i>Lịch sử mượn
            </router-link>
            <div @click="onLogout" class="flex items-center p-3 mt-1 rounded-lg hover:bg-red-900/30 text-red-500 cursor-pointer border-t border-gray-700">
              <i class="fa-solid fa-power-off mr-3"></i>Đăng Xuất
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <Teleport to="body">
    <div v-if="showCart" class="relative z-[9999]">
      <div @click="showCart = false" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"></div>

      <div class="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
        
        <div class="flex-none p-6 border-b border-slate-100 bg-white flex justify-between items-center">
          <h2 class="text-2xl font-black flex items-center gap-3 text-slate-800">
            <i class="fa-solid fa-basket-shopping text-blue-600"></i> Giỏ Mượn Sách
          </h2>
          <button @click="showCart = false" class="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 hover:text-red-500 transition-colors flex items-center justify-center text-2xl">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          <div v-if="cart.items.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-80">
            <i class="fa-solid fa-box-open text-7xl text-slate-300"></i>
            <p class="font-bold text-lg text-slate-500">Giỏ mượn đang trống!</p>
            <button @click="showCart = false; router.push('/book')" class="mt-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-bold hover:bg-blue-100 transition-colors">
              Khám phá sách ngay
            </button>
          </div>

          <div v-for="item in cart.items" :key="item._id" class="flex gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
            <img :src="item.COVER" class="w-20 h-28 object-cover rounded-xl shadow-sm border border-slate-100" @error="(e) => e.target.src='https://placehold.co/400x600?text=No+Cover'" />
            <div class="flex-1 py-1">
              <h4 class="font-bold text-slate-800 text-lg leading-tight line-clamp-2 pr-6">{{ item.TENSACH }}</h4>
              <p class="text-sm text-slate-500 font-medium mt-1">{{ item.TACGIA }}</p>
              <div class="mt-3 inline-block bg-emerald-50 px-3 py-1 rounded-lg">
                <p class="text-emerald-600 font-bold text-sm">{{ item.DONGIA.toLocaleString() }}đ <span class="text-xs font-medium text-emerald-500/70">/ ngày</span></p>
              </div>
            </div>
            <button @click="cart.removeBook(item._id)" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Xóa khỏi giỏ">
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
        </div>

        <div v-if="cart.items.length > 0" class="flex-none p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10">
          <div class="flex justify-between items-center font-bold mb-4">
            <span class="text-slate-500 text-lg">Tổng số lượng:</span>
            <span class="text-blue-600 text-2xl font-black">{{ cart.totalItems }} cuốn</span>
          </div>
          
          <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6 flex gap-3 items-start">
            <i class="fa-solid fa-circle-info text-amber-500 mt-0.5"></i>
            <p class="text-xs text-amber-700 font-medium leading-relaxed">Hạn trả sách mặc định là <strong>7 ngày</strong> kể từ ngày thư viện duyệt đơn. Vui lòng trả đúng hạn.</p>
          </div>
          
          <button @click="submitBorrowRequest" class="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-slate-900/20 flex justify-center items-center gap-3">
            <i class="fa-solid fa-paper-plane"></i> XÁC NHẬN MƯỢN NGAY
          </button>
        </div>
        
      </div>
    </div>
  </Teleport>
</template>