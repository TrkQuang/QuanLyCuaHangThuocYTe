package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.NhaCungCapDAO;
import com.quanlycuahangthuoc.dto.NhaCungCapDTO;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NhaCungCapBUS {

  @Autowired
  private NhaCungCapDAO nhacungcapDAO;

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

    validateSdt(ncc.getSDT());
    if (ncc.getTrangThai() == null || ncc.getTrangThai().isBlank()) {
      ncc.setTrangThai("HOAT_DONG");
    }
    return nhacungcapDAO.insertNhaCungCap(ncc);
  }

  public boolean SuaNhaCungCap(NhaCungCapDTO ncc) {
    if (
      ncc.getMaNhaCungCap().isEmpty() ||
      ncc.getTenNhaCungCap().isEmpty() ||
      ncc.getSDT().isEmpty() ||
      ncc.getDiaChi().isEmpty()
    ) throw new RuntimeException("Các thông tin cơ bản không được rỗng");

    validateSdt(ncc.getSDT());
    if (ncc.getTrangThai() == null || ncc.getTrangThai().isBlank()) {
      ncc.setTrangThai("HOAT_DONG");
    }
    return nhacungcapDAO.updateNhaCungCap(ncc);
  }

  private void validateSdt(String sdt) {
    String normalized = sdt == null ? "" : sdt.trim();
    if (!normalized.matches("^\\d{10,15}$")) {
      throw new RuntimeException("Số điện thoại phải từ 10 đến 15 chữ số");
    }
  }

  //nếu đã từng hợp tác và có nhập thuoc thì sẽ chuyển thành ko hợp tác nữa
  //nếu chưa từng nhập thuoc thì xóa trên dtb dc
  public boolean ngungHopTac(String maNCC) {
    NhaCungCapDTO ncc = nhacungcapDAO.getById(maNCC);
    if (ncc == null) throw new RuntimeException("Nhà cung cấp không tồn tại");

    ncc.setTrangThai("TAM_NGUNG");
    return nhacungcapDAO.updateNhaCungCap(ncc);
  }

  public boolean hopTacLai(String maNCC) {
    NhaCungCapDTO ncc = nhacungcapDAO.getById(maNCC);
    if (ncc == null) throw new RuntimeException("Nhà cung cấp không tồn tại");

    ncc.setTrangThai("HOAT_DONG");
    return nhacungcapDAO.updateNhaCungCap(ncc);
  }
}
