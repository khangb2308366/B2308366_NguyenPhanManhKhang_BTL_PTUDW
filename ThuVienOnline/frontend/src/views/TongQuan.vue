<template>
    <div class="w-full min-h-screen bg-gray-500 pr-5 pb-10">
        <h1 class="text-2xl font-extrabold text-center text-gray-100 py-10">Tổng quan Thư viện</h1>

        <div v-if="error" class="ml-5 mb-5 p-4 bg-red-500 text-white rounded-md text-center font-bold">
            {{ error }}
        </div>

        <div class="ml-5 flex flex-col gap-4">
            <div class="flex gap-4 p-6 bg-gray-100 rounded-md shadow-md">
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Đầu sách hiện có : <span class="text-red-500 text-2xl">{{ books.length }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Sách trong kho : <span class="text-red-500 text-2xl">{{tongSach}}</span>  </div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Đầu sách đã hết : <span class="text-red-500 text-2xl">{{ sachDaHet }}</span> </div>
            </div>

             <div class="flex gap-4 p-6 bg-gray-100 rounded-md shadow-md">
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center text-gray-100">Nhà xuất bản : <span class="text-red-500 text-2xl">{{ nxbs.length }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Đang hoạt động : <span class="text-red-500 text-2xl">{{ nxbCon}}</span></div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Dừng hoạt động : <span class="text-red-500 text-2xl">{{ nxbs.length - nxbCon }}</span></div>
            </div>

             <div class="flex gap-4 p-6 bg-gray-100 rounded-md shadow-md">
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Thể loại hiện có : <span class="text-red-500 text-2xl">{{ theLoais.length }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Đang lấy sách : <span class="text-red-500 text-2xl">{{ loaiCon }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Dừng lấy sách : <span class="text-red-500 text-2xl">{{ theLoais.length - loaiCon }}</span></div>
            </div>

             <div class="flex gap-4 p-6 bg-gray-100 rounded-md shadow-md">
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 text-gray-100 rounded-md w-1/3 text-center">Đơn chờ Duyệt : <span class="text-red-500 text-2xl">{{ choDuyet }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold  bg-gray-700 text-gray-100 rounded-md w-1/3 text-center">Đơn đang Mượn  : <span class="text-red-500 text-2xl">{{ dangMuon }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold  bg-gray-700 text-gray-100 rounded-md w-1/3 text-center">Đơn Hoàn Thành : <span class="text-red-500 text-2xl">{{ hoanThanh }}</span></div>
            </div>

             <div class="flex gap-4 p-6 bg-gray-100 rounded-md shadow-md">
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Người dùng : <span class="text-red-500 text-2xl">{{ users.length }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Tài khoản đã khóa : <span class="text-red-500 text-2xl">{{ khoaUser }}</span></div>
                <div class="px-4 py-3 text-xl font-semibold bg-gray-700 rounded-md w-1/3 text-center  text-gray-100">Nhân viên : <span class="text-red-500 text-2xl">{{ Math.max(0, staffs.length - 1) }}</span></div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';

const books = ref([]);
const nxbs = ref([]);
const theLoais = ref([]);
const muons = ref([]);
const users = ref([]);
const staffs = ref([]);

// KHAI BÁO BIẾN error ĐỂ KHÔNG BỊ CRASH
const error = ref(null); 

const fetchData = async () => {
  try {
    error.value = null; // Reset lỗi trước khi fetch

    // TỐI ƯU HÓA: Dùng Promise.all để gọi 6 API cùng một lúc, tăng tốc độ tải trang
    const [bookRes, nxbRes, theLoaiRes, userRes, staffRes, muonRes] = await Promise.all([
      axios.get("http://localhost:3000/api/sach"),
      axios.get("http://localhost:3000/api/nxbadmin"),
      axios.get("http://localhost:3000/api/theloaiadmin"),
      axios.get("http://localhost:3000/api/user"),
      axios.get("http://localhost:3000/api/staff"),
      axios.get("http://localhost:3000/api/muon")
    ]);

    books.value = bookRes.data;
    nxbs.value = nxbRes.data;
    theLoais.value = theLoaiRes.data;
    users.value = userRes.data;
    staffs.value = staffRes.data;
    muons.value = muonRes.data;
    
  } catch (err) {
    error.value = "Không thể tải dữ liệu kết nối đến Server!";
    console.error(err);
  }
}

onMounted(() => {
  fetchData();
});

const tongSach = computed(() => {
  if (!books.value || books.value.length === 0) return 0;
  return books.value.reduce((sum, item) => sum + item.SOLUONG, 0);
});

const sachDaHet = computed(() => {
  if (!books.value || books.value.length === 0) return 0;
  return books.value.filter(item => item.SOLUONG == 0).length;
});

const nxbCon = computed(() => {
  if (!nxbs.value || nxbs.value.length === 0) return 0;
  return nxbs.value.filter(item => item.XOA == 0).length;
});

const loaiCon = computed(() => {
  if (!theLoais.value || theLoais.value.length === 0) return 0;
  return theLoais.value.filter(item => item.XOA == 0).length;
});

const khoaUser = computed(() => {
  if (!users.value || users.value.length === 0) return 0;
  return users.value.filter(item => item.XOA == 1).length;
});

const choDuyet = computed(() => {
  if (!muons.value || muons.value.length === 0) return 0;
  return muons.value.filter(item => item.TrangThai == 0).length;
});

const dangMuon = computed(() => {
  if (!muons.value || muons.value.length === 0) return 0;
  return muons.value.filter(item => (item.TrangThai == 1 || item.TrangThai == 2)).length;
});

const hoanThanh = computed(() => {
  if (!muons.value || muons.value.length === 0) return 0;
  return muons.value.filter(item => (item.TrangThai == 4)).length;
});
</script>