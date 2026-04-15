<template>
  <div class="container mx-auto px-6 py-16 min-h-screen bg-gray-50/50">
    
    <div class="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-8">
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

    <div class="mb-12 flex flex-wrap gap-3 items-center">
      <span class="text-sm font-black uppercase tracking-widest text-gray-400 mr-2">Lọc theo:</span>
      
      <button 
        @click="selectedCategory = 'all'"
        :class="selectedCategory === 'all' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
        class="px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
      >
        Tất cả sách
      </button>

      <button 
        v-for="cat in categoryList" 
        :key="cat._id"
        @click="selectedCategory = cat.TenTheLoai"
        :class="selectedCategory === cat.TenTheLoai ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
        class="px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
      >
        {{ cat.TenTheLoai }}
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-60">
      <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="filteredBooks.length === 0" class="text-center text-gray-500 py-24 text-lg bg-white rounded-3xl shadow-sm border border-gray-100">
      <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
         <i class="fa-solid fa-magnifying-glass text-5xl text-gray-300"></i>
      </div>
      <p class="font-bold text-gray-600">Không tìm thấy cuốn sách nào thuộc thể loại "{{ selectedCategory }}".</p>
      <button @click="selectedCategory = 'all'" class="mt-4 text-green-600 font-bold hover:underline">Quay lại xem tất cả</button>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      <div 
        v-for="book in filteredBooks" 
        :key="book._id" 
        @click="goToDetail(book._id)"
        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer group transform hover:-translate-y-2"
      >
        <div class="h-72 overflow-hidden bg-gray-50 relative">
          <img 
            :src="book.COVER || '/images/placeholder.jpg'" 
            :alt="book.TENSACH" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            @error="(e) => e.target.src='https://placehold.co/400x600?text=No+Cover'"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          
          <span v-if="book.SOLUONG === 0" class="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm">
            Hết sách
          </span>

          <span class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-gray-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm border border-gray-100">
            {{ book.THELOAI?.TenTheLoai || 'Chưa phân loại' }}
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
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// 1. KHAI BÁO BIẾN
const router = useRouter();
const books = ref([]); 
const categoryList = ref([]); // 🔥 Danh sách thể loại từ Backend
const selectedCategory = ref('all'); // 🔥 Thể loại đang được chọn (mặc định là 'all')
const isLoading = ref(true);

const auth = reactive({
  isLoggedIn: false,
  role: 1 
});

// 2. LOGIC LỌC SÁCH
// Hàm này sẽ tự động chạy lại mỗi khi biến selectedCategory thay đổi
const filteredBooks = computed(() => {
  if (selectedCategory.value === 'all') {
    return books.value; // Trả về toàn bộ nếu chọn Tất cả
  }
  // Lọc sách có Tên thể loại trùng với cái đang chọn
  return books.value.filter(book => book.THELOAI?.TenTheLoai === selectedCategory.value);
});

// 3. HÀM KIỂM TRA ĐĂNG NHẬP
const checkAuth = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      auth.isLoggedIn = true;
      auth.role = user.role;
    }
  } catch (error) {
    console.error("Lỗi đọc localStorage:", error);
  }
};

// 4. HÀM LẤY DANH SÁCH THỂ LOẠI
const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/theloai');
    categoryList.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thể loại:", error);
  }
};

// 5. HÀM LẤY DANH SÁCH SÁCH
const fetchBooks = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/sach');
    books.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (price) => {
  if (!price) return '0';
  return new Intl.NumberFormat('vi-VN').format(price);
};

const goToDetail = (id) => {
  router.push(`/book/${id}`);
};

onMounted(() => {
  checkAuth();
  fetchBooks();
  fetchCategories(); // 🔥 Gọi thêm hàm này khi mở trang
});
</script>