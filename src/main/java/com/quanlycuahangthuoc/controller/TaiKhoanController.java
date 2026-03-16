package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.TaiKhoanBUS;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;
import com.quanlycuahangthuoc.dto.requests.CreateKhachHangRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/taikhoan")
@CrossOrigin
public class TaiKhoanController {

  @Autowired
  private TaiKhoanBUS taikhoanBUS;

  //Khách đăng ký
  @PostMapping("/dangky")
  public ResponseEntity<?> dangky(@RequestBody CreateKhachHangRequest request) {
    try {
      return ResponseEntity.ok(taikhoanBUS.dangKyKhachDayDu(request));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  //Tạo tài khoản cho nhân viên
  @PostMapping("/dangky-nhanvien")
  public ResponseEntity<?> dangkyNV(@RequestBody TaiKhoanDTO tk) {
    try {
      return ResponseEntity.ok(taikhoanBUS.taoNhanVien(tk));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  //Khách đăng nhập
  @PostMapping("/login-khach")
  public ResponseEntity<?> loginKhach(@RequestBody TaiKhoanDTO tk) {
    try {
      TaiKhoanDTO result = taikhoanBUS.dangNhapWebKhach(
        tk.getTenDangNhap(),
        tk.getMatKhau()
      );
      KhachHangDTO kh = taikhoanBUS.getKhachHangByMaTK(result.getMaTaiKhoan());
      Map<String, Object> payload = new HashMap<>();
      payload.put("user", taikhoanBUS.withoutPassword(result));
      payload.put("khachHang", kh);
      return ResponseEntity.ok(payload);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  //Nhân viên đăng nhập
  @PostMapping("/login-nhanvien")
  public ResponseEntity<?> loginNhanVien(
    @RequestBody TaiKhoanDTO tk,
    HttpSession session
  ) {
    try {
      TaiKhoanDTO result = taikhoanBUS.dangNhapWebNhanVien(
        tk.getTenDangNhap(),
        tk.getMatKhau()
      );
      session.setAttribute("CURRENT_USER", taikhoanBUS.withoutPassword(result));
      session.setAttribute("CURRENT_ROLE", result.getLoaiTaiKhoan());
      return ResponseEntity.ok(taikhoanBUS.withoutPassword(result));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Đăng nhập khách hàng theo session
  @PostMapping("/session/login-khach")
  public ResponseEntity<?> loginKhachSession(
    @RequestBody TaiKhoanDTO tk,
    HttpSession session
  ) {
    TaiKhoanDTO result = taikhoanBUS.dangNhapWebKhach(
      tk.getTenDangNhap(),
      tk.getMatKhau()
    );
    TaiKhoanDTO safeUser = taikhoanBUS.withoutPassword(result);
    KhachHangDTO kh = taikhoanBUS.getKhachHangByMaTK(result.getMaTaiKhoan());

    session.setAttribute("CURRENT_USER", safeUser);
    session.setAttribute("CURRENT_ROLE", result.getLoaiTaiKhoan());
    Map<String, Object> payload = new HashMap<>();
    payload.put("user", safeUser);
    payload.put("khachHang", kh);
    return ResponseEntity.ok(payload);
  }

  // Lấy user hiện tại từ session
  @GetMapping("/session/me")
  public ResponseEntity<?> currentSessionUser(HttpSession session) {
    Object currentUser = session.getAttribute("CURRENT_USER");
    if (currentUser == null) {
      return ResponseEntity.status(401).body("Chưa đăng nhập");
    }
    return ResponseEntity.ok(currentUser);
  }

  // Logout
  @PostMapping("/session/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok("Đăng xuất thành công");
  }

  //Xóa tài khoản
  @DeleteMapping("/{maTK}")
  public ResponseEntity<?> xoa(@PathVariable String maTK) {
    try {
      boolean deleted = taikhoanBUS.xoaTaiKhoan(maTK);
      if (!deleted) {
        return ResponseEntity.badRequest().body("Xóa tài khoản thất bại");
      }
      return ResponseEntity.ok(true);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PutMapping("/{maTK}/reset-password")
  public ResponseEntity<?> resetPassword(@PathVariable String maTK) {
    try {
      boolean ok = taikhoanBUS.resetMatKhauMacDinh(maTK);
      if (!ok) {
        return ResponseEntity.badRequest().body("Không thể reset mật khẩu");
      }
      return ResponseEntity.ok(true);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PutMapping("/{maTK}/ban")
  public ResponseEntity<?> banTaiKhoan(@PathVariable String maTK) {
    try {
      boolean ok = taikhoanBUS.voHieuHoaTaiKhoan(maTK);
      if (!ok) {
        return ResponseEntity.badRequest().body("Không thể cấm tài khoản");
      }
      return ResponseEntity.ok(true);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PutMapping("/{maTK}/unban")
  public ResponseEntity<?> unbanTaiKhoan(
    @PathVariable String maTK,
    @RequestBody(required = false) Map<String, String> payload
  ) {
    try {
      String roleSauMoKhoa =
        payload == null ? null : payload.get("loaiTaiKhoan");
      boolean ok = taikhoanBUS.goBoVoHieuHoaTaiKhoan(maTK, roleSauMoKhoa);
      if (!ok) {
        return ResponseEntity.badRequest().body("Không thể gỡ cấm tài khoản");
      }
      return ResponseEntity.ok(true);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  //Lấy tài khoản all
  @GetMapping
  public ResponseEntity<?> getAll() {
    try {
      return ResponseEntity.ok(taikhoanBUS.getAllTaiKhoan());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(e.getMessage());
    }
  }
}
