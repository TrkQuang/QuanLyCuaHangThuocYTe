package com.quanlycuahangthuoc.bus;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dto.HoaDonDTO;

@Service
public class HoaDonBUS {

    @Autowired
    private HoaDonDAO hoaDonDAO;

    public boolean taoHoaDon(HoaDonDTO hd){
        hd.setTrangThai("CHOXACNHAN");
        hd.setTongTien(0);
        return hoaDonDAO.insertHoaDon(hd);
    }

    public boolean thanhToanHoaDon(HoaDonDTO hd){
        if(!hd.getTrangThai().equals("CHOXACNHAN")) return false;
        if(hd.getTongTien() <= 0) return false;

        hd.setTrangThai("DATHANHTOAN");
        return hoaDonDAO.updateHoaDon(hd);
    }

    public boolean huyHoaDon(HoaDonDTO hd){
        if(!hd.getTrangThai().equals("CHOXACNHAN")) return false;

        hd.setTrangThai("HUY");
        hd.setTongTien(0);
        return hoaDonDAO.updateHoaDon(hd);
    }

    public ArrayList<HoaDonDTO> getAllHoaDon(){
        return hoaDonDAO.getAllHoaDon();
    }
}
