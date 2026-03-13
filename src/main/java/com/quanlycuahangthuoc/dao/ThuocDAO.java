package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class ThuocDAO {

  public ArrayList<ThuocDTO> getAllThuoc() {
    ArrayList<ThuocDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM Thuoc";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql);
    ) {
      while (rs.next()) {
        ThuocDTO t = new ThuocDTO();
        t.setMaThuoc(rs.getString("MaThuoc"));
        t.setMaNhaCungCap("");
        t.setTenThuoc(rs.getString("TenThuoc"));
        t.setHinhAnh(
          hasColumn(rs, "HinhAnh")
            ? rs.getString("HinhAnh")
            : "img/UATThuoc.jpg"
        );
        t.setDonViTinh(rs.getString("DonViTinh"));
        java.sql.Date nsx = rs.getDate("NgaySanXuat");
        t.setNSX(nsx != null ? nsx.toString() : "");

        // HanSuDung is DATE type in DB
        java.sql.Date hsd = rs.getDate("HanSuDung");
        t.setHSD(hsd != null ? hsd.toString() : "");

        t.setGiaBan(rs.getFloat("GiaBan"));
        t.setSoLuongTon(rs.getInt("SoLuongTon")); // Column name is SoLuongTon

        ds.add(t);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertThuoc(ThuocDTO t) {
    String sql =
      "INSERT INTO Thuoc (MaThuoc, TenThuoc, HinhAnh, DonViTinh, GiaBan, SoLuongTon, HanSuDung, NgaySanXuat) VALUES (?,?,?,?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, t.getMaThuoc());
      ps.setString(2, t.getTenThuoc());
      ps.setString(3, t.getHinhAnh());
      ps.setString(4, t.getDonViTinh());
      ps.setFloat(5, t.getGiaBan());
      ps.setInt(6, t.getSoLuongTon());

      if (t.getHSD() != null && !t.getHSD().isEmpty()) {
        ps.setString(7, t.getHSD());
      } else {
        ps.setNull(7, java.sql.Types.DATE);
      }

      if (t.getNSX() != null && !t.getNSX().isEmpty()) {
        ps.setString(8, t.getNSX());
      } else {
        ps.setNull(8, java.sql.Types.DATE);
      }

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      System.err.println("Error inserting Thuoc: " + e.getMessage());
    }
    return false;
  }

  public boolean updateThuoc(ThuocDTO t) {
    String sql =
      "UPDATE Thuoc SET TenThuoc=?, HinhAnh=?, DonViTinh=?, GiaBan=?, SoLuongTon=?, HanSuDung=?, NgaySanXuat=? WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, t.getTenThuoc());
      ps.setString(2, t.getHinhAnh());
      ps.setString(3, t.getDonViTinh());
      ps.setFloat(4, t.getGiaBan());
      ps.setInt(5, t.getSoLuongTon());

      if (t.getHSD() != null && !t.getHSD().isEmpty()) {
        ps.setString(6, t.getHSD());
      } else {
        ps.setNull(6, java.sql.Types.DATE);
      }

      if (t.getNSX() != null && !t.getNSX().isEmpty()) {
        ps.setString(7, t.getNSX());
      } else {
        ps.setNull(7, java.sql.Types.DATE);
      }

      ps.setString(8, t.getMaThuoc());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      System.err.println("Error updating Thuoc: " + e.getMessage());
    }
    return false;
  }

  public boolean deleteThuoc(String MaThuoc) {
    String sql = "DELETE FROM Thuoc WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaThuoc);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public ThuocDTO getById(String maThuoc) {
    String sql = "SELECT * FROM Thuoc WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maThuoc);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        ThuocDTO t = new ThuocDTO();
        t.setMaThuoc(rs.getString("MaThuoc"));
        t.setMaNhaCungCap("");
        t.setTenThuoc(rs.getString("TenThuoc"));
        t.setHinhAnh(
          hasColumn(rs, "HinhAnh")
            ? rs.getString("HinhAnh")
            : "img/UATThuoc.jpg"
        );
        t.setDonViTinh(rs.getString("DonViTinh"));
        java.sql.Date nsx = rs.getDate("NgaySanXuat");
        t.setNSX(nsx != null ? nsx.toString() : "");

        // HanSuDung is DATE type in DB
        java.sql.Date hsd = rs.getDate("HanSuDung");
        t.setHSD(hsd != null ? hsd.toString() : "");

        t.setGiaBan(rs.getFloat("GiaBan"));
        t.setSoLuongTon(rs.getInt("SoLuongTon"));
        return t;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public boolean CongSoLuongTon(String maThuoc, int soLuong) {
    String sql = "UPDATE Thuoc SET SoLuongTon = SoLuongTon + ? WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setInt(1, soLuong);
      ps.setString(2, maThuoc);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean CongSoLuongTon(Connection conn, String maThuoc, int soLuong)
    throws SQLException {
    String sql = "UPDATE Thuoc SET SoLuongTon = SoLuongTon + ? WHERE MaThuoc=?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setInt(1, soLuong);
      ps.setString(2, maThuoc);
      return ps.executeUpdate() > 0;
    }
  }

  public float getGiaBanByMaThuoc(Connection conn, String maThuoc)
    throws SQLException {
    String sql = "SELECT GiaBan FROM Thuoc WHERE MaThuoc=?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, maThuoc);
      try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
          return rs.getFloat("GiaBan");
        }
      }
    }
    throw new SQLException("Không tìm thấy thuốc: " + maThuoc);
  }

  // Tạo mã thuốc tự động (TH001, TH002, ...)
  public String generateMaThuoc() {
    String sql = "SELECT MaThuoc FROM Thuoc ORDER BY MaThuoc DESC LIMIT 1";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      if (rs.next()) {
        String lastMa = rs.getString("MaThuoc");
        try {
          // Lấy số từ mã cuối (VD: TH001 -> 001)
          String numberPart = lastMa.substring(2);
          long number = Long.parseLong(numberPart);
          number++;
          // Format lại thành TH + số với độ dài tương tự
          int length = Math.max(3, numberPart.length());
          return String.format("TH%0" + length + "d", number);
        } catch (NumberFormatException e) {
          // Nếu parse thất bại, dùng timestamp
          return "TH" + System.currentTimeMillis();
        }
      } else {
        return "TH001";
      }
    } catch (SQLException | NumberFormatException e) {
      e.printStackTrace();
    }
    return "TH001";
  }

  private boolean hasColumn(ResultSet rs, String columnName) {
    try {
      ResultSetMetaData metaData = rs.getMetaData();
      int columnCount = metaData.getColumnCount();
      for (int i = 1; i <= columnCount; i++) {
        if (columnName.equalsIgnoreCase(metaData.getColumnLabel(i))) {
          return true;
        }
      }
    } catch (SQLException ignored) {
      // Keep backward compatibility and fallback to default values.
    }
    return false;
  }
}
