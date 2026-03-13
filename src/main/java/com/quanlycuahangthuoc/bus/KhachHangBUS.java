package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dao.KhachHangDAO;
import com.quanlycuahangthuoc.dao.TaiKhoanDAO;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;
import com.quanlycuahangthuoc.dto.requests.CreateKhachHangRequest;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KhachHangBUS {

  @Autowired
  private KhachHangDAO khachHangDAO;

  @Autowired
  private HoaDonDAO hoaDonDAO;

  @Autowired
  private TaiKhoanDAO taiKhoanDAO;

  public ArrayList<KhachHangDTO> getAllKhachHang() {
    return khachHangDAO.getAllKhachHang();
  }

  public boolean themKhachHang(KhachHangDTO kh) {
    if (
      kh.getHo().isEmpty() || kh.getTen().isEmpty() || kh.getSDT().isEmpty()
    ) throw new RuntimeException("Thiếu thông tin khách hàng");

    // Có thể mở rộng: kiểm tra trùng SDT
    return khachHangDAO.insertKhachHang(kh);
  }

  public boolean createKhachHangWithAccount(CreateKhachHangRequest request) {
    if (
      request.getTenDangNhap() == null || request.getTenDangNhap().isBlank()
    ) {
      throw new RuntimeException("Tên đăng nhập không được để trống");
    }
    if (request.getMatKhau() == null || request.getMatKhau().isBlank()) {
      throw new RuntimeException("Mật khẩu không được để trống");
    }
    if (request.getEmail() == null || request.getEmail().isBlank()) {
      throw new RuntimeException("Email không được để trống");
    }
    if (request.getHoTen() == null || request.getHoTen().isBlank()) {
      throw new RuntimeException("Họ tên không được để trống");
    }
    if (
      request.getSoDienThoai() == null || request.getSoDienThoai().isBlank()
    ) {
      throw new RuntimeException("Số điện thoại không được để trống");
    }

    if (taiKhoanDAO.existUsername(request.getTenDangNhap())) {
      throw new RuntimeException("Tên đăng nhập đã tồn tại");
    }
    if (taiKhoanDAO.existEmail(request.getEmail())) {
      throw new RuntimeException("Email đã tồn tại");
    }

    String maTK = taiKhoanDAO.generateMaTK();
    TaiKhoanDTO tk = new TaiKhoanDTO();
    tk.setMaTaiKhoan(maTK);
    tk.setTenDangNhap(request.getTenDangNhap());
    tk.setMatKhau(request.getMatKhau());
    tk.setEmail(request.getEmail());
    tk.setLoaiTaiKhoan(
      request.getLoaiTaiKhoan() == null || request.getLoaiTaiKhoan().isBlank()
        ? "KHACHHANG"
        : request.getLoaiTaiKhoan()
    );

    if (!taiKhoanDAO.insertTaiKhoan(tk)) {
      throw new RuntimeException("Tạo tài khoản khách hàng thất bại");
    }

    try {
      String maKH = khachHangDAO.generateMaKH();
      String hoTen = request.getHoTen().trim();
      String ho = "";
      String ten = "";
      int lastSpace = hoTen.lastIndexOf(" ");
      if (lastSpace > 0) {
        ho = hoTen.substring(0, lastSpace).trim();
        ten = hoTen.substring(lastSpace + 1).trim();
      } else {
        ten = hoTen;
      }

      KhachHangDTO kh = new KhachHangDTO();
      kh.setMaKhachHang(maKH);
      kh.setMaTaiKhoan(maTK);
      kh.setHo(ho);
      kh.setTen(ten);
      kh.setNgaySinh(
        request.getNgaySinh() == null ? "" : request.getNgaySinh().trim()
      );
      kh.setGioiTinh("");
      kh.setSDT(request.getSoDienThoai());
      kh.setDiaChi(request.getDiaChi() == null ? "" : request.getDiaChi());
      kh.setTienSuBenhLy(
        request.getTienSuBenhLy() == null ? "" : request.getTienSuBenhLy()
      );

      if (!khachHangDAO.insertKhachHang(kh)) {
        throw new RuntimeException("Tạo khách hàng thất bại");
      }

      return true;
    } catch (Exception e) {
      taiKhoanDAO.deleteTaiKhoan(maTK);
      throw e;
    }
  }

  public boolean suaKhachHang(KhachHangDTO kh) {
    return khachHangDAO.updateKhachHang(kh);
  }

  public boolean xoaKhachHang(String maKH) {
    if (hoaDonDAO.countByKhachHang(maKH) > 0) {
      throw new RuntimeException("Khách hàng đã có hóa đơn, không được xoá");
    }
    return khachHangDAO.deleteKhachHang(maKH);
  }

  public KhachHangDTO getByMaTK(String maTK) {
    return khachHangDAO.getByMaTK(maTK);
  }

  public KhachHangDTO getBySDT(String sdt) {
    return khachHangDAO.getBySDT(sdt);
  }

  public String generateMaKH() {
    return khachHangDAO.generateMaKH();
  }
}
