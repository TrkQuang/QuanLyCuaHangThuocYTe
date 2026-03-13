package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.PhieuNhapBUS;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dto.PhieuNhapDTO;
import com.quanlycuahangthuoc.dto.requests.CreatePhieuNhapRequest;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/phieunhap")
@CrossOrigin
public class PhieuNhapController {

  @Autowired
  private PhieuNhapBUS phieuNhapBUS;

  @Autowired
  private PhieuNhapDAO phieuNhapDAO;

  // Lấy tất cả phiếu nhập
  @GetMapping
  public ArrayList<PhieuNhapDTO> getAll() {
    return phieuNhapDAO.getAllPhieuNhap();
  }

  // Lấy phiếu nhập theo ID
  @GetMapping("/{maPhieuNhap}")
  public ResponseEntity<?> getById(@PathVariable String maPhieuNhap) {
    PhieuNhapDTO pn = phieuNhapDAO.getById(maPhieuNhap);
    if (pn != null) {
      return ResponseEntity.ok(pn);
    }
    return ResponseEntity.notFound().build();
  }

  // Thêm phiếu nhập
  @PostMapping
  public ResponseEntity<?> themPhieuNhap(@RequestBody PhieuNhapDTO pn) {
    try {
      if (phieuNhapBUS.ThemPhieuNhap(pn)) return ResponseEntity.ok(
        "Tạo phiếu nhập thành công"
      );
      return ResponseEntity.badRequest().body("Tạo phiếu nhập thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Tạo phiếu nhập + chi tiết trong cùng transaction
  @PostMapping("/full")
  public ResponseEntity<?> themPhieuNhapDayDu(
    @RequestBody CreatePhieuNhapRequest request
  ) {
    try {
      return ResponseEntity.ok(phieuNhapBUS.taoPhieuNhapVaChiTiet(request));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PutMapping("/{maPhieuNhap}/details")
  public ResponseEntity<?> capNhatChiTietPhieuNhap(
    @PathVariable String maPhieuNhap,
    @RequestBody CreatePhieuNhapRequest request
  ) {
    try {
      return ResponseEntity.ok(
        phieuNhapBUS.capNhatChiTietPhieuNhap(maPhieuNhap, request.getChiTiet())
      );
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PutMapping("/{maPhieuNhap}/xacnhan")
  public ResponseEntity<?> xacNhanPhieuNhap(@PathVariable String maPhieuNhap) {
    try {
      return ResponseEntity.ok(phieuNhapBUS.xacNhanPhieuNhap(maPhieuNhap));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PutMapping("/{maPhieuNhap}/huy")
  public ResponseEntity<?> huyPhieuNhap(@PathVariable String maPhieuNhap) {
    try {
      return ResponseEntity.ok(phieuNhapBUS.huyPhieuNhap(maPhieuNhap));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Xóa phiếu nhập
  @DeleteMapping("/{maPhieuNhap}")
  public ResponseEntity<?> xoaPhieuNhap(@PathVariable String maPhieuNhap) {
    try {
      PhieuNhapDTO pn = new PhieuNhapDTO();
      pn.setMaPhieuNhap(maPhieuNhap);

      if (phieuNhapBUS.XoaPhieuNhap(pn)) return ResponseEntity.ok(
        "Đã xóa phiếu nhập"
      );
      return ResponseEntity.badRequest().body("Xóa phiếu nhập thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
