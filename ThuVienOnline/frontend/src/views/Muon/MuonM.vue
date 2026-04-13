<template>
  <div class="bg-gray-600 w-full min-h-screen pl-5">
    <h1 class="font-extrabold text-2xl p-4 text-center mb-5 pt-10 text-white">
      Quản Lí Đơn mượn
    </h1>
    <div class="flex mb-10">
      <div
        class="text-xl font-bold px-4 py-2 shadow-lg rounded-xl w-[23%] ml-5 cursor-pointer  text-center"
        @click="() => {all = true; choDuyet = false; dangMuon=false; hoanThanh=false}"
        :class="[all ? 'bg-gray-800 text-gray-100':'bg-gray-100  text-gray-800']"      
      >
        Tất cả Đơn mượn
      </div>
      <div
        class="text-xl font-bold  px-4 py-2 shadow-lg rounded-xl w-[23%] ml-5 cursor-pointer text-center"
        @click="() => {all = false; choDuyet = true; dangMuon=false; hoanThanh=false}"
        :class="[choDuyet ?  'bg-gray-800 text-gray-100':'bg-gray-100  text-gray-800']"
      >
        Chờ duyệt
      </div>
      <div
        class="text-xl font-bold  px-4 py-2 shadow-lg rounded-xl w-[23%] ml-5 cursor-pointer text-center"
        @click="() => {all = false; choDuyet = false; dangMuon=true; hoanThanh=false}"
        :class="[dangMuon ?  'bg-gray-800 text-gray-100':'bg-gray-100  text-gray-800']"
      >
        Đang mượn
      </div>
      <div
        class="text-xl font-bold  px-4 py-2 shadow-lg rounded-xl w-[23%] ml-5 cursor-pointer text-center"
        @click="() => {all = false; choDuyet = false; dangMuon=false; hoanThanh=true}"
        :class="[hoanThanh ?  'bg-gray-800 text-gray-100':'bg-gray-100  text-gray-800']"
      >
        Đã hoàn thành
      </div>
    </div>
    <div class="min-h-screen w-full">
        <AllDon v-if="all"/>
        <ChoDuyet v-if="choDuyet"/>
        <DangMuon v-if="dangMuon"/>
        <HoanThanh v-if="hoanThanh"/>
    </div>
    
  </div>

</template>

<script setup>
import { ref} from "vue";
import AllDon from "./AllDon.vue";
import ChoDuyet from "./ChoDuyet.vue";
import HoanThanh from "./HoanThanh.vue";
import DangMuon from "./DangMuon.vue";

const all = ref(true);
const choDuyet = ref(false);
const dangMuon = ref(false);
const hoanThanh = ref(false);
</script>
