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

  public java.util.ArrayList<ThuocDTO> getAllThuoc() {
    return thuocDAO.getAllThuoc();
  }

  public java.util.ArrayList<ThuocDTO> getAllThuoc(boolean includeImage) {
    return thuocDAO.getAllThuoc(includeImage);
  }

  public java.util.ArrayList<ThuocDTO> getThuocPaged(
    String keyword,
    String priceFilter,
    String sortBy,
    int page,
    int size,
    boolean includeImage
  ) {
    return thuocDAO.getThuocPaged(
      keyword,
      priceFilter,
      sortBy,
      page,
      size,
      includeImage
    );
  }

  public int countThuocPaged(String keyword, String priceFilter) {
    return thuocDAO.countThuocPaged(keyword, priceFilter);
  }

  public ThuocDTO getById(String maThuoc) {
    return thuocDAO.getById(maThuoc);
  }

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

  public boolean suaThuoc(ThuocDTO t) {
    if (t.getMaThuoc() == null || t.getMaThuoc().isBlank()) {
      throw new RuntimeException("Mã thuoc không hợp lệ");
    }

    ThuocDTO current = thuocDAO.getById(t.getMaThuoc());
    if (current == null) {
      throw new RuntimeException("Không tìm thấy thuoc cần cập nhật");
    }

    if (t.getTenThuoc() == null || t.getTenThuoc().isBlank()) {
      throw new RuntimeException("Tên thuoc không được rỗng");
    }
    if (t.getDonViTinh() == null || t.getDonViTinh().isBlank()) {
      throw new RuntimeException("Đơn vị tính không được rỗng");
    }
    if (t.getGiaBan() <= 0) {
      throw new RuntimeException("Giá bán phải lớn hơn 0");
    }
    if (t.getSoLuongTon() < 0) {
      throw new RuntimeException("Số lượng tồn không hợp lệ");
    }

    if (t.getHinhAnh() == null || t.getHinhAnh().isBlank()) {
      if (current.getHinhAnh() != null && !current.getHinhAnh().isBlank()) {
        t.setHinhAnh(current.getHinhAnh());
      } else {
        t.setHinhAnh("img/UATThuoc.jpg");
      }
    }

    LocalDate nsx;
    LocalDate hsd;
    try {
      String nsxRaw = (t.getNSX() == null || t.getNSX().isBlank())
        ? current.getNSX()
        : t.getNSX();
      if (nsxRaw == null || nsxRaw.isBlank()) nsxRaw =
        LocalDate.now().toString();

      String hsdRaw = (t.getHSD() == null || t.getHSD().isBlank())
        ? current.getHSD()
        : t.getHSD();

      nsx = LocalDate.parse(nsxRaw);
      hsd = (hsdRaw == null || hsdRaw.isBlank())
        ? nsx.plusYears(1)
        : LocalDate.parse(hsdRaw);
    } catch (DateTimeParseException ex) {
      throw new RuntimeException("Định dạng ngày không hợp lệ (yyyy-MM-dd)");
    }

    if (!hsd.isAfter(nsx)) {
      throw new RuntimeException("Hạn sử dụng phải sau ngày sản xuất");
    }

    t.setNSX(nsx.toString());
    t.setHSD(hsd.toString());

    if (t.getMaNhaCungCap() != null && !t.getMaNhaCungCap().isBlank()) {
      if (nhaCungCapDAO.getById(t.getMaNhaCungCap()) == null) {
        throw new RuntimeException("Nhà cung cấp không tồn tại");
      }
    }

    return thuocDAO.updateThuoc(t);
  }

  public boolean xoaThuoc(String maThuoc) {
    return thuocDAO.deleteThuoc(maThuoc);
  }
}
