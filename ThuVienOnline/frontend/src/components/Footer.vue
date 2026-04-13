<template>
  <footer class="relative bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 overflow-hidden mt-10">
    
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none">
      <img 
        src="/images/bg-book.jpg" 
        alt="Background" 
        class="w-full h-full object-cover blur-sm" 
        @error="handleImageError" 
      />
    </div>

    <div class="container mx-auto px-6 lg:px-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
        
        <div class="space-y-5">
          <img src="/images/logo.png" alt="Logo" class="h-16 object-contain filter brightness-0 invert opacity-90" />
          <p class="text-sm leading-relaxed text-gray-400 italic">
            "Lan tỏa tri thức, kết nối trái tim."
          </p>
          <p class="text-sm leading-relaxed text-gray-400">
            Hệ thống thư viện trực tuyến mang đến không gian đọc sách hiện đại, tiện lợi và nguồn tài nguyên phong phú cho mọi thế hệ độc giả.
          </p>
          <div class="flex flex-col gap-3 mt-4 text-sm text-gray-400">
            <span class="flex items-center gap-3 hover:text-white transition-colors cursor-pointer"><i class="fa-solid fa-location-dot w-4 text-center"></i> Cần Thơ, Việt Nam</span>
            <span class="flex items-center gap-3 hover:text-white transition-colors cursor-pointer"><i class="fa-solid fa-phone w-4 text-center"></i> +84 123 456 789</span>
            <span class="flex items-center gap-3 hover:text-white transition-colors cursor-pointer"><i class="fa-solid fa-envelope w-4 text-center"></i> contact@thuvien.vn</span>
          </div>
        </div>

        <div>
          <h3 class="text-white font-bold text-lg mb-6 uppercase tracking-wider border-b-2 border-green-500 pb-2 inline-block">Điều hướng nhanh</h3>
          <ul class="space-y-4">
            <li>
              <router-link to="/" class="group flex items-center gap-3 hover:text-green-400 transition-colors font-medium">
                <i class="fa-solid fa-chevron-right text-xs text-gray-600 group-hover:text-green-400 transition-colors"></i> 
                Trang Chủ
              </router-link>
            </li>
            <li>
              <router-link to="/book" class="group flex items-center gap-3 hover:text-green-400 transition-colors font-medium">
                <i class="fa-solid fa-chevron-right text-xs text-gray-600 group-hover:text-green-400 transition-colors"></i> 
                Danh Mục Sách
              </router-link>
            </li>
            <li>
              <router-link to="/login" class="group flex items-center gap-3 hover:text-green-400 transition-colors font-medium">
                <i class="fa-solid fa-chevron-right text-xs text-gray-600 group-hover:text-green-400 transition-colors"></i> 
                Đăng Nhập / Đăng Ký
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-bold text-lg mb-6 uppercase tracking-wider border-b-2 border-green-500 pb-2 inline-block">Theo dõi chúng tôi</h3>
          <p class="text-sm text-gray-400 mb-6">Cập nhật những đầu sách mới nhất, tin tức và các sự kiện hấp dẫn từ thư viện hàng tuần.</p>
          
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg" title="Facebook">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg" title="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg" title="Youtube">
              <i class="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

      </div>

      <div class="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; 2026 Thư Viện Online. Tất cả các quyền được bảo lưu.</p>
        <div class="flex gap-6 mt-4 md:mt-0">
          <a href="#" class="hover:text-gray-300 transition-colors">Điều khoản dịch vụ</a>
          <a href="#" class="hover:text-gray-300 transition-colors">Chính sách bảo mật</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Hàm xử lý khi ảnh nền bị lỗi (không load được)
const handleImageError = (event) => {
  if (event.target) {
    event.target.style.display = 'none';
  }
};
</script>