package com.quanlycuahangthuoc.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.HoaDonBUS;
import com.quanlycuahangthuoc.dto.HoaDonDTO;

@RestController
@RequestMapping("/api/hoadon")
@CrossOrigin(origins = "*")
public class HoaDonController {

    @Autowired
    private HoaDonBUS hoaDonBUS;

    // Tạo hóa đơn mới
    @PostMapping
    public boolean taoHoaDon(@RequestBody HoaDonDTO hd){
        return hoaDonBUS.taoHoaDon(hd);
    }

    // Thanh toán hóa đơn
    @PutMapping("/thanhtoan")
    public boolean thanhToan(@RequestBody HoaDonDTO hd){
        return hoaDonBUS.thanhToanHoaDon(hd);
    }

    // Hủy hóa đơn
    @PutMapping("/huy")
    public boolean huy(@RequestBody HoaDonDTO hd){
        return hoaDonBUS.huyHoaDon(hd);
    }

    // Lấy tất cả hóa đơn
    @GetMapping
    public ArrayList<HoaDonDTO> getAll(){
        return hoaDonBUS.getAllHoaDon();
    }
}
