package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.LichLamDAO;
import com.quanlycuahangthuoc.dto.LichLamDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LichLamBUS {

  private static final String STATUS_CHO_DUYET = "CHO_DUYET";
  private static final String STATUS_DA_DUYET = "DA_DUYET";
  private static final String STATUS_TU_CHOI = "TU_CHOI";

  private static final String[][] FIXED_SLOTS = {
    { "08:00:00", "12:00:00" },
    { "13:00:00", "17:00:00" },
    { "18:00:00", "22:00:00" },
  };

  @Autowired
  private LichLamDAO lichlamDAO;

  public List<Map<String, String>> getFixedSlots() {
    List<Map<String, String>> result = new ArrayList<>();
    for (String[] slot : FIXED_SLOTS) {
      result.add(Map.of("gioBatDau", slot[0], "gioKetThuc", slot[1]));
    }
    return result;
  }

  private boolean isFixedSlot(String gioBatDau, String gioKetThuc) {
    for (String[] slot : FIXED_SLOTS) {
      if (slot[0].equals(gioBatDau) && slot[1].equals(gioKetThuc)) {
        return true;
      }
    }
    return false;
  }

  public boolean dangKyCaLam(LichLamDTO ll) {
    if (ll.getMaNhanVien() == null || ll.getMaNhanVien().isBlank()) {
      throw new RuntimeException("Mã nhân viên không được rỗng");
    }
    if (
      ll.getNgayLam() == null ||
      ll.getNgayLam().isBlank() ||
      ll.getGioBatDau() == null ||
      ll.getGioBatDau().isBlank() ||
      ll.getGioKetThuc() == null ||
      ll.getGioKetThuc().isBlank()
    ) {
      throw new RuntimeException("Thiếu thông tin ca làm");
    }

    if (!isFixedSlot(ll.getGioBatDau(), ll.getGioKetThuc())) {
      throw new RuntimeException("Ca làm không thuộc khung giờ cố định");
    }

    boolean duplicated = lichlamDAO.existsByNhanVienAndCaLam(
      ll.getMaNhanVien(),
      ll.getNgayLam(),
      ll.getGioBatDau(),
      ll.getGioKetThuc(),
      new String[] { STATUS_CHO_DUYET, STATUS_DA_DUYET }
    );
    if (duplicated) {
      throw new RuntimeException("Bạn đã đăng ký ca làm này rồi");
    }

    ll.setMaLich(lichlamDAO.generateMaLich());
    ll.setTrangThai(STATUS_CHO_DUYET);
    return lichlamDAO.insertLichLam(ll);
  }

  public ArrayList<LichLamDTO> getChoDuyet() {
    return lichlamDAO.getByTrangThai(STATUS_CHO_DUYET);
  }

  public boolean duyetDangKy(String maLich) {
    LichLamDTO ll = lichlamDAO.getById(maLich);
    if (ll == null) {
      throw new RuntimeException("Không tìm thấy đăng ký lịch làm");
    }
    if (!STATUS_CHO_DUYET.equalsIgnoreCase(ll.getTrangThai())) {
      throw new RuntimeException("Đăng ký này không ở trạng thái chờ duyệt");
    }

    boolean duplicated = lichlamDAO.existsByNhanVienAndCaLam(
      ll.getMaNhanVien(),
      ll.getNgayLam(),
      ll.getGioBatDau(),
      ll.getGioKetThuc(),
      new String[] { STATUS_DA_DUYET }
    );
    if (duplicated) {
      throw new RuntimeException("Ca làm đã được duyệt trước đó");
    }

    return lichlamDAO.updateTrangThai(maLich, STATUS_DA_DUYET);
  }

  public boolean tuChoiDangKy(String maLich) {
    LichLamDTO ll = lichlamDAO.getById(maLich);
    if (ll == null) {
      throw new RuntimeException("Không tìm thấy đăng ký lịch làm");
    }
    if (!STATUS_CHO_DUYET.equalsIgnoreCase(ll.getTrangThai())) {
      throw new RuntimeException("Đăng ký này không ở trạng thái chờ duyệt");
    }
    return lichlamDAO.updateTrangThai(maLich, STATUS_TU_CHOI);
  }

  public boolean ThemLichLam(LichLamDTO ll) {
    if (
      ll.getMaLich().isEmpty() || ll.getMaNhanVien().isEmpty()
    ) throw new RuntimeException("Ma lich va ma nhan vien không được rong");

    if (
      ll.getNgayLam().isEmpty() ||
      ll.getGioBatDau().isEmpty() ||
      ll.getGioKetThuc().isEmpty()
    ) throw new RuntimeException(
      "Ngay lam, gio bat dau, gio ket thuc không được rong"
    );

    // Gio bat dau < gio ket thuc
    if (
      ll.getGioBatDau().compareTo(ll.getGioKetThuc()) >= 0
    ) throw new RuntimeException("Gio bat dau phai nho hon gio ket thuc");

    if (ll.getTrangThai() == null || ll.getTrangThai().isBlank()) {
      ll.setTrangThai(STATUS_DA_DUYET);
    }

    return lichlamDAO.insertLichLam(ll);
  }

  public boolean SuaLichLam(LichLamDTO ll) {
    if (ll.getMaLich().isEmpty()) throw new RuntimeException(
      "Mã lịch làm ko được rỗng"
    );

    if (
      ll.getNgayLam().isEmpty() ||
      ll.getGioBatDau().isEmpty() ||
      ll.getGioKetThuc().isEmpty()
    ) throw new RuntimeException(
      "Ngày làm, giờ bắt đầu, giờ kết thúc ko được rỗng"
    );
    // Gio bat dau < gio ket thuc
    if (
      ll.getGioBatDau().compareTo(ll.getGioKetThuc()) >= 0
    ) throw new RuntimeException("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");

    if (ll.getTrangThai() == null || ll.getTrangThai().isBlank()) {
      ll.setTrangThai(STATUS_DA_DUYET);
    }

    return lichlamDAO.updateLichLam(ll);
  }

  public boolean XoaLichlam(String maLL) {
    return lichlamDAO.deleteLichLam(maLL);
  }
}
