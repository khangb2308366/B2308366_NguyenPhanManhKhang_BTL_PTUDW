const {
  SACH,
  NXB,
  DOCGIA,
  NHANVIEN,
  MUON,
  LOAI,
} = require("../models/book.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAllBook = async (req, res) => {
  try {
    const books = await SACH.find({ XOA: 0 })
      .populate("THELOAI")
      .populate("MANXB");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookAdmin = async (req, res) => {
  try {
    const books = await SACH.find({}).populate("THELOAI").populate("MANXB");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNxbById = async (req, res) => {
  console.log("Xu li trả về nxb qua mã nxb");
  try {
    const id = req.params.id;
    console.log(id);
    const nxb = await NXB.findById(id);
    console.log(nxb);
    res.status(200).json(nxb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTheLoaiById = async (req, res) => {
  console.log("Xu li trả về the loai qua mã the loai");
  try {
    const id = req.params.id;
    const theLoai = await LOAI.findById(id); 
    res.status(200).json(theLoai);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  console.log("ham dang ki dang chay");

  try {
    let {
      Ho,
      Ten,
      NgaySinh,
      DienThoai,
      Phai,
      DiaChi,
      Username,
      MatKhau,
    } = req.body;

    // ===== 1. TRIM =====
    Username = Username?.trim();
    MatKhau = MatKhau?.trim();
    DienThoai = DienThoai?.trim();

    // ===== 2. VALIDATE =====
    const errors = {};

    if (!Ho) errors.Ho = "Họ không được để trống";
    if (!Ten) errors.Ten = "Tên không được để trống";

    if (!Username) {
      errors.Username = "Username không được để trống";
    }

    if (!MatKhau) {
      errors.MatKhau = "Mật khẩu không được để trống";
    } else if (MatKhau.length < 6) {
      errors.MatKhau = "Mật khẩu phải >= 6 ký tự";
    }

    if (!DienThoai) {
      errors.DienThoai = "SĐT không được để trống";
    } else if (!/^[0-9]{10}$/.test(DienThoai)) {
      errors.DienThoai = "SĐT phải đúng 10 số";
    }

    if (!NgaySinh) {
      errors.NgaySinh = "Vui lòng chọn ngày sinh";
    }

    if (!DiaChi) {
      errors.DiaChi = "Địa chỉ không được để trống";
    }

    // Nếu có lỗi → trả về luôn
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // ===== 3. CHECK TRÙNG USER =====
    const exist = await DOCGIA.findOne({ Username });
    if (exist) {
      return res.status(400).json({
        errors: { Username: "Username đã được sử dụng" },
      });
    }

    // ===== 4. HASH PASSWORD =====
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    // ===== 5. TẠO USER =====
    const user = new DOCGIA({
      Username,
      Ho,
      Ten,
      NgaySinh,
      Phai,
      DiaChi,
      DienThoai,
      MatKhau: hashedPassword,
      XOA: 0,
      SachChuaTra: 0,
      QuaHanTra: 0,
    });

    await user.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        Username: user.Username,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const addBook = async (req, res) => {
  try {
    // ĐÃ SỬA: Thêm MOTA vào đây
    const {
      TENSACH,
      TACGIA,
      SOLUONG,
      TENNXB,
      NAMXUATBAN,
      COVER,
      DONGIA,
      TheLoai,
      MOTA 
    } = req.body;
    
    // 1. Kiểm tra sách đã tồn tại chưa
    const exist = await SACH.findOne({ TENSACH: TENSACH });
    if (exist) return res.status(400).json({ message: "Tên sách này đã tồn tại trong thư viện!" });

    // 2. Kiểm tra Nhà Xuất Bản
    const NXBs = await NXB.findOne({ TENNXB: TENNXB });
    if (!NXBs) {
      return res.status(400).json({ message: `Nhà xuất bản '${TENNXB}' chưa có trong hệ thống!` });
    }
    const so1 = Number(NXBs.SOLUONG + 1);
    await NXB.updateOne({ _id: NXBs._id }, { $set: { SOLUONG: so1 } });
    const MANXB = NXBs._id;

    // 3. Kiểm tra Thể Loại
    const theLoai = await LOAI.findOne({ TenTheLoai: TheLoai });
    if (!theLoai) {
      return res.status(400).json({ message: `Thể loại '${TheLoai}' chưa có trong hệ thống!` });
    }
    const so2 = Number(theLoai.SOLUONG + 1);
    await LOAI.updateOne({ _id: theLoai._id }, { $set: { SOLUONG: so2 } });
    const THELOAI = theLoai._id;

    // 4. Tạo sách mới
    const XOA = 0;
    const LUOTMUON = 0;
    
    // ĐÃ SỬA: Đưa MOTA vào CSDL
    const book = new SACH({
      TENSACH,
      TACGIA,
      DONGIA,
      NAMXUATBAN,
      MANXB,
      SOLUONG,
      COVER,
      THELOAI,
      MOTA, 
      XOA,
      LUOTMUON,
    });
    
    await book.save();

    res.status(201).json({ message: "Thêm sách thành công" });
  } catch (err) {
    console.error("Lỗi thêm sách:", err);
    res.status(500).json({ message: "Lỗi Server: " + err.message });
  }
};

const getAllNXB = async (req, res) => {
  try {
    const nxbs = await NXB.find({ XOA: 0 });
    res.status(200).json(nxbs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllNXBAdmin = async (req, res) => {
  try {
    const nxbs = await NXB.find({});
    res.status(200).json(nxbs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTheLoai = async (req, res) => {
  try {
    const nxbs = await LOAI.find({ XOA: 0 });
    res.status(200).json(nxbs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTheLoaiAdmin = async (req, res) => {
  try {
    const nxbs = await LOAI.find({});
    res.status(200).json(nxbs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  console.log("Xu li trả book qua id");
  try {
    const id = req.params.id;
    // ĐÃ SỬA: Thêm .populate("THELOAI") vào phía sau
    const book = await SACH.findOne({ _id: id }).populate("MANXB").populate("THELOAI");
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addNxb = async (req, res) => {
  try {
    const { TENNXB, DIACHI } = req.body;
    // Kiểm tra nxb đã tồn tại chưa
    const exist = await SACH.findOne({ TENNXB: TENNXB });
    if (exist) return res.status(400).json({ message: "NXB đã tồn tại" });
    const XOA = 0;
    const SOLUONG = 0;
    // Tạo user mới
    const nxb = new NXB({
      TENNXB,
      DIACHI,
      SOLUONG,
      XOA,
    });
    await nxb.save();

    res.status(201).json({
      message: "Thêm nxb thành công",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addTheLoai = async (req, res) => {
  try {
    const { TenTheLoai } = req.body;
    const exist = await LOAI.findOne({ TenTheLoai: TenTheLoai });
    if (exist) return res.status(400).json({ message: "Thể loại đã tồn tại" });
    const XOA = 0;
    const SOLUONG = 0;
    
    const theloaiMoi = new LOAI({ 
      TenTheLoai,
      SOLUONG,
      XOA,
    });
    await theloaiMoi.save();

    res.status(201).json({
      message: "Thể loại đã được thêm",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addStaff = async (req, res) => {
  try {
    const { Username, MatKhau, HoTen, DiaChi, DienThoai } = req.body;
    const exist = await NHANVIEN.findOne({ HoTen: HoTen });
    if (exist) return res.status(400).json({ message: "Nhân viên đã tồn tại" });
    const XOA = 0;
    const ChucVu = 'NhanVien'
    const staff = new NHANVIEN({
      Username,
      MatKhau,
      HoTen,
      DiaChi,
      DienThoai,
      ChucVu,
      XOA
    });
    await staff.save();

    res.status(201).json({
      message: "Nhân viên đã được thêm",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    console.log("ham cap nhat sach");
    const { id } = req.params;
    // ĐÃ SỬA: Lấy thêm MOTA
    const {
      TENSACH,
      DONGIA,
      COVER,
      SOLUONG,
      NAMXUATBAN,
      MANXB,
      TACGIA,
      THELOAI,
      MOTA 
    } = req.body;

    const updatedBook = await SACH.findByIdAndUpdate(
      id,
      {
        TENSACH,
        TACGIA,
        DONGIA,
        NAMXUATBAN,
        MANXB,
        SOLUONG,
        COVER,
        THELOAI,
        MOTA, // ĐÃ SỬA: Cập nhật MOTA
      },
      { new: true } 
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Ho, Ten, NgaySinh, DiaChi, DienThoai, Username, MatKhau, Phai } = req.body;

    const updatedUser = await DOCGIA.findByIdAndUpdate(
      id,
      {
        Ho,
        Ten,
        NgaySinh,
        DiaChi,
        DienThoai,
        Username,
        MatKhau,
        Phai,
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { HoTen,DiaChi, DienThoai, Username, MatKhau } = req.body;

    const updatedUser = await NHANVIEN.findByIdAndUpdate(
      id,
      {
        HoTen,
        DiaChi,
        DienThoai,
        Username,
        MatKhau,
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await SACH.findById(id).populate('MANXB').populate('THELOAI');
    if(book){
      book.MANXB.SOLUONG = book.MANXB.SOLUONG - (1-2*book.XOA) ;
      book.THELOAI.SOLUONG = book.THELOAI.SOLUONG -(1-2*book.XOA);
      book.XOA = 1-book.XOA;
      book.save();
      book.MANXB.save();
      book.THELOAI.save();
    }
    else {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteTheLoai = async (req, res) => {
  try {
    const { id } = req.params;
    const theLoai = await LOAI.findById(id);

    if(theLoai){
      theLoai.XOA = 1- theLoai.XOA;
      theLoai.save();
    }
    else{
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json(theLoai);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteNXB = async (req, res) => {
  try {
    const { id } = req.params;
    const nxb = await NXB.findById(id);
    if(nxb){
      nxb.XOA = 1- nxb.XOA;
      nxb.save();
    }
    else {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json(nxb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateNxb = async (req, res) => {
  try {
    console.log("ham cap nhat nxb");
    const { id } = req.params;
    const { TENNXB, DIACHI } = req.body;
    const updatedNxb = await NXB.findByIdAndUpdate(
      id,
      {
        TENNXB,
        DIACHI,
      },
      { new: true } 
    );

    if (!updatedNxb) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.status(200).json(updatedNxb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const lockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await DOCGIA.findById(id);
    if (user) {
      user.XOA = 1- user.XOA;
      user.save();
      res.status(200).json({message: "Thành công"});
    }

    else{
      res.status(404).json({ message: "Không tìm thấy user" });
    }    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const lockStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await NHANVIEN.findById(id);
    if (user) {
      user.XOA = 1 - user.XOA;
      user.save();
      res.status(200).json({ message: "Thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy user" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const login = async (req, res) => {
  try {
    let { Username, MatKhau } = req.body;

    // ===== 1. TRIM =====
    Username = Username?.trim();
    MatKhau = MatKhau?.trim();

    // ===== 2. VALIDATE =====
    const errors = {};

    if (!Username) {
      errors.Username = "Vui lòng nhập username";
    }

    if (!MatKhau) {
      errors.MatKhau = "Vui lòng nhập mật khẩu";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    let role = 0;
    let HoTen = "";
    let id = "";

    // ===== 3. CHECK NHÂN VIÊN =====
    const staff = await NHANVIEN.findOne({ Username });

    if (staff) {
      const isMatch = await bcrypt.compare(MatKhau, staff.MatKhau);

      if (!isMatch) {
        return res.status(400).json({
          errors: { MatKhau: "Mật khẩu không đúng" },
        });
      }

      role = staff.Username === "admin" ? 3 : 2;
      HoTen = staff.HoTen;
      id = staff._id;
    } else {
      // ===== 4. CHECK ĐỘC GIẢ =====
      const user = await DOCGIA.findOne({ Username, XOA: 0 });

      if (!user) {
        return res.status(400).json({
          errors: { Username: "Tài khoản không tồn tại" },
        });
      }

      const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);

      if (!isMatch) {
        return res.status(400).json({
          errors: { MatKhau: "Mật khẩu không đúng" },
        });
      }

      role = user.role || 1;
      HoTen = user.Ho + " " + user.Ten;
      id = user._id;
    }

    // ===== 5. TẠO TOKEN =====
    const token = jwt.sign(
      { Username, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        HoTen,
        role,
        id,
      },
    });

  } catch (err) {
    console.error("Lỗi server đăng nhập", err);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const addDonMuon = async (req, res) => {
  try {
    const { ngayMuon, NgayTra, MaNv, MaDocGia, MaSach, TrangThai } = req.body;
    const moment = require("moment");

    const NgayMuon = moment(ngayMuon, "DD/MM/YYYY").toDate();

    const exist = await MUON.findOne({
      MaSach: MaSach,
      MaDocGia: MaDocGia,
      TrangThai: TrangThai,
    }).populate("MaDocGia");
    if (exist)
      return res
        .status(400)
        .json({ message: "Đơn trước đó cho sách này đang chờ duyệt" });
    else {
      const docGia = await DOCGIA.findById(MaDocGia);
      if(docGia.XOA == 1){
        return res.status(404).json({
          message: "Tài khoản của bạn hiện đang tạm khóa, vui lòng liên hệ thư viện",
        });
      }
      else if (docGia.QuaHanTra == 1) {
        return res.status(400).json({
          message: "Vui lòng trả sách quá hạn trước khi mượn đơn mới",
        });
      } else if (docGia.SachChuaTra == 5) {
        return res
          .status(400)
          .json({ message: "Bạn chỉ có thể mượn tối đa 5 quyển sách" });
      } else {
        // cập nhật thêm sách chưa trả
        const SachChuaTra = docGia.SachChuaTra + 1;
        await DOCGIA.findByIdAndUpdate(
          MaDocGia,
          {
            SachChuaTra: SachChuaTra,
          },
          { new: true }
        );
      }
    }
    // Tạo user mới
    const XOA = 0;
    const muon = new MUON({
      NgayMuon,
      NgayTra,
      MaNv,
      MaDocGia,
      MaSach,
      TrangThai,
      XOA,
    });
    await muon.save();

    res.status(201).json({
      message: "Thêm don thành công",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMuonById = async (req, res) => {
  try {
    const userId = req.params.id;
    const dons = await MUON.find({ MaDocGia: userId }).populate("MaSach"); 
    console.log(dons);

    res.json(dons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await DOCGIA.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const userId = req.params.id;
    const staff = await NHANVIEN.findById(userId);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const dgia = await DOCGIA.find();
    res.status(200).json(dgia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staff = await NHANVIEN.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMuon = async (req, res) => {
  try {
    console.log("lay tat ca docgia");
    const dgia = await MUON.find().populate("MaSach").populate("MaDocGia");
    res.status(200).json(dgia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChoDuyet = async (req, res) => {
  try {
    console.log("lay tat ca docgia");
    const dgia = await MUON.find({ TrangThai: 0 })
      .populate("MaSach")
      .populate("MaDocGia");
    res.status(200).json(dgia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDangMuon = async (req, res) => {
  try {
    console.log("lay tat ca docgia");
    const dgia = await MUON.find({
      $or: [
        { TrangThai: 2 }, 
        { TrangThai: 1 },
      ],
    })
      .populate("MaSach")
      .populate("MaDocGia");
    res.status(200).json(dgia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getHoanThanh = async (req, res) => {
  try {
    const dgia = await MUON.find({ TrangThai: 4 })
      .populate("MaSach")
      .populate("MaDocGia");
    res.status(200).json(dgia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDuyet = async (req, res) => {
  try {
    const { id } = req.params;
    const donMuon = await MUON.findById(id).populate("MaSach");
    if (donMuon) {
      if (donMuon.MaSach.XOA == 1) {
        return res
          .status(404)
          .json({ message: "Sách này đã bị xóa không thể duyệt" });
      } else if (donMuon.MaSach.SOLUONG == 0) {
        return res.status(404).json({ message: "Sách đã hết không thể duyệt" });
      } else {
        donMuon.TrangThai = 1;
        donMuon.MaSach.SOLUONG = donMuon.MaSach.SOLUONG - 1;
        donMuon.MaSach.LUOTMUON = donMuon.MaSach.LUOTMUON + 1 ;
        await donMuon.save();
        await donMuon.MaSach.save();
        res.status(200).json({ message: "Đã duyệt thành công" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Người dùng đã hủy đơn này trước đó" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateTuChoiDuyet = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("ham tu choi duyet don");
    const { id } = req.params;
    const donMuon = await MUON.findById(id).populate("MaDocGia");
    if (donMuon) {
      donMuon.TrangThai = 3;
      donMuon.MaDocGia.SachChuaTra = donMuon.MaDocGia.SachChuaTra - 1;
      donMuon.message = message;
      await donMuon.save();
      await donMuon.MaDocGia.save();
      res.status(200).json(donMuon);
    } else {
      res.status(404).json({ message: "Người dùng đã xóa đơn yêu cầu" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateDaLaySach = async (req, res) => {
  try {
    const { id } = req.params;
    const donMuon = await MUON.findById(id);
    if (donMuon.TrangThai == 1) {
      donMuon.TrangThai = 2;
      await donMuon.save();
      res.status(200).json({ message: "Cập nhật thành công" });
    } else {
      res.status(404).json({
        message: "Không thành công, trạng thái đã bị thay đổi trước đó",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateDangMuon = async (req, res) => {
  try {
    const { id } = req.params;
    const donMuon = await MUON.findById(id)
      .populate("MaSach")
      .populate("MaDocGia");
    if (donMuon) {
      donMuon.MaSach.SOLUONG = donMuon.MaSach.SOLUONG + 1;
      donMuon.MaDocGia.SachChuaTra = donMuon.MaDocGia.SachChuaTra - 1;
      donMuon.TrangThai = 4;
      donMuon.MaDocGia.save();
      donMuon.MaSach.save();
      donMuon.save();
      res.status(200).json({ message: "Thành công" });
    } else {
      res.status(404).json({ message: "Lỗi" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const xoaDonMuon = async (req, res) => {
  try {
    const donMuon = req.params.id;

    const deletedDon = await MUON.findById(donMuon).populate("MaDocGia");
    if (deletedDon) {
      deletedDon.MaDocGia.SachChuaTra = deletedDon.MaDocGia.SachChuaTra - 1;
      deletedDon.MaDocGia.save();
      await deletedDon.deleteOne();
    } else {
      return res.status(404).json({ message: "Không tìm thấy sách để xóa." });
    }

    return res.status(200).json({ message: "Hủy đơn thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa." });
  }
};

const xoaDonHoanThanh = async (req, res) => {
  try {
    const donMuon = req.params.id;
    const deletedDon = await MUON.findByIdAndDelete(donMuon);
    if (!deletedDon) {
      return res.status(404).json({ message: "Không tìm thấy đơn để xóa." });
    }
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa." });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalBooks = await SACH.countDocuments({ XOA: 0 });
    
    const booksList = await SACH.find({ XOA: 0 }, 'SOLUONG');
    const stockBooks = booksList.reduce((sum, book) => sum + book.SOLUONG, 0);
    
    const outOfStock = await SACH.countDocuments({ XOA: 0, SOLUONG: 0 });

    const pendingRequests = await MUON.countDocuments({ TrangThai: 0 });
    const borrowingRequests = await MUON.countDocuments({
      $or: [{ TrangThai: 2 }, { TrangThai: 1 }]
    });

    const totalUsers = await DOCGIA.countDocuments(); 
    const lockedUsers = await DOCGIA.countDocuments({ XOA: 1 }); 
    const staffCount = await NHANVIEN.countDocuments({ XOA: 0 }); 

    res.status(200).json({
      totalBooks,
      stockBooks,
      outOfStock,
      pendingRequests,
      borrowingRequests,
      totalUsers,
      lockedUsers,
      staffCount
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê admin:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê." });
  }
};

module.exports = {
  getAllBook,
  addBook,
  updateBook,
  getBookById,
  deleteBook,
  getAllBookAdmin,
  getNxbById,
  getAllNXB,
  updateNxb,
  addNxb,
  deleteNXB,
  getAllNXBAdmin,
  getTheLoaiById,
  getAllTheLoai,
  addTheLoai,
  deleteTheLoai,
  getAllTheLoaiAdmin,
  register,
  login,
  addDonMuon,
  getMuonById,
  getAllMuon,
  getAllUser,
  getUserById,
  updateUser,
  lockUser,
  getChoDuyet,
  updateDuyet,
  updateTuChoiDuyet,
  updateDaLaySach,
  getDangMuon,
  updateDangMuon,
  getHoanThanh,
  xoaDonHoanThanh,
  xoaDonMuon,
  getAllStaff,
  addStaff,
  getStaffById,
  lockStaff,
  updateStaff,
  getAdminStats,
};