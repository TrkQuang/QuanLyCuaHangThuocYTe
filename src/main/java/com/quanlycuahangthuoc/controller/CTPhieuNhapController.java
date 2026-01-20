package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.CTPhieuNhapBUS;
import com.quanlycuahangthuoc.dao.CTPhieuNhapDAO;
import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ctphieunhap")
@CrossOrigin
public class CTPhieuNhapController {

  @Autowired
  private CTPhieuNhapBUS ctPhieuNhapBUS;

  @Autowired
  private CTPhieuNhapDAO ctPhieuNhapDAO;

  // Lấy chi tiết theo phiếu nhập
  @GetMapping("/phieunhap/{maPhieuNhap}")
  public ArrayList<CTPhieuNhapDTO> getByPhieuNhap(
    @PathVariable String maPhieuNhap
  ) {
    return ctPhieuNhapDAO.getCTPhieuNhapTheoMaPN(maPhieuNhap);
  }

  // Thêm chi tiết phiếu nhập
  @PostMapping
  public ResponseEntity<?> them(@RequestBody CTPhieuNhapDTO ct) {
    try {
      return ResponseEntity.ok(ctPhieuNhapBUS.themCTPhieuNhap(ct));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
