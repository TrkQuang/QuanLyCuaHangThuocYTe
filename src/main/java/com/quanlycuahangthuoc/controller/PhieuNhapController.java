package com.quanlycuahangthuoc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.PhieuNhapBUS;
import com.quanlycuahangthuoc.dto.PhieuNhapDTO;

@RestController
@RequestMapping("/api/phieunhap")
@CrossOrigin
public class PhieuNhapController {

    @Autowired
    private PhieuNhapBUS phieuNhapBUS;

    // Thêm phiếu nhập
    @PostMapping
    public ResponseEntity<?> themPhieuNhap(@RequestBody PhieuNhapDTO pn){
        try{
            if(phieuNhapBUS.ThemPhieuNhap(pn))
                return ResponseEntity.ok("Tạo phiếu nhập thành công");
            return ResponseEntity.badRequest().body("Tạo phiếu nhập thất bại");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa phiếu nhập
    @DeleteMapping("/{maPhieuNhap}")
    public ResponseEntity<?> xoaPhieuNhap(@PathVariable String maPhieuNhap){
        try{
            PhieuNhapDTO pn = new PhieuNhapDTO();
            pn.setMaPhieuNhap(maPhieuNhap);

            if(phieuNhapBUS.XoaPhieuNhap(pn))
                return ResponseEntity.ok("Đã xóa phiếu nhập");
            return ResponseEntity.badRequest().body("Xóa phiếu nhập thất bại");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
