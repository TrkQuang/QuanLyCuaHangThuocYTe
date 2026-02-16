package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.NhaCungCapDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.dto.*;
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

    if (
      t.getTenThuoc() == null || t.getTenThuoc().isEmpty()
    ) throw new RuntimeException("Tên thuốc không được rỗng");

    // Check if MaNhaCungCap is provided and validate it
    if (t.getMaNhaCungCap() != null && !t.getMaNhaCungCap().isEmpty()) {
      if (
        nhaCungCapDAO.getById(t.getMaNhaCungCap()) == null
      ) throw new RuntimeException("Nhà cung cấp không tồn tại");
    }

    return thuocDAO.insertThuoc(t);
  }
}
