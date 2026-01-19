package com.quanlycuahangthuoc.bus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quanlycuahangthuoc.dao.CTPhieuNhapDAO;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;
//chi tiết phiếu nhập thì khi nhập xong ra chi tiết phiếu đó và ko sửa ko xóa dc
//bữa bán bánh cx y chang z
@Service
public class CTPhieuNhapBUS {

    @Autowired
    private CTPhieuNhapDAO ctPhieuNhapDAO;

    @Autowired
    private ThuocDAO thuocDAO;

    @Autowired
    private PhieuNhapDAO phieuNhapDAO;

    public boolean themCTPhieuNhap(CTPhieuNhapDTO ct) {

        if (ct.getSoLuongNhap() <= 0 || ct.getDonGia() <= 0) {
            throw new RuntimeException("So luong va don gia phai lon hon 0");
        }

        boolean ok = ctPhieuNhapDAO.insertCTPhieuNhap(ct);
        if (!ok) return false;

        // Cap nhat ton kho
        thuocDAO.CongSoLuongTon(ct.getMaThuoc(), ct.getSoLuongNhap());

        // Cap nhat tong tien phieu nhap
        float tien = ct.getSoLuongNhap() * ct.getDonGia();
        phieuNhapDAO.CongTongTien(ct.getMaPhieuNhap(), tien);

        return true;
    }
}
