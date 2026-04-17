<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-gray-100 w-[45vw] h-[88vh] flex flex-col rounded-2xl p-10 shadow-2xl overflow-y-auto">
      <h1 class="font-bold text-2xl mb-5 text-gray-800">Chỉnh sửa thông tin Sách</h1>
      
      <form @submit.prevent="saveChanges" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-600">Tên Sách</label>
          <input
            v-model="updateBook.name"
            type="text"
            required
            class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-600">Tác Giả</label>
            <input
              type="text"
              v-model="updateBook.author"
              required
              class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-600">Thể loại</label>
            <select
              v-model="updateBook.type"
              required
              class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Chọn Thể loại</option>
              <option v-for="tl in theLoaiUnique" :key="tl" :value="tl">
                {{ tl }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-600">Số lượng</label>
            <input
              type="number"
              v-model.number="updateBook.soLuong"
              required
              class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-600">Đơn giá</label>
            <input
              type="number"
              v-model.number="updateBook.price"
              required
              class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-600">Năm xuất bản</label>
            <input
              v-model.number="updateBook.namXuatBan"
              type="number"
              required
              class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-600">Nhà xuất bản</label>
            <select
              v-model="updateBook.nxb"
              required
              class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Chọn NXB</option>
              <option v-for="nxb in nxbsUnique" :key="nxb" :value="nxb">
                {{ nxb }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-600">Link hình ảnh</label>
          <input
            v-model="updateBook.cover"
            type="text"
            required
            class="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button
            @click.prevent="$emit('close')"
            type="button"
            class="flex-1 py-3 rounded-lg bg-gray-300 text-gray-700 font-bold hover:bg-gray-400 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            class="flex-1 py-3 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition shadow-lg"
          >
            Cập nhật ngay
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, reactive, defineEmits } from "vue";
import axios from "axios";

const props = defineProps({
  bookId: String,
});

const emit = defineEmits(["close"]);

const bookData = ref({});
const updateBook = reactive({
  name: "",
  price: 0,
  cover: "",
  soLuong: 0,
  namXuatBan: "",
  nxb: "",
  author: "",
  type: ""
});

const nxbs = ref([]);
const theLoais = ref([]);
const nxbsUnique = ref([]);
const theLoaiUnique = ref([]);

// Lấy dữ liệu danh mục để đổ vào Select
onMounted(async () => {
  try {
    const [resNxb, resType] = await Promise.all([
      axios.get("http://localhost:3000/api/nxbadmin"),
      axios.get("http://localhost:3000/api/theloaiadmin")
    ]);
    nxbs.value = resNxb.data;
    theLoais.value = resType.data;
    
    nxbsUnique.value = [...new Set(nxbs.value.map((nxb) => nxb.TENNXB))];
    theLoaiUnique.value = [...new Set(theLoais.value.map((tl) => tl.TenTheLoai))];
  } catch (err) {
    console.error("Lỗi khi load danh mục:", err);
  }
});

// Theo dõi ID sách để load thông tin cũ
watch(
  () => props.bookId,
  async (id) => {
    if (id) {
      try {
        const res = await axios.get(`http://localhost:3000/api/book/${id}`);
        bookData.value = res.data;

        updateBook.name = bookData.value.TENSACH;
        updateBook.price = bookData.value.DONGIA;
        updateBook.cover = bookData.value.COVER;
        updateBook.soLuong = bookData.value.SOLUONG;
        updateBook.namXuatBan = bookData.value.NAMXUATBAN;
        updateBook.nxb = bookData.value.MANXB?.TENNXB || "";
        updateBook.author = bookData.value.TACGIA;
        updateBook.type = bookData.value.THELOAI?.TenTheLoai || "";
      } catch (err) {
        console.error("Lỗi load chi tiết sách:", err);
      }
    }
  },
  { immediate: true }
);

const saveChanges = async () => {
  try {
    // Tìm ID của NXB và Thể Loại dựa trên Tên 
    const selectedNxbId = nxbs.value.find((n) => n.TENNXB === updateBook.nxb)?._id;
    const selectedTypeId = theLoais.value.find((t) => t.TenTheLoai === updateBook.type)?._id;

    const payload = {
      TENSACH: updateBook.name,
      DONGIA: updateBook.price,
      COVER: updateBook.cover,
      SOLUONG: updateBook.soLuong,
      NAMXUATBAN: updateBook.namXuatBan,
      MANXB: selectedNxbId,
      TACGIA: updateBook.author,
      THELOAI: selectedTypeId
    };

    await axios.put(`http://localhost:3000/api/sach/${props.bookId}`, payload);
    alert("Cập nhật thông tin sách thành công!");
    emit("close");
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    alert(err.response?.data?.message || "Cập nhật thất bại!");
  }
};
</script>