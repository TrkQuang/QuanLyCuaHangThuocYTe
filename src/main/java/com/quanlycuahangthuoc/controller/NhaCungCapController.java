package com.quanlycuahangthuoc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quanlycuahangthuoc.bus.NhaCungCapBUS;
import com.quanlycuahangthuoc.dto.NhaCungCapDTO;

@RestController
@RequestMapping("/api/nhacungcap")
@CrossOrigin
public class NhaCungCapController {

    @Autowired
    private NhaCungCapBUS nhaCungCapBUS;

    // Lấy danh sách nhà cung cấp
    @GetMapping
    public ResponseEntity<?> getAll(){
        try{
            return ResponseEntity.ok(nhaCungCapBUS.getAllNhaCungCap());
        }catch(Exception e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // Thêm nhà cung cấp
    @PostMapping
    public ResponseEntity<?> them(@RequestBody NhaCungCapDTO ncc){
        try{
            if(nhaCungCapBUS.ThemNhaCungCap(ncc))
                return ResponseEntity.ok("Thêm nhà cung cấp thành công");
            return ResponseEntity.badRequest().body("Thêm thất bại");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Sửa nhà cung cấp
    @PutMapping
    public ResponseEntity<?> sua(@RequestBody NhaCungCapDTO ncc){
        try{
            if(nhaCungCapBUS.SuaNhaCungCap(ncc))
                return ResponseEntity.ok("Cập nhật thành công");
            return ResponseEntity.badRequest().body("Cập nhật thất bại");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ngừng hợp tác / xóa
    @DeleteMapping("/{maNCC}")
    public ResponseEntity<?> ngungHopTac(@PathVariable String maNCC){
        try{
            if(nhaCungCapBUS.ngungHopTac(maNCC))
                return ResponseEntity.ok("Đã ngừng hợp tác");
            return ResponseEntity.badRequest().body("Không thể ngừng hợp tác");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
