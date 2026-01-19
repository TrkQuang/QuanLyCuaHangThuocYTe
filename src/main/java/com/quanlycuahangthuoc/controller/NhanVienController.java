package com.quanlycuahangthuoc.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.NhanVienBUS;
import com.quanlycuahangthuoc.dto.NhanVienDTO;

@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin
public class NhanVienController {

    @Autowired
    private NhanVienBUS nhanVienBUS;

    // Lấy danh sách nhân viên
    @GetMapping
    public ArrayList<NhanVienDTO> getAll(){
        return nhanVienBUS.getAllNhanVien();
    }

    // Thêm nhân viên
    @PostMapping
    public ResponseEntity<?> them(@RequestBody NhanVienDTO nv){
        if(nhanVienBUS.ThemNhanVien(nv))
            return ResponseEntity.ok("Thêm nhân viên thành công");
        return ResponseEntity.badRequest().body("Thêm nhân viên thất bại");
    }

    // Cập nhật nhân viên
    @PutMapping
    public ResponseEntity<?> sua(@RequestBody NhanVienDTO nv){
        if(nhanVienBUS.CapNhatNhanVien(nv))
            return ResponseEntity.ok("Cập nhật nhân viên thành công");
        return ResponseEntity.badRequest().body("Cập nhật nhân viên thất bại");
    }

    // Xóa nhân viên
    @DeleteMapping("/{maNhanVien}")
    public ResponseEntity<?> xoa(@PathVariable String maNhanVien){
        if(nhanVienBUS.XoaNhanVien(maNhanVien))
            return ResponseEntity.ok("Đã xóa nhân viên");
        return ResponseEntity.badRequest().body("Xóa nhân viên thất bại");
    }
}
