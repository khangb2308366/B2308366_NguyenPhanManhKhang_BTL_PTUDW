<template>
  <div class="bg-gray-600 w-full min-h-[100vh] pl-5">
    <h1 class="font-extrabold text-2xl p-4 text-center mb-5 pt-10 text-white">
      Quản Lí Thể Loại
    </h1>
    <div>
      <input
        v-model="query"
        type="text"
        placeholder="Tìm kiếm Thể loại..."
        class="ml-5 border pl-4 py-4 rounded-xl w-[70%] bg-gray-200"
      />
      <button
        @click="addNxb = true"
        class="bg-gray-800 hover:bg-blue-800 px-2 py-4 w-[23%] ml-5 rounded-xl font-bold text-gray-100"
      >
        Thêm Thể loại +
      </button>
    </div>

    <div class="flex ml-5 mt-5 gap-5">
      <button
        @click="filterStatus = 'all'"
        :class="[
          'px-3 py-2 rounded-md font-semibold',
          filterStatus === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-800',
        ]"
      >
        Tất cả
      </button>
      <button
        @click="filterStatus = 'active'"
        :class="[
          'px-3 py-2 rounded-md font-semibold',
          filterStatus === 'active'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-800',
        ]"
      >
        Hiện có
      </button>
      <button
        @click="filterStatus = 'deleted'"
        :class="[
          'px-3 py-2 rounded-md font-semibold',
          filterStatus === 'deleted'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-800',
        ]"
      >
        Đã xóa
      </button>
    </div>

    <div class="overflow-y-auto h-[30%] w-[100%]">
      <table class="mx-5 my-5 w-[95%]">
        <thead class="bg-gray-800 text-gray-100">
          <tr>
            <th class="px-4 py-2 text-left rounded-tl-2xl">Tên Thể Loại</th>
            <th class="px-4 py-2 text-center">Số Lượng Sách</th>
            <th class="px-4 py-2 text-left rounded-tr-2xl">Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredData"
            :key="item._id"
            :class="{
              'bg-gray-100 hover:bg-white': item.XOA == 0,
              'bg-gray-300': item.XOA == 1,
            }"
          >
            <td class="border-b px-4 py-2">{{ item.TenTheLoai }}</td>
            <td class="border-b px-4 py-2 w-[30%] text-center">
              {{ item.SOLUONG }}
            </td>

            <td class="border-b px-4 py-2 w-[10%]">
              <i
                v-if="item.XOA == 0"
                @click="
                  () => {
                    deleteTheLoai = true;
                    bk = item._id;
                  }
                "
                class="cursor-pointer p-2 fa-solid fa-trash-can"
                style="color: #b12020"
              ></i>
              <i
                v-if="item.XOA == 1"
                @click="onDelete(item._id)"
                class="fa-solid fa-trash-arrow-up p-2 cursor-pointer"
              ></i>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="3" class="text-center p-4">Không có kết quả</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <AddTheLoai
    v-if="addNxb"
    @close="
      () => {
        addNxb = null;
        fetchData();
      }
    "
  />
  <div
    class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
    v-if="deleteTheLoai"
  >
    <div
      class="w-[30vw] h-[20vh] bg-gray-100 flex flex-col justify-between items-center"
    >
      <h1 class="text-2xl text-center mt-5">Xác nhận Xóa ?</h1>
      <div class="flex w-full gap-2 mb-5">
        <button @click="onDelete(bk)" class="w-1/2 bg-blue-600 px-3 py-2 ml-4">
          Xác nhận
        </button>
        <button @click="deleteTheLoai = false" class="w-1/2 bg-gray-300 mr-4">
          Hủy
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import axios from "axios";
import AddTheLoai from "./AddTheLoai.vue";

const nxbs = ref([]);
const loading = ref(true);
const error = ref(null);
const addNxb = ref(null);

const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/theloaiadmin");
    nxbs.value = res.data;
  } catch (err) {
    error.value = "Không thể tải dữ liệu!";
  } finally {
    loading.value = false;
  }
};
onMounted(fetchData);

const query = ref("");

const filterStatus = ref("all");
const filteredData = computed(() => {
  let result = nxbs.value;
  if (filterStatus.value === "active") {
    result = result.filter((item) => item.XOA === 0);
  } else if (filterStatus.value === "deleted") {
    result = result.filter((item) => item.XOA === 1);
  }
  if (query.value) {
    result = result.filter(
      (item) =>
        item.TenTheLoai.toLowerCase().includes(query.value.toLowerCase()) ||
        item.DIACHI.toLowerCase().includes(query.value.toLowerCase())
    );
  }

  return result;
});

const bk = ref(null);
const deleteTheLoai = ref(false);

const onDelete = async (id) => {
  try {
    // Map dữ liệu từ form sang backend
    const payload = {
      XOA: 1,
    };
    console.log(payload);
    await axios.put(
      `http://localhost:3000/api/xoatheloai/${id}`,
      payload
    );
    alert("Thành công");
    deleteTheLoai.value = false;
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Xóa thất bại");
  }
};
</script>
