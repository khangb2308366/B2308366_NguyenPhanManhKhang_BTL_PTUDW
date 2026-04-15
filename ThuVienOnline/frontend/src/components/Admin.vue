<template>
  <div class="flex min-h-screen bg-slate-100/50 relative text-slate-800 font-sans">
    
    <aside class="w-64 bg-slate-800 text-white p-6 shadow-xl hidden md:block relative shrink-0">
      <div class="flex items-center gap-3 mb-10 px-2 border-b border-slate-700 pb-6">
        <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i class="fa-solid fa-shield-halved text-xl text-white"></i>
        </div>
        <h2 class="text-xl font-black tracking-tighter uppercase text-white">ADMIN <span class="text-blue-400">PANEL</span></h2>
      </div>

      <nav class="space-y-2">
        <div @click="activeTab = 'dashboard'" :class="activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'" class="flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-sm">
          <i class="fa-solid fa-chart-pie w-5 text-center text-lg"></i> Tổng Quan
        </div>
        <div @click="activeTab = 'books'" :class="activeTab === 'books' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'" class="flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-sm">
          <i class="fa-solid fa-book-bookmark w-5 text-center text-lg"></i> Quản lí Sách
        </div>
        <div @click="activeTab = 'publishers'" :class="activeTab === 'publishers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'" class="flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-sm">
          <i class="fa-solid fa-building-columns w-5 text-center text-lg"></i> Nhà Xuất Bản
        </div>
        <div @click="activeTab = 'categories'" :class="activeTab === 'categories' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'" class="flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-sm">
          <i class="fa-solid fa-tags w-5 text-center text-lg"></i> Thể Loại
        </div>
        <div @click="activeTab = 'orders'" :class="activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'" class="flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-sm">
          <i class="fa-solid fa-hand-holding-heart w-5 text-center text-lg"></i> Quản lí Đơn mượn
        </div>
        <div v-if="authStore.user?.role === 3" @click="activeTab = 'users'" :class="activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'" class="flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-sm">
          <i class="fa-solid fa-users-gear w-5 text-center text-lg"></i> Quản lí Người dùng
        </div>

        <div class="pt-10">
          <div @click="goHome" class="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer text-emerald-400 hover:bg-emerald-500/10 font-bold text-sm border border-emerald-500/20 border-dashed transition-all">
            <i class="fa-solid fa-house w-5 text-center"></i> Về Trang Chủ
          </div>
        </div>
      </nav>
    </aside>

    <main class="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
      
      <div v-if="activeTab === 'dashboard'" class="animate-in fade-in duration-500">
        <header class="mb-12 flex justify-between items-end">
          <div><h1 class="text-4xl font-black tracking-tight text-slate-900">Tổng quan Thư viện</h1><p class="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.3em]">Số liệu thống kê thời gian thực</p></div>
        </header>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-blue-500 hover:shadow-md transition-all group"><p class="text-slate-400 text-[10px] font-black uppercase mb-1">Đầu sách</p><div class="flex justify-between items-center"><h3 class="text-3xl font-black">{{ stats.totalBooks }}</h3><i class="fa-solid fa-book text-blue-100 text-2xl"></i></div></div>
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-emerald-500 hover:shadow-md transition-all group"><p class="text-slate-400 text-[10px] font-black uppercase mb-1">Trong kho</p><div class="flex justify-between items-center"><h3 class="text-3xl font-black text-slate-800">{{ stats.stockBooks }}</h3><i class="fa-solid fa-warehouse text-emerald-100 text-2xl"></i></div></div>
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-orange-500 hover:shadow-md transition-all group"><p class="text-slate-400 text-[10px] font-black uppercase mb-1">Chờ duyệt</p><div class="flex justify-between items-center"><h3 class="text-3xl font-black text-orange-600">{{ stats.pendingRequests }}</h3><i class="fa-solid fa-clock-rotate-left text-orange-100 text-2xl animate-pulse"></i></div></div>
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-indigo-500 hover:shadow-md transition-all group"><p class="text-slate-400 text-[10px] font-black uppercase mb-1">Nhân sự</p><div class="flex justify-between items-center"><h3 class="text-3xl font-black text-indigo-600">{{ staffList.length }}</h3><i class="fa-solid fa-user-shield text-indigo-100 text-2xl"></i></div></div>
        </div>
        <div class="mt-12 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="max-w-md text-center md:text-left"><h2 class="text-2xl font-black mb-2 text-slate-800">Tác vụ nhanh</h2><p class="text-slate-500 text-sm leading-relaxed font-medium">Thêm sách mới vào hệ thống hoặc quản lý đơn mượn đang chờ xử lý.</p></div>
          <button @click="openAddModal" class="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3 shadow-xl active:scale-95"><i class="fa-solid fa-plus-circle text-lg text-blue-400"></i> NHẬP SÁCH MỚI</button>
        </div>
      </div>

      <div v-if="activeTab === 'books'" class="animate-in slide-in-from-bottom-6 duration-500">
        <header class="mb-10 flex justify-between items-center text-slate-900">
          <div><h1 class="text-3xl font-black tracking-tight text-slate-800">Danh Mục Kho Sách</h1><p class="text-slate-500 font-medium">Quản lý toàn bộ {{ bookList.length }} đầu sách</p></div>
          <button @click="openAddModal" class="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">THÊM MỚI</button>
        </header>
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-slate-800">
          <table class="w-full text-left border-collapse">
            <thead><tr class="bg-slate-50/50 border-b border-slate-100"><th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Sách</th><th class="px-8 py-5 text-center text-[10px] font-black uppercase text-slate-400">Số lượng</th><th class="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400">Hành động</th></tr></thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="book in bookList" :key="book._id" class="hover:bg-blue-50/30 transition-all group">
                <td class="px-8 py-5"><div class="flex items-center gap-5"><img :src="book.COVER" class="w-12 h-16 object-cover rounded-xl shadow-sm border border-slate-100" @error="(e) => e.target.src='https://placehold.co/400x600?text=No+Cover'" /><div><p class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ book.TENSACH }}</p><p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ book.TACGIA }} | <span class="text-blue-400">{{ book.THELOAI?.TenTheLoai }}</span></p></div></div></td>
                <td class="px-8 py-5 text-center font-black text-blue-600 text-lg">{{ book.SOLUONG }}</td>
                <td class="px-8 py-5 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="openEditModal(book)" class="w-9 h-9 rounded-lg bg-slate-100 text-slate-400 hover:bg-blue-500 hover:text-white transition-all"><i class="fa-solid fa-pen text-xs"></i></button>
                    <button @click="handleDeleteBook(book._id, book.TENSACH)" class="w-9 h-9 rounded-lg bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><i class="fa-solid fa-trash-can text-xs"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'publishers'" class="animate-in slide-in-from-right-6 duration-300">
        <header class="mb-10 flex justify-between items-center text-slate-900">
          <div><h1 class="text-3xl font-black tracking-tight text-slate-800">Nhà Xuất Bản</h1><p class="text-slate-500 font-medium">Danh sách các đối tác cung cấp sách</p></div>
          <button @click="openAddNxbModal" class="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">THÊM NXB +</button>
        </header>
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-slate-800">
          <table class="w-full text-left border-collapse">
            <thead><tr class="bg-slate-50/50 border-b border-slate-100"><th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Tên NXB</th><th class="px-8 py-5 text-center text-[10px] font-black uppercase text-slate-400">Số lượng sách</th><th class="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400">Hành động</th></tr></thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="nxb in nxbList" :key="nxb._id" class="hover:bg-slate-50 transition-colors group">
                <td class="px-8 py-5"><p class="font-bold text-slate-800 uppercase">{{ nxb.TENNXB }}</p><p class="text-[10px] text-slate-400 uppercase tracking-tighter">{{ nxb.DIACHI }}</p></td>
                <td class="px-8 py-5 text-center font-black text-blue-600 text-lg">{{ nxb.SOLUONG }}</td>
                <td class="px-8 py-5 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="openEditNxbModal(nxb)" class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white transition-all"><i class="fa-solid fa-pen text-xs"></i></button>
                    <button @click="handleDeleteNxb(nxb._id, nxb.TENNXB)" class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><i class="fa-solid fa-trash-can text-xs"></i></button>
                  </div>
                </td>
              </tr>
              <tr v-if="nxbList.length === 0"><td colspan="3" class="py-10 text-center text-slate-400">Chưa có dữ liệu</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'categories'" class="animate-in slide-in-from-right-6 duration-300">
        <header class="mb-10 flex justify-between items-center text-slate-900">
          <div><h1 class="text-3xl font-black tracking-tight text-slate-800">Thể Loại</h1><p class="text-slate-500 font-medium">Phân loại sách trong hệ thống</p></div>
          <button @click="openAddCatModal" class="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">THÊM LOẠI +</button>
        </header>
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-slate-800">
          <table class="w-full text-left border-collapse">
            <thead><tr class="bg-slate-50/50 border-b border-slate-100"><th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Tên Thể Loại</th><th class="px-8 py-5 text-center text-[10px] font-black uppercase text-slate-400">Số lượng sách</th><th class="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400">Hành động</th></tr></thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="cat in categoryList" :key="cat._id" class="hover:bg-slate-50 transition-colors group">
                <td class="px-8 py-5"><p class="font-bold text-slate-800 uppercase">{{ cat.TenTheLoai }}</p></td>
                <td class="px-8 py-5 text-center font-black text-blue-600 text-lg">{{ cat.SOLUONG }}</td>
                <td class="px-8 py-5 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="openEditCatModal(cat)" class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white transition-all"><i class="fa-solid fa-pen text-xs"></i></button>
                    <button @click="handleDeleteCat(cat._id, cat.TenTheLoai)" class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><i class="fa-solid fa-trash-can text-xs"></i></button>
                  </div>
                </td>
              </tr>
              <tr v-if="categoryList.length === 0"><td colspan="3" class="py-10 text-center text-slate-400">Chưa có dữ liệu</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'orders'" class="animate-in slide-in-from-right-6 duration-500">
         <header class="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div><h1 class="text-3xl font-black text-slate-800">Quản lý Đơn Mượn</h1><p class="text-slate-500 font-medium">Duyệt yêu cầu mượn trả</p></div>
          <div class="relative w-full md:w-80"><i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i><input v-model="orderQuery" type="text" placeholder="Tìm tên sách/độc giả..." class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 outline-none focus:border-blue-500 shadow-sm text-sm" /></div>
        </header>
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-slate-800">
          <table class="w-full text-left border-collapse text-sm">
            <thead><tr class="bg-slate-50/50 border-b border-slate-100"><th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px]">Độc giả</th><th class="px-6 py-5 font-black text-slate-400 uppercase text-[10px]">Sách</th><th class="px-6 py-5 text-center font-black text-slate-400 uppercase text-[10px]">Trạng thái</th><th class="px-6 py-5 text-right font-black text-slate-400 uppercase text-[10px]">Xử lý</th></tr></thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-5 font-bold text-slate-800">{{ order.MaDocGia?.Ho }} {{ order.MaDocGia?.Ten }}</td>
                <td class="px-6 py-5 text-slate-600">{{ order.MaSach?.TENSACH }}</td>
                <td class="px-6 py-5 text-center"><span :class="getStatusClass(order.TrangThai)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase">{{ getStatusText(order.TrangThai) }}</span></td>
                <td class="px-6 py-5 text-right"><div class="flex justify-end gap-2"><button v-if="order.TrangThai === 0" @click="handleApprove(order._id)" class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-colors">Duyệt</button><button v-if="order.TrangThai === 0" @click="handleReject(order._id)" class="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-colors">Từ chối</button><button v-if="order.TrangThai === 1" @click="handleTaken(order._id)" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-colors">Giao sách</button><button v-if="order.TrangThai === 2" @click="handleReturn(order._id)" class="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-colors">Nhận Trả</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'users'" class="animate-in slide-in-from-right-6 duration-500">
        <header class="mb-8 text-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h1 class="text-3xl font-black tracking-tight text-slate-800">Quản lý Người Dùng</h1><p class="text-slate-500 font-medium">Hệ thống Độc giả và Nhân viên</p></div>
          <div class="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
            <button @click="activeUserTab = 'readers'" :class="activeUserTab === 'readers' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'" class="px-6 py-2 rounded-xl font-black text-xs uppercase transition-all">Độc Giả</button>
            <button @click="activeUserTab = 'staff'" :class="activeUserTab === 'staff' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'" class="px-6 py-2 rounded-xl font-black text-xs uppercase transition-all">Nhân Viên</button>
          </div>
        </header>

        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-slate-800">
          
          <div v-if="activeUserTab === 'readers'">
            <table class="w-full text-left border-collapse">
              <thead><tr class="bg-slate-50/50 border-b border-slate-100"><th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Độc giả</th><th class="px-8 py-5 text-center text-[10px] font-black uppercase text-slate-400">Tài khoản</th><th class="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400">Xóa</th></tr></thead>
              <tbody class="divide-y divide-slate-50 text-sm">
                <tr v-for="r in filteredReaders" :key="r._id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-8 py-5"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">{{ r.Ten?.charAt(0) }}</div><div><p class="font-bold text-slate-800">{{ r.Ho }} {{ r.Ten }}</p></div></div></td>
                  <td class="px-8 py-5 text-center font-medium text-slate-500">@{{ r.Username }}</td>
                  <td class="px-8 py-5 text-right"><button @click="handleDeleteReader(r._id, r.Ten)" class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><i class="fa-solid fa-trash-can"></i></button></td>
                </tr>
                <tr v-if="filteredReaders.length === 0"><td colspan="3" class="py-20 text-center text-slate-400 font-medium">Không có độc giả nào.</td></tr>
              </tbody>
            </table>
          </div>

          <div v-if="activeUserTab === 'staff'">
            <div class="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center text-slate-800">
              <h3 class="font-bold text-slate-500 text-sm">Nhân viên quản trị</h3>
              <button @click="openAddStaffModal" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md hover:bg-blue-600 transition-colors">THÊM NHÂN VIÊN +</button>
            </div>
            <table class="w-full text-left border-collapse">
              <tbody class="divide-y divide-slate-50 text-sm">
                <tr v-for="s in staffList" :key="s._id" class="hover:bg-indigo-50/30 transition-all group">
                  <td class="px-8 py-5"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">{{ s.HoTen?.charAt(0) }}</div><div><p class="font-bold">{{ s.HoTen }}</p><p class="text-[10px] text-slate-400 uppercase">@{{ s.Username }}</p></div></div></td>
                  <td class="px-8 py-5 text-right">
                    <button @click="openEditStaffModal(s)" class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white transition-all mr-2"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button @click="handleDeleteStaff(s._id, s.HoTen)" class="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><i class="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-slate-800">
        <div class="bg-slate-900 p-8 px-10 flex justify-between items-center text-white text-slate-800">
          <h3 class="text-2xl font-black flex items-center gap-4 text-white text-slate-800"><i class="fa-solid text-slate-800" :class="isEditing ? 'fa-pen-to-square text-orange-400' : 'fa-book-medical text-blue-400'"></i>{{ isEditing ? 'Cập Nhật Sách' : 'Thêm Sách Mới' }}</h3>
          <button @click="closeModal" class="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-3xl text-white text-slate-800 leading-none">&times;</button>
        </div>
        <form @submit.prevent="handleSubmit" class="p-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto text-slate-800">
          <div class="sm:col-span-2 text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Tên sách</label><input v-model="newBook.TENSACH" required type="text" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold text-slate-800" /></div>
          <div class="text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Tác giả</label><input v-model="newBook.TACGIA" required type="text" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold text-slate-800" /></div>
          <div class="text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Thể loại</label><div class="relative mt-1 text-slate-800"><select v-model="newBook.TheLoai" required class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold appearance-none cursor-pointer text-slate-800"><option value="" disabled class="text-slate-800">-- Chọn thể loại --</option><option v-for="cat in categoryList" :key="cat._id" :value="cat.TenTheLoai" class="text-slate-800">{{ cat.TenTheLoai }}</option></select><div class="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400"><i class="fa-solid fa-chevron-down text-xs"></i></div></div></div>
          <div class="text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Nhà Xuất Bản</label><div class="relative mt-1 text-slate-800"><select v-model="newBook.TENNXB" required class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold appearance-none cursor-pointer text-slate-800"><option value="" disabled class="text-slate-800">-- Chọn NXB --</option><option v-for="nxb in nxbList" :key="nxb._id" :value="nxb.TENNXB" class="text-slate-800">{{ nxb.TENNXB }}</option></select><div class="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400"><i class="fa-solid fa-chevron-down text-xs"></i></div></div></div>
          <div class="text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Năm Xuất Bản</label><input v-model="newBook.NAMXUATBAN" required type="number" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold text-slate-800" /></div>
          <div class="text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Số lượng</label><input v-model="newBook.SOLUONG" required type="number" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold text-slate-800" /></div>
          <div class="text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Giá mượn</label><input v-model="newBook.DONGIA" required type="number" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold text-slate-800" /></div>
          <div class="sm:col-span-2 text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Mô tả</label><textarea v-model="newBook.MOTA" rows="3" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold text-slate-800"></textarea></div>
          <div class="sm:col-span-2 text-slate-800"><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-slate-800">Link bìa</label><input v-model="newBook.COVER" type="text" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold text-slate-800" /></div>
          <div class="sm:col-span-2 flex justify-end gap-4 pt-6 border-t border-slate-100 mt-4 text-slate-800"><button type="button" @click="closeModal" class="px-8 py-4 font-black text-slate-400 uppercase text-xs text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">Hủy</button><button type="submit" class="bg-blue-600 hover:bg-blue-700 px-10 py-4 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase text-xs">Lưu lại</button></div>
        </form>
      </div>
    </div>

    <div v-if="showNxbModal" class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div class="bg-slate-900 p-8 flex justify-between items-center text-white">
          <h3 class="text-xl font-black flex items-center gap-3"><i class="fa-solid" :class="isEditingNxb ? 'fa-pen text-orange-400' : 'fa-building-columns text-blue-400'"></i> {{ isEditingNxb ? 'Sửa NXB' : 'Thêm NXB' }}</h3>
          <button @click="closeNxbModal" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl leading-none">&times;</button>
        </div>
        <form @submit.prevent="handleNxbSubmit" class="p-8 space-y-5">
          <div><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên NXB</label><input v-model="newNxb.TENNXB" required type="text" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold" /></div>
          <div><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ</label><input v-model="newNxb.DIACHI" required type="text" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold" /></div>
          <div class="flex justify-end gap-3 pt-4"><button type="button" @click="closeNxbModal" class="px-6 py-3 font-bold text-slate-400 hover:bg-slate-100 rounded-xl transition-colors text-sm">Hủy</button><button type="submit" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all text-sm">Lưu</button></div>
        </form>
      </div>
    </div>

    <div v-if="showCatModal" class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div class="bg-slate-900 p-8 flex justify-between items-center text-white">
          <h3 class="text-xl font-black flex items-center gap-3"><i class="fa-solid" :class="isEditingCat ? 'fa-pen text-orange-400' : 'fa-tags text-blue-400'"></i> {{ isEditingCat ? 'Sửa Thể Loại' : 'Thêm Thể Loại' }}</h3>
          <button @click="closeCatModal" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl leading-none">&times;</button>
        </div>
        <form @submit.prevent="handleCatSubmit" class="p-8 space-y-5">
          <div><label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên Thể Loại</label><input v-model="newCat.TenTheLoai" required type="text" class="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 bg-slate-50 outline-none font-bold" /></div>
          <div class="flex justify-end gap-3 pt-4"><button type="button" @click="closeCatModal" class="px-6 py-3 font-bold text-slate-400 hover:bg-slate-100 rounded-xl transition-colors text-sm">Hủy</button><button type="submit" class="bg-slate-900 hover:bg-slate-800 px-6 py-3 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all text-sm">Lưu</button></div>
        </form>
      </div>
    </div>

    <AddStaffModal 
      v-if="showAddStaffModal" 
      :is-editing="isEditingStaff" 
      :staff="selectedStaff" 
      @close="showAddStaffModal = false" 
      @refresh="fetchStaff" 
    />

    <div v-if="toast.show" :class="toast.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-red-500 shadow-red-500/40'" class="fixed top-10 right-10 z-[200] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-500 text-white">
      <i class="fa-solid text-xl" :class="toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'"></i>
      <span class="font-black tracking-tight text-lg">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 
import Swal from 'sweetalert2';
import AddStaffModal from '@/views/NguoiDung/AddStaff.vue'; 
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const activeTab = ref('dashboard');
const activeUserTab = ref('readers');

const bookList = ref([]);
const staffList = ref([]);
const readerList = ref([]);
const orderList = ref([]);
const categories = ref([]);
const orderQuery = ref('');
const nxbList = ref([]);
const categoryList = ref([]);

// === STATE NHÂN VIÊN ===
const showAddStaffModal = ref(false);
const isEditingStaff = ref(false);
const selectedStaff = ref(null);

// === STATE SÁCH ===
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const newBook = reactive({ TENSACH: '', TACGIA: '', SOLUONG: 1, DONGIA: 0, TheLoai: '', TENNXB: '', NAMXUATBAN: new Date().getFullYear(), COVER: '', MOTA: '' });

// 🔥 MỚI: STATE NXB & THỂ LOẠI
const showNxbModal = ref(false);
const isEditingNxb = ref(false);
const editNxbId = ref(null);
const newNxb = reactive({ TENNXB: '', DIACHI: '' });

const showCatModal = ref(false);
const isEditingCat = ref(false);
const editCatId = ref(null);
const newCat = reactive({ TenTheLoai: '' });

const stats = reactive({ totalBooks: 0, stockBooks: 0, pendingRequests: 0 });
const toast = ref({ show: false, message: '', type: 'success' });

// ================= CÁC HÀM TIỆN ÍCH =================
const showNotification = (msg, type = 'success') => { 
  toast.value = { show: true, message: msg, type }; 
  setTimeout(() => toast.value.show = false, 4000); 
};
const goHome = () => router.push('/');
const getStatusText = (s) => ["Chờ duyệt", "Chờ lấy", "Đang mượn", "Từ chối", "Đã trả"][s];
const getStatusClass = (s) => ['bg-amber-100 text-amber-600', 'bg-emerald-100 text-emerald-600', 'bg-blue-100 text-blue-600', 'bg-rose-100 text-rose-600', 'bg-slate-100 text-slate-400'][s];

// ================= GỌI API =================
const fetchStats = async () => { try { const res = await axios.get('http://localhost:3000/api/admin/stats'); Object.assign(stats, res.data); } catch (e) {} };
const fetchBooks = async () => { try { const res = await axios.get('http://localhost:3000/api/sachadmin'); bookList.value = res.data.filter(b => b.XOA !== 1); } catch (e) {} };
const fetchStaff = async () => { try { const res = await axios.get('http://localhost:3000/api/staff'); staffList.value = res.data; } catch (e) {} };
const fetchOrders = async () => { try { const res = await axios.get('http://localhost:3000/api/muon'); orderList.value = res.data; } catch (e) {} };
const fetchReaders = async () => { try { const res = await axios.get('http://localhost:3000/api/user'); readerList.value = res.data; } catch (e) {} };
const fetchNxbs = async () => { try { const res = await axios.get('http://localhost:3000/api/nxbadmin'); nxbList.value = res.data.filter(n => n.XOA !== 1); } catch (e) {} };
const fetchCats = async () => { try { const res = await axios.get('http://localhost:3000/api/theloaiadmin'); categoryList.value = res.data.filter(c => c.XOA !== 1); categories.value = res.data.filter(c => c.XOA !== 1); } catch (e) {} };

// ================= QUẢN LÝ SÁCH =================
const openAddModal = () => { isEditing.value = false; Object.assign(newBook, { TENSACH: '', TACGIA: '', SOLUONG: 1, DONGIA: 0, TheLoai: '', TENNXB: '', NAMXUATBAN: new Date().getFullYear(), COVER: '', MOTA: '' }); showModal.value = true; };
const openEditModal = (book) => { isEditing.value = true; editId.value = book._id; Object.assign(newBook, { TENSACH: book.TENSACH, TACGIA: book.TACGIA, SOLUONG: book.SOLUONG, DONGIA: book.DONGIA, TheLoai: book.THELOAI?.TenTheLoai || '', TENNXB: book.MANXB?.TENNXB || '', NAMXUATBAN: book.NAMXUATBAN || new Date().getFullYear(), COVER: book.COVER || '', MOTA: book.MOTA || '' }); showModal.value = true; };
const closeModal = () => showModal.value = false;

const handleSubmit = async () => {
  try {
    const payload = { ...newBook, COVER: newBook.COVER || '' };
    if (isEditing.value) await axios.put(`http://localhost:3000/api/sach/${editId.value}`, payload);
    else await axios.post('http://localhost:3000/api/addBook', payload);
    showNotification(isEditing.value ? 'Cập nhật thành công!' : 'Đã thêm sách vào kho!');
    closeModal(); fetchStats(); fetchBooks();
  } catch (e) { showNotification(e.response?.data?.message || 'Lỗi hệ thống!', 'error'); }
};
const handleDeleteBook = async (id, name) => {
  const result = await Swal.fire({ title: 'Xóa sách?', text: `Xác nhận xóa cuốn "${name}"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
  if (result.isConfirmed) { try { await axios.put(`http://localhost:3000/api/xoasach/${id}`); showNotification('Đã xóa sách!'); fetchStats(); fetchBooks(); } catch (e) {} }
};

// 🔥 MỚI: QUẢN LÝ NXB
const openAddNxbModal = () => { isEditingNxb.value = false; Object.assign(newNxb, { TENNXB: '', DIACHI: '' }); showNxbModal.value = true; };
const openEditNxbModal = (nxb) => { isEditingNxb.value = true; editNxbId.value = nxb._id; Object.assign(newNxb, { TENNXB: nxb.TENNXB, DIACHI: nxb.DIACHI }); showNxbModal.value = true; };
const closeNxbModal = () => showNxbModal.value = false;

const handleNxbSubmit = async () => {
  try {
    if (isEditingNxb.value) await axios.put(`http://localhost:3000/api/nxb/${editNxbId.value}`, newNxb);
    else await axios.post('http://localhost:3000/api/addNxb', newNxb);
    showNotification(isEditingNxb.value ? 'Cập nhật NXB thành công!' : 'Đã thêm NXB mới!');
    closeNxbModal(); fetchNxbs();
  } catch (e) { showNotification(e.response?.data?.message || 'Lỗi hệ thống!', 'error'); }
};
const handleDeleteNxb = async (id, name) => {
  const result = await Swal.fire({ title: 'Xóa NXB?', text: `Xác nhận xóa ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
  if (result.isConfirmed) { try { await axios.put(`http://localhost:3000/api/xoanxb/${id}`); showNotification('Đã xóa NXB!'); fetchNxbs(); } catch (e) {} }
};

// 🔥 MỚI: QUẢN LÝ THỂ LOẠI
const openAddCatModal = () => { isEditingCat.value = false; Object.assign(newCat, { TenTheLoai: '' }); showCatModal.value = true; };
const openEditCatModal = (cat) => { isEditingCat.value = true; editCatId.value = cat._id; Object.assign(newCat, { TenTheLoai: cat.TenTheLoai }); showCatModal.value = true; };
const closeCatModal = () => showCatModal.value = false;

const handleCatSubmit = async () => {
  try {
    if (isEditingCat.value) await axios.put(`http://localhost:3000/api/theloai/${editCatId.value}`, newCat);
    else await axios.post('http://localhost:3000/api/addtheloai', newCat);
    showNotification(isEditingCat.value ? 'Cập nhật Thể loại thành công!' : 'Đã thêm Thể loại!');
    closeCatModal(); fetchCats();
  } catch (e) { showNotification(e.response?.data?.message || 'Lỗi hệ thống!', 'error'); }
};
const handleDeleteCat = async (id, name) => {
  const result = await Swal.fire({ title: 'Xóa Thể loại?', text: `Xác nhận xóa ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
  if (result.isConfirmed) { try { await axios.put(`http://localhost:3000/api/xoatheloai/${id}`); showNotification('Đã xóa Thể loại!'); fetchCats(); } catch (e) {} }
};

// ================= QUẢN LÝ ĐƠN MƯỢN VÀ NGƯỜI DÙNG GIỮ NGUYÊN =================
const filteredOrders = computed(() => {
  if (!orderQuery.value) return orderList.value;
  const q = orderQuery.value.toLowerCase();
  return orderList.value.filter(o => o.MaSach?.TENSACH?.toLowerCase().includes(q) || o.MaDocGia?.Ten?.toLowerCase().includes(q));
});

const handleApprove = async (id) => { try { await axios.put(`http://localhost:3000/api/choduyet/${id}`); showNotification('Đã phê duyệt đơn!'); fetchOrders(); fetchStats(); } catch (e) {} };
const handleReject = async (id) => { const r = prompt("Lý do từ chối:"); if (r) { try { await axios.patch(`http://localhost:3000/api/tuchoiduyet/${id}`, { message: r }); showNotification('Đã từ chối!'); fetchOrders(); } catch (e) {} } };
const handleTaken = async (id) => { try { await axios.put(`http://localhost:3000/api/dalaysach/${id}`); showNotification('Đã giao sách!'); fetchOrders(); } catch (e) {} };
const handleReturn = async (id) => { try { await axios.put(`http://localhost:3000/api/dangmuon/${id}`); showNotification('Đã nhận trả!'); fetchOrders(); fetchStats(); } catch (e) {} };

const openAddStaffModal = () => { isEditingStaff.value = false; selectedStaff.value = null; showAddStaffModal.value = true; };
const openEditStaffModal = (staff) => { isEditingStaff.value = true; selectedStaff.value = staff; showAddStaffModal.value = true; };
const filteredReaders = computed(() => { return readerList.value.filter(reader => { if (reader.role == 2 || reader.role == 3) return false; const isAlsoStaff = staffList.value.some(s => s.Username === reader.Username); return !isAlsoStaff; }); });
const handleDeleteReader = async (id, name) => { const result = await Swal.fire({ title: 'Xóa độc giả?', text: `Bạn có chắc muốn xóa tài khoản của ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' }); if (result.isConfirmed) { try { await axios.delete(`http://localhost:3000/api/user/${id}`); showNotification('Đã xóa độc giả!'); fetchReaders(); } catch (e) {} } };
const handleDeleteStaff = async (id, name) => { const result = await Swal.fire({ title: 'Xóa nhân viên?', text: `Bạn có chắc muốn xóa tài khoản của ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' }); if (result.isConfirmed) { try { await axios.delete(`http://localhost:3000/api/staff/${id}`); showNotification('Đã xóa nhân viên!'); fetchStaff(); } catch (e) {} } };

onMounted(() => { fetchStats(); fetchBooks(); fetchStaff(); fetchReaders(); fetchOrders(); fetchNxbs(); fetchCats(); });
</script>