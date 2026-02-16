package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
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
        // Skip MaNhaCungCap - column name unknown in actual DB
        t.setMaNhaCungCap("");
        t.setTenThuoc(rs.getString("TenThuoc"));
        t.setDonViTinh(rs.getString("DonViTinh"));
        t.setNSX(""); // NSX not in DB

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
    // Schema thực tế: MaThuoc, TenThuoc, DonViTinh, GiaBan, SoLuongTon, HanSuDung (không rõ tên cột nhà cung cấp)
    String sql =
      "INSERT INTO Thuoc (MaThuoc, TenThuoc, DonViTinh, GiaBan, SoLuongTon, HanSuDung) VALUES (?,?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, t.getMaThuoc());
      ps.setString(2, t.getTenThuoc());
      ps.setString(3, t.getDonViTinh());
      ps.setFloat(4, t.getGiaBan());
      ps.setInt(5, t.getSoLuongTon());

      // Handle HanSuDung
      if (t.getHSD() != null && !t.getHSD().isEmpty()) {
        ps.setString(6, t.getHSD());
      } else {
        ps.setNull(6, java.sql.Types.DATE);
      }

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      System.err.println("Error inserting Thuoc: " + e.getMessage());
    }
    return false;
  }

  public boolean updateThuoc(ThuocDTO t) {
    // Schema fields: TenThuoc, DonViTinh, GiaBan, SoLuongTon, HanSuDung (không có MaNCC)
    String sql =
      "UPDATE Thuoc SET TenThuoc=?, DonViTinh=?, GiaBan=?, SoLuongTon=?, HanSuDung=? WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, t.getTenThuoc());
      ps.setString(2, t.getDonViTinh());
      ps.setFloat(3, t.getGiaBan());
      ps.setInt(4, t.getSoLuongTon());

      if (t.getHSD() != null && !t.getHSD().isEmpty()) {
        ps.setString(5, t.getHSD());
      } else {
        ps.setNull(5, java.sql.Types.DATE);
      }

      ps.setString(6, t.getMaThuoc());

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
        t.setMaNhaCungCap(""); // Not in DB
        t.setTenThuoc(rs.getString("TenThuoc"));
        t.setDonViTinh(rs.getString("DonViTinh"));
        t.setNSX(""); // Not in DB

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
}
