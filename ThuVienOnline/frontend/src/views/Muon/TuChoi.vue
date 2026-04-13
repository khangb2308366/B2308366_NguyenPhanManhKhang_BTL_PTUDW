<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-[60]"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-[35vw] flex flex-col rounded-2xl p-8 shadow-2xl transform transition-all scale-100">
      <div class="flex items-center gap-3 mb-6 text-red-600">
        <i class="fa-solid fa-circle-exclamation text-3xl"></i>
        <h1 class="font-bold text-2xl text-gray-800">Từ chối Đơn mượn</h1>
      </div>

      <form @submit.prevent="tuChoiDon" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-600 uppercase tracking-wider">
            Lí do từ chối
          </label>
          <textarea
            v-model="muon.reason"
            required
            rows="3"
            placeholder="Ví dụ: Sách đang được bảo trì, bạn đang có đơn quá hạn..."
            class="w-full bg-gray-50 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-none"
          ></textarea>
        </div>

        <div class="flex flex-col gap-3">
          <button
            type="submit"
            class="w-full py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            Xác nhận Từ chối
          </button>
          <button
            @click.prevent="$emit('close')"
            type="button"
            class="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits } from "vue";
import axios from "axios";

const props = defineProps({
  donMuon: String
});

const emit = defineEmits(['close']);

const muon = reactive({
  reason: ""
});

const tuChoiDon = async () => {
  if (!muon.reason.trim()) {
    alert("Vui lòng nhập lý do từ chối!");
    return;
  }

  const payload = {
    message: muon.reason
  };

  try {
    const res = await axios.put(`http://localhost:3000/api/tuchoiduyet/${props.donMuon}`, payload);
    
    alert("Đã gửi thông báo từ chối đến độc giả!");
    emit("close");
  } catch (err) {
    console.error("Lỗi từ chối đơn:", err);
    alert(err.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại.");
  }
};
</script>