package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.NhaCungCapDAO;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dto.NhaCungCapDTO;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NhaCungCapBUS {

  @Autowired
  private NhaCungCapDAO nhacungcapDAO;

  @Autowired
  private PhieuNhapDAO phieuNhapDAO;

  public ArrayList<NhaCungCapDTO> getAllNhaCungCap() {
    return nhacungcapDAO.getAllNhaCungCap();
  }

  public boolean ThemNhaCungCap(NhaCungCapDTO ncc) {
    if (
      ncc.getMaNhaCungCap().isEmpty() ||
      ncc.getTenNhaCungCap().isEmpty() ||
      ncc.getSDT().isEmpty() ||
      ncc.getDiaChi().isEmpty()
    ) throw new RuntimeException("Các thông tin cơ bản không được rỗng");
    return nhacungcapDAO.insertNhaCungCap(ncc);
  }

  public boolean SuaNhaCungCap(NhaCungCapDTO ncc) {
    if (
      ncc.getMaNhaCungCap().isEmpty() ||
      ncc.getTenNhaCungCap().isEmpty() ||
      ncc.getSDT().isEmpty() ||
      ncc.getDiaChi().isEmpty()
    ) throw new RuntimeException("Các thông tin cơ bản không được rỗng");
    return nhacungcapDAO.updateNhaCungCap(ncc);
  }

  //nếu đã từng hợp tác và có nhập thuốc thì sẽ chuyển thành ko hợp tác nữa
  //nếu chưa từng nhập thuốc thì xóa trên dtb dc
  public boolean ngungHopTac(String maNCC) {
    NhaCungCapDTO ncc = nhacungcapDAO.getById(maNCC);
    if (ncc == null) throw new RuntimeException("Nhà cung cấp không tồn tại");

    if (phieuNhapDAO.countByNhaCungCap(maNCC) > 0) {
      ncc.setTrangThai("TAM_NGUNG");
      return nhacungcapDAO.updateNhaCungCap(ncc);
    } else {
      return nhacungcapDAO.deleteNhaCungCap(maNCC);
    }
  }
}
