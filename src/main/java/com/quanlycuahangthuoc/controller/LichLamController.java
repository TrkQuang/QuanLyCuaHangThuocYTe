package com.quanlycuahangthuoc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.LichLamBUS;
import com.quanlycuahangthuoc.dto.LichLamDTO;

@RestController
@RequestMapping("/api/lichlam")
@CrossOrigin
public class LichLamController {

    @Autowired
    private LichLamBUS lichLamBUS;

    // Thêm lịch làm
    @PostMapping
    public ResponseEntity<?> them(@RequestBody LichLamDTO ll){
        try {
            return ResponseEntity.ok(lichLamBUS.ThemLichLam(ll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Sửa lịch làm
    @PutMapping
    public ResponseEntity<?> sua(@RequestBody LichLamDTO ll){
        try {
            return ResponseEntity.ok(lichLamBUS.SuaLichLam(ll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa lịch làm
    @DeleteMapping("/{maLL}")
    public ResponseEntity<?> xoa(@PathVariable String maLL){
        return ResponseEntity.ok(lichLamBUS.XoaLichlam(maLL));
    }
}
