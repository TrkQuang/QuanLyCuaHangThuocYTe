package com.quanlycuahangthuoc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quanlycuahangthuoc.bus.ThuocBUS;
import com.quanlycuahangthuoc.dto.ThuocDTO;

@RestController
@RequestMapping("/api/thuoc")
@CrossOrigin
public class ThuocController {
    @Autowired
    private ThuocBUS thuocBUS;

    //Thêm thuốc
    @PostMapping("/them-thuoc")
    public boolean themThuoc(@RequestBody ThuocDTO th) {
        return thuocBUS.themThuoc(th);
    }
}
