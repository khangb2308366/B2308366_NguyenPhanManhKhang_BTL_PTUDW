import Swal from 'sweetalert2';

export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

export const alertSuccess = (title) => {
  Swal.fire({
    icon: 'success',
    title: title,
    showConfirmButton: false,
    timer: 1500,
    borderRadius: '15px'
  });
};

export const alertError = (text) => {
  Swal.fire({
    icon: 'error',
    title: 'Lỗi rồi!',
    text: text,
    confirmButtonColor: '#ef4444'
  });
};