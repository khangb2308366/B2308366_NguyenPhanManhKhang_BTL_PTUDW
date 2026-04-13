<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-gray-100 w-[45vw] h-[40vh] flex flex-col rounded-2xl p-10">
      <h1 class="font-bold text-2xl mb-5">Thêm Nhà xuất bản mới</h1>
      <form @submit.prevent="onAddTheLoai" class="space-y-2">
        <div class="">
          <label class="block text-sm font-medium mb-2 whitespace-nowrap"
            >Tên Thể loại</label
          >
          <input
            v-model="addNxb.name"
            type="text"
            required
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
          Thêm
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from "vue";
import { ref, watch, computed } from "vue";
import axios from "axios";
import { reactive } from "vue";


const addNxb = reactive({
  name: "",
});

const emit = defineEmits(['close']);

const onAddTheLoai = async () => {
  const nxb = {
    TenTheLoai: addNxb.name,
  };
  try {
    const res = await axios.post("http://localhost:3000/api/addtheloai", nxb);
    console.log(res.data);
    alert("Thêm thành công!");
    emit('close');
  } catch (error) {
    alert(error.response.data.message);
  }
};
</script>
