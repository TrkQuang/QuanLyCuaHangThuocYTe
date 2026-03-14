package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.CTHoaDonDAO;
import com.quanlycuahangthuoc.dao.HoaDonDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.CTHoaDonDTO;
import com.quanlycuahangthuoc.dto.HoaDonDTO;
import com.quanlycuahangthuoc.dto.requests.CreateHoaDonRequest;
import com.quanlycuahangthuoc.exception.DatabaseException;
import com.quanlycuahangthuoc.exception.ValidationException;
import java.sql.Connection;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HoaDonBUS {

  private static final String STATUS_CHO_XAC_NHAN = "CHO_XAC_NHAN";
  private static final String STATUS_DA_THANH_TOAN = "DA_THANH_TOAN";
  private static final String STATUS_HUY = "HUY";

  @Autowired
  private HoaDonDAO hoaDonDAO;

  @Autowired
  private CTHoaDonDAO ctHoaDonDAO;

  @Autowired
  private ThuocDAO thuocDAO;

  public boolean taoHoaDon(HoaDonDTO hd) {
    hd.setTrangThai(STATUS_CHO_XAC_NHAN);
    hd.setTongTien(0);
    return hoaDonDAO.insertHoaDon(hd);
  }

  public boolean thanhToanHoaDon(HoaDonDTO hd) {
    if (hd == null || hd.getMaHoaDon() == null || hd.getMaHoaDon().isBlank()) {
      return false;
    }

    Connection conn = null;
    try {
      conn = DBConnection.getConnection();
      conn.setAutoCommit(false);

      HoaDonDTO current = hoaDonDAO.getByMaHoaDon(conn, hd.getMaHoaDon());
      if (current == null) {
        DBConnection.rollbackQuietly(conn);
        return false;
      }
      if (!isPendingStatus(current.getTrangThai())) {
        DBConnection.rollbackQuietly(conn);
        return false;
      }
      if (current.getTongTien() <= 0) {
        DBConnection.rollbackQuietly(conn);
        return false;
      }

      List<CTHoaDonDTO> details = ctHoaDonDAO.getCTHoaDonByMaHoaDon(
        conn,
        hd.getMaHoaDon()
      );
      if (details.isEmpty()) {
        DBConnection.rollbackQuietly(conn);
        return false;
      }

      for (CTHoaDonDTO ct : details) {
        if (!thuocDAO.CongSoLuongTon(conn, ct.getMaThuoc(), -ct.getSoLuong())) {
          throw new DatabaseException(
            "Không du ton kho cho thuoc: " + ct.getMaThuoc()
          );
        }
      }

      if (
        !hoaDonDAO.updateTrangThai(conn, hd.getMaHoaDon(), STATUS_DA_THANH_TOAN)
      ) {
        throw new DatabaseException("Không thể cap nhat trạng thái hóa đơn");
      }

      conn.commit();
      return true;
    } catch (Exception e) {
      DBConnection.rollbackQuietly(conn);
      throw new DatabaseException(
        "Xác nhận hóa đơn thất bại: " + e.getMessage(),
        e
      );
    } finally {
      if (conn != null) {
        try {
          conn.setAutoCommit(true);
          conn.close();
        } catch (Exception ignored) {}
      }
    }
  }

  public boolean huyHoaDon(HoaDonDTO hd) {
    if (hd == null || hd.getMaHoaDon() == null || hd.getMaHoaDon().isBlank()) {
      return false;
    }

    HoaDonDTO current = hoaDonDAO.getByMaHoaDon(hd.getMaHoaDon());
    if (current == null) return false;
    if (!isPendingStatus(current.getTrangThai())) return false;

    return hoaDonDAO.updateTrangThai(hd.getMaHoaDon(), STATUS_HUY);
  }

  private boolean isPendingStatus(String status) {
    String normalized = String.valueOf(status == null ? "" : status)
      .trim()
      .toUpperCase()
      .replace(' ', '_');
    return (
      STATUS_CHO_XAC_NHAN.equals(normalized) ||
      "CHOXACNHAN".equals(normalized) ||
      "CHO_XAC_NHAN".equals(normalized)
    );
  }

  public ArrayList<HoaDonDTO> getAllHoaDon() {
    return hoaDonDAO.getAllHoaDon();
  }

  public boolean taoHoaDonVaChiTiet(CreateHoaDonRequest request) {
    if (request == null || request.getHoaDon() == null) {
      throw new ValidationException("Thiếu thông tin hóa đơn");
    }

    HoaDonDTO hd = request.getHoaDon();
    List<CTHoaDonDTO> dsChiTiet = request.getChiTiet();

    if (hd.getMaHoaDon() == null || hd.getMaHoaDon().isBlank()) {
      throw new ValidationException("Mã hóa đơn không được rỗng");
    }
    if (hd.getMaKhachHang() == null || hd.getMaKhachHang().isBlank()) {
      throw new ValidationException("Mã khách hàng không được rỗng");
    }
    if (hd.getMaNhanVien() == null || hd.getMaNhanVien().isBlank()) {
      throw new ValidationException("Mã nhân viên không được rỗng");
    }
    if (dsChiTiet.isEmpty()) {
      throw new ValidationException("Hóa đơn phải có ít nhất 1 dòng chi tiết");
    }

    Connection conn = null;
    try {
      conn = DBConnection.getConnection();
      conn.setAutoCommit(false);

      if (hd.getNgayTao() == null || hd.getNgayTao().isBlank()) {
        hd.setNgayTao(LocalDate.now().toString());
      }
      if (hd.getTrangThai() == null || hd.getTrangThai().isBlank()) {
        hd.setTrangThai(STATUS_CHO_XAC_NHAN);
      }
      hd.setTongTien(0);
      if (!hoaDonDAO.insertHoaDon(conn, hd)) {
        throw new DatabaseException("Không thể tạo hóa đơn");
      }

      float tongTien = 0;
      for (CTHoaDonDTO ct : dsChiTiet) {
        if (ct.getMaThuoc() == null || ct.getMaThuoc().isBlank()) {
          throw new ValidationException("Mã thuoc không được rỗng");
        }
        if (ct.getSoLuong() <= 0) {
          throw new ValidationException("Số lượng phải lớn hơn 0");
        }
        if (ct.getMaCTHD() == null || ct.getMaCTHD().isBlank()) {
          ct.setMaCTHD("CTHD" + System.nanoTime());
        }
        ct.setMaHoaDon(hd.getMaHoaDon());

        float giaBan = thuocDAO.getGiaBanByMaThuoc(conn, ct.getMaThuoc());
        ct.setDonGiaBan(giaBan);
        if (!ctHoaDonDAO.insertCTHoaDon(conn, ct)) {
          throw new DatabaseException("Không thể thêm chi tiết hóa đơn");
        }
        tongTien += ct.getSoLuong() * giaBan;
      }

      if (!hoaDonDAO.updateTongTien(conn, hd.getMaHoaDon(), tongTien)) {
        throw new DatabaseException("Không thể cập nhật tổng tiền hóa đơn");
      }

      conn.commit();
      return true;
    } catch (Exception e) {
      DBConnection.rollbackQuietly(conn);
      if (e instanceof RuntimeException) {
        throw (RuntimeException) e;
      }
      throw new DatabaseException("Tạo hóa đơn thất bại: " + e.getMessage(), e);
    } finally {
      if (conn != null) {
        try {
          conn.setAutoCommit(true);
          conn.close();
        } catch (Exception ignored) {}
      }
    }
  }
}
