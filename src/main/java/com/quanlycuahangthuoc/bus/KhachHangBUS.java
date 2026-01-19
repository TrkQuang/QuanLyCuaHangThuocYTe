package com.quanlycuahangthuoc.bus;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dao.KhachHangDAO;
import com.quanlycuahangthuoc.dto.KhachHangDTO;

@Service
public class KhachHangBUS {

    @Autowired
    private KhachHangDAO khachHangDAO;

    @Autowired
    private HoaDonDAO hoaDonDAO;

    public ArrayList<KhachHangDTO> getAllKhachHang(){
        return khachHangDAO.getAllKhachHang();
    }

    public boolean themKhachHang(KhachHangDTO kh){
        if(kh.getHo().isEmpty() || kh.getTen().isEmpty() || kh.getSDT().isEmpty())
            throw new RuntimeException("Thiếu thông tin khách hàng");

        // Có thể mở rộng: kiểm tra trùng SDT
        return khachHangDAO.insertKhachHang(kh);
    }

    public boolean suaKhachHang(KhachHangDTO kh){
        return khachHangDAO.updateKhachHang(kh);
    }

    public boolean xoaKhachHang(String maKH){
        if(hoaDonDAO.countByKhachHang(maKH) > 0){
            throw new RuntimeException("Khách hàng đã có hóa đơn, không được xoá");
        }
        return khachHangDAO.deleteKhachHang(maKH);
    }
}
