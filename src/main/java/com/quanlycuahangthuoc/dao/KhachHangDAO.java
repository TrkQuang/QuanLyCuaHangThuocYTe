package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import java.sql.*;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository //giúp Spring hiểu đây là lớp truy xuất dữ liệu.
public class KhachHangDAO {

  private Boolean hasGioiTinhColumnCache = null;

  private boolean hasGioiTinhColumn(Connection conn) {
    if (hasGioiTinhColumnCache != null) {
      return hasGioiTinhColumnCache;
    }
    try (
      ResultSet rs = conn
        .getMetaData()
        .getColumns(conn.getCatalog(), null, "KhachHang", "GioiTinh")
    ) {
      hasGioiTinhColumnCache = rs.next();
    } catch (SQLException e) {
      hasGioiTinhColumnCache = false;
    }
    return hasGioiTinhColumnCache;
  }

  // Lấy danh sách tất cả khách hàng
  public ArrayList<KhachHangDTO> getAllKhachHang() {
    ArrayList<KhachHangDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM KhachHang"; //Lấy toàn bộ bảng

    try (
      Connection conn = DBConnection.getConnection(); //mở kết nối csdl
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        KhachHangDTO kh = new KhachHangDTO();
        kh.setMaKhachHang(rs.getString("MaKH")); // MaKH in DB
        kh.setMaTaiKhoan(rs.getString("MaTK")); // MaTK in DB

        // Database has HoTen as single field
        String hoTen = rs.getString("HoTen");
        if (hoTen != null && !hoTen.isEmpty()) {
          String[] parts = hoTen.trim().split("\\s+", 2);
          kh.setHo(parts.length > 0 ? parts[0] : "");
          kh.setTen(parts.length > 1 ? parts[1] : "");
        }

        java.sql.Date ngaySinh = rs.getDate("NgaySinh");
        kh.setNgaySinh(ngaySinh != null ? ngaySinh.toString() : "");
        try {
          kh.setGioiTinh(rs.getString("GioiTinh"));
        } catch (SQLException ignored) {
          kh.setGioiTinh("");
        }
        kh.setSDT(rs.getString("SDT"));
        kh.setDiaChi(rs.getString("DiaChi"));
        kh.setTienSuBenhLy(rs.getString("TienSuBenhLy"));

        ds.add(kh);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  // Thêm khách hàng
  public boolean insertKhachHang(KhachHangDTO kh) {
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(
        hasGioiTinhColumn(conn)
          ? "INSERT INTO KhachHang (MaKH, HoTen, NgaySinh, GioiTinh, SDT, DiaChi, TienSuBenhLy, MaTK) VALUES (?,?,?,?,?,?,?,?)"
          : "INSERT INTO KhachHang (MaKH, HoTen, NgaySinh, SDT, DiaChi, TienSuBenhLy, MaTK) VALUES (?,?,?,?,?,?,?)"
      )
    ) {
      ps.setString(1, kh.getMaKhachHang());
      String hoTen = (kh.getHo() + " " + kh.getTen()).trim();
      ps.setString(2, hoTen);
      if (kh.getNgaySinh() == null || kh.getNgaySinh().isBlank()) {
        ps.setNull(3, Types.DATE);
      } else {
        ps.setString(3, kh.getNgaySinh());
      }
      if (hasGioiTinhColumn(conn)) {
        ps.setString(4, kh.getGioiTinh());
        ps.setString(5, kh.getSDT());
        ps.setString(6, kh.getDiaChi());
        ps.setString(7, kh.getTienSuBenhLy());
        ps.setString(8, kh.getMaTaiKhoan());
      } else {
        ps.setString(4, kh.getSDT());
        ps.setString(5, kh.getDiaChi());
        ps.setString(6, kh.getTienSuBenhLy());
        ps.setString(7, kh.getMaTaiKhoan());
      }

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  // Cập nhật khách hàng
  public boolean updateKhachHang(KhachHangDTO kh) {
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(
        hasGioiTinhColumn(conn)
          ? "UPDATE KhachHang SET HoTen=?, NgaySinh=?, GioiTinh=?, SDT=?, DiaChi=?, TienSuBenhLy=?, MaTK=? WHERE MaKH=?"
          : "UPDATE KhachHang SET HoTen=?, NgaySinh=?, SDT=?, DiaChi=?, TienSuBenhLy=?, MaTK=? WHERE MaKH=?"
      )
    ) {
      String hoTen = (kh.getHo() + " " + kh.getTen()).trim();
      ps.setString(1, hoTen);
      if (kh.getNgaySinh() == null || kh.getNgaySinh().isBlank()) {
        ps.setNull(2, Types.DATE);
      } else {
        ps.setString(2, kh.getNgaySinh());
      }
      if (hasGioiTinhColumn(conn)) {
        ps.setString(3, kh.getGioiTinh());
        ps.setString(4, kh.getSDT());
        ps.setString(5, kh.getDiaChi());
        ps.setString(6, kh.getTienSuBenhLy());
        ps.setString(7, kh.getMaTaiKhoan());
        ps.setString(8, kh.getMaKhachHang());
      } else {
        ps.setString(3, kh.getSDT());
        ps.setString(4, kh.getDiaChi());
        ps.setString(5, kh.getTienSuBenhLy());
        ps.setString(6, kh.getMaTaiKhoan());
        ps.setString(7, kh.getMaKhachHang());
      }

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  // Xóa khách hàng
  public boolean deleteKhachHang(String MaKhachHang) {
    String sql = "DELETE FROM KhachHang WHERE MaKH=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaKhachHang);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public KhachHangDTO getByMaTK(String maTK) {
    String sql = "SELECT * FROM KhachHang WHERE MaTK=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maTK);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) {
        KhachHangDTO kh = new KhachHangDTO();
        kh.setMaKhachHang(rs.getString("MaKH"));
        kh.setMaTaiKhoan(rs.getString("MaTK"));
        String hoTen = rs.getString("HoTen");
        if (hoTen != null && !hoTen.isBlank()) {
          String[] parts = hoTen.trim().split("\\s+", 2);
          kh.setHo(parts.length > 0 ? parts[0] : "");
          kh.setTen(parts.length > 1 ? parts[1] : "");
        }
        java.sql.Date ngaySinh = rs.getDate("NgaySinh");
        kh.setNgaySinh(ngaySinh != null ? ngaySinh.toString() : "");
        try {
          kh.setGioiTinh(rs.getString("GioiTinh"));
        } catch (SQLException ignored) {
          kh.setGioiTinh("");
        }
        kh.setSDT(rs.getString("SDT"));
        kh.setDiaChi(rs.getString("DiaChi"));
        kh.setTienSuBenhLy(rs.getString("TienSuBenhLy"));
        return kh;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public KhachHangDTO getBySDT(String sdt) {
    String sql = "SELECT * FROM KhachHang WHERE SDT=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, sdt);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) {
        KhachHangDTO kh = new KhachHangDTO();
        kh.setMaKhachHang(rs.getString("MaKH"));
        kh.setMaTaiKhoan(rs.getString("MaTK"));
        String hoTen = rs.getString("HoTen");
        if (hoTen != null && !hoTen.isBlank()) {
          String[] parts = hoTen.trim().split("\\s+", 2);
          kh.setHo(parts.length > 0 ? parts[0] : "");
          kh.setTen(parts.length > 1 ? parts[1] : "");
        }
        java.sql.Date ngaySinh = rs.getDate("NgaySinh");
        kh.setNgaySinh(ngaySinh != null ? ngaySinh.toString() : "");
        try {
          kh.setGioiTinh(rs.getString("GioiTinh"));
        } catch (SQLException ignored) {
          kh.setGioiTinh("");
        }
        kh.setSDT(rs.getString("SDT"));
        kh.setDiaChi(rs.getString("DiaChi"));
        kh.setTienSuBenhLy(rs.getString("TienSuBenhLy"));
        return kh;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public String generateMaKH() {
    String sql = "SELECT MaKH FROM KhachHang ORDER BY MaKH DESC LIMIT 1";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      if (rs.next()) {
        String lastMa = rs.getString("MaKH");
        String numberPart = lastMa.substring(2);
        long number = Long.parseLong(numberPart) + 1;
        int len = Math.max(3, numberPart.length());
        return String.format("KH%0" + len + "d", number);
      }
      return "KH001";
    } catch (Exception e) {
      e.printStackTrace();
      return "KH" + System.currentTimeMillis();
    }
  }
}
