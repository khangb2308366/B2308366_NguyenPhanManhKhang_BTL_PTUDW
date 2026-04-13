const express = require("express");
const router = express.Router();

const {
  // xử lý sách
  getAllBook,
  addBook,
  updateBook,
  getBookById,
  deleteBook,
  getAllBookAdmin,

  //xử lí Nhà xuất bản
  getNxbById,
  getAllNXB,
  updateNxb,
  addNxb,
  getAllNXBAdmin,

  // Xử lí thể loại
  getTheLoaiById,
  getAllTheLoai,
  addTheLoai,

  //xử lí đăng kí, đăng nhập
  register,
  login,

  // xử lí đơn mượn
  addDonMuon,
  getMuonById,
  getAllMuon,

  getAllUser,
  updateUser,

  //xử lí sách chưa duyệt
  getChoDuyet,
  updateDuyet,
  updateTuChoiDuyet,

  // xử lí sách đang mượn
  getDangMuon,
  updateDangMuon,

  // XỬ đơn đã hoàn thành
  getHoanThanh,

  //
  xoaDonMuon,
  deleteNXB,
  deleteTheLoai,
  getAllTheLoaiAdmin,
  updateDaLaySach,
  xoaDonHoanThanh,
  getUserById,
  lockUser,
  getAllStaff,
  addStaff,
  getStaffById,
  lockStaff,
  updateStaff,

  // 👇 1. KHAI BÁO HÀM VỪA THÊM Ở ĐÂY
  getAdminStats,
} = require("../controllers/controller");

// POST: /api/books
router.get("/api/sach", getAllBook);
router.post("/api/addBook", addBook);
router.get("/api/sach/:id", getBookById);
router.put("/api/sach/:id", updateBook);
router.get("/api/sachadmin", getAllBookAdmin);
router.put("/api/xoasach/:id", deleteBook);

router.get("/api/nxb/:id", getNxbById);
router.get("/api/nxb", getAllNXB);
router.get("/api/nxbadmin", getAllNXBAdmin);
router.post("/api/addNxb", addNxb);
router.put("/api/nxb/:id", updateNxb);
router.put("/api/xoanxb/:id", deleteNXB);

router.post("/api/register", register);
router.post("/api/login", login);
router.get("/api/user", getAllUser);
router.get("/api/user/:id", getUserById);
router.put("/api/user/:id", updateUser);
router.patch("/api/lockuser/:id", lockUser);

router.get("/api/theloai", getAllTheLoai);
router.post("/api/addtheloai", addTheLoai);
router.get("/api/theloaiadmin", getAllTheLoaiAdmin);
router.put("/api/xoatheloai/:id", deleteTheLoai);

router.post("/api/muon", addDonMuon);
router.get("/api/muon/:id", getMuonById);
router.get("/api/muon", getAllMuon);
router.get("/api/choduyet", getChoDuyet);
router.get("/api/dangmuon", getDangMuon);
router.get("/api/hoanthanh", getHoanThanh);
router.put("/api/choduyet/:id", updateDuyet);
router.patch("/api/tuchoiduyet/:id", updateTuChoiDuyet);
router.put("/api/dangmuon/:id", updateDangMuon);
router.delete("/api/xoadon/:id", xoaDonMuon);
router.put("/api/dalaysach/:id", updateDaLaySach);
router.delete("/api/xoadonhoanthanh/:id", xoaDonHoanThanh);

router.get("/api/staff", getAllStaff);
router.post("/api/addstaff", addStaff);
router.get("/api/staff/:id", getStaffById);
router.patch("/api/lockstaff/:id", lockStaff);
router.put("/api/updatestaff/:id", updateStaff);
router.get("/api/admin/stats", getAdminStats);
module.exports = router;