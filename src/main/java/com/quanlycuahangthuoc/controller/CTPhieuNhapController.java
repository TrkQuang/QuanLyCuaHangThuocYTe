package com.quanlycuahangthuoc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.CTPhieuNhapBUS;
import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;

@RestController
@RequestMapping("/api/ctphieunhap")
@CrossOrigin
public class CTPhieuNhapController {

    @Autowired
    private CTPhieuNhapBUS ctPhieuNhapBUS;

    // Thêm chi tiết phiếu nhập
    @PostMapping
    public ResponseEntity<?> them(@RequestBody CTPhieuNhapDTO ct){
        try {
            return ResponseEntity.ok(ctPhieuNhapBUS.themCTPhieuNhap(ct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
