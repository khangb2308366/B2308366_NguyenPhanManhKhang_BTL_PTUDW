const mongoose = require("mongoose");

//Sách
const bookSchema = new mongoose.Schema(
  {
    TENSACH: { type: String, required: true },
    TACGIA: { type: String },
    DONGIA: { type: Number },
    NAMXUATBAN: { type: Number },
    MANXB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhaXuatBan",
      required: true,
    },
    SOLUONG: { type: Number, required: true },
    COVER: { type: String },
    
    // BỔ SUNG: Thêm trường Mô tả sách
    MOTA: { type: String }, 
    
    THELOAI: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TheLoai",
      required: true,
    },
    XOA: { type: Number },
    LUOTMUON: {type: Number}
  },
  { collection: "Sach" }
);

const SACH = mongoose.model("Sach", bookSchema);

//Nhà Xuất Bản
const nxbSchema = new mongoose.Schema(
  {
    TENNXB: { type: String, required: true },
    DIACHI: { type: String },
    XOA: { type: Number },
    SOLUONG: { type: Number },
  },
  { collection: "NhaXuatBan" }
);

const NXB = mongoose.model("NhaXuatBan", nxbSchema);

//Độc giả
const docGiaSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true, unique: true },
    Ho: { type: String },
    Ten: { type: String },
    NgaySinh: { type: Date },
    Phai: { type: String },
    DiaChi: { type: String },
    DienThoai: { type: String },
    MatKhau: { type: String },
    XOA: { type: Number },
    SachChuaTra: { type: Number },
    QuaHanTra: { type: Number },
    role: { type: Number, default: 1 },
  },
  { collection: "DocGia" }
);
const DOCGIA = mongoose.model("DocGia", docGiaSchema);

const theLoaiSchema = new mongoose.Schema(
  {
    TenTheLoai: { type: String, required: true, unique: true },
    SOLUONG: { type: Number },
    XOA: { type: Number },
  },
  { collection: "TheLoai" }
);

const LOAI = mongoose.model("TheLoai", theLoaiSchema);

//Nhân Viên
const nhanVienSchema = new mongoose.Schema(
  {
    HoTen: { type: String },
    Username: { type: String, unique: true },
    DiaChi: { type: String },
    DienThoai: { type: String },
    MatKhau: { type: String },
    ChucVu: { type: String },
    XOA: { type: String },
  },
  { collection: "NhanVien" }
);

const NHANVIEN = mongoose.model("NhanVien", nhanVienSchema);

//Theo Dõi Mượn Sách
const muonSchema = new mongoose.Schema(
  {
    MaDocGia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocGia",
      required: true,
    },
    MaSach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sach",
      required: true,
    },
    NgayMuon: { type: Date, required: true },
    NgayTra: { type: Date, required: true },
    TrangThai: { type: Number, required: true }, // 0: chờ duyệt , 1: Duyệt nhưng chưa đến nhận sách, 2: Đã đến nhận sách (đang mượn) 3: Bị từ chối, 4: Đã hoàn thành đơn mượn
    XOA: { type: Number },
    message: {type: String}
  },
  { collection: "TheoDoiMuonSach" }
);

const MUON = mongoose.model("Muon", muonSchema);

module.exports = { SACH, NXB, DOCGIA, NHANVIEN, MUON, LOAI };