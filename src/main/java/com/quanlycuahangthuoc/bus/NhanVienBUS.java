package com.quanlycuahangthuoc.bus;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quanlycuahangthuoc.dao.NhanVienDAO;
import com.quanlycuahangthuoc.dto.NhanVienDTO;

@Service
public class NhanVienBUS {

    @Autowired
    private NhanVienDAO nhanVienDAO;

    public ArrayList<NhanVienDTO> getAllNhanVien() {
        return nhanVienDAO.getAllNhanVien();
    }

    public boolean ThemNhanVien(NhanVienDTO nv) {

        if (nv.getMaNhanVien() == null || nv.getMaNhanVien().isEmpty()) return false;
        if (nv.getHo() == null || nv.getHo().isEmpty()) return false;
        if (nv.getTen() == null || nv.getTen().isEmpty()) return false;
        if (nv.getSDT() == null || nv.getSDT().isEmpty()) return false;

        return nhanVienDAO.insertNhanVien(nv);
    }

    public boolean CapNhatNhanVien(NhanVienDTO nv) {

        if (nv.getMaNhanVien() == null || nv.getMaNhanVien().isEmpty()) return false;

        return nhanVienDAO.updateNhanVien(nv);
    }

    public boolean XoaNhanVien(String maNhanVien) {

        if (maNhanVien == null || maNhanVien.isEmpty()) return false;

        return nhanVienDAO.deleteNhanVien(maNhanVien);
    }
}
