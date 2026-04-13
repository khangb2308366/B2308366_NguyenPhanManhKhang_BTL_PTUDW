<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-gray-100 w-[45vw] h-[62vh] flex flex-col rounded-2xl p-10">
      <h1 class="font-bold text-2xl mb-5">Chỉnh sửa thông tin Nhân viên</h1>
      <form @submit.prevent="saveChanges" class="space-y-2">
        <div class="">
          <label class="block text-sm font-medium mb-2 whitespace-nowrap"
            >Họ và Tên</label
          >
          <input
            v-model="updateStaff.hoten"
            type="text"
            required
            class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div class="flex">
          <div class="w-[100%]">
            <label class="block text-sm font-medium whitespace-nowrap mb-2"
              >Địa chỉ</label
            >
            <input
              type="text"
              v-model="updateStaff.diachi"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div class="w-[100%] ml-5">
            <label class="block text-sm font-medium whitespace-nowrap mb-2"
              >Điện thoại</label
            >
            <input
              type="text"
              v-model="updateStaff.dienthoai"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-1/2">
            <label class="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              v-model="updateStaff.username"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div class="w-1/2 ml-5">
            <label class="block text-sm font-medium mb-2">Mật Khẩu</label>
            <input
              type="text"
              v-model="updateStaff.matkhau"
              class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
        <button
          type="submit"
          class="w-full py-2 rounded-lg bg-blue-700 text-gray-100 font-semibold hover:bg-blue-900 transition"
        >
          Cập Nhật
        </button>
        <div class="">
          <button
            @click.self="$emit('close')"
            type="cancel"
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
const updateStaff = reactive({
  hoten: "",
  diachi: "",
  dienthoai: "",
  username: "",
  matkhau: ""
});

onMounted(async () => {
  try {
  } catch (err) {
    console.error(err);
  }
});

// Khi bookId thay đổi, load dữ liệu sách
watch(
  [() => props.id],
  async ([id]) => {
    if (id) {
      const res = await axios.get(`http://localhost:3000/api/staff/${id}`);
      userData.value = res.data;

      updateStaff.hoten = userData.value.HoTen;
      updateStaff.diachi = userData.value.DiaChi;
      updateStaff.dienthoai = userData.value.DienThoai;
      updateStaff.username = userData.value.Username;
      updateStaff.matkhau = userData.value.MatKhau;
    }
  },
  { immediate: true }
);

// const updateStaff = reactive({
//   name: userData.value.TENSACH,
//   price: bookData.value.DONGIA,
//   cover: bookData.value.COVER,
//   soLuong: bookData.value.SOLUONG,
//   namXuatBan: bookData.value.NAMXUATBAN,
//   nxb: bookData.value.MANXB,
//   author: bookData.value.TACGIA,
// });
const emit = defineEmits(["close"]);

const saveChanges = async () => {
  try {
    // Map dữ liệu từ form sang backend
    const payload = {
      HoTen: updateStaff.hoten,
      DiaChi: updateStaff.diachi,
      DienThoai: updateStaff.dienthoai,
      Username: updateStaff.username,
      MatKhau: updateStaff.matkhau,
    };
    await axios.put(`http://localhost:3000/api/updatestaff/${props.id}`, payload);
    alert("Cập nhật thành công");
    emit("close");
  } catch (err) {
    console.error(err);
    alert("Cập nhật thất bại");
  }
};
</script>
