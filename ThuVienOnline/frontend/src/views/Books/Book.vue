<template>
  <div class="container mx-auto px-6 py-16 min-h-screen bg-gray-50/50">
    
    <div class="flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-gray-100 pb-8">
      <div>
        <h2 class="text-4xl font-extrabold text-gray-950 tracking-tight">
          Tất Cả Sách
          <span class="block w-20 h-1.5 bg-green-500 rounded-full mt-3"></span>
        </h2>
      </div>
      
      <button 
        v-if="auth.isLoggedIn && (auth.role === 2 || auth.role === 3)"
        @click="router.push('/addbook')"
        class="mt-6 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2.5 active:scale-95"
      >
        <i class="fa-solid fa-plus text-lg"></i>
        <span>Thêm sách mới</span>
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-60">
      <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="books.length === 0" class="text-center text-gray-500 py-24 text-lg bg-white rounded-3xl shadow-sm border border-gray-100">
      <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
         <i class="fa-solid fa-book-open text-5xl text-gray-300"></i>
      </div>
      <p class="font-bold text-gray-600">Hiện tại chưa có cuốn sách nào trong thư viện.</p>
      <p class="text-sm mt-2">Vui lòng quay lại sau hoặc thêm sách mới từ Admin Panel.</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      <div 
        v-for="book in books" 
        :key="book._id" 
        @click="goToDetail(book._id)"
        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer group transform hover:-translate-y-2"
      >
        <div class="h-72 overflow-hidden bg-gray-50 relative">
          <img 
            :src="book.COVER || '/images/placeholder.jpg'" 
            :alt="book.TENSACH" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            @error="(e) => e.target.src='/images/placeholder.jpg'"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          
          <span v-if="book.SOLUONG === 0" class="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm">
            Hết sách
          </span>
        </div>
        
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="font-extrabold text-gray-950 text-xl mb-1.5 line-clamp-2 group-hover:text-green-600 transition-colors" :title="book.TENSACH">
            {{ book.TENSACH }}
          </h3>
          <p class="text-sm text-gray-500 mb-4 font-medium line-clamp-1">{{ book.TACGIA }}</p>
          
          <div class="mt-auto flex justify-between items-center gap-3">
            <span class="text-blue-600 font-extrabold text-xl">{{ formatPrice(book.DONGIA) }}đ</span>
            <button class="text-sm bg-gray-50 hover:bg-green-500 hover:text-white text-gray-700 px-4 py-2.5 rounded-xl transition-all font-bold shadow-sm hover:shadow-green-500/30">
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// 1. KHAI BÁO BIẾN
const router = useRouter();
const books = ref([]); // Mảng chứa dữ liệu sách
const isLoading = ref(true); // Trạng thái loading quay quay

// Quản lý trạng thái user (Để ẩn/hiện nút Thêm sách)
const auth = reactive({
  isLoggedIn: false,
  role: 1 // 1: User thường, 2: Nhân viên, 3: Admin
});

// 2. HÀM KIỂM TRA ĐĂNG NHẬP
const checkAuth = () => {
  try {
    // Lấy thông tin user từ localStorage (do trang Login của bạn lưu vào)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      auth.isLoggedIn = true;
      auth.role = user.role;
    }
  } catch (error) {
    console.error("Lỗi đọc localStorage:", error);
  }
};

// 3. HÀM GỌI API LẤY SÁCH TỪ BACKEND
const fetchBooks = async () => {
  isLoading.value = true;
  try {
    // Gọi route /api/sach để lấy danh sách sách có XOA: 0
    const response = await axios.get('http://localhost:3000/api/sach');
    books.value = response.data; // Đổ dữ liệu vào biến books
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
  } finally {
    isLoading.value = false; // Tắt vòng quay loading
  }
};

// 4. HÀM ĐỊNH DẠNG TIỀN TỆ (VD: 5000 -> 5.000)
const formatPrice = (price) => {
  if (!price) return '0';
  return new Intl.NumberFormat('vi-VN').format(price);
};

// 5. HÀM CHUYỂN SANG TRANG CHI TIẾT SÁCH
const goToDetail = (id) => {
  router.push(`/book/${id}`);
};

// 6. CHẠY HÀM KHI VỪA MỞ TRANG
onMounted(() => {
  checkAuth();
  fetchBooks();
});
</script>