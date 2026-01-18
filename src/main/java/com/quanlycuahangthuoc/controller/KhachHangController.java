package com.quanlycuahangthuoc.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.KhachHangBUS;
import com.quanlycuahangthuoc.dto.KhachHangDTO;

@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    @Autowired
    private KhachHangBUS khachHangBUS;

    // GET: lấy danh sách khách hàng
    @GetMapping
    public ArrayList<KhachHangDTO> getAllKhachHang() {
        return khachHangBUS.getAllKhachHang();
    }

    // POST: thêm khách hàng
    @PostMapping
    public boolean themKhachHang(@RequestBody KhachHangDTO kh) {
        return khachHangBUS.ThemKhachHang(kh);
    }

    // PUT: cập nhật khách hàng
    @PutMapping
    public boolean capNhatKhachHang(@RequestBody KhachHangDTO kh) {
        return khachHangBUS.CapNhatKhachHang(kh);
    }

    // DELETE: xóa khách hàng
    @DeleteMapping("/{maKH}")
    public boolean xoaKhachHang(@PathVariable String maKH) {
        return khachHangBUS.XoaKhachHang(maKH);
    }
}
