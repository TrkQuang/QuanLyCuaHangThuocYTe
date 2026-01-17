package com.quanlycuahangthuoc.bus;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.quanlycuahangthuoc.dao.KhachHangDAO;
import com.quanlycuahangthuoc.dto.KhachHangDTO;

import java.util.ArrayList;

@Service
public class KhachHangBUS {

    @Autowired
    private KhachHangDAO khachHangDAO;

    private ArrayList<KhachHangDTO> dskh;

    public KhachHangBUS() {
        // Không load ở constructor
    }

    public void loadData() {
        dskh = khachHangDAO.getAllKhachHang();
    }

    public ArrayList<KhachHangDTO> getAllKhachHang() {
        if (dskh == null) loadData();
        return dskh;
    }

    public boolean ThemKhachHang(KhachHangDTO kh) {
        if (kh.getMaKhachHang().isEmpty()) return false;
        if (kh.getTen().isEmpty()) return false;
        if (kh.getHo().isEmpty()) return false;
        if (kh.getSDT().isEmpty()) return false;
        if (kh.getDiaChi().isEmpty()) return false;
        if (kh.getNgaySinh().isEmpty()) return false;

        boolean ok = khachHangDAO.insertKhachHang(kh);
        if (ok) dskh.add(kh);

        return ok;
    }

    public boolean CapNhatKhachHang(KhachHangDTO kh) {
        if (kh.getMaKhachHang().isEmpty()) return false;
        boolean check = khachHangDAO.updateKhachHang(kh);
        if (check) {
            for (int i = 0; i < dskh.size(); i++) {
                if (dskh.get(i).getMaKhachHang().equalsIgnoreCase(kh.getMaKhachHang())) {
                    dskh.set(i, kh);
                    break;
                }
            }
        }
        return check;
    }

    public boolean XoaKhachHang(String maKH) {
        if (maKH.isEmpty()) return false;
        boolean check = khachHangDAO.deleteKhachHang(maKH);
        if (check) {
            dskh.removeIf(k -> k.getMaKhachHang().equals(maKH));
        }
        return check;
    }
}
