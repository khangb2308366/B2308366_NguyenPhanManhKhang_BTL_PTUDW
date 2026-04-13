<template>
  <div class="p-2 animate-in fade-in duration-500">
    
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Quản lý Đơn Mượn</h1>
        <p class="text-slate-500 font-medium mt-1">Kiểm soát toàn bộ yêu cầu mượn trả sách trong hệ thống</p>
      </div>
      
      <div class="relative w-full md:w-96 group">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
        <input
          v-model="query"
          type="text"
          placeholder="Tìm username hoặc tên sách..."
          class="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700"
        />
      </div>
    </header>

    <div v-if="loading" class="py-20 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
      <p class="text-slate-400 font-medium">Đang tải danh sách đơn mượn...</p>
    </div>

    <div v-else class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-xs tracking-widest font-black">
              <th class="px-6 py-5">Độc giả</th>
              <th class="px-6 py-5">Thông tin Sách</th>
              <th class="px-6 py-5">Thời gian mượn</th>
              <th class="px-6 py-5 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            
            <tr
              v-for="item in filteredData"
              :key="item._id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm shrink-0">
                    {{ item.MaDocGia?.Username?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-800">{{ item.MaDocGia?.Username || 'Tài khoản đã xóa' }}</p>
                    <p class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Thành viên</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <p class="font-bold text-slate-800 text-lg mb-0.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {{ item.MaSach?.TENSACH || "Sách đã bị xóa" }}
                </p>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {{ item.MaSach?.TACGIA || 'N/A' }}
                </p>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <p class="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <i class="fa-solid fa-calendar-plus text-slate-400 w-4"></i>
                    {{ new Date(item.NgayMuon).toLocaleDateString("vi-VN") }}
                  </p>
                  <p class="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <i class="fa-solid fa-calendar-check text-slate-400 w-4"></i>
                    <span :class="isOverdue(item.NgayTra, item.TrangThai) ? 'text-red-500 font-bold' : ''">
                      {{ new Date(item.NgayTra).toLocaleDateString("vi-VN") }}
                    </span>
                  </p>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span 
                  :class="getStatusClass(item.TrangThai)" 
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border"
                >
                  <span v-if="item.TrangThai === 0 || item.TrangThai === 2" class="w-1.5 h-1.5 rounded-full animate-pulse bg-current"></span>
                  {{ getStatusText(item.TrangThai) }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredData.length === 0">
              <td colspan="4" class="py-24 text-center">
                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                   <i class="fa-solid fa-folder-open text-3xl"></i>
                </div>
                <p class="text-slate-500 font-bold text-lg">Không tìm thấy đơn mượn nào phù hợp.</p>
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// Đổi tên biến books thành orders cho đúng ngữ nghĩa
const orders = ref([]);
const loading = ref(true);
const query = ref("");

// Lấy danh sách toàn bộ đơn mượn
const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/muon");
    orders.value = res.data;
  } catch (err) {
    console.error("Lỗi không thể tải dữ liệu mượn sách!", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// BỘ LỌC THÔNG MINH (CHỐNG CRASH KHI DỮ LIỆU BỊ NULL)
const filteredData = computed(() => {
  if (!query.value) return orders.value;
  const searchStr = query.value.toLowerCase().trim();
  
  return orders.value.filter((item) => {
    // Dùng ?. để nếu sách hoặc user bị xóa thì không bị lỗi văng web
    const tenSach = item.MaSach?.TENSACH?.toLowerCase() || "";
    const userName = item.MaDocGia?.Username?.toLowerCase() || "";
    
    return tenSach.includes(searchStr) || userName.includes(searchStr);
  });
});

// HÀM FORMAT TRẠNG THÁI
const getStatusText = (status) => {
  const texts = { 
    0: 'Chờ duyệt', 
    1: 'Chưa lấy sách', 
    2: 'Đang mượn', 
    3: 'Từ chối', 
    4: 'Hoàn thành' 
  };
  return texts[status] || 'Không rõ';
};

const getStatusClass = (status) => {
  const classes = {
    0: 'bg-amber-50 text-amber-600 border-amber-100', // Chờ duyệt
    1: 'bg-emerald-50 text-emerald-600 border-emerald-100', // Chưa lấy
    2: 'bg-blue-50 text-blue-600 border-blue-100', // Đang mượn
    3: 'bg-red-50 text-red-600 border-red-100', // Từ chối
    4: 'bg-slate-50 text-slate-500 border-slate-100' // Hoàn thành
  };
  return classes[status] || 'bg-slate-50 text-slate-400';
};

// HÀM KIỂM TRA QUÁ HẠN (Tô đỏ ngày nếu quá hạn chưa trả)
const isOverdue = (ngayTra, trangThai) => {
  if (trangThai === 4 || trangThai === 3 || trangThai === 0) return false;
  const deadline = new Date(ngayTra);
  const today = new Date();
  return today > deadline;
};
</script>

<style scoped>
/* Ẩn thanh cuộn thừa để nhìn gọn hơn */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>