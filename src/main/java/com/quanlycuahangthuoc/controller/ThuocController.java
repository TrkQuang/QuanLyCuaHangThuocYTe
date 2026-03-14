package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.ThuocBUS;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thuoc")
@CrossOrigin
public class ThuocController {

  @Autowired
  private ThuocBUS thuocBUS;

  // Lấy tất cả thuoc
  @GetMapping
  public ArrayList<ThuocDTO> getAll() {
    return thuocBUS.getAllThuoc();
  }

  // Lấy thuoc theo ID
  @GetMapping("/{maThuoc}")
  public ResponseEntity<?> getById(@PathVariable String maThuoc) {
    ThuocDTO thuoc = thuocBUS.getById(maThuoc);
    if (thuoc != null) {
      return ResponseEntity.ok(thuoc);
    }
    return ResponseEntity.notFound().build();
  }

  // Thêm thuoc
  @PostMapping("/them-thuoc")
  public ResponseEntity<?> themThuoc(@RequestBody ThuocDTO th) {
    try {
      if (thuocBUS.themThuoc(th)) {
        return ResponseEntity.ok("Thêm thuoc thành công");
      }
      return ResponseEntity.badRequest().body("Thêm thuoc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Cập nhật thuoc
  @PutMapping
  public ResponseEntity<?> suaThuoc(@RequestBody ThuocDTO th) {
    try {
      if (thuocBUS.suaThuoc(th)) {
        return ResponseEntity.ok("Cập nhật thuoc thành công");
      }
      return ResponseEntity.badRequest().body("Cập nhật thuoc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Xóa thuoc
  @DeleteMapping("/{maThuoc}")
  public ResponseEntity<?> xoaThuoc(@PathVariable String maThuoc) {
    try {
      if (thuocBUS.xoaThuoc(maThuoc)) {
        return ResponseEntity.ok("Xóa thuoc thành công");
      }
      return ResponseEntity.badRequest().body("Xóa thuoc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
