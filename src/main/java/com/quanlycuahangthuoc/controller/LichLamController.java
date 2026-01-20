package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.LichLamBUS;
import com.quanlycuahangthuoc.dao.LichLamDAO;
import com.quanlycuahangthuoc.dto.LichLamDTO;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lichlam")
@CrossOrigin
public class LichLamController {

  @Autowired
  private LichLamBUS lichLamBUS;

  @Autowired
  private LichLamDAO lichLamDAO;

  // Lấy tất cả lịch làm
  @GetMapping
  public ArrayList<LichLamDTO> getAll() {
    return lichLamDAO.getAllLichLam();
  }

  // Lấy lịch làm theo nhân viên
  @GetMapping("/nhanvien/{maNhanVien}")
  public ArrayList<LichLamDTO> getByNhanVien(@PathVariable String maNhanVien) {
    return lichLamDAO.getLichLamByNhanVien(maNhanVien);
  }

  // Lấy lịch làm theo ID
  @GetMapping("/{maLich}")
  public ResponseEntity<?> getById(@PathVariable String maLich) {
    LichLamDTO ll = lichLamDAO.getById(maLich);
    if (ll != null) {
      return ResponseEntity.ok(ll);
    }
    return ResponseEntity.notFound().build();
  }

  // Thêm lịch làm
  @PostMapping
  public ResponseEntity<?> them(@RequestBody LichLamDTO ll) {
    try {
      return ResponseEntity.ok(lichLamBUS.ThemLichLam(ll));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Sửa lịch làm
  @PutMapping
  public ResponseEntity<?> sua(@RequestBody LichLamDTO ll) {
    try {
      return ResponseEntity.ok(lichLamBUS.SuaLichLam(ll));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Xóa lịch làm
  @DeleteMapping("/{maLL}")
  public ResponseEntity<?> xoa(@PathVariable String maLL) {
    return ResponseEntity.ok(lichLamBUS.XoaLichlam(maLL));
  }
}
