<template>
  <div class="flex min-h-screen bg-slate-100/50 relative text-slate-800">
    <aside class="w-64 bg-slate-800 text-white p-6 shadow-xl hidden md:block relative">
      <h2 class="text-2xl font-black mb-10 px-2 tracking-tighter border-b border-slate-700 pb-4">
        Admin <span class="text-blue-400">Panel</span>
      </h2>
      <nav class="space-y-2">
        <div @click="activeTab = 'dashboard'" :class="activeTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white font-medium'" class="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer">
          <i class="fa-solid fa-chart-line w-5 text-center"></i> Tổng Quan
        </div>
        <div @click="activeTab = 'books'" :class="activeTab === 'books' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white font-medium'" class="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer">
          <i class="fa-solid fa-book w-5 text-center"></i> Quản lí Sách
        </div>
        <div @click="activeTab = 'orders'" :class="activeTab === 'orders' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white font-medium'" class="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer">
          <i class="fa-solid fa-hand-holding-hand w-5 text-center"></i> Quản lí Đơn mượn
        </div>
        <div @click="goHome" class="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-bold mt-10 border border-dashed border-emerald-500/30">
          <i class="fa-solid fa-house-user w-5 text-center"></i> Trang Chủ
        </div>
      </nav>
    </aside>

    <main class="flex-1 p-8 md:p-10 overflow-y-auto h-screen">
      
      <div v-if="activeTab === 'dashboard'" class="animate-in fade-in duration-300">
        <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Tổng quan Thư viện</h1>
            <p class="text-slate-500 font-medium mt-1">Theo dõi hoạt động và số liệu thời gian thực</p>
          </div>
          <div class="text-sm font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
            {{ new Date().toLocaleDateString('vi-VN') }}
          </div>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div class="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
              <div><p class="text-slate-400 text-xs font-bold uppercase mb-1">Đầu sách hiện có</p><h3 class="text-3xl font-black">{{ stats.totalBooks }}</h3></div>
              <div class="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors"><i class="fa-solid fa-book-open-reader text-xl"></i></div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
              <div><p class="text-slate-400 text-xs font-bold uppercase mb-1">Sách trong kho</p><h3 class="text-3xl font-black">{{ stats.stockBooks }}</h3></div>
              <div class="p-3 bg-green-50 text-green-500 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-colors"><i class="fa-solid fa-warehouse text-xl"></i></div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
              <div><p class="text-slate-400 text-xs font-bold uppercase mb-1">Đơn chờ duyệt</p><h3 class="text-3xl font-black text-orange-600">{{ stats.pendingRequests }}</h3></div>
              <div class="p-3 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors animate-pulse"><i class="fa-solid fa-clock-rotate-left text-xl"></i></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'books'" class="animate-in slide-in-from-right-4 duration-300">
         <header class="mb-10 flex justify-between items-center">
          <div><h1 class="text-3xl font-black tracking-tight">Quản lý Kho Sách</h1><p class="text-slate-500 font-medium mt-1">Quản lý toàn bộ danh mục sách</p></div>
          <button @click="openAddModal" class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg transition-all active:scale-95"><i class="fa-solid fa-book-medical"></i> Nhập sách mới</button>
        </header>
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Bìa</th>
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Thông tin sách</th>
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Kho</th>
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in bookList" :key="book._id" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                <td class="px-6 py-4"><img :src="book.COVER" class="w-12 h-16 object-cover rounded-lg shadow-sm border border-slate-200" @error="(e) => e.target.src='https://placehold.co/400x600?text=No+Cover'" /></td>
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-800">{{ book.TENSACH }}</p>
                  <p class="text-xs text-slate-500">{{ book.TACGIA }} | <span class="text-blue-500 font-bold uppercase">{{ book.THELOAI?.TenTheLoai }}</span></p>
                </td>
                <td class="px-6 py-4 text-center">
                  <p class="font-bold text-slate-800 mb-1">SL: <span :class="book.SOLUONG === 0 ? 'text-red-500' : 'text-blue-600'">{{ book.SOLUONG }}</span></p>
                  <p class="font-bold text-green-600 text-xs">{{ book.DONGIA.toLocaleString() }}đ</p>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button @click="openEditModal(book)" class="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white transition-all"><i class="fa-solid fa-pen text-xs"></i></button>
                  <button @click="handleDeleteBook(book._id, book.TENSACH)" class="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all"><i class="fa-solid fa-trash-can text-xs"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'orders'" class="animate-in slide-in-from-right-4 duration-300">
         <header class="mb-10 flex justify-between items-center">
          <div><h1 class="text-3xl font-black tracking-tight">Quản lý Đơn mượn</h1><p class="text-slate-500 font-medium mt-1">Duyệt và theo dõi trạng thái mượn trả</p></div>
          <div class="relative w-64 group">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input v-model="orderQuery" type="text" placeholder="Tìm tên độc giả hoặc sách..." class="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none focus:border-blue-500 transition-all font-medium text-sm shadow-sm" />
          </div>
        </header>
        
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Độc giả</th>
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Sách mượn</th>
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Trạng thái</th>
                <th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Xử lý</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-slate-50/80 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">{{ order.MaDocGia?.Ten?.charAt(0) || '?' }}</div>
                    <div><p class="font-bold text-slate-800">{{ order.MaDocGia?.Ho }} {{ order.MaDocGia?.Ten }}</p><p class="text-[10px] text-slate-400 font-bold uppercase">@{{ order.MaDocGia?.Username }}</p></div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-700 line-clamp-1">{{ order.MaSach?.TENSACH || 'Sách đã xóa' }}</p>
                  <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Hạn trả: {{ new Date(order.NgayTra).toLocaleDateString('vi-VN') }}</p>
                </td>
                <td class="px-6 py-4 text-center">
                  <span :class="getStatusClass(order.TrangThai)" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm">
                    {{ getStatusText(order.TrangThai) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <template v-if="order.TrangThai === 0">
                      <button @click="handleApprove(order._id)" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md transition-all active:scale-95">Duyệt</button>
                      <button @click="handleReject(order._id)" class="bg-white border border-slate-200 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95">Từ chối</button>
                    </template>
                    <button v-if="order.TrangThai === 1" @click="handleTaken(order._id)" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md active:scale-95">Giao sách</button>
                    <button v-if="order.TrangThai === 2" @click="handleReturn(order._id)" class="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md active:scale-95">Nhận trả</button>
                    <span v-if="order.TrangThai === 4" class="text-slate-300 italic text-xs">Đã xong</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
        <div class="bg-slate-900 p-6 px-8 flex justify-between items-center text-white">
          <h3 class="text-2xl font-extrabold flex items-center gap-3"><i class="fa-solid" :class="isEditing ? 'fa-pen-to-square text-orange-400' : 'fa-book-medical text-blue-400'"></i>{{ isEditing ? 'Cập Nhật Sách' : 'Thêm Sách Mới' }}</h3>
          <button @click="closeModal" class="hover:text-red-400 text-4xl leading-none">&times;</button>
        </div>
        <form @submit.prevent="handleSubmit" class="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto">
          <div class="sm:col-span-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tên sách</label><input v-model="newBook.TENSACH" required type="text" class="w-full border-2 border-slate-100 rounded-2xl p-3 focus:border-blue-500 outline-none font-bold" /></div>
          <div><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tác giả</label><input v-model="newBook.TACGIA" required type="text" class="w-full border-2 border-slate-100 rounded-2xl p-3 focus:border-blue-500 outline-none font-bold" /></div>
          
          <div>
            <label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Thể loại</label>
            <div class="relative mt-1">
              <select v-model="newBook.TheLoai" required class="w-full border-2 border-slate-100 rounded-2xl p-3 focus:border-blue-500 outline-none font-bold bg-white appearance-none cursor-pointer hover:border-slate-200 transition-colors">
                <option value="" disabled>-- Chọn thể loại --</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat.TenTheLoai">{{ cat.TenTheLoai }}</option>
              </select>
              <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400"><i class="fa-solid fa-chevron-down text-xs"></i></div>
            </div>
          </div>

          <div><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Số lượng</label><input v-model="newBook.SOLUONG" required type="number" class="w-full border-2 border-slate-100 rounded-2xl p-3 focus:border-blue-500 outline-none font-bold" /></div>
          <div><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Giá mượn</label><input v-model="newBook.DONGIA" required type="number" class="w-full border-2 border-slate-100 rounded-2xl p-3 focus:border-blue-500 outline-none font-bold" /></div>
          <div class="sm:col-span-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mô tả</label><textarea v-model="newBook.MOTA" rows="3" class="w-full border-2 border-slate-100 rounded-2xl p-3 focus:border-blue-500 outline-none font-bold"></textarea></div>
          <div class="sm:col-span-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Link bìa</label><input v-model="newBook.COVER" type="text" class="w-full border-2 border-slate-100 rounded-2xl p-3 focus:border-blue-500 outline-none font-bold" /></div>
          <div class="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100"><button type="button" @click="closeModal" class="px-7 py-3 font-bold text-slate-400">Hủy</button><button type="submit" class="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">Xác nhận</button></div>
        </form>
      </div>
    </div>

    <div v-if="toast.show" :class="toast.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-red-500 shadow-red-500/40'" class="fixed top-8 right-8 z-[200] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8">
      <i class="fa-solid text-xl" :class="toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'"></i>
      <span class="font-bold text-lg">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const activeTab = ref('dashboard');
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const bookList = ref([]);
const orderList = ref([]);
const categories = ref([]); // Biến chứa danh sách thể loại
const orderQuery = ref('');

const stats = reactive({ totalBooks: 0, stockBooks: 0, pendingRequests: 0 });
const newBook = reactive({ TENSACH: '', TACGIA: '', SOLUONG: 1, DONGIA: 0, TheLoai: '', COVER: '', MOTA: '' });
const toast = ref({ show: false, message: '', type: 'success' });

const showNotification = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

// API CALLS
const fetchStats = async () => { try { const res = await axios.get('http://localhost:3000/api/admin/stats'); Object.assign(stats, res.data); } catch (e) {} };
const fetchBooks = async () => { try { const res = await axios.get('http://localhost:3000/api/sachadmin'); bookList.value = res.data.filter(b => b.XOA !== 1); } catch (e) {} };
const fetchOrders = async () => { try { const res = await axios.get('http://localhost:3000/api/muon'); orderList.value = res.data; } catch (e) {} };
const fetchCategories = async () => { try { const res = await axios.get('http://localhost:3000/api/theloai'); categories.value = res.data; } catch (e) {} };

// ACTIONS XỬ LÝ ĐƠN MƯỢN
const handleApprove = async (id) => { try { await axios.put(`http://localhost:3000/api/choduyet/${id}`); showNotification('Đã duyệt đơn mượn!'); fetchOrders(); fetchStats(); } catch (e) {} };
const handleReject = async (id) => { const r = prompt("Lý do từ chối:"); if (r) { try { await axios.patch(`http://localhost:3000/api/tuchoiduyet/${id}`, { message: r }); showNotification('Đã từ chối đơn!'); fetchOrders(); } catch (e) {} } };
const handleTaken = async (id) => { try { await axios.put(`http://localhost:3000/api/dalaysach/${id}`); showNotification('Đã giao sách!'); fetchOrders(); } catch (e) {} };
const handleReturn = async (id) => { try { await axios.put(`http://localhost:3000/api/dangmuon/${id}`); showNotification('Đã nhận sách trả!'); fetchOrders(); fetchStats(); } catch (e) {} };

// FILTER (ĐÃ SỬA LỖI)
const filteredOrders = computed(() => {
  if (!orderQuery.value) return orderList.value;
  const q = orderQuery.value.toLowerCase();
  return orderList.value.filter(o => 
    o.MaDocGia?.Ten?.toLowerCase().includes(q) || 
    o.MaSach?.TENSACH?.toLowerCase().includes(q)
  );
});

const goHome = () => router.push('/');
const openAddModal = () => { isEditing.value = false; Object.assign(newBook, { TENSACH: '', TACGIA: '', SOLUONG: 1, DONGIA: 0, TheLoai: '', COVER: '', MOTA: '' }); showModal.value = true; };
const openEditModal = (book) => { isEditing.value = true; editId.value = book._id; Object.assign(newBook, { TENSACH: book.TENSACH, TACGIA: book.TACGIA, SOLUONG: book.SOLUONG, DONGIA: book.DONGIA, TheLoai: book.THELOAI?.TenTheLoai || '', COVER: book.COVER || '', MOTA: book.MOTA || '' }); showModal.value = true; };
const closeModal = () => showModal.value = false;

const handleSubmit = async () => {
  try {
    const payload = { ...newBook, COVER: newBook.COVER || '' };
    if (isEditing.value) await axios.put(`http://localhost:3000/api/sach/${editId.value}`, payload);
    else await axios.post('http://localhost:3000/api/addBook', payload);
    showNotification(isEditing.value ? 'Cập nhật thành công!' : 'Thêm thành công!');
    closeModal(); fetchStats(); fetchBooks();
  } catch (e) { showNotification('Lỗi hệ thống!', 'error'); }
};

const handleDeleteBook = async (id, name) => {
  if (confirm(`Xóa cuốn "${name}"?`)) { try { await axios.put(`http://localhost:3000/api/xoasach/${id}`); showNotification('Đã xóa!'); fetchStats(); fetchBooks(); } catch (e) {} }
};

const getStatusText = (s) => ["Chờ duyệt", "Chờ lấy", "Đang mượn", "Từ chối", "Đã trả"][s];
const getStatusClass = (s) => ['bg-amber-50 text-amber-600 border-amber-100', 'bg-emerald-50 text-emerald-600 border-emerald-100', 'bg-blue-50 text-blue-600 border-blue-100', 'bg-rose-50 text-rose-600 border-rose-100', 'bg-slate-50 text-slate-400 border-slate-200'][s];

onMounted(() => { fetchStats(); fetchBooks(); fetchOrders(); fetchCategories(); });
</script>