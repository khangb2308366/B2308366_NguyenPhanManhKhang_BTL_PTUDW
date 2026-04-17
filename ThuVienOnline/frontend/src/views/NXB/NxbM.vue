<template>
  <div class="bg-gray-600 w-full min-h-[100vh] pl-5">
    <h1 class="font-extrabold text-2xl p-4 text-center mb-5 pt-10 text-white">
      Quản Lí Nhà xuất bản
    </h1>
    <div>
      <input
        v-model="query"
        type="text"
        placeholder="Tìm kiếm Nhà xuất bản..."
        class="ml-5 border pl-4 py-4 rounded-xl w-[70%] bg-gray-200"
      />
      <button
        @click="addNxb = true"
        class="bg-gray-800 hover:bg-blue-800 px-2 py-4 w-[23%] ml-5 rounded-xl font-bold text-gray-100"
      >
        Thêm Nhà xuất bản mới +
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
            <th class="px-4 py-2 text-left rounded-tl-2xl">Tên nhà Xuất bản</th>
            <th class="px-4 py-2 text-left">Địa chỉ</th>
            <th class="px-4 py-2 text-left">Số lượng Sách</th>
            <th class="px-4 py-2 text-left rounded-tr-2xl">Hành động</th>
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
            <td class="border-b px-4 py-2">{{ item.TENNXB }}</td>
            <td class="border-b px-4 py-2 w-[30%]">{{ item.DIACHI }}</td>
            <td class="border-b py-2 w-[15%] text-center">
              {{ item.SOLUONG }}
            </td>

            <td class="border-b px-4 py-2 w-[13%]">
              <i
                class="fa-solid fa-pencil p-2 ml-3 cursor-pointer"
                style="color: #ffd43b"
                @click="editNXB(item._id)"
              ></i>
              <i
                v-if="item.XOA == 0"
                class="cursor-pointer p-2 fa-solid fa-trash-can"
                @click="
                  () => {
                    deleteNXB = true;
                    bk = item._id;
                  }
                "
                style="color: #b12020"
              ></i>
              <span v-else>
                <i
                  v-if="item.XOA == 1"
                  @click="onDelete(item._id)"
                  class="fa-solid fa-trash-arrow-up p-2 cursor-pointer"
                ></i
              ></span>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="3" class="text-center p-4">Không có kết quả</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <AddNxb
    v-if="addNxb"
    @close="
      () => {
        addNxb = null;
        fetchData();
      }
    "
  />

  <UpdateNxb
    v-if="showEditModal"
    :nxbId="selectedNxbId"
    @close="
      () => {
        showEditModal = false;
        fetchData();
      }
    "
  />

  <div
    class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
    v-if="deleteNXB"
  >
    <div
      class="w-[30vw] h-[20vh] bg-gray-100 flex flex-col justify-between items-center"
    >
      <h1 class="text-2xl text-center mt-5">Xác nhận Xóa ?</h1>
      <div class="flex w-full gap-2 mb-5">
        <button @click="onDelete(bk)" class="w-1/2 bg-blue-600 px-3 py-2 ml-4">
          Xác nhận
        </button>
        <button @click="deleteNXB = false" class="w-1/2 bg-gray-300 mr-4">
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
import AddNxb from "./AddNxb.vue";
import UpdateNxb from "./UpdateNxb.vue";

const nxbs = ref([]);
const loading = ref(true);
const error = ref(null);
const addNxb = ref(null);

const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/nxbadmin");
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
        item.TENNXB.toLowerCase().includes(query.value.toLowerCase()) ||
        item.DIACHI.toLowerCase().includes(query.value.toLowerCase())
    );
  }

  return result;
});

const showEditModal = ref(false);
const selectedNxbId = ref(null);

const editNXB = (id) => {
  selectedNxbId.value = id; 
  showEditModal.value = true; 
};

const bk = ref(null);
const deleteNXB = ref(false);

const onDelete = async (id) => {
  try {
    const payload = {
      XOA: 1,
    };
    console.log(payload);
    await axios.put(`http://localhost:3000/api/xoanxb/${id}`, payload);
    alert("Thành công");
    deleteNXB.value = false;
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Xóa thất bại");
  }
};
</script>
