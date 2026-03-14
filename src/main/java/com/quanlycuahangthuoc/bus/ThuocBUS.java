package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.NhaCungCapDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.dto.*;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThuocBUS {

  @Autowired
  private ThuocDAO thuocDAO;

  @Autowired
  private NhaCungCapDAO nhaCungCapDAO;

  public boolean themThuoc(ThuocDTO t) {
    // Auto-generate maThuoc if not provided
    if (t.getMaThuoc() == null || t.getMaThuoc().isEmpty()) {
      t.setMaThuoc(thuocDAO.generateMaThuoc());
    }

    if (t.getTenThuoc() == null || t.getTenThuoc().isEmpty()) {
      throw new RuntimeException("Tên thuoc không được rỗng");
    }
    if (t.getDonViTinh() == null || t.getDonViTinh().isEmpty()) {
      throw new RuntimeException("Đơn vị tính không được rỗng");
    }
    if (t.getGiaBan() <= 0) {
      throw new RuntimeException("Giá bán phải lớn hơn 0");
    }
    if (t.getSoLuongTon() < 0) {
      throw new RuntimeException("Số lượng tồn không hợp lệ");
    }

    if (t.getHinhAnh() == null || t.getHinhAnh().isBlank()) {
      t.setHinhAnh("img/UATThuoc.jpg");
    }

    // Chuẩn hóa ngày để thỏa ràng buộc schema (NgaySanXuat/HanSuDung NOT NULL)
    LocalDate nsx;
    LocalDate hsd;
    try {
      nsx = (t.getNSX() == null || t.getNSX().isBlank())
        ? LocalDate.now()
        : LocalDate.parse(t.getNSX());
      hsd = (t.getHSD() == null || t.getHSD().isBlank())
        ? nsx.plusYears(1)
        : LocalDate.parse(t.getHSD());
    } catch (DateTimeParseException ex) {
      throw new RuntimeException("Định dạng ngày không hợp lệ (yyyy-MM-dd)");
    }

    if (!hsd.isAfter(nsx)) {
      throw new RuntimeException("Hạn sử dụng phải sau ngày sản xuất");
    }

    t.setNSX(nsx.toString());
    t.setHSD(hsd.toString());

    // Check if MaNhaCungCap is provided and validate it
    if (t.getMaNhaCungCap() != null && !t.getMaNhaCungCap().isEmpty()) {
      if (
        nhaCungCapDAO.getById(t.getMaNhaCungCap()) == null
      ) throw new RuntimeException("Nhà cung cấp không tồn tại");
    }

    return thuocDAO.insertThuoc(t);
  }
}
