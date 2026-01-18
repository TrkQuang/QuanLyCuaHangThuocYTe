package com.quanlycuahangthuoc.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.NhanVienBUS;
import com.quanlycuahangthuoc.dto.NhanVienDTO;

@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin(origins = "*")
public class NhanVienController {

    @Autowired
    private NhanVienBUS nhanVienBUS;

    // GET: lấy danh sách nhân viên
    @GetMapping
    public ArrayList<NhanVienDTO> getAllNhanVien() {
        return nhanVienBUS.getAllNhanVien();
    }

    // POST: thêm nhân viên
    @PostMapping
    public boolean ThemNhanVien(@RequestBody NhanVienDTO nv) {
        return nhanVienBUS.ThemNhanVien(nv);
    }

    // PUT: cập nhật nhân viên
    @PutMapping
    public boolean CapNhatNhanVien(@RequestBody NhanVienDTO nv) {
        return nhanVienBUS.CapNhatNhanVien(nv);
    }

    // DELETE: xóa nhân viên
    @DeleteMapping("/{maNhanVien}")
    public boolean XoaNhanVien(@PathVariable String maNhanVien) {
        return nhanVienBUS.XoaNhanVien(maNhanVien);
    }
}
