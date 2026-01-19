package com.quanlycuahangthuoc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quanlycuahangthuoc.bus.TaiKhoanBUS;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;

@RestController
@RequestMapping("/api/taikhoan")
@CrossOrigin
public class TaiKhoanController {
    @Autowired
    private TaiKhoanBUS taikhoanBUS;

    //Khách đăng ký
    @PostMapping("/dangky")
    public boolean dangky(@RequestBody TaiKhoanDTO tk){
        return taikhoanBUS.dangKyKhach(tk);
    }
    //Tạo tài khoản cho nhân viên
    @PostMapping("dangky-nhanvien")
    public boolean dangkyNV(@RequestBody TaiKhoanDTO tk) {
        return taikhoanBUS.taoNhanVien(tk);
    }
    //Khách đăng nhập
    @PostMapping("/login-khach")
    public TaiKhoanDTO loginKhach(@RequestBody TaiKhoanDTO tk) {
        return taikhoanBUS.dangNhapWebKhach(tk.getTenDangNhap(), tk.getMatKhau());
    }
    //Nhân viên đăng nhập
    @PostMapping("/login-nhanvien")
    public TaiKhoanDTO loginNhanVien(@RequestBody TaiKhoanDTO tk) {
        return taikhoanBUS.dangNhapWebNhanVien(tk.getTenDangNhap(), tk.getMatKhau());
    }
    //Xóa tài khoản
    @DeleteMapping("/{maTK}")
    public boolean xoa(@PathVariable String maTk) {
        return taikhoanBUS.xoaTaiKhoan(maTk);
    }
}
