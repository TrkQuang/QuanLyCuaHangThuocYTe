package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.ThuocBUS;
import com.quanlycuahangthuoc.dao.ThuocDAO;
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

  @Autowired
  private ThuocDAO thuocDAO;

  // Lấy tất cả thuốc
  @GetMapping
  public ArrayList<ThuocDTO> getAll() {
    return thuocDAO.getAllThuoc();
  }

  // Lấy thuốc theo ID
  @GetMapping("/{maThuoc}")
  public ResponseEntity<?> getById(@PathVariable String maThuoc) {
    ThuocDTO thuoc = thuocDAO.getById(maThuoc);
    if (thuoc != null) {
      return ResponseEntity.ok(thuoc);
    }
    return ResponseEntity.notFound().build();
  }

  // Thêm thuốc
  @PostMapping("/them-thuoc")
  public ResponseEntity<?> themThuoc(@RequestBody ThuocDTO th) {
    try {
      if (thuocBUS.themThuoc(th)) {
        return ResponseEntity.ok("Thêm thuốc thành công");
      }
      return ResponseEntity.badRequest().body("Thêm thuốc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Cập nhật thuốc
  @PutMapping
  public ResponseEntity<?> suaThuoc(@RequestBody ThuocDTO th) {
    try {
      if (thuocDAO.updateThuoc(th)) {
        return ResponseEntity.ok("Cập nhật thuốc thành công");
      }
      return ResponseEntity.badRequest().body("Cập nhật thuốc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Xóa thuốc
  @DeleteMapping("/{maThuoc}")
  public ResponseEntity<?> xoaThuoc(@PathVariable String maThuoc) {
    try {
      if (thuocDAO.deleteThuoc(maThuoc)) {
        return ResponseEntity.ok("Xóa thuốc thành công");
      }
      return ResponseEntity.badRequest().body("Xóa thuốc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
