package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.TaiKhoanBUS;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
  public ResponseEntity<?> dangky(@RequestBody TaiKhoanDTO tk) {
    try {
      return ResponseEntity.ok(taikhoanBUS.dangKyKhach(tk));
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
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  //Nhân viên đăng nhập
  @PostMapping("/login-nhanvien")
  public ResponseEntity<?> loginNhanVien(@RequestBody TaiKhoanDTO tk) {
    try {
      TaiKhoanDTO result = taikhoanBUS.dangNhapWebNhanVien(
        tk.getTenDangNhap(),
        tk.getMatKhau()
      );
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  //Xóa tài khoản
  @DeleteMapping("/{maTK}")
  public ResponseEntity<?> xoa(@PathVariable String maTk) {
    try {
      return ResponseEntity.ok(taikhoanBUS.xoaTaiKhoan(maTk));
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
