<template>
  <div class="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-800 to-slate-900 p-4 font-sans">
    <div class="relative w-full max-w-5xl h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">

      <router-link 
        to="/" 
        class="absolute top-6 left-6 z-[100] flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md text-slate-700 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg border border-slate-200"
        title="Quay về trang chủ"
      >
        <i class="fa-solid fa-house"></i>
      </router-link>

      <div class="w-1/2 h-full flex flex-col justify-center items-center p-8 lg:p-12 text-slate-800 relative z-10">
        <div class="w-full max-w-sm">
          <h2 class="text-4xl font-black mb-8 text-center text-slate-900 tracking-tight">Đăng nhập</h2>

          <div v-if="loginError" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm animate-shake font-medium">
            <i class="fa-solid fa-circle-exclamation mr-2"></i> {{ loginError }}
          </div>

          <form @submit.prevent="onLogin" class="space-y-5">
            <div>
              <label class="block text-xs font-black uppercase tracking-widest mb-1.5 text-slate-500 ml-1">Tên đăng nhập</label>
              <input v-model="login.username" @input="loginError = ''" type="text" placeholder="Nhập username..." required
                class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-sm font-bold text-slate-800" />
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest mb-1.5 text-slate-500 ml-1">Mật khẩu</label>
              <input v-model="login.password" @input="loginError = ''" type="password" placeholder="••••••••" required
                class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-sm font-bold text-slate-800" />
            </div>

            <button type="submit" :disabled="isLoading"
              class="w-full py-4 mt-6 rounded-xl bg-blue-600 text-white font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all duration-300 disabled:bg-slate-400 flex justify-center items-center gap-2 uppercase tracking-widest text-sm">
              <i v-if="isLoading" class="fa-solid fa-circle-notch animate-spin"></i>
              {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập ngay' }}
            </button>
          </form>

          <p class="text-center mt-8 text-slate-500 font-medium">
            Chưa có tài khoản?
            <button @click="toggleForm" class="text-blue-600 font-black hover:text-blue-800 transition-colors ml-1">Đăng ký</button>
          </p>
        </div>
      </div>

      <div class="w-1/2 h-full flex flex-col justify-center items-center p-8 lg:p-12 text-slate-800 bg-slate-50 relative z-10">
        <div class="w-full max-w-sm">
          <h2 class="text-4xl font-black text-center mb-8 text-slate-900 tracking-tight">Tạo tài khoản</h2>

          <form @submit.prevent="onRegister" class="space-y-4">
            <div class="flex gap-4">
              <div class="w-1/2">
                <input v-model="register.firstName" placeholder="Họ" required
                  class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 text-sm" />
                <span class="text-[10px] text-red-500 font-bold block mt-1 ml-1" v-if="registerErrors.firstName">{{ registerErrors.firstName }}</span>
              </div>
              <div class="w-1/2">
                <input v-model="register.lastName" placeholder="Tên" required
                  class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 text-sm" />
                <span class="text-[10px] text-red-500 font-bold block mt-1 ml-1" v-if="registerErrors.lastName">{{ registerErrors.lastName }}</span>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-1/2">
                <input v-model="register.dob" type="date" required
                  class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-slate-500 font-bold text-sm" />
                <span class="text-[10px] text-red-500 font-bold block mt-1 ml-1" v-if="registerErrors.dob">{{ registerErrors.dob }}</span>
              </div>
              <div class="w-1/2">
                <input v-model="register.phone" placeholder="Số điện thoại" required
                  class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 text-sm" />
                <span class="text-[10px] text-red-500 font-bold block mt-1 ml-1" v-if="registerErrors.phone">{{ registerErrors.phone }}</span>
              </div>
            </div>

            <div>
              <input v-model="register.address" placeholder="Địa chỉ liên hệ" required
                class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 text-sm" />
              <span class="text-[10px] text-red-500 font-bold block mt-1 ml-1" v-if="registerErrors.address">{{ registerErrors.address }}</span>
            </div>
            
            <div>
              <input v-model="register.username" placeholder="Tên đăng nhập (Username)" required
                class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 text-sm" />
              <span class="text-[10px] text-red-500 font-bold block mt-1 ml-1" v-if="registerErrors.username">{{ registerErrors.username }}</span>
            </div>
            
            <div>
              <input v-model="register.password" type="password" placeholder="Mật khẩu bảo mật" required
                class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 text-sm" />
              <span class="text-[10px] text-red-500 font-bold block mt-1 ml-1" v-if="registerErrors.password">{{ registerErrors.password }}</span>
            </div>

            <button type="submit" :disabled="isLoading"
              class="w-full py-4 mt-2 rounded-xl bg-slate-900 text-white font-black shadow-lg hover:bg-emerald-500 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 uppercase tracking-widest text-sm">
              <i v-if="isLoading" class="fa-solid fa-circle-notch animate-spin"></i>
              {{ isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}
            </button>
          </form>

          <p class="text-center mt-6 text-slate-500 font-medium">
            Đã có tài khoản?
            <button @click="toggleForm" class="text-blue-600 font-black hover:text-blue-800 transition-colors ml-1">Đăng nhập</button>
          </p>
        </div>
      </div>

      <div
        class="absolute top-0 left-0 w-1/2 h-full z-20 transition-transform duration-700 ease-in-out pointer-events-none shadow-2xl"
        :class="isLogin ? 'translate-x-full' : 'translate-x-0'"
      >
        <img
          src="/images/dn-dk.jpg"
          class="w-full h-full object-cover"
          alt="Library Slide"
          @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000'"
        />
        <div class="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth"; 
import Swal from 'sweetalert2'; 

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const isLoading = ref(false);
const loginError = ref("");
const registerError = ref("");

const registerErrors = reactive({
  firstName: "", lastName: "", phone: "", dob: "", username: "", password: "", address: "",
});

function toggleForm() {
  isLogin.value = !isLogin.value;
  loginError.value = "";
  registerError.value = "";
  Object.keys(registerErrors).forEach(key => registerErrors[key] = "");
}

// ================= XỬ LÝ ĐĂNG NHẬP =================
const login = reactive({ username: "", password: "" });

const onLogin = async () => {
  loginError.value = "";
  isLoading.value = true;
  try {
    const res = await axios.post("http://localhost:3000/api/login", {
      Username: login.username,
      MatKhau: login.password,
    });

    Swal.fire({
      icon: 'success',
      title: 'Đăng nhập thành công',
      text: `Chào mừng ${res.data.user.HoTen || res.data.user.Ten} quay trở lại!`,
      showConfirmButton: false,
      timer: 2000,
      customClass: { popup: 'rounded-[2rem]' }
    });

    authStore.login(res.data); 

    // 🔥 ĐÃ SỬA CHỖ NÀY:
    // Chỉ những ai có role = 2 (Nhân Viên) hoặc role = 3 (Admin) thì mới vào '/admin'
    // Độc giả (role = 1) sẽ được chuyển về Trang Chủ '/'
    if (res.data.user.role == 2 || res.data.user.role == 3) {
      router.push("/admin");
    } else {
      router.push("/");
    }

  } catch (error) {
    const errors = error.response?.data?.errors;
    if (errors) {
      loginError.value = errors.Username || errors.MatKhau || "Tài khoản hoặc mật khẩu chưa đúng";
    } else {
      loginError.value = error.response?.data?.message || "Lỗi kết nối server hoặc sai thông tin!";
    }
  } finally {
    isLoading.value = false;
  }
};

// ================= XỬ LÝ ĐĂNG KÝ (TẠO TÀI KHOẢN ĐỘC GIẢ) =================
const register = reactive({
  firstName: "", lastName: "", phone: "", dob: "", username: "", password: "", address: "",
});

const onRegister = async () => {
  isLoading.value = true;
  Object.keys(registerErrors).forEach(key => registerErrors[key] = "");

  try {
    await axios.post("http://localhost:3000/api/register", {
      Ho: register.firstName,
      Ten: register.lastName,
      NgaySinh: register.dob,
      DiaChi: register.address,
      DienThoai: register.phone,
      Username: register.username,
      MatKhau: register.password,
    });

    Swal.fire({
      icon: 'success',
      title: 'Đăng ký thành công!',
      text: 'Tài khoản Độc giả của bạn đã được tạo. Vui lòng đăng nhập để sử dụng hệ thống.',
      confirmButtonText: 'Đăng nhập ngay',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[2rem]' }
    });

    Object.keys(register).forEach(key => register[key] = "");
    isLogin.value = true;

  } catch (error) {
    const errors = error.response?.data?.errors;
    if (errors) {
      if (errors.Ho) registerErrors.firstName = errors.Ho;
      if (errors.Ten) registerErrors.lastName = errors.Ten;
      if (errors.Username) registerErrors.username = errors.Username;
      if (errors.MatKhau) registerErrors.password = errors.MatKhau;
      if (errors.DienThoai) registerErrors.phone = errors.DienThoai;
      if (errors.NgaySinh) registerErrors.dob = errors.NgaySinh;
      if (errors.DiaChi) registerErrors.address = errors.DiaChi;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tạo tài khoản',
        text: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại username khác.',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}
</style>