<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-gray-100 w-[45vw] h-[75vh] flex flex-col rounded-2xl p-10">
      <h1 class="font-bold text-2xl mb-5">Chỉnh sửa thông tin Người dùng</h1>
      <form @submit.prevent="saveChanges" class="space-y-2">
        <div class="flex">
          <div class="w-[100%]">
            <label class="block text-sm font-medium whitespace-nowrap mb-2"
              >Họ</label
            >
            <input
              type="text"
              v-model="updateUser.ho"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div class="w-[100%] ml-4">
            <label class="block text-sm font-medium whitespace-nowrap mb-2"
              >Tên</label
            >
            <input
              type="text"
              v-model="updateUser.ten"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-1/2">
            <label class="block text-sm font-medium mb-2">Ngày sinh</label>
            <input
              type="date"
              v-model="updateUser.NgaySinh"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div class="w-1/2 ml-5">
            <label class="block  text-sm font-medium mb-2"
              >Giới tính :</label
            >
            <select
              v-model="updateUser.Phai"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-1/2">
            <label class="block text-sm font-medium mb-2">Địa chỉ</label>
            <input
              v-model="updateUser.DiaChi"
              type="text"
              required
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div class="w-1/2 ml-5">
            <label class="block text-sm font-medium mb-2">Điện thoại</label>
            <input
              v-model="updateUser.DienThoai"
              type="text"
              required
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div class="flex justify-between mb-5">
          <div class="w-1/2">
            <label class="block text-sm font-medium mb-2">Username</label>
            <input
              v-model="updateUser.Username"
              type="text"
              required
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div class="w-1/2 ml-5">
            <label class="block text-sm font-medium mb-2">Mật Khẩu</label>
            <input
              v-model="updateUser.MatKhau"
              type="text"
              required
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
        <p class="font-semibold text-sm text-red-600">
          (Vui lòng chỉ chỉnh sửa khi có yêu cầu từ người dùng)
        </p>

        <button
          type="submit"
          class="w-full py-2 rounded-lg bg-blue-700 text-gray-100 font-semibold hover:bg-blue-900 transition"
        >
          Cập nhật
        </button>
        <div class="">
          <button
            @click.self="$emit('close')"
            type="button"
            class="w-full py-2 rounded-lg bg-gray-400 text-gray-700 font-semibold hover:bg-gray-600 transition"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, reactive } from "vue";
import axios from "axios";

const props = defineProps({
  id: String,
});

const userData = ref({});
const updateUser = reactive({
  ho: "",
  ten: "",
  NgaySinh: "",
  Phai: "",
  DiaChi: "",
  DienThoai: "",
  Username: "",
  MatKhau: "",
});

onMounted(async () => {
  try {
  } catch (err) {
    console.error(err);
  }
});

watch(
  [() => props.id],
  async ([id]) => {
    if (id) {
      const res = await axios.get(`http://localhost:3000/api/user/${id}`);
      userData.value = res.data;

      updateUser.ho = userData.value.Ho;
      updateUser.ten = userData.value.Ten;
      updateUser.DiaChi = userData.value.DiaChi;
      updateUser.DienThoai = userData.value.DienThoai;
      updateUser.Username = userData.value.Username;
      updateUser.MatKhau = userData.value.MatKhau;
      updateUser.Phai = userData.value.Phai;
      const d = new Date(userData.value.NgaySinh);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0"); 
      const dd = String(d.getDate()).padStart(2, "0");

      updateUser.NgaySinh = `${yyyy}-${mm}-${dd}`;
    }
  },
  { immediate: true }
);

const emit = defineEmits(["close"]);

const saveChanges = async () => {
  try {
    const payload = {
      Ho: updateUser.ho,
      Ten: updateUser.ten,
      NgaySinh: updateUser.NgaySinh,
      Phai: updateUser.Phai,
      DiaChi: updateUser.DiaChi,
      DienThoai: updateUser.DienThoai,
      Username: updateUser.Username,
      MatKhau: updateUser.MatKhau,
    };
    await axios.put(`http://localhost:3000/api/user/${props.id}`, payload);
    alert("Cập nhật thành công");
    emit("close");
  } catch (err) {
    console.error(err);
    alert("Cập nhật thất bại");
  }
};
</script>
