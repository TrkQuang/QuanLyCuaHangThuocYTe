package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dao.TaiKhoanDAO;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaiKhoanBUS {

  @Autowired
  private TaiKhoanDAO taiKhoanDAO;

  @Autowired
  private HoaDonDAO hoaDonDAO;

  @Autowired
  private PhieuNhapDAO phieuNhapDAO;

  // ================== KHÁCH ĐĂNG KÝ ==================
  public boolean dangKyKhach(TaiKhoanDTO tk) {
    if (tk == null) {
      throw new IllegalArgumentException("Thông tin tài khoản không được null");
    }

    // Validate username
    if (tk.getTenDangNhap() == null || tk.getTenDangNhap().trim().isEmpty()) {
      throw new RuntimeException("Tên đăng nhập không được để trống");
    }
    if (tk.getTenDangNhap().length() < 3 || tk.getTenDangNhap().length() > 50) {
      throw new RuntimeException("Tên đăng nhập phải từ 3-50 ký tự");
    }
    if (!tk.getTenDangNhap().matches("^[a-zA-Z0-9_]+$")) {
      throw new RuntimeException("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới");
    }

    // Validate password
    if (tk.getMatKhau() == null || tk.getMatKhau().trim().isEmpty()) {
      throw new RuntimeException("Mật khẩu không được để trống");
    }
    if (tk.getMatKhau().length() < 6) {
      throw new RuntimeException("Mật khẩu phải có ít nhất 6 ký tự");
    }
    if (tk.getMatKhau().length() > 100) {
      throw new RuntimeException("Mật khẩu không được quá 100 ký tự");
    }

    // Validate email
    if (tk.getEmail() == null || tk.getEmail().trim().isEmpty()) {
      throw new RuntimeException("Email không được để trống");
    }
    if (!tk.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
      throw new RuntimeException("Email không hợp lệ");
    }

    if (
      taiKhoanDAO.existUsername(tk.getTenDangNhap())
    ) throw new RuntimeException("Tên đăng nhập đã tồn tại");

    if (taiKhoanDAO.existEmail(tk.getEmail())) throw new RuntimeException(
      "Email đã tồn tại"
    );

    // Generate mã tài khoản nếu chưa có
    if (tk.getMaTaiKhoan() == null || tk.getMaTaiKhoan().isEmpty()) {
      tk.setMaTaiKhoan("TK" + System.currentTimeMillis());
    }

    tk.setLoaiTaiKhoan("Khach"); // Mặc định khách (capitalize đầu)
    return taiKhoanDAO.insertTaiKhoan(tk);
  }

  // ================== ADMIN TẠO NHÂN VIÊN ==================
  public boolean taoNhanVien(TaiKhoanDTO tk) {
    if (
      tk.getTenDangNhap().isEmpty() ||
      tk.getMatKhau().isEmpty() ||
      tk.getEmail().isEmpty()
    ) throw new RuntimeException("Thiếu thông tin");

    if (
      taiKhoanDAO.existUsername(tk.getTenDangNhap())
    ) throw new RuntimeException("Tên đăng nhập đã tồn tại");

    if (taiKhoanDAO.existEmail(tk.getEmail())) throw new RuntimeException(
      "Email đã tồn tại"
    );

    if (
      !tk.getLoaiTaiKhoan().equals("NhanVien") &&
      !tk.getLoaiTaiKhoan().equals("Admin")
    ) throw new RuntimeException("Loại tài khoản không hợp lệ");

    return taiKhoanDAO.insertTaiKhoan(tk);
  }

  // ================== ĐĂNG NHẬP ==================
  public TaiKhoanDTO dangNhap(String username, String password) {
    TaiKhoanDTO tk = taiKhoanDAO.getByUsername(username);
    if (
      tk == null || !tk.getMatKhau().equals(password)
    ) throw new RuntimeException("Sai tài khoản hoặc mật khẩu");

    return tk;
  }

  public TaiKhoanDTO dangNhapWebKhach(String username, String password) {
    TaiKhoanDTO tk = dangNhap(username, password);
    if (!tk.getLoaiTaiKhoan().equals("Khach")) throw new RuntimeException(
      "Không có quyền truy cập web khách"
    );
    return tk;
  }

  public TaiKhoanDTO dangNhapWebNhanVien(String username, String password) {
    TaiKhoanDTO tk = dangNhap(username, password);
    if (
      !tk.getLoaiTaiKhoan().equals("NhanVien") &&
      !tk.getLoaiTaiKhoan().equals("Admin")
    ) throw new RuntimeException("Không có quyền truy cập web nhân viên");
    return tk;
  }

  // ================== XOÁ / KHOÁ ==================
  public boolean xoaTaiKhoan(String maTK) {
    if (
      hoaDonDAO.countByNhanVien(maTK) > 0 ||
      phieuNhapDAO.countByNhanVien(maTK) > 0
    ) throw new RuntimeException(
      "Tài khoản đã phát sinh giao dịch, không được xoá"
    );

    return taiKhoanDAO.deleteTaiKhoan(maTK);
  }

  public ArrayList<TaiKhoanDTO> getAllTaiKhoan() {
    return taiKhoanDAO.getAllTaiKhoan();
  }
}
