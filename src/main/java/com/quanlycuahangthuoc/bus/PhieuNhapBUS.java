package com.quanlycuahangthuoc.bus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dto.PhieuNhapDTO;

@Service
public class PhieuNhapBUS {
    @Autowired
    private PhieuNhapDAO phieunhapDAO;

    public boolean ThemPhieuNhap(PhieuNhapDTO pn) {
        if(pn.getMaPhieuNhap().isEmpty() || pn.getMaNhaCungCap().isEmpty() || pn.getMaNhanVien().isEmpty() || pn.getNgayNhap().isEmpty() ) throw new RuntimeException("Thông tin cơ bản không được rỗng!");
        pn.setTongTien(0); // lúc mới tạo phiếu thì chưa có chi tiết
        return phieunhapDAO.insertPhieuNhap(pn);
    }

    public boolean XoaPhieuNhap(PhieuNhapDTO pn) {
        int tontai = phieunhapDAO.demSoCTTheoMaPhieuNhap(pn.getMaPhieuNhap());
        if(tontai != 0) throw new RuntimeException("Phiếu nhập này đã có chi tiết, không thể xóa");
        return phieunhapDAO.deletePhieuNhap(pn.getMaPhieuNhap());
    }
}
