import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Lấy dữ liệu giỏ hàng từ trình duyệt (nếu có), nếu không thì tạo mảng rỗng
  const items = ref(JSON.parse(localStorage.getItem('cart_items')) || []);

  // Đếm số lượng sách trong giỏ
  const totalItems = computed(() => items.value.length);

  // Hàm thêm sách vào giỏ
  const addBook = (book) => {
    // 1. Kiểm tra xem sách đã có trong giỏ chưa
    const exists = items.value.find(item => item._id === book._id);
    if (exists) {
      return { success: false, message: 'Cuốn sách này đã nằm trong giỏ của bạn rồi!' };
    }
    
    // 2. Giới hạn chỉ cho mượn tối đa 5 cuốn (như quy định Backend của bạn)
    if (items.value.length >= 5) {
      return { success: false, message: 'Bạn chỉ được mượn tối đa 5 cuốn sách cùng lúc!' };
    }

    // 3. Thêm vào mảng và lưu lại
    items.value.push(book);
    localStorage.setItem('cart_items', JSON.stringify(items.value));
    return { success: true, message: 'Đã thêm sách vào giỏ thành công!' };
  };

  // Hàm xóa sách khỏi giỏ
  const removeBook = (bookId) => {
    items.value = items.value.filter(item => item._id !== bookId);
    localStorage.setItem('cart_items', JSON.stringify(items.value));
  };

  // Hàm xóa sạch giỏ hàng (dùng sau khi gửi đơn thành công)
  const clearCart = () => {
    items.value = [];
    localStorage.removeItem('cart_items');
  };

  return { items, totalItems, addBook, removeBook, clearCart };
});