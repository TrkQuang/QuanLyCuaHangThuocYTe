package com.quanlycuahangthuoc.bus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quanlycuahangthuoc.dao.TaiKhoanDAO;
import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;

@Service
public class TaiKhoanBUS {

    @Autowired
    private TaiKhoanDAO taiKhoanDAO;

    @Autowired
    private HoaDonDAO hoaDonDAO;

    @Autowired
    private PhieuNhapDAO phieuNhapDAO;

    // ================== KHÁCH ĐĂNG KÝ ==================
    public boolean dangKyKhach(TaiKhoanDTO tk){
        if(tk.getTenDangNhap().isEmpty() || tk.getMatKhau().isEmpty() || tk.getEmail().isEmpty())
            throw new RuntimeException("Thiếu thông tin đăng ký");

        if(taiKhoanDAO.existUsername(tk.getTenDangNhap()))
            throw new RuntimeException("Tên đăng nhập đã tồn tại");

        if(taiKhoanDAO.existEmail(tk.getEmail()))
            throw new RuntimeException("Email đã tồn tại");

        tk.setLoaiTaiKhoan("KHACH");   // 🔥 mặc định khách
        return taiKhoanDAO.insertTaiKhoan(tk);
    }

    // ================== ADMIN TẠO NHÂN VIÊN ==================
    public boolean taoNhanVien(TaiKhoanDTO tk){
        if(tk.getTenDangNhap().isEmpty() || tk.getMatKhau().isEmpty() || tk.getEmail().isEmpty())
            throw new RuntimeException("Thiếu thông tin");

        if(taiKhoanDAO.existUsername(tk.getTenDangNhap()))
            throw new RuntimeException("Tên đăng nhập đã tồn tại");

        if(taiKhoanDAO.existEmail(tk.getEmail()))
            throw new RuntimeException("Email đã tồn tại");

        if(!tk.getLoaiTaiKhoan().equals("NHANVIEN") && !tk.getLoaiTaiKhoan().equals("ADMIN"))
            throw new RuntimeException("Loại tài khoản không hợp lệ");

        return taiKhoanDAO.insertTaiKhoan(tk);
    }

    // ================== ĐĂNG NHẬP ==================
    public TaiKhoanDTO dangNhap(String username, String password){
        TaiKhoanDTO tk = taiKhoanDAO.getByUsername(username);
        if(tk == null || !tk.getMatKhau().equals(password))
            throw new RuntimeException("Sai tài khoản hoặc mật khẩu");

        return tk;
    }

    public TaiKhoanDTO dangNhapWebKhach(String username, String password){
        TaiKhoanDTO tk = dangNhap(username, password);
        if(!tk.getLoaiTaiKhoan().equals("KHACH"))
            throw new RuntimeException("Không có quyền truy cập web khách");
        return tk;
    }

    public TaiKhoanDTO dangNhapWebNhanVien(String username, String password){
        TaiKhoanDTO tk = dangNhap(username, password);
        if(!tk.getLoaiTaiKhoan().equals("NHANVIEN") && !tk.getLoaiTaiKhoan().equals("ADMIN"))
            throw new RuntimeException("Không có quyền truy cập web nhân viên");
        return tk;
    }

    // ================== XOÁ / KHOÁ ==================
    public boolean xoaTaiKhoan(String maTK){
        if(hoaDonDAO.countByNhanVien(maTK) > 0 || phieuNhapDAO.countByNhanVien(maTK) > 0)
            throw new RuntimeException("Tài khoản đã phát sinh giao dịch, không được xoá");

        return taiKhoanDAO.deleteTaiKhoan(maTK);
    }
}

