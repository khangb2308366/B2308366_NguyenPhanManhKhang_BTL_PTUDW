<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from "../../stores/auth"; // Nhập Store để lấy thông tin chuẩn

const router = useRouter();
const authStore = useAuthStore();
const user = ref(null);
const isLoading = ref(true);

const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
    // SỬA LỖI: Lấy ID từ authStore thay vì tự parse localStorage thủ công
    const userId = authStore.user?.id || authStore.user?.user?.id;
    
    if (!userId) {
      console.warn("Không tìm thấy ID người dùng, đang chuyển hướng...");
      router.push('/login');
      return;
    }

    // Gọi API lấy dữ liệu chi tiết
    const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
    user.value = response.data;
    
  } catch (error) {
    console.error("Lỗi khi tải hồ sơ:", error);
    // Nếu lỗi token hoặc hết hạn thì cho về login
    if (error.response?.status === 401) router.push('/login');
  } finally {
    // Cho loading chạy thêm tí cho mượt hiệu ứng
    setTimeout(() => { isLoading.value = false; }, 500);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật';
  const date = new Date(dateString);
  if(isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('vi-VN');
};

const formatGender = (gender) => {
  if (!gender) return 'Chưa cập nhật';
  const g = gender.toLowerCase();
  return (g === 'male' || g === 'nam') ? 'Nam' : (g === 'female' || g === 'nu' || g === 'nữ') ? 'Nữ' : gender;
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 py-12 px-4 md:px-10 font-sans flex flex-col items-center">
    
    <div class="w-full max-w-4xl mb-6">
      <button @click="router.push('/')" class="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-lg w-fit bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100 hover:shadow-md active:scale-95">
        <i class="fa-solid fa-house"></i> Về trang chủ
      </button>
    </div>

    <div v-if="isLoading" class="w-full max-w-4xl space-y-4 animate-pulse">
        <div class="h-64 bg-slate-200 rounded-[2.5rem]"></div>
        <div class="grid grid-cols-2 gap-6">
            <div class="h-20 bg-slate-200 rounded-2xl"></div>
            <div class="h-20 bg-slate-200 rounded-2xl"></div>
        </div>
    </div>

    <div v-else-if="user" class="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      <div class="bg-slate-900 p-10 md:p-14 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
        <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>

        <div class="relative group">
            <img 
              :src="`https://ui-avatars.com/api/?name=${user.Ten}&background=3b82f6&color=fff&size=150&bold=true`" 
              class="w-32 h-32 rounded-full border-4 border-white shadow-2xl relative z-10 object-cover bg-white transition-transform group-hover:scale-105"
            >
            <div class="absolute inset-0 rounded-full bg-black/20 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <i class="fa-solid fa-camera text-white"></i>
            </div>
        </div>
        
        <div class="text-center sm:text-left relative z-10 text-white">
          <h1 class="text-4xl font-black mb-2 tracking-tight">{{ user.Ho }} {{ user.Ten }}</h1>
          <p class="text-slate-400 font-medium text-xl flex items-center justify-center sm:justify-start gap-2">
            <i class="fa-solid fa-at text-sm text-blue-400"></i>{{ user.Username }}
          </p>
          <div class="mt-4 inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
          </div>
        </div>
      </div>

      <div class="p-10 md:p-14">
        <h3 class="text-2xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
          <i class="fa-regular fa-address-card text-blue-500 text-3xl"></i> Thông tin cá nhân
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoBox icon="fa-user" color="text-blue-500" label="Họ và Tên" :value="user.Ho + ' ' + user.Ten" />
          <InfoBox icon="fa-venus-mars" color="text-indigo-500" label="Giới tính" :value="formatGender(user.Phai)" />
          <InfoBox icon="fa-calendar-days" color="text-rose-500" label="Ngày sinh" :value="formatDate(user.NgaySinh)" />
          <InfoBox icon="fa-phone" color="text-emerald-500" label="Số điện thoại" :value="user.DienThoai || 'Chưa cập nhật'" />
          <div class="md:col-span-2">
            <InfoBox icon="fa-location-dot" color="text-orange-500" label="Địa chỉ liên hệ" :value="user.DiaChi || 'Chưa cập nhật'" />
          </div>

          <div @click="router.push('/history')" class="md:col-span-2 flex items-center gap-5 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-[2rem] shadow-lg shadow-blue-200 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
            <div class="absolute right-[-10px] bottom-[-20px] opacity-10 group-hover:rotate-12 transition-transform duration-500">
               <i class="fa-solid fa-book-open text-[10rem] text-white"></i>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0 relative z-10">
              <i class="fa-solid fa-layer-group text-2xl"></i>
            </div>
            <div class="relative z-10 text-white">
              <p class="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1 opacity-80">Sách đang mượn</p>
              <p class="font-black text-2xl">
                Bạn đang giữ <span class="underline decoration-amber-400 underline-offset-4">{{ user.SachChuaTra || 0 }}</span> cuốn sách
              </p>
            </div>
            <div class="ml-auto relative z-10 bg-white/20 p-3 rounded-full text-white group-hover:translate-x-2 transition-transform">
                <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>

        <div class="mt-12 bg-slate-900 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 text-white relative overflow-hidden">
            <i class="fa-solid fa-circle-info text-4xl text-blue-400 opacity-50"></i>
            <p class="font-medium text-slate-300 text-sm leading-relaxed relative z-10">
            </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const InfoBox = {
  props: ['icon', 'color', 'label', 'value'],
  template: `
    <div class="flex items-center gap-5 bg-slate-50 hover:bg-white hover:shadow-md p-5 rounded-2xl border border-slate-100 transition-all group">
      <div :class="color" class="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
        <i class="fa-solid" :class="icon"></i>
      </div>
      <div class="overflow-hidden">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{label}}</p>
        <p class="text-slate-800 font-bold text-lg truncate">{{value}}</p>
      </div>
    </div>
  `
}
</script>