<template>
  <div class="overflow-x-hidden min-h-screen flex flex-col bg-gray-50">
    
    <div
      class="bg-zoom h-[80vh] flex justify-center items-center flex-col text-white px-4 relative"
    >
      <div class="z-20 text-center w-full max-w-4xl mx-auto mt-10">
        <h1
          class="font-black text-5xl md:text-7xl drop-shadow-2xl animate-scale-up mb-6 leading-tight"
        >
          Một Trang Sách <br />
          <span class="text-400">Một Hành Trình Mới</span>
        </h1>
        
        <p
          class="text-lg md:text-2xl font-medium drop-shadow-lg mb-12 opacity-90 animate-fade-in"
        >
          Đắm mình vào tri thức, biến những giấc mơ thành hiện thực.
        </p>
        
        <div class="relative w-full max-w-3xl mx-auto z-50">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full blur opacity-30 hover:opacity-50 transition duration-1000"></div>
          
          <div class="relative flex items-center w-full h-16 bg-white/95 backdrop-blur-md rounded-full shadow-2xl focus-within:ring-4 focus-within:ring-blue-500/40 overflow-hidden pr-2 transition-all">
            
            <div class="flex items-center justify-center w-14 text-gray-400 pl-2">
              <i class="fa-solid fa-magnifying-glass text-xl"></i>
            </div>

            <input 
              v-model="searchQuery"
              @focus="isInputFocused = true"
              @blur="setTimeout(() => isInputFocused = false, 200)"
              type="text" 
              class="peer w-full h-full bg-transparent text-gray-800 text-lg font-medium outline-none placeholder-gray-500 px-2"
              placeholder="Tìm kiếm sách, tác giả..."
              @keyup.enter="gotoBook"
            />

            <button 
              @click="gotoBook"
              class="bg-gray-900 hover:bg-blue-600 text-white font-bold rounded-full px-8 py-3.5 transition-colors duration-300 flex items-center gap-2 active:scale-95 shadow-md shrink-0"
            >
              <span class="hidden sm:inline text-lg">Tìm kiếm</span>
            </button>
          </div>

          <div 
            v-if="isInputFocused && suggestedBooks.length > 0" 
              class="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in text-left z-[9999]"
          >
            <div class="p-3">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 pb-2 pt-2 border-b border-gray-100 mb-2">Kết quả gợi ý</p>
              <ul>
                <li 
                  v-for="book in suggestedBooks" 
                  :key="book._id"
                  @mousedown.prevent="goToDetail(book._id)" 
                  class="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-2xl cursor-pointer transition-colors group"
                >
                  <img 
                    :src="book.COVER || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.TENSACH)}&background=random`" 
                    class="w-12 h-16 object-cover rounded-md shadow-sm border border-gray-200 group-hover:scale-105 transition-transform" 
                    @error="(e) => e.target.src=`https://placehold.co/400x600/e2e8f0/64748b?text=${encodeURIComponent(book.TENSACH)}`"
                  />
                  <div class="flex-1">
                    <h4 class="text-gray-800 font-bold text-lg group-hover:text-blue-600 line-clamp-1">{{ book.TENSACH }}</h4>
                    <p class="text-gray-500 font-medium">{{ book.TACGIA }}</p>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i class="fa-solid fa-arrow-right -rotate-45"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div 
            v-if="isInputFocused && searchQuery && suggestedBooks.length === 0" 
            class="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-2xl p-8 text-center animate-fade-in"
          >
            <i class="fa-solid fa-ghost text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500 font-medium text-lg">Không tìm thấy sách nào khớp với "<span class="text-gray-800 font-bold">{{ searchQuery }}</span>"</p>
          </div>
          
          <div class="mt-6 flex flex-wrap gap-3 justify-center text-sm font-medium text-white/90 drop-shadow-md">
          </div>
        </div>
      </div>
      
      <div class="absolute inset-0 bg-black/40 z-10"></div>
    </div>

    <div class="container mx-auto py-20 px-6">
      
      <div class="grid md:grid-cols-2 gap-12 items-center mb-28" ref="box">
        <div :class="{ 'animate-fade-in-left': isVisible, 'opacity-0': !isVisible }" class="space-y-6">
          <h2 class="text-4xl font-bold text-gray-800">Khởi nguồn những hành trình mới</h2>
          <p class="text-gray-600 text-lg leading-relaxed text-justify">
            Mỗi cuốn sách là một thế giới đang chờ bạn khám phá. Từ những tác phẩm văn học kinh điển đến các tài liệu chuyên ngành sâu sắc, hãy để chúng tôi đồng hành cùng bạn trên con đường chinh phục tri thức.
          </p>
          <button @click="gotoBook" class="border-2 border-gray-800 text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-gray-800 hover:text-white transition-all shadow-sm">
            Khám phá ngay
          </button>
        </div>
        <div :class="{ 'animate-fade-in-right': isVisible, 'opacity-0': !isVisible }" class="rounded-2xl overflow-hidden shadow-2xl transition-all duration-700">
          <img src="/images/section1.jpg" alt="Library" class="w-full h-[400px] object-cover" @error="(e) => (e.target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66')">
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center" ref="box1">
        <div :class="{ 'animate-fade-in-left': isVisible1, 'opacity-0': !isVisible1 }" class="order-2 md:order-1 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700">
          <img src="/images/section2.jpg" alt="Reading" class="w-full h-[400px] object-cover" @error="(e) => (e.target.src = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')">
        </div>
        <div :class="{ 'animate-fade-in-right': isVisible1, 'opacity-0': !isVisible1 }" class="order-1 md:order-2 space-y-6">
          <h2 class="text-4xl font-bold text-gray-800">Nơi tinh hoa hội tụ</h2>
          <p class="text-gray-600 text-lg leading-relaxed text-justify">
            Hơn cả một thư viện, đây là ngôi nhà chung của những trái tim đồng điệu. Hãy cùng chúng tôi kiến tạo một văn hóa đọc mạnh mẽ, lan tỏa ánh sáng tri thức đến mọi thế hệ.
          </p>
          <div class="flex gap-6">
             <div class="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex-1 text-center transform hover:-translate-y-2 transition-transform">
                <span class="block text-4xl font-black text-blue-600">5000+</span>
                <span class="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 block">Đầu sách</span>
             </div>
             <div class="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex-1 text-center transform hover:-translate-y-2 transition-transform">
                <span class="block text-4xl font-black text-green-600">10k+</span>
                <span class="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 block">Độc giả</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import axios from 'axios'; // Import axios để gọi API

const router = useRouter();
const isVisible = ref(false);
const isVisible1 = ref(false);
const box = ref(null);
const box1 = ref(null);

// ==========================================
// CHỨC NĂNG TÌM KIẾM TRỰC TIẾP (LIVE SEARCH)
// ==========================================
const allBooks = ref([]);
const searchQuery = ref('');
const isInputFocused = ref(false);

// Lấy danh sách sách từ backend để chuẩn bị tìm kiếm
const fetchBooks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/sach');
    allBooks.value = response.data.filter(book => book.XOA !== 1);
  } catch (error) {
    console.error("Lỗi tải danh sách sách:", error);
  }
};

// Bộ lọc tự động chạy khi bạn gõ chữ
// Bộ lọc tự động chạy khi bạn gõ chữ
const suggestedBooks = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const query = searchQuery.value.toLowerCase();
  
  return allBooks.value.filter(book => {
    // Quét Tên sách
    const matchName = book.TENSACH?.toLowerCase().includes(query);
    // Quét Tác giả
    const matchAuthor = book.TACGIA?.toLowerCase().includes(query);
    // Quét Thể loại (MỚI THÊM)
    const matchGenre = book.THELOAI?.TenTheLoai?.toLowerCase().includes(query);
    
    // Nếu gõ trúng 1 trong 3 cái trên thì đều vớt ra hết
    return matchName || matchAuthor || matchGenre;
  }).slice(0, 5); 
});

// Chuyển hướng khi bấm vào 1 sách trong danh sách gợi ý
const goToDetail = (id) => {
  router.push(`/book/${id}`);
};

// ==========================================
// CÁC HÀM CŨ
// ==========================================
const gotoBook = () => {
  router.push('/book');
};

onMounted(() => {
  fetchBooks(); // Nạp danh sách sách ngay khi load trang
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === box.value && entry.isIntersecting) isVisible.value = true;
      if (entry.target === box1.value && entry.isIntersecting) isVisible1.value = true;
    });
  }, { threshold: 0.15 });

  if (box.value) observer.observe(box.value);
  if (box1.value) observer.observe(box1.value);
});
</script>

<style scoped>
/* Giữ nguyên toàn bộ style cũ của bạn */
.bg-zoom {
  position: relative;
  width: 100%;
  background: transparent;
}

.bg-zoom::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("/images/images-home.jpg") center/cover no-repeat;
  background-size: cover;
  background-position: center;
  transform: scale(1);
  animation: zoomBg 20s infinite alternate ease-in-out;
  z-index: 0; 
}

@keyframes zoomBg {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.animate-scale-up {
  animation: scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-left {
  animation: fadeInLeft 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-fade-in-right {
  animation: fadeInRight 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}

.opacity-0 {
  opacity: 0;
}
</style>