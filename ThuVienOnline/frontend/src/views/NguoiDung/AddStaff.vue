<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
    <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
      
      <div class="bg-slate-900 p-6 px-8 flex justify-between items-center text-white">
        <h3 class="text-2xl font-black flex items-center gap-3 tracking-tight">
          <i class="fa-solid" :class="isEditing ? 'fa-pen-to-square text-orange-400' : 'fa-user-plus text-blue-400'"></i>
          {{ isEditing ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới' }}
        </h3>
        <button @click="$emit('close')" class="hover:text-red-400 text-4xl font-light transition-colors leading-none">&times;</button>
      </div>

      <form @submit.prevent="onSubmitStaff" class="p-8 space-y-5">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Họ và Tên Nhân Viên</label>
          <div class="relative">
            <i class="fa-solid fa-signature absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
            <input v-model="staffData.hoten" type="text" required placeholder="VD: Nguyễn Văn A" class="w-full bg-slate-50 border-2 border-slate-100 pl-11 pr-4 py-3 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Địa chỉ</label>
            <input v-model="staffData.diachi" type="text" placeholder="TP. Cần Thơ" class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Số điện thoại</label>
            <input v-model="staffData.dienthoai" type="text" placeholder="09xxx..." class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-50">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Tên đăng nhập</label>
            <input v-model="staffData.username" type="text" required :disabled="isEditing" placeholder="username" class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold disabled:opacity-60 text-slate-700" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Mật khẩu {{ isEditing ? '(Để trống nếu ko đổi)' : '' }}</label>
            <input v-model="staffData.matkhau" type="password" :required="!isEditing" placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" />
          </div>
        </div>

        <div class="flex flex-col gap-3 pt-4">
          <button type="submit" class="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2">
            <i class="fa-solid fa-check"></i> {{ isEditing ? 'LƯU THAY ĐỔI' : 'XÁC NHẬN THÊM' }}
          </button>
          <button type="button" @click="$emit('close')" class="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition-all">Hủy bỏ</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";
import Swal from 'sweetalert2';

const props = defineProps({
  isEditing: Boolean,
  staff: Object
});

const emit = defineEmits(["close", "refresh"]);

const staffData = reactive({ hoten: "", diachi: "", dienthoai: "", username: "", matkhau: "" });

// Tự động điền dữ liệu nếu là Edit
onMounted(() => {
  if (props.isEditing && props.staff) {
    staffData.hoten = props.staff.HoTen || "";
    staffData.diachi = props.staff.DiaChi || "";
    staffData.dienthoai = props.staff.DienThoai || "";
    staffData.username = props.staff.Username || "";
  }
});

const onSubmitStaff = async () => {
  const payload = {
    HoTen: staffData.hoten,
    DiaChi: staffData.diachi,
    DienThoai: staffData.dienthoai,
    Username: staffData.username
  };

  if (staffData.matkhau && staffData.matkhau.trim() !== "") {
    payload.MatKhau = staffData.matkhau;
  }

  try {
    if (props.isEditing) {
      // ĐÃ SỬA: Đổi thành 'updatestaff' cho khớp với Backend
      await axios.put(`http://localhost:3000/api/updatestaff/${props.staff._id}`, payload);
      await Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã cập nhật thông tin nhân viên', confirmButtonColor: '#3b82f6', customClass: { popup: 'rounded-[2rem]' } });
    } else {
      // ĐÃ SỬA: Đổi thành 'addstaff' viết thường toàn bộ cho khớp Backend
      await axios.post("http://localhost:3000/api/addstaff", payload);
      await Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã tạo tài khoản nhân viên mới', confirmButtonColor: '#3b82f6', customClass: { popup: 'rounded-[2rem]' } });
    }
    emit("refresh"); 
    emit("close");   
  } catch (error) {
    console.error("Lỗi từ server:", error); 
    Swal.fire({ 
      icon: 'error', 
      title: 'Lỗi!', 
      text: error.response?.data?.message || "Có lỗi xảy ra khi gọi API.", 
      customClass: { popup: 'rounded-[2rem]' } 
    });
  }
};
</script>