package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.NhanVienDAO;
import com.quanlycuahangthuoc.dao.TaiKhoanDAO;
import com.quanlycuahangthuoc.dto.NhanVienDTO;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;
import com.quanlycuahangthuoc.dto.requests.CreateNhanVienRequest;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NhanVienBUS {

  @Autowired
  private NhanVienDAO nhanVienDAO;

  @Autowired
  private TaiKhoanDAO taiKhoanDAO;

  public ArrayList<NhanVienDTO> getAllNhanVien() {
    return nhanVienDAO.getAllNhanVien();
  }

  /**
   * Tạo nhân viên mới kèm tài khoản
   * Bước 1: Tạo tài khoản với MaTK tự động
   * Bước 2: Tạo nhân viên với MaNV tự động và link với tài khoản vừa tạo
   */
  public boolean createNhanVienWithAccount(CreateNhanVienRequest request) {
    // Validate
    if (
      request.getTenDangNhap() == null || request.getTenDangNhap().isEmpty()
    ) {
      throw new RuntimeException("Tên đăng nhập không được để trống");
    }
    if (request.getMatKhau() == null || request.getMatKhau().isEmpty()) {
      throw new RuntimeException("Mật khẩu không được để trống");
    }
    if (request.getEmail() == null || request.getEmail().isEmpty()) {
      throw new RuntimeException("Email không được để trống");
    }
    if (request.getHoTen() == null || request.getHoTen().isEmpty()) {
      throw new RuntimeException("Họ tên không được để trống");
    }
    if (
      request.getSoDienThoai() == null || request.getSoDienThoai().isEmpty()
    ) {
      throw new RuntimeException("Số điện thoại không được để trống");
    }

    // Kiểm tra tên đăng nhập đã tồn tại chưa
    if (taiKhoanDAO.existUsername(request.getTenDangNhap())) {
      throw new RuntimeException("Tên đăng nhập đã tồn tại");
    }

    // Kiểm tra email đã tồn tại chưa
    if (taiKhoanDAO.existEmail(request.getEmail())) {
      throw new RuntimeException("Email đã tồn tại");
    }

    // Bước 1: Tạo tài khoản
    String maTK = taiKhoanDAO.generateMaTK(); // Tự động tạo mã TK
    TaiKhoanDTO taiKhoan = new TaiKhoanDTO();
    taiKhoan.setMaTaiKhoan(maTK);
    taiKhoan.setTenDangNhap(request.getTenDangNhap());
    taiKhoan.setMatKhau(request.getMatKhau());
    taiKhoan.setEmail(request.getEmail());
    taiKhoan.setLoaiTaiKhoan(
      request.getLoaiTaiKhoan() != null ? request.getLoaiTaiKhoan() : "NhanVien"
    );

    boolean taiKhoanCreated = taiKhoanDAO.insertTaiKhoan(taiKhoan);
    if (!taiKhoanCreated) {
      throw new RuntimeException("Tạo tài khoản thất bại");
    }

    // Bước 2: Tạo nhân viên
    String maNV = nhanVienDAO.generateMaNV(); // Tự động tạo mã NV

    // Tách họ tên thành Họ và Tên
    String hoTen = request.getHoTen().trim();
    String ho = "";
    String ten = "";

    int lastSpace = hoTen.lastIndexOf(" ");
    if (lastSpace > 0) {
      ho = hoTen.substring(0, lastSpace).trim();
      ten = hoTen.substring(lastSpace + 1).trim();
    } else {
      ten = hoTen; // Nếu chỉ có 1 từ thì coi như tên
    }

    NhanVienDTO nhanVien = new NhanVienDTO();
    nhanVien.setMaNhanVien(maNV);
    nhanVien.setMaTaiKhoan(maTK);
    nhanVien.setHo(ho);
    nhanVien.setTen(ten);
    nhanVien.setGioiTinh(
      request.getGioiTinh() != null ? request.getGioiTinh() : ""
    );
    nhanVien.setSDT(request.getSoDienThoai());
    nhanVien.setDiaChi(request.getDiaChi() != null ? request.getDiaChi() : "");

    boolean nhanVienCreated = nhanVienDAO.insertNhanVien(nhanVien);
    if (!nhanVienCreated) {
      // Rollback: xóa tài khoản đã tạo
      taiKhoanDAO.deleteTaiKhoan(maTK);
      throw new RuntimeException("Tạo nhân viên thất bại");
    }

    return true;
  }

  public boolean ThemNhanVien(NhanVienDTO nv) {
    if (
      nv.getMaNhanVien() == null || nv.getMaNhanVien().isEmpty()
    ) return false;
    if (nv.getHo() == null || nv.getHo().isEmpty()) return false;
    if (nv.getTen() == null || nv.getTen().isEmpty()) return false;
    if (nv.getSDT() == null || nv.getSDT().isEmpty()) return false;

    return nhanVienDAO.insertNhanVien(nv);
  }

  public boolean CapNhatNhanVien(NhanVienDTO nv) {
    if (
      nv.getMaNhanVien() == null || nv.getMaNhanVien().isEmpty()
    ) return false;

    return nhanVienDAO.updateNhanVien(nv);
  }

  public boolean XoaNhanVien(String maNhanVien) {
    if (maNhanVien == null || maNhanVien.isEmpty()) return false;

    return nhanVienDAO.deleteNhanVien(maNhanVien);
  }
}
