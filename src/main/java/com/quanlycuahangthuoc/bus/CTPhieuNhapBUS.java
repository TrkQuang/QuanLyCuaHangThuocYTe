package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.CTPhieuNhapDAO;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    if (ct.getMaPhieuNhap() == null || ct.getMaPhieuNhap().isBlank()) {
      throw new RuntimeException("Ma phieu nhap khong hop le");
    }

    var pn = phieuNhapDAO.getById(ct.getMaPhieuNhap());
    if (pn == null) {
      throw new RuntimeException("Khong tim thay phieu nhap");
    }
    String status = String.valueOf(
      pn.getTrangThai() == null ? "" : pn.getTrangThai()
    )
      .trim()
      .toUpperCase();
    if (!("CHO_XAC_NHAN".equals(status) || "CHOXACNHAN".equals(status))) {
      throw new RuntimeException(
        "Phieu nhap da hoan tat, khong the them chi tiet"
      );
    }

    boolean ok = ctPhieuNhapDAO.insertCTPhieuNhap(ct);
    if (!ok) return false;

    // Cap nhat tong tien phieu nhap, ton kho chi cong khi xac nhan phieu
    float tien = ct.getSoLuongNhap() * ct.getDonGia();
    phieuNhapDAO.CongTongTien(ct.getMaPhieuNhap(), tien);

    return true;
  }
}
