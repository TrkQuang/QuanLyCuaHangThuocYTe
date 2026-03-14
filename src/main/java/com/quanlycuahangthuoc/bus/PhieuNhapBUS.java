package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.CTPhieuNhapDAO;
import com.quanlycuahangthuoc.dao.PhieuNhapDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;
import com.quanlycuahangthuoc.dto.PhieuNhapDTO;
import com.quanlycuahangthuoc.dto.requests.CreatePhieuNhapRequest;
import com.quanlycuahangthuoc.exception.DatabaseException;
import com.quanlycuahangthuoc.exception.ValidationException;
import java.sql.Connection;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhieuNhapBUS {

  private static final String STATUS_CHO_XAC_NHAN = "CHO_XAC_NHAN";
  private static final String STATUS_DA_XAC_NHAN = "DA_XAC_NHAN";
  private static final String STATUS_DA_HUY = "DA_HUY";

  @Autowired
  private PhieuNhapDAO phieunhapDAO;

  @Autowired
  private CTPhieuNhapDAO ctPhieuNhapDAO;

  @Autowired
  private ThuocDAO thuocDAO;

  public boolean ThemPhieuNhap(PhieuNhapDTO pn) {
    if (
      pn.getMaPhieuNhap().isEmpty() ||
      pn.getMaNhaCungCap().isEmpty() ||
      pn.getMaNhanVien().isEmpty() ||
      pn.getNgayNhap().isEmpty()
    ) throw new RuntimeException("Thông tin cơ bản không được rỗng!");
    pn.setTongTien(0); // lúc mới tạo phiếu thì chưa có chi tiết
    pn.setTrangThai(STATUS_CHO_XAC_NHAN);
    return phieunhapDAO.insertPhieuNhap(pn);
  }

  public boolean XoaPhieuNhap(PhieuNhapDTO pn) {
    int tontai = phieunhapDAO.demSoCTTheoMaPhieuNhap(pn.getMaPhieuNhap());
    if (tontai != 0) throw new RuntimeException(
      "Phiếu nhập này đã có chi tiết, không thể xóa"
    );
    return phieunhapDAO.deletePhieuNhap(pn.getMaPhieuNhap());
  }

  public boolean taoPhieuNhapVaChiTiet(CreatePhieuNhapRequest request) {
    if (request == null || request.getPhieuNhap() == null) {
      throw new ValidationException("Thiếu thông tin phiếu nhập");
    }

    PhieuNhapDTO pn = request.getPhieuNhap();
    List<CTPhieuNhapDTO> dsChiTiet = request.getChiTiet();

    if (pn.getMaPhieuNhap() == null || pn.getMaPhieuNhap().isBlank()) {
      throw new ValidationException("Mã phiếu nhập không được rỗng");
    }
    if (pn.getMaNhanVien() == null || pn.getMaNhanVien().isBlank()) {
      throw new ValidationException("Mã nhân viên không được rỗng");
    }
    if (pn.getMaNhaCungCap() == null || pn.getMaNhaCungCap().isBlank()) {
      throw new ValidationException("Mã nhà cung cấp không được rỗng");
    }
    if (dsChiTiet.isEmpty()) {
      throw new ValidationException(
        "Phiếu nhập phải có ít nhất 1 dòng chi tiết"
      );
    }

    Connection conn = null;
    try {
      conn = DBConnection.getConnection();
      conn.setAutoCommit(false);

      if (pn.getNgayNhap() == null || pn.getNgayNhap().isBlank()) {
        pn.setNgayNhap(LocalDate.now().toString());
      }
      pn.setTongTien(0);
      pn.setTrangThai(STATUS_CHO_XAC_NHAN);
      if (!phieunhapDAO.insertPhieuNhap(conn, pn)) {
        throw new DatabaseException("Không thể tạo phiếu nhập");
      }

      float tongTien = 0;
      for (CTPhieuNhapDTO ct : dsChiTiet) {
        if (ct.getMaThuoc() == null || ct.getMaThuoc().isBlank()) {
          throw new ValidationException("Mã thuoc không được rỗng");
        }
        if (ct.getSoLuongNhap() <= 0 || ct.getDonGia() <= 0) {
          throw new ValidationException("Số lượng và đơn giá phải lớn hơn 0");
        }
        if (ct.getMaCTPN() == null || ct.getMaCTPN().isBlank()) {
          ct.setMaCTPN("CTPN" + System.nanoTime());
        }
        ct.setMaPhieuNhap(pn.getMaPhieuNhap());

        if (!ctPhieuNhapDAO.insertCTPhieuNhap(conn, ct)) {
          throw new DatabaseException("Không thể thêm chi tiết phiếu nhập");
        }
        tongTien += ct.getSoLuongNhap() * ct.getDonGia();
      }

      if (!phieunhapDAO.updateTongTien(conn, pn.getMaPhieuNhap(), tongTien)) {
        throw new DatabaseException("Không thể cập nhật tổng tiền phiếu nhập");
      }

      conn.commit();
      return true;
    } catch (Exception e) {
      DBConnection.rollbackQuietly(conn);
      if (e instanceof RuntimeException) {
        throw (RuntimeException) e;
      }
      throw new DatabaseException(
        "Tạo phiếu nhập thất bại: " + e.getMessage(),
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

  public boolean capNhatChiTietPhieuNhap(
    String maPhieuNhap,
    List<CTPhieuNhapDTO> dsChiTiet
  ) {
    if (maPhieuNhap == null || maPhieuNhap.isBlank()) {
      throw new ValidationException("Mã phiếu nhập không hợp lệ");
    }
    if (dsChiTiet == null || dsChiTiet.isEmpty()) {
      throw new ValidationException(
        "Phiếu nhập phải có ít nhất 1 dòng chi tiết"
      );
    }

    PhieuNhapDTO pn = phieunhapDAO.getById(maPhieuNhap);
    if (pn == null) {
      throw new ValidationException("Không tìm thấy phiếu nhập");
    }
    if (!isPendingStatus(pn.getTrangThai())) {
      throw new ValidationException(
        "Phiếu nhập đã hoàn tất, không thể chỉnh sửa"
      );
    }

    Connection conn = null;
    try {
      conn = DBConnection.getConnection();
      conn.setAutoCommit(false);

      if (!ctPhieuNhapDAO.deleteByMaPhieuNhap(conn, maPhieuNhap)) {
        throw new DatabaseException("Không thể xóa chi tiết phiếu nhập cũ");
      }

      float tongTien = 0;
      for (CTPhieuNhapDTO ct : dsChiTiet) {
        if (ct.getMaThuoc() == null || ct.getMaThuoc().isBlank()) {
          throw new ValidationException("Mã thuoc không được rỗng");
        }
        if (ct.getSoLuongNhap() <= 0 || ct.getDonGia() <= 0) {
          throw new ValidationException("Số lượng và đơn giá phải lớn hơn 0");
        }

        if (ct.getMaCTPN() == null || ct.getMaCTPN().isBlank()) {
          ct.setMaCTPN("CTPN" + System.nanoTime());
        }
        ct.setMaPhieuNhap(maPhieuNhap);

        if (!ctPhieuNhapDAO.insertCTPhieuNhap(conn, ct)) {
          throw new DatabaseException("Không thể thêm chi tiết phiếu nhập");
        }
        tongTien += ct.getSoLuongNhap() * ct.getDonGia();
      }

      if (
        !phieunhapDAO.updateTongTienAndTrangThai(
          conn,
          maPhieuNhap,
          tongTien,
          STATUS_CHO_XAC_NHAN
        )
      ) {
        throw new DatabaseException("Không thể cập nhật tổng tiền phiếu nhập");
      }

      conn.commit();
      return true;
    } catch (Exception e) {
      DBConnection.rollbackQuietly(conn);
      if (e instanceof RuntimeException) {
        throw (RuntimeException) e;
      }
      throw new DatabaseException(
        "Cập nhật phiếu nhập thất bại: " + e.getMessage(),
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

  public boolean xacNhanPhieuNhap(String maPhieuNhap) {
    if (maPhieuNhap == null || maPhieuNhap.isBlank()) return false;

    Connection conn = null;
    try {
      conn = DBConnection.getConnection();
      conn.setAutoCommit(false);

      PhieuNhapDTO pn = phieunhapDAO.getById(maPhieuNhap);
      if (pn == null) {
        DBConnection.rollbackQuietly(conn);
        return false;
      }
      if (!isPendingStatus(pn.getTrangThai())) {
        DBConnection.rollbackQuietly(conn);
        return false;
      }

      List<CTPhieuNhapDTO> details = ctPhieuNhapDAO.getCTPhieuNhapTheoMaPN(
        conn,
        maPhieuNhap
      );
      if (details.isEmpty()) {
        DBConnection.rollbackQuietly(conn);
        return false;
      }

      for (CTPhieuNhapDTO ct : details) {
        if (
          !thuocDAO.CongSoLuongTon(conn, ct.getMaThuoc(), ct.getSoLuongNhap())
        ) {
          throw new DatabaseException(
            "Không thể cập nhật tồn kho cho thuoc: " + ct.getMaThuoc()
          );
        }
      }

      if (
        !phieunhapDAO.updateTongTienAndTrangThai(
          conn,
          maPhieuNhap,
          pn.getTongTien(),
          STATUS_DA_XAC_NHAN
        )
      ) {
        throw new DatabaseException("Không thể cập nhật trạng thái phiếu nhập");
      }

      conn.commit();
      return true;
    } catch (Exception e) {
      DBConnection.rollbackQuietly(conn);
      if (e instanceof RuntimeException) {
        throw (RuntimeException) e;
      }
      throw new DatabaseException(
        "Xác nhận phiếu nhập thất bại: " + e.getMessage(),
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

  public boolean huyPhieuNhap(String maPhieuNhap) {
    if (maPhieuNhap == null || maPhieuNhap.isBlank()) return false;

    PhieuNhapDTO pn = phieunhapDAO.getById(maPhieuNhap);
    if (pn == null) return false;
    if (!isPendingStatus(pn.getTrangThai())) return false;

    return phieunhapDAO.updateTrangThai(maPhieuNhap, STATUS_DA_HUY);
  }

  private boolean isPendingStatus(String status) {
    String normalized = String.valueOf(status == null ? "" : status)
      .trim()
      .toUpperCase();
    return "CHO_XAC_NHAN".equals(normalized) || "CHOXACNHAN".equals(normalized);
  }
}
