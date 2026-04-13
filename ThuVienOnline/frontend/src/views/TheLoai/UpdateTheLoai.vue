<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-gray-100 w-[45vw] h-[50vh] flex flex-col rounded-2xl p-10">
      <h1 class="font-bold text-2xl mb-5">Chỉnh sửa thông tin Nhà xuất bản</h1>
      <form @submit.prevent="saveChanges" class="space-y-2">
        <div class="">
          <label class="block text-sm font-medium mb-2 whitespace-nowrap"
            >Tên Nhà xuất bản</label
          >
          <input
            v-model="updateNxb.name"
            type="text"
            required
            class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div class="">
          <label class="block text-sm font-medium">Địa Chỉ</label>
          <input
            type="text"
            v-model="updateNxb.address"
            class="w-full bg-gray-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div class="">
          <button
            @click.self="$emit('close')"
            type="cancel"
            class="w-full py-2 rounded-lg bg-gray-400 text-gray-700 font-semibold hover:bg-gray-600 transition"
          >
            Hủy
          </button>
        </div>

        <button
          type="submit"
          class="w-full py-2 rounded-lg bg-blue-700 text-gray-100 font-semibold hover:bg-blue-900 transition"
        >
          Cập nhật
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive, defineProps} from "vue";
import axios from "axios";


const props = defineProps({
  nxbId: String
});

const nxbData = ref({});
const updateNxb = reactive({
  name: "",
  address: ""
});

const MaNxb = ref("");
const nxbs = ref([]);
const selectedNXB = ref("");

// Khi bookId thay đổi, load dữ liệu sách
watch(
  () => props.nxbId,
  async (id) => {
    if (id) {
      const res = await axios.get(`http://localhost:3000/api/nxb/${id}`);
      nxbData.value = res.data;
      updateNxb.name = nxbData.value.TENNXB;
      updateNxb.address = nxbData.value.DIACHI;
    }
  },
  { immediate: true }
);

//
const emit = defineEmits(['close']);

const saveChanges = async () => {
  try {
    // Map dữ liệu từ form sang backend
    const payload = {
      TENSACH: updateNxb.name,
      DIACHI: updateNxb.address,
    }
    console.log(payload);
    await axios.put(`http://localhost:3000/api/nxb/${props.nxbId}`, payload);
    alert("Cập nhật thành công");
    emit('close');
  } catch (err) {
    console.error(err);
    alert("Cập nhật thất bại");
  }
};








</script>
