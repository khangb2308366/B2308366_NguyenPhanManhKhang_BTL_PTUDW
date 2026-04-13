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
      <table class="mx-5 my-5 w-[95%]">
        <thead class="bg-gray-800 text-gray-100">
          <tr>
            <th class="px-4 py-2 text-left rounded-tl-2xl">Username</th>
            <th class="px-4 py-2 text-left">Tên Sách</th>
            <th class="px-4 py-2 text-left">Ngày Mượn</th>
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
              {{ new Date(item.NgayMuon).toLocaleDateString("vi-VN") }}
            </td>

            <td
              class="border-b text-center w-[10%]"
            >
              <button @click="deleteHoanThanh(item._id)">
                <i class="fa-solid fa-trash-can p-2 cursor-pointer text-red-600 "></i> 
              </button>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="text-center p-4">
              Không có đơn nào được hoàn thành!
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
    const res = await axios.get("http://localhost:3000/api/hoanthanh");
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

const deleteHoanThanh = async (id) => {
   try {
    console.log(id)
    const res = await axios.delete(
      `http://localhost:3000/api/xoadonhoanthanh/${id}`
    );
    alert(res.data.message);
    fetchData();
  } catch (err) {
    alert("loi xoa don");
    console.log(err.response.data.message)
  }
}
</script>
