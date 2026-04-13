<template>
  <div class="bg-gray-600 w-full min-h-screen pl-5 pb-10">
    <h1 class="font-extrabold text-2xl p-4 text-center mb-5 pt-10 text-white">
      Quản Lí Sách
    </h1>
    
    <div class="flex items-center">
      <input
        v-model="query"
        type="text"
        placeholder="Tìm kiếm theo tên sách, tác giả..."
        class="ml-5 border-none px-6 py-3 rounded-xl w-[70%] bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
      />
      <button
        @click="addBook = true"
        class="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-3 w-[23%] ml-5 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-plus"></i> Thêm Sách mới
      </button>
    </div>

    <div class="flex ml-5 mt-6 gap-4">
      <button
        @click="filterStatus = 'all'"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm',
          filterStatus === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        Tất cả
      </button>
      <button
        @click="filterStatus = 'active'"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm',
          filterStatus === 'active'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        Hiện có
      </button>
      <button
        @click="filterStatus = 'deleted'"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm',
          filterStatus === 'deleted'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        Đã xóa
      </button>
    </div>

    <div class="overflow-y-auto h-[60vh] w-[95%] mt-5 ml-5 rounded-xl shadow-2xl">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-800 text-gray-100 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-4 text-left">Tên Sách</th>
            <th class="px-4 py-4 text-left">Tác giả</th>
            <th class="px-4 py-4 text-left">Thể loại</th>
            <th class="px-4 py-4 text-left">NXB</th>
            <th class="px-4 py-4 text-center">Tồn kho</th>
            <th class="px-4 py-4 text-center">Lượt mượn</th>
            <th class="px-4 py-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredData"
            :key="item._id"
            :class="{
              'bg-white hover:bg-gray-50': item.XOA == 0,
              'bg-gray-300 opacity-80': item.XOA == 1,
            }"
            class="border-b transition-colors"
          >
            <td class="px-4 py-3 font-semibold text-gray-800">{{ item.TENSACH }}</td>
            <td class="px-4 py-3 text-gray-600">{{ item.TACGIA }}</td>
            <td class="px-4 py-3 text-gray-600">
              <span class="bg-gray-200 text-xs px-2 py-1 rounded-md">{{ item.THELOAI?.TenTheLoai || '—' }}</span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ item.MANXB?.TENNXB || '—' }}</td>
            <td class="px-4 py-3 text-center font-bold" :class="item.SOLUONG > 0 ? 'text-green-600' : 'text-red-600'">
              {{ item.SOLUONG }}
            </td>
            <td class="px-4 py-3 text-center text-blue-600 font-bold">
              {{ item.LUOTMUON || 0 }}
            </td>
            <td class="px-4 py-3 text-center">
              <button
                class="hover:bg-yellow-100 p-2 rounded-full transition-colors"
                title="Chỉnh sửa"
                @click="editBook(item._id)"
              >
                <i class="fa-solid fa-pencil text-yellow-500"></i>
              </button>
              
              <button
                v-if="item.XOA == 0"
                @click="() => { deleteBook = true; bk = item._id; }"
                class="hover:bg-red-100 p-2 rounded-full transition-colors ml-2"
                title="Xóa sách"
              >
                <i class="fa-solid fa-trash-can text-red-600"></i>
              </button>
              
              <button
                v-if="item.XOA == 1"
                @click="restoreBook(item._id)"
                class="hover:bg-green-100 p-2 rounded-full transition-colors ml-2"
                title="Khôi phục sách"
              >
                <i class="fa-solid fa-rotate-left text-green-600"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="7" class="text-center p-8 text-gray-500 font-medium">Không tìm thấy cuốn sách nào!</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <AddBook
    v-if="addBook"
    @close="() => { addBook = false; fetchData(); }"
  />

  <UpdateBook
    v-if="showEditModal"
    :bookId="selectedBookId"
    @close="() => { showEditModal = false; fetchData(); }"
  />

  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
    v-if="deleteBook"
  >
    <div class="w-[30vw] bg-white rounded-xl shadow-2xl flex flex-col items-center p-6 transform transition-all">
      <div class="text-red-500 text-5xl mb-4"><i class="fa-solid fa-circle-exclamation"></i></div>
      <h1 class="text-2xl font-bold text-gray-800 text-center mb-2">Xác nhận Xóa?</h1>
      <p class="text-gray-500 text-center mb-6">Sách sau khi xóa sẽ bị ẩn khỏi trang của độc giả. Bạn có thể khôi phục lại sau.</p>
      
      <div class="flex w-full gap-4">
        <button @click="deleteBook = false" class="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors">
          Hủy bỏ
        </button>
        <button @click="onDelete" class="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
          Đồng ý Xóa
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import AddBook from "./AddBook.vue";
import UpdateBook from "./UpdateBook.vue";

const books = ref([]);
const loading = ref(true);
const error = ref(null);
const addBook = ref(false); // Nên dùng false thay vì null cho boolean

const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/sachadmin");
    books.value = res.data;
  } catch (err) {
    error.value = "Không thể tải dữ liệu!";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const query = ref("");
const filterStatus = ref("all");

const filteredData = computed(() => {
  let result = books.value;
  if (filterStatus.value === "active") {
    result = result.filter((item) => item.XOA === 0);
  } else if (filterStatus.value === "deleted") {
    result = result.filter((item) => item.XOA === 1);
  }
  if (query.value) {
    result = result.filter(
      (item) =>
        (item.TENSACH || "").toLowerCase().includes(query.value.toLowerCase()) ||
        (item.TACGIA || "").toLowerCase().includes(query.value.toLowerCase())
    );
  }
  return result;
});

const showEditModal = ref(false);
const selectedBookId = ref(null);

const editBook = (id) => {
  selectedBookId.value = id;
  showEditModal.value = true;
};

const bk = ref(null);
const deleteBook = ref(false);

const onDelete = async () => {
  try {
    // API xóa/khôi phục sách trên controller đã viết theo dạng toggle
    await axios.put(`http://localhost:3000/api/xoasach/${bk.value}`);
    alert("Cập nhật trạng thái sách thành công!");
    deleteBook.value = false;
    bk.value = null;
    fetchData();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Cập nhật thất bại!");
  }
};

const restoreBook = async (id) => {
  try {
    await axios.put(`http://localhost:3000/api/xoasach/${id}`);
    alert("Khôi phục sách thành công!");
    fetchData();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Khôi phục thất bại!");
  }
};
</script>