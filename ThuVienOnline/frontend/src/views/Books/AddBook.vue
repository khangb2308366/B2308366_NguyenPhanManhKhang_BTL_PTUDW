<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gray-800 px-8 py-6 flex items-center gap-4">
        <button @click="$router.go(-1)" class="w-10 h-10 rounded-full bg-gray-700 text-white hover:bg-gray-600 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h2 class="text-2xl font-bold text-white">Thêm Sách Mới</h2>
      </div>

      <form @submit.prevent="onAddBook" class="p-8 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên sách <span class="text-red-500">*</span></label>
            <input v-model="addBook.name" required type="text" placeholder="Nhập tên sách..." 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tác giả <span class="text-red-500">*</span></label>
            <input v-model="addBook.author" required type="text" placeholder="Tên tác giả..." 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
            <input v-model="addBook.type" type="text" placeholder="Ví dụ: Tiểu thuyết, IT..." 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nhà xuất bản</label>
            <input v-model="addBook.nxb" type="text" placeholder="Tên nhà xuất bản..." 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Năm xuất bản</label>
            <input v-model="addBook.namXuatBan" type="text" placeholder="Ví dụ: 2023" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng <span class="text-red-500">*</span></label>
            <input v-model="addBook.soLuong" required type="number" min="1" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Đơn giá (VNĐ) <span class="text-red-500">*</span></label>
            <input v-model="addBook.price" required type="number" min="0" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Link ảnh bìa (Cover)</label>
            <input v-model="addBook.cover" type="text" placeholder="VD: /images/sach1.jpg hoặc link URL mạng" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
            <p class="text-xs text-gray-500 mt-2 italic">* Nếu bỏ trống, hệ thống sẽ dùng ảnh mặc định.</p>
          </div>
        </div>

        <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-4">
          <button type="button" @click="$router.go(-1)" class="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors">
            Hủy bỏ
          </button>
          <button type="submit" class="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <i class="fa-solid fa-floppy-disk mr-2"></i> Lưu Sách
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Khởi tạo state chứa dữ liệu form
const addBook = reactive({
  name: '',
  author: '',
  soLuong: 1,
  nxb: '',
  namXuatBan: '',
  cover: '',
  price: 0,
  type: ''
});

// Xử lý Gửi dữ liệu
const onAddBook = async () => {
  try {
    const payload = {
      TENSACH: addBook.name,
      TACGIA: addBook.author,
      SOLUONG: addBook.soLuong,
      TENNXB: addBook.nxb,
      NAMXUATBAN: addBook.namXuatBan,
      COVER: addBook.cover.trim() || '/images/placeholder.jpg', 
      DONGIA: addBook.price,
      TheLoai: addBook.type,
    };

    // Đẩy dữ liệu lên Backend
    await axios.post('http://localhost:3000/api/books', payload);
    
    alert('Thêm sách thành công!');
    
    // Quay lại trang Tất Cả Sách để xem kết quả
    router.push('/book'); 
  } catch (error) {
    console.error(error);
    alert('Có lỗi xảy ra khi thêm sách. Vui lòng kiểm tra lại server!');
  }
};
</script>