<template>
  <div class="min-h-screen bg-slate-50/50 py-12 px-4 md:px-10 font-sans flex flex-col items-center">
    
    <div class="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
      <div class="flex items-center gap-4">
        <button @click="router.push('/')" class="w-12 h-12 flex items-center justify-center bg-white text-slate-600 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-900 hover:text-white transition-all active:scale-95">
          <i class="fa-solid fa-house"></i>
        </button>
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Lịch Sử Mượn Sách</h1>
          <p class="text-slate-500 font-medium">Theo dõi trạng thái các yêu cầu của bạn</p>
        </div>
      </div>

      <div class="relative w-full md:w-96 group">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
        <input
          v-model="query"
          type="text"
          placeholder="Tìm tên sách hoặc tác giả..."
          class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700"
        />
      </div>
    </div>

    <div class="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="px-8 py-6 font-bold uppercase text-xs tracking-[0.2em]">Thông tin sách</th>
              <th class="px-6 py-6 font-bold uppercase text-xs tracking-[0.2em]">Ngày Đăng ký</th>
              <th class="px-6 py-6 font-bold uppercase text-xs tracking-[0.2em]">Hạn Trả</th>
              <th class="px-6 py-6 font-bold uppercase text-xs tracking-[0.2em] text-center">Trạng Thái</th>
              <th class="px-8 py-6 font-bold uppercase text-xs tracking-[0.2em] text-right">Thao tác</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="item in filteredData"
              :key="item._id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-sm border border-slate-200">
                    <img v-if="item.MaSach?.COVER" :src="item.MaSach.COVER" class="w-full h-full object-cover" />
                    <i v-else class="fa-solid fa-book text-xl"></i>
                  </div>
                  <div>
                    <p class="font-black text-slate-800 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {{ item.MaSach?.TENSACH || "Sách không tồn tại" }}
                    </p>
                    <p class="text-sm font-bold text-slate-400 uppercase tracking-tighter">{{ item.MaSach?.TACGIA || 'N/A' }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-slate-700 font-bold">{{ new Date(item.NgayMuon).toLocaleDateString("vi-VN") }}</span>
                  <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Ngày đăng ký</span>
                </div>
              </td>

              <td class="px-6 py-5">
                 <div class="flex flex-col">
                  <span class="text-slate-700 font-bold">{{ new Date(item.NgayTra).toLocaleDateString("vi-VN") }}</span>
                  <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Ngày hết hạn</span>
                </div>
              </td>
              
              <td class="px-6 py-5 text-center">
                <span :class="getStatusClass(item.TrangThai)" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm border">
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse bg-current"></span>
                  {{ getStatusText(item.TrangThai) }}
                </span>
              </td>

              <td class="px-8 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="item.TrangThai == 0"
                    @click="confirmHuyDon(item._id)"
                    class="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Hủy đơn mượn"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>

                  <button
                    v-if="item.TrangThai == 3"
                    @click="showRejectReason(item.message)"
                    class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Xem lí do từ chối"
                  >
                    <i class="fa-solid fa-comment-dots"></i>
                  </button>

                  <span v-if="item.TrangThai == 4" class="text-slate-300 italic text-sm font-medium">Đã đóng hồ sơ</span>
                </div>
              </td>
            </tr>

            <tr v-if="filteredData.length === 0">
              <td colspan="5" class="py-24 text-center">
                <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                   <i class="fa-solid fa-folder-open text-4xl"></i>
                </div>
                <p class="text-slate-400 font-bold text-xl">Không tìm thấy đơn mượn nào.</p>
                <button @click="router.push('/book')" class="mt-4 text-blue-600 font-black hover:underline uppercase text-sm tracking-widest">Mượn sách ngay</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import Swal from 'sweetalert2';

const router = useRouter();
const auth = useAuthStore();
const muons = ref([]);
const loading = ref(true);
const query = ref("");

// Lấy dữ liệu từ Backend
const fetchData = async () => {
  const userId = auth.user?.id || auth.user?.user?.id;
  if (!userId) return;

  try {
    const res = await axios.get(`http://localhost:3000/api/muon/${userId}`);
    muons.value = res.data;
  } catch (err) {
    console.error("Lỗi tải lịch sử mượn:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);

// BỘ LỌC TÌM KIẾM
const filteredData = computed(() => {
  if (!query.value) return muons.value;
  const searchStr = query.value.toLowerCase();
  
  return muons.value.filter(item => {
    const tenSach = item.MaSach?.TENSACH?.toLowerCase() || "";
    const tacGia = item.MaSach?.TACGIA?.toLowerCase() || "";
    return tenSach.includes(searchStr) || tacGia.includes(searchStr);
  });
});

// QUẢN LÝ TRẠNG THÁI (Màu sắc & Chữ)
const getStatusText = (status) => {
  const texts = { 0: 'Chờ duyệt', 1: 'Chờ nhận sách', 2: 'Đang mượn', 3: 'Đã từ chối', 4: 'Hoàn thành' };
  return texts[status] || 'Không rõ';
};

const getStatusClass = (status) => {
  const classes = {
    0: 'bg-amber-50 text-amber-600 border-amber-100', // Chờ duyệt
    1: 'bg-emerald-50 text-emerald-600 border-emerald-100', // Chờ nhận
    2: 'bg-blue-50 text-blue-600 border-blue-100', // Đang mượn
    3: 'bg-red-50 text-red-600 border-red-100', // Từ chối
    4: 'bg-slate-50 text-slate-500 border-slate-100' // Hoàn thành
  };
  return classes[status] || 'bg-slate-50 text-slate-400';
};

// HÀNH ĐỘNG HỦY ĐƠN (Dùng Swal)
const confirmHuyDon = async (id) => {
  const result = await Swal.fire({
    title: 'Hủy đơn mượn?',
    text: "Bạn chắc chắn muốn hủy yêu cầu này chứ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Đúng, hủy nó!',
    cancelButtonText: 'Không, giữ lại',
    customClass: { popup: 'rounded-[2rem]' }
  });

  if (result.isConfirmed) {
    try {
      const res = await axios.delete(`http://localhost:3000/api/xoadon/${id}`);
      Swal.fire({
        title: 'Đã hủy!',
        text: res.data.message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      fetchData();
    } catch (err) {
      Swal.fire('Lỗi!', 'Không thể hủy đơn lúc này.', 'error');
    }
  }
};

// XEM LÍ DO TỪ CHỐI
const showRejectReason = (msg) => {
  Swal.fire({
    title: 'Lí do từ chối',
    text: msg || "Rất tiếc, thủ thư không để lại ghi chú cụ thể.",
    icon: 'info',
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'Đã hiểu',
    customClass: { popup: 'rounded-[2rem]' }
  });
};
</script>