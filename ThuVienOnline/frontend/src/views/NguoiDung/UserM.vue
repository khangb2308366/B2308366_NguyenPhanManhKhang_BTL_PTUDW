<template>
  <div class="bg-gray-500 w-full min-h-screen pl-5">
    <h1 class="font-extrabold text-2xl p-4 text-center mb-5 pt-10 text-white">
      Quản Lí Người dùng
    </h1>
    <div class="flex mb-10">
      <div
        class="text-xl font-bold px-4 py-2 shadow-lg rounded-xl w-[30%] ml-5 cursor-pointer "
        @click="() => {user = true; staff = false}"
        :class="[user ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800']"      
      >
        Quản lí Độc giả
      </div>
      <div
        class="text-xl font-bold  px-4 py-2 shadow-lg rounded-xl w-[40%] ml-5 cursor-pointer text-gray-100"
        @click="() => {user = false; staff = true}"
        :class="[staff ?  'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800']"
      >
        Quản lí Nhân viên (chức năng cho Giám đốc)
      </div>
    </div>
    <div>
        <User v-if="user"/>

        <Staff v-if="staff"/>
    </div>
    
  </div>

</template>

<script setup>
import { ref} from "vue";
import User from "./User.vue";
import Staff from "./Staff.vue";

const user = ref(true);
const staff = ref(false);
</script>
