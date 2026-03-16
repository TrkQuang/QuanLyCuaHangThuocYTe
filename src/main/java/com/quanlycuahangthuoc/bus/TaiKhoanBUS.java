package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dao.KhachHangDAO;
import com.quanlycuahangthuoc.dao.LichLamDAO;
import com.quanlycuahangthuoc.dao.NhanVienDAO;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dao.TaiKhoanDAO;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import com.quanlycuahangthuoc.dto.NhanVienDTO;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;
import com.quanlycuahangthuoc.dto.requests.CreateKhachHangRequest;
import com.quanlycuahangthuoc.exception.AuthenticationException;
import com.quanlycuahangthuoc.exception.ValidationException;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaiKhoanBUS {

  private boolean hasRole(TaiKhoanDTO tk, String... allowedRoles) {
    if (tk == null || tk.getLoaiTaiKhoan() == null) {
      return false;
    }
    String actualRole = tk.getLoaiTaiKhoan().trim();
    for (String role : allowedRoles) {
      if (role.equalsIgnoreCase(actualRole)) {
        return true;
      }
    }
    return false;
  }

  @Autowired
  private TaiKhoanDAO taiKhoanDAO;

  @Autowired
  private HoaDonDAO hoaDonDAO;

  @Autowired
  private KhachHangDAO khachHangDAO;

  @Autowired
  private NhanVienDAO nhanVienDAO;

  @Autowired
  private LichLamDAO lichLamDAO;

  @Autowired
  private PhieuNhapDAO phieuNhapDAO;

  private String normalizeGender(String rawGender) {
    String gender = String.valueOf(rawGender == null ? "" : rawGender).trim();
    if (gender.equalsIgnoreCase("Nam")) return "Nam";
    if (gender.equalsIgnoreCase("Nu") || gender.equalsIgnoreCase("Nữ")) {
      return "Nu";
    }
    if (gender.equalsIgnoreCase("Khac") || gender.equalsIgnoreCase("Khác")) {
      return "Khac";
    }
    throw new ValidationException("Giới tính phải là Nam, Nu hoặc Khac");
  }

  private void validateDateString(String date, String fieldName) {
    try {
      java.time.LocalDate parsed = java.time.LocalDate.parse(date);
      if (parsed.isAfter(java.time.LocalDate.now())) {
        throw new ValidationException(
          fieldName + " không được lớn hơn ngày hiện tại"
        );
      }
      if (parsed.isBefore(java.time.LocalDate.of(1900, 1, 1))) {
        throw new ValidationException(fieldName + " không hợp lệ");
      }
    } catch (java.time.format.DateTimeParseException e) {
      throw new ValidationException(
        fieldName + " phải đúng định dạng yyyy-MM-dd"
      );
    }
  }

  public boolean dangKyKhachDayDu(CreateKhachHangRequest request) {
    if (request == null) {
      throw new ValidationException("Thông tin đăng ký không được để trống");
    }

    String tenDangNhap = String.valueOf(
      request.getTenDangNhap() == null ? "" : request.getTenDangNhap()
    ).trim();
    String matKhau = String.valueOf(
      request.getMatKhau() == null ? "" : request.getMatKhau()
    ).trim();
    String email = String.valueOf(
      request.getEmail() == null ? "" : request.getEmail()
    ).trim();
    String hoTen = String.valueOf(
      request.getHoTen() == null ? "" : request.getHoTen()
    ).trim();
    String soDienThoai = String.valueOf(
      request.getSoDienThoai() == null ? "" : request.getSoDienThoai()
    ).trim();
    String diaChi = String.valueOf(
      request.getDiaChi() == null ? "" : request.getDiaChi()
    ).trim();
    String ngaySinh = String.valueOf(
      request.getNgaySinh() == null ? "" : request.getNgaySinh()
    ).trim();
    String tienSuBenhLy = String.valueOf(
      request.getTienSuBenhLy() == null ? "" : request.getTienSuBenhLy()
    ).trim();
    String gioiTinh = normalizeGender(request.getGioiTinh());

    if (tenDangNhap.isBlank()) {
      throw new ValidationException("Tên đăng nhập không được để trống");
    }
    if (tenDangNhap.length() < 3 || tenDangNhap.length() > 50) {
      throw new ValidationException("Tên đăng nhập phải từ 3-50 ký tự");
    }
    if (!tenDangNhap.matches("^[a-zA-Z0-9_]+$")) {
      throw new ValidationException(
        "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
      );
    }

    if (matKhau.isBlank()) {
      throw new ValidationException("Mật khẩu không được để trống");
    }
    if (matKhau.length() < 6 || matKhau.length() > 100) {
      throw new ValidationException("Mật khẩu phải từ 6-100 ký tự");
    }

    if (email.isBlank()) {
      throw new ValidationException("Email không được để trống");
    }
    if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
      throw new ValidationException("Email không hợp lệ");
    }

    if (hoTen.isBlank()) {
      throw new ValidationException("Họ tên không được để trống");
    }
    if (soDienThoai.isBlank()) {
      throw new ValidationException("Số điện thoại không được để trống");
    }
    if (!soDienThoai.matches("^[0-9]{10,15}$")) {
      throw new ValidationException("Số điện thoại phải gồm 10-15 chữ số");
    }
    if (diaChi.isBlank()) {
      throw new ValidationException("Địa chỉ không được để trống");
    }
    if (ngaySinh.isBlank()) {
      throw new ValidationException("Ngày sinh không được để trống");
    }
    validateDateString(ngaySinh, "Ngày sinh");
    if (tienSuBenhLy.isBlank()) {
      throw new ValidationException("Tiền sử bệnh lý không được để trống");
    }

    if (taiKhoanDAO.existUsername(tenDangNhap)) {
      throw new ValidationException("Tên đăng nhập đã tồn tại");
    }
    if (taiKhoanDAO.existEmail(email)) {
      throw new ValidationException("Email đã tồn tại");
    }
    if (khachHangDAO.getBySDT(soDienThoai) != null) {
      throw new ValidationException("Số điện thoại đã tồn tại");
    }

    String maTK = taiKhoanDAO.generateMaTK();
    TaiKhoanDTO tk = new TaiKhoanDTO();
    tk.setMaTaiKhoan(maTK);
    tk.setTenDangNhap(tenDangNhap);
    tk.setMatKhau(matKhau);
    tk.setEmail(email);
    tk.setLoaiTaiKhoan("KHACHHANG");

    if (!taiKhoanDAO.insertTaiKhoan(tk)) {
      throw new ValidationException("Không thể tạo tài khoản");
    }

    try {
      String maKH = khachHangDAO.generateMaKH();
      String ho = "";
      String ten = hoTen;
      int lastSpace = hoTen.lastIndexOf(' ');
      if (lastSpace > 0) {
        ho = hoTen.substring(0, lastSpace).trim();
        ten = hoTen.substring(lastSpace + 1).trim();
      }

      KhachHangDTO kh = new KhachHangDTO();
      kh.setMaKhachHang(maKH);
      kh.setMaTaiKhoan(maTK);
      kh.setHo(ho);
      kh.setTen(ten);
      kh.setNgaySinh(ngaySinh);
      kh.setGioiTinh(gioiTinh);
      kh.setSDT(soDienThoai);
      kh.setDiaChi(diaChi);
      kh.setTienSuBenhLy(tienSuBenhLy);

      if (!khachHangDAO.insertKhachHang(kh)) {
        throw new ValidationException("Không thể tạo hồ sơ khách hàng");
      }

      return true;
    } catch (Exception e) {
      taiKhoanDAO.deleteTaiKhoan(maTK);
      throw e;
    }
  }

  // ================== KHÁCH ĐĂNG KÝ ==================
  public boolean dangKyKhach(TaiKhoanDTO tk) {
    if (tk == null) {
      throw new ValidationException("Thông tin tài khoản không được null");
    }

    // Validate username
    if (tk.getTenDangNhap() == null || tk.getTenDangNhap().trim().isEmpty()) {
      throw new ValidationException("Tên đăng nhập không được để trống");
    }
    if (tk.getTenDangNhap().length() < 3 || tk.getTenDangNhap().length() > 50) {
      throw new ValidationException("Tên đăng nhập phải từ 3-50 ký tự");
    }
    if (!tk.getTenDangNhap().matches("^[a-zA-Z0-9_]+$")) {
      throw new ValidationException(
        "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
      );
    }

    // Validate password
    if (tk.getMatKhau() == null || tk.getMatKhau().trim().isEmpty()) {
      throw new ValidationException("Mật khẩu không được để trống");
    }
    if (tk.getMatKhau().length() < 6) {
      throw new ValidationException("Mật khẩu phải có ít nhất 6 ký tự");
    }
    if (tk.getMatKhau().length() > 100) {
      throw new ValidationException("Mật khẩu không được quá 100 ký tự");
    }

    // Validate email
    if (tk.getEmail() == null || tk.getEmail().trim().isEmpty()) {
      throw new ValidationException("Email không được để trống");
    }
    if (
      !tk.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
    ) {
      throw new ValidationException("Email không hợp lệ");
    }

    if (
      taiKhoanDAO.existUsername(tk.getTenDangNhap())
    ) throw new ValidationException("Tên đăng nhập đã tồn tại");

    if (taiKhoanDAO.existEmail(tk.getEmail())) throw new ValidationException(
      "Email đã tồn tại"
    );

    // Generate mã tài khoản nếu chưa có
    if (tk.getMaTaiKhoan() == null || tk.getMaTaiKhoan().isEmpty()) {
      tk.setMaTaiKhoan("TK" + System.currentTimeMillis());
    }

    tk.setLoaiTaiKhoan("KHACHHANG");

    boolean created = taiKhoanDAO.insertTaiKhoan(tk);
    if (!created) {
      return false;
    }

    KhachHangDTO kh = new KhachHangDTO();
    kh.setMaKhachHang(khachHangDAO.generateMaKH());
    kh.setMaTaiKhoan(tk.getMaTaiKhoan());
    kh.setHo("");
    kh.setTen(tk.getTenDangNhap());
    kh.setNgaySinh(null);
    kh.setGioiTinh("");
    kh.setSDT("");
    kh.setDiaChi("");
    kh.setTienSuBenhLy("");

    boolean createdKh = khachHangDAO.insertKhachHang(kh);
    if (!createdKh) {
      taiKhoanDAO.deleteTaiKhoan(tk.getMaTaiKhoan());
      throw new ValidationException("Không thể tạo hồ sơ khách hàng");
    }

    return true;
  }

  // ================== ADMIN TẠO NHÂN VIÊN ==================
  public boolean taoNhanVien(TaiKhoanDTO tk) {
    if (tk == null) {
      throw new ValidationException("Thông tin tài khoản không được null");
    }
    if (
      tk.getTenDangNhap().isEmpty() ||
      tk.getMatKhau().isEmpty() ||
      tk.getEmail().isEmpty()
    ) throw new ValidationException("Thiếu thông tin");

    if (
      taiKhoanDAO.existUsername(tk.getTenDangNhap())
    ) throw new ValidationException("Tên đăng nhập đã tồn tại");

    if (taiKhoanDAO.existEmail(tk.getEmail())) throw new ValidationException(
      "Email đã tồn tại"
    );

    if (!hasRole(tk, "NHANVIEN", "ADMIN", "NhanVien", "Admin")) {
      throw new ValidationException("Loại tài khoản không hợp lệ");
    }

    if (tk.getMaTaiKhoan() == null || tk.getMaTaiKhoan().isBlank()) {
      tk.setMaTaiKhoan(taiKhoanDAO.generateMaTK());
    }

    return taiKhoanDAO.insertTaiKhoan(tk);
  }

  // ================== ĐĂNG NHẬP ==================
  public TaiKhoanDTO dangNhap(String username, String password) {
    if (
      username == null ||
      username.isBlank() ||
      password == null ||
      password.isBlank()
    ) {
      throw new ValidationException(
        "Tên đăng nhập và mật khẩu không được để trống"
      );
    }
    TaiKhoanDTO tk = taiKhoanDAO.getByUsername(username);
    if (tk != null && "BANNED".equalsIgnoreCase(tk.getLoaiTaiKhoan())) {
      throw new AuthenticationException("Tài khoản đã bị vô hiệu hóa");
    }
    if (
      tk == null || !tk.getMatKhau().equals(password)
    ) throw new AuthenticationException("Sai tài khoản hoặc mật khẩu");

    return tk;
  }

  public TaiKhoanDTO dangNhapWebKhach(String username, String password) {
    TaiKhoanDTO tk = dangNhap(username, password);
    if (!hasRole(tk, "KHACHHANG", "KhachHang")) {
      throw new AuthenticationException("Không có quyền truy cập web khách");
    }
    return tk;
  }

  public TaiKhoanDTO dangNhapWebNhanVien(String username, String password) {
    TaiKhoanDTO tk = dangNhap(username, password);
    if (!hasRole(tk, "NHANVIEN", "ADMIN", "NhanVien", "Admin")) {
      throw new AuthenticationException(
        "Không có quyền truy cập web nhân viên"
      );
    }
    return tk;
  }

  // ================== XOÁ / KHOÁ ==================
  public boolean xoaTaiKhoan(String maTK) {
    if (maTK == null || maTK.isBlank()) {
      throw new ValidationException("Mã tài khoản không hợp lệ");
    }

    TaiKhoanDTO tk = taiKhoanDAO.getById(maTK);
    if (tk == null) {
      throw new ValidationException("Không tìm thấy tài khoản");
    }

    NhanVienDTO nv = nhanVienDAO.getByMaTaiKhoan(maTK);
    if (nv != null) {
      String maNV = nv.getMaNhanVien();
      if (
        hoaDonDAO.countByNhanVien(maNV) > 0 ||
        phieuNhapDAO.countByNhanVien(maNV) > 0
      ) {
        throw new ValidationException(
          "Tài khoản nhân viên đã phát sinh giao dịch, không được xoá"
        );
      }
      if (lichLamDAO.countByNhanVien(maNV) > 0) {
        throw new ValidationException(
          "Tài khoản nhân viên đã có lịch làm, không được xoá"
        );
      }
      if (!nhanVienDAO.deleteNhanVien(maNV)) {
        throw new ValidationException("Không thể xoá hồ sơ nhân viên");
      }
    }

    var kh = khachHangDAO.getByMaTK(maTK);
    if (kh != null) {
      if (hoaDonDAO.countByKhachHang(kh.getMaKhachHang()) > 0) {
        throw new ValidationException(
          "Tài khoản khách hàng đã phát sinh hóa đơn, không được xoá"
        );
      }
      if (!khachHangDAO.deleteKhachHang(kh.getMaKhachHang())) {
        throw new ValidationException("Không thể xoá hồ sơ khách hàng");
      }
    }

    return taiKhoanDAO.deleteTaiKhoan(maTK);
  }

  public boolean resetMatKhauMacDinh(String maTK) {
    if (maTK == null || maTK.isBlank()) {
      throw new ValidationException("Mã tài khoản không hợp lệ");
    }
    TaiKhoanDTO tk = taiKhoanDAO.getById(maTK);
    if (tk == null) {
      throw new ValidationException("Không tìm thấy tài khoản");
    }
    return taiKhoanDAO.updateMatKhau(maTK, "123456");
  }

  public boolean voHieuHoaTaiKhoan(String maTK) {
    if (maTK == null || maTK.isBlank()) {
      throw new ValidationException("Mã tài khoản không hợp lệ");
    }
    TaiKhoanDTO tk = taiKhoanDAO.getById(maTK);
    if (tk == null) {
      throw new ValidationException("Không tìm thấy tài khoản");
    }
    if ("BANNED".equalsIgnoreCase(tk.getLoaiTaiKhoan())) {
      return true;
    }
    return taiKhoanDAO.updateLoaiTaiKhoan(maTK, "BANNED");
  }

  public boolean goBoVoHieuHoaTaiKhoan(String maTK, String roleSauMoKhoa) {
    if (maTK == null || maTK.isBlank()) {
      throw new ValidationException("Mã tài khoản không hợp lệ");
    }
    TaiKhoanDTO tk = taiKhoanDAO.getById(maTK);
    if (tk == null) {
      throw new ValidationException("Không tìm thấy tài khoản");
    }

    if (!"BANNED".equalsIgnoreCase(tk.getLoaiTaiKhoan())) {
      throw new ValidationException("Tài khoản này chưa bị vô hiệu hóa");
    }

    String role = String.valueOf(roleSauMoKhoa == null ? "" : roleSauMoKhoa)
      .trim()
      .toUpperCase();
    if (
      !"ADMIN".equals(role) &&
      !"NHANVIEN".equals(role) &&
      !"KHACHHANG".equals(role)
    ) {
      throw new ValidationException(
        "Vai trò sau khi gỡ cấm phải là ADMIN, NHANVIEN hoặc KHACHHANG"
      );
    }

    return taiKhoanDAO.updateLoaiTaiKhoan(maTK, role);
  }

  public TaiKhoanDTO withoutPassword(TaiKhoanDTO tk) {
    if (tk == null) {
      return null;
    }
    TaiKhoanDTO safe = new TaiKhoanDTO(tk);
    safe.setMatKhau(null);
    return safe;
  }

  public KhachHangDTO getKhachHangByMaTK(String maTK) {
    return khachHangDAO.getByMaTK(maTK);
  }

  public ArrayList<TaiKhoanDTO> getAllTaiKhoan() {
    return taiKhoanDAO.getAllTaiKhoan();
  }
}
