<template>
  <div>
    <div>
      <input
        v-model="query"
        type="text"
        placeholder="Tìm kiếm username, tên..."
        class="ml-5 border pl-4 py-4 rounded-xl w-[95%]"
      />
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
        Hoạt động
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
        Đã khóa
      </button>
    </div>

    <div class="overflow-y-auto h-[30%] w-[100%]">
      <table class="mx-5 my-5 w-[95%]">
        <thead class="bg-gray-800 text-gray-100">
          <tr>
            <th class="px-4 py-2 text-left rounded-tl-2xl">Username</th>
            <th class="px-4 py-2 text-left">Tên</th>
            <th class="px-4 py-2 text-left">Họ</th>
            <th class="px-4 py-2 text-left">Phái</th>
            <th class="px-4 py-2 text-left">Địa chỉ</th>
            <th class="px-4 py-2 text-left rounded-tr-2xl">Hành dộng</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="item in filteredData"
            :key="item._id"
            class="hover:bg-gray-200"
          >
            <td class="border-b px-4 py-2">{{ item.Username }}</td>
            <td class="border-b px-4 py-2 w-[16%]">{{ item.Ho }}</td>
            <td class="border-b px-4 py-2 w-[16%]">{{ item.Ten }}</td>
            <td class="border-b px-4 py-2 w-[16%]">{{ item.Phai }}</td>
            <td class="border-b px-4 py-2 w-[16%] mx-auto">
              {{ item.DiaChi }}
            </td>
            <td class="border-b px-4 py-2 w-[10%]">
              <i
                class="fa-solid fa-pencil p-2 ml-3 cursor-pointer"
                style="color: #ffd43b"
                @click="editUser(item._id)"
              ></i>
              <i
                v-if="item.XOA == 0 && item.ChucVu != 'admin'"
                class="cursor-pointer p-2 fa-solid fa-lock"
                style="color: #b12020"
                @click.prevent="lockUser(item._id)"
              ></i>
              <i
                v-else-if="item.XOA == 1 && item.ChucVu != 'admin'"
                class="cursor-pointer p-2 fa-solid fa-unlock"
                style="color: #000"
                @click.prevent="lockUser(item._id)"
              ></i>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="text-center p-4">Không có kết quả</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <UpdateUser
    v-if="showEditModal"
    :id="userId"
    @close="
      () => {
        showEditModal = false;
        fetchData();
      }
    "
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import axios from "axios";
import UpdateUser from "./UpdateUser.vue";

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/user");
    users.value = res.data;
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
  let result = users.value;
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


const showEditModal = ref(false);
const userId = ref(null);

// Hàm khi click vào icon chỉnh sửa
const editUser = (id) => {
  userId.value = id; // lưu _id sách
  showEditModal.value = true; // mở modal/component con
};

const lockUser = async (id) => {
  try {
    const lock = await axios.patch(`http://localhost:3000/api/lockuser/${id}`);
    alert("Thành công");
    fetchData();
  } catch (err) {
    alert("Thất bại");
  }
};
</script>
