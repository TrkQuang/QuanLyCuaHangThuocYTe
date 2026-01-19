package com.quanlycuahangthuoc.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.KhachHangBUS;
import com.quanlycuahangthuoc.dto.KhachHangDTO;

@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    @Autowired
    private KhachHangBUS khachHangBUS;

    @GetMapping
    public ArrayList<KhachHangDTO> getAll(){
        return khachHangBUS.getAllKhachHang();
    }

    @PostMapping
    public ResponseEntity<?> them(@RequestBody KhachHangDTO kh){
        try{
            return ResponseEntity.ok(khachHangBUS.themKhachHang(kh));
        }catch(Exception e){
            Map<String,String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PutMapping
    public ResponseEntity<?> sua(@RequestBody KhachHangDTO kh){
        try{
            return ResponseEntity.ok(khachHangBUS.suaKhachHang(kh));
        }catch(Exception e){
            Map<String,String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @DeleteMapping("/{maKH}")
    public ResponseEntity<?> xoa(@PathVariable String maKH){
        try{
            return ResponseEntity.ok(khachHangBUS.xoaKhachHang(maKH));
        }catch(Exception e){
            Map<String,String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }
}
