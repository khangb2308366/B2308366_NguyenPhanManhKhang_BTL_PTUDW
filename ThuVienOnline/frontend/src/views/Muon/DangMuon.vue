<template>
  <div>
    <div>
      <input
        v-model="query"
        type="text"
        placeholder="Tìm kiếm đơn mượn..."
        class="ml-5 border pl-4 py-4 rounded-xl w-[95%]"
      />
      
    </div>

    <div class="overflow-y-auto h-[30%] w-[100%]">
      <table class="mx-5 my-5 w-[95%] ">
        <thead class="bg-gray-800 text-gray-100">
          <tr>
            <th class="px-4 py-2 text-left rounded-tl-2xl">Username</th>
            <th class="px-4 py-2 text-left">Tên Sách</th>
            <th class="px-4 py-2 text-left">Ngày Trả</th>
            <th class="px-4 py-2 text-center">Đã đến lấy Sách</th>
            <th class="px-4 py-2 text-left">Trạng Thái</th>
            <th class="px-4 py-2 text-left rounded-tr-2xl">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="item in filteredData"
            :key="item._id"
            class="hover:bg-gray-200"
          >
            <td class="border-b px-4 py-2">{{ item.MaDocGia.Username }}</td>
            <td class="border-b px-4 py-2">{{ item.MaSach.TENSACH }}</td>
            <td class="border-b px-4 py-2 w-[20%] mx-auto">
              {{ new Date(item.NgayTra).toLocaleDateString("vi-VN") }}
            </td>
            <td
              class="border-b px-4 py-2 text-center"
              v-if="item.TrangThai == 1"
            >
              <input type="checkbox" @click="isChecked(item._id)" />
            </td>
            <td
              v-else-if="item.TrangThai == 2"
              class="border-b px-4 py-2 text-center text-red-500 font-semibold"
            >
              Đã lấy sách
            </td>
            <td
              v-if="isEarlierDMY(item.NgayTra)"
              class="border-b px-4 py-2 text-yellow-600 font-semibold"
            >
              Quá hạn
            </td>
            <td v-else class="border-b px-4 py-2 text-blue-600 font-semibold">
              Còn hạn
            </td>
            <td
              class="border-b py-1 px-1 w-[10%] mx-auto bg-blue-100 font-bold text-sm"
            >
              <button
                @click="hoanThanhDon(item._id)"
                class="p-3 bg-blue-600 text-gray-200 rounded-md shadow-sm"
                :disabled="item.TrangThai == 1"
                :class="{
                  'opacity-50 cursor-not-allowed':
                    item.TrangThai == 1 
                }"
              >
                Hoàn Thành
              </button>
              <!-- <button @click="tuChoiDon(item._id)" class="p-3 bg-red-600 ml-2  text-gray-200 rounded-md shadow-sm">Từ chối</button>-->
            </td>

            <!-- <td class="border-b px-4 py-2 w-[3%] mx-auto bg-red-600">
              <i
                v-if="item.TrangThai == 0"
                class="fa-solid fa-trash-can p-2 cursor-pointer"
              ></i>
            </td> -->
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="text-center p-4">
              Không có sách nào được mượn!
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import axios from "axios";

const books = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/dangmuon");
    books.value = res.data;
  } catch (err) {
    error.value = "Không thể tải dữ liệu!";
  } finally {
    loading.value = false;
  }
}
onMounted(fetchData);

const query = ref("");

const filteredData = computed(() => {
  if (!query.value) return books.value;
  return books.value.filter(
    (item) =>
      item.MaSach.TENSACH.toLowerCase().includes(query.value.toLowerCase()) ||
      item.MaDocGia.Username.toLowerCase().includes(query.value.toLowerCase())
  );
});

// Hàm khi click vào icon chỉnh sửa
const hoanThanhDon = async (id) => {
  try {
    console.log(id)
    await axios.put(`http://localhost:3000/api/dangmuon/${id}`);
    alert("Cập nhật thành công");
    fetchData();
  } catch (err) {
    console.error(err.response.data.message);
    alert("Cập nhật thất bại");
  }
};

function isEarlierDMY(dateDMY) {
  dateDMY = new Date(dateDMY).toLocaleDateString("vi-VN");
  const [d, m, y] = dateDMY.split("/");
  const inputDate = new Date(y, m - 1, d);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate < today;
}

const isChecked = async (id) => {
  try {
    await axios.put(`http://localhost:3000/api/dalaysach/${id}`);
    alert("Cập nhật thành công");
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Cập nhật thất bại");
  }
};
</script>
