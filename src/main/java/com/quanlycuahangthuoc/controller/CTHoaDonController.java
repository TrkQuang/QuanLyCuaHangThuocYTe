package com.quanlycuahangthuoc.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.CTHoaDonBUS;
import com.quanlycuahangthuoc.dto.CTHoaDonDTO;
import com.quanlycuahangthuoc.dto.requests.CTHoaDonRequest;

@RestController
@RequestMapping("/api/cthoadon")
@CrossOrigin(origins = "*")
public class CTHoaDonController {

    @Autowired
    private CTHoaDonBUS ctHoaDonBUS;

    // Lấy chi tiết theo hóa đơn
    @GetMapping("/{maHoaDon}")
    public ArrayList<CTHoaDonDTO> getByHoaDon(@PathVariable String maHoaDon){
        return ctHoaDonBUS.getCTHoaDonTheoHoaDon(maHoaDon);
    }

    // Thêm chi tiết hóa đơn
    @PostMapping
    public boolean themCTHoaDon(@RequestBody CTHoaDonRequest req){
        return ctHoaDonBUS.themCTHoaDon(
            req.getCtHoaDon(),
            req.getHoaDon(),
            req.getGiaBan()
        );
    }
}
