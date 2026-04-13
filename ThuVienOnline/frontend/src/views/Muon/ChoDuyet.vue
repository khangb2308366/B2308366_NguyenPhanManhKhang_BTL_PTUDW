<template>
  <div class="p-5">
    <div>
      <input
        v-model="query"
        type="text"
        placeholder="Tìm kiếm theo username hoặc tên sách..."
        class="border px-6 py-4 rounded-xl w-full bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
    </div>

    <div class="overflow-y-auto h-[70vh] w-full mt-5 rounded-xl shadow-lg">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-800 text-gray-100 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-4 rounded-tl-xl">Username</th>
            <th class="px-4 py-4">Tên Sách</th>
            <th class="px-4 py-4 text-center">Sách còn</th>
            <th class="px-4 py-4">Ngày Đăng ký</th>
            <th class="px-4 py-4">Ngày Trả</th>
            <th class="px-4 py-4 text-center rounded-tr-xl">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="item in filteredData"
            :key="item._id"
            class="hover:bg-gray-50 border-b transition-colors"
          >
            <td class="px-4 py-3 font-medium text-blue-700">
              {{ item.MaDocGia?.Username || "N/A" }}
            </td>
            <td class="px-4 py-3 text-gray-800">
              {{ item.MaSach?.TENSACH || "Sách đã bị xóa" }}
            </td>
            <td class="px-4 py-3 text-center">
              <span :class="item.MaSach?.SOLUONG > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                {{ item.MaSach?.SOLUONG ?? 0 }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ item.NgayMuon ? new Date(item.NgayMuon).toLocaleDateString("vi-VN") : '-' }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ item.NgayTra ? new Date(item.NgayTra).toLocaleDateString("vi-VN") : '-' }}
            </td>
            <td class="px-4 py-3 text-center flex justify-center gap-2">
              <button 
                @click="duyetDon(item._id)" 
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-colors font-semibold flex items-center gap-1"
                :disabled="item.MaSach?.SOLUONG <= 0"
                :class="{'opacity-50 cursor-not-allowed': item.MaSach?.SOLUONG <= 0}"
              >
                <i class="fa-solid fa-check"></i> Duyệt
              </button>
              <button 
                @click="()=>{tuChoi = true; donMuon = item._id }" 
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-colors font-semibold flex items-center gap-1"
              >
                <i class="fa-solid fa-xmark"></i> Từ chối
              </button>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="text-center p-10 text-gray-500 text-lg">
              <i class="fa-solid fa-inbox block text-4xl mb-2"></i>
              Không có đơn mượn nào đang chờ duyệt!
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <TuChoi
    v-if="tuChoi"
    :donMuon="donMuon"
    @close="()=>{tuChoi = false; fetchData()}"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import TuChoi from "./TuChoi.vue";

const books = ref([]);
const loading = ref(true);
const error = ref(null);

const tuChoi = ref(false);
const donMuon = ref("");

const fetchData = async () => {
  try {
    loading.value = true;
    const res = await axios.get("http://localhost:3000/api/choduyet");
    books.value = res.data;
  } catch (err) {
    error.value = "Không thể tải dữ liệu!";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);

const query = ref("");

const filteredData = computed(() => {
  if (!query.value) return books.value;
  const search = query.value.toLowerCase();
  return books.value.filter((item) => {
    const username = item.MaDocGia?.Username?.toLowerCase() || "";
    const tenSach = item.MaSach?.TENSACH?.toLowerCase() || "";
    return username.includes(search) || tenSach.includes(search);
  });
});

const duyetDon = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn duyệt đơn mượn này?")) return;
  try {
    const res = await axios.put(`http://localhost:3000/api/choduyet/${id}`);
    alert(res.data.message || "Duyệt đơn thành công!");
    fetchData();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Lỗi khi duyệt đơn!");
  }
};
</script>