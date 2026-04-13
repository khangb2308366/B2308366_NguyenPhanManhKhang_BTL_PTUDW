<template>
  <div class="container mx-auto px-6 py-12 min-h-screen bg-slate-50/50 mt-10">
    
    <button @click="router.push('/book')" class="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-lg w-fit">
      <i class="fa-solid fa-arrow-left"></i> Quay lại danh sách
    </button>

    <div v-if="isLoading" class="flex flex-col justify-center items-center h-80">
      <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-4"></div>
      <p class="text-slate-400 font-medium animate-pulse">Đang tải thông tin sách...</p>
    </div>

    <div v-else-if="book" class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
      
      <div class="md:w-2/5 bg-slate-100 p-10 flex justify-center items-start relative">
        <img 
          :src="book.COVER || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.TENSACH)}&background=random&size=512`" 
          class="w-full max-w-sm rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500 sticky top-10" 
          @error="(e) => e.target.src=`https://placehold.co/600x800/e2e8f0/64748b?text=${encodeURIComponent(book.TENSACH)}`" 
        />
        
        <span v-if="book.SOLUONG === 0" class="absolute top-6 left-6 bg-red-500 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-xs shadow-md">
          Tạm hết hàng
        </span>
        <span v-else class="absolute top-6 left-6 bg-emerald-500 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-xs shadow-md animate-pulse">
          Sẵn sàng mượn
        </span>
      </div>

      <div class="md:w-3/5 p-10 md:p-14 flex flex-col justify-center">
        <div class="flex items-center gap-3 mb-4">
          <span class="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
            {{ book.THELOAI?.TenTheLoai || 'Chưa phân loại' }}
          </span>
        </div>

        <h1 class="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">{{ book.TENSACH }}</h1>
        <p class="text-xl text-slate-500 font-medium mb-10">Tác giả: <span class="text-slate-800 font-bold">{{ book.TACGIA }}</span></p>

        <div class="grid grid-cols-2 gap-6 mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div>
            <p class="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Nhà Xuất Bản</p>
            <p class="text-slate-800 font-bold text-lg">{{ book.MANXB?.TENNXB || 'Đang cập nhật' }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Năm Xuất Bản</p>
            <p class="text-slate-800 font-bold text-lg">{{ book.NAMXUATBAN || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Số lượng còn lại</p>
            <p class="font-black text-lg">
              <span :class="book.SOLUONG > 0 ? 'text-blue-600' : 'text-red-500'">{{ book.SOLUONG }}</span> quyển
            </p>
          </div>
          <div>
            <p class="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Đơn giá mượn</p>
            <p class="font-black text-emerald-600 text-2xl">{{ formatPrice(book.DONGIA) }}đ</p>
          </div>
        </div>

        <div class="mb-12">
          <h3 class="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-quote-left text-slate-300"></i> Giới thiệu nội dung
          </h3>
          <p class="text-slate-600 font-medium leading-relaxed whitespace-pre-line text-justify bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            {{ book.MOTA || 'Thông tin giới thiệu về cuốn sách này đang được thủ thư cập nhật. Tuy nhiên, với tựa sách hấp dẫn này, đây chắc chắn là một tác phẩm đáng để bạn trải nghiệm. Bấm mượn ngay để khám phá nhé!' }}
          </p>
        </div>

        <div class="mt-auto">
          <button 
            :disabled="book.SOLUONG === 0"
            @click="handleBorrow" 
            class="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ mượn
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
        <i class="fa-solid fa-face-frown text-6xl text-slate-200 mb-4"></i>
        <p class="text-slate-500 font-bold text-xl">Rất tiếc, không tìm thấy thông tin cuốn sách này.</p>
        <button @click="router.push('/book')" class="mt-6 text-blue-600 font-bold hover:underline">Quay lại trang danh mục</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2'; // Thêm SweetAlert2
import { useCartStore } from '../../stores/cart'; // Đảm bảo đường dẫn này trỏ đúng vào file cart.js bạn vừa tạo

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore(); // Khởi tạo Giỏ hàng

const book = ref(null);
const isLoading = ref(true);

const fetchBookDetail = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id;
    const response = await axios.get(`http://localhost:3000/api/sach/${id}`);
    
    if (response.data && response.data._id) {
      book.value = response.data;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết sách:", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 400);
  }
};

const formatPrice = (price) => {
  if (!price) return '0';
  return new Intl.NumberFormat('vi-VN').format(price);
};

// HÀM XỬ LÝ KHI BẤM NÚT MƯỢN SÁCH
const handleBorrow = () => {
  if (!book.value) return;

  // 1. Gọi hàm thêm sách vào kho lưu trữ Pinia
  const result = cartStore.addBook(book.value);
  
  // 2. Hiển thị thông báo bằng SweetAlert2
  if (result.success) {
    Swal.fire({
      icon: 'success',
      title: 'Tuyệt vời!',
      text: result.message,
      showConfirmButton: false,
      timer: 1500,
      customClass: { popup: 'rounded-[2rem]' } // Bo góc cho đồng bộ UI
    });
  } else {
    // Thông báo lỗi nếu sách đã có trong giỏ hoặc mượn quá 5 cuốn
    Swal.fire({
      icon: 'warning',
      title: 'Khoan đã...',
      text: result.message,
      confirmButtonColor: '#3b82f6',
      customClass: { popup: 'rounded-[2rem]' }
    });
  }
};

onMounted(() => {
  fetchBookDetail();
});
</script>