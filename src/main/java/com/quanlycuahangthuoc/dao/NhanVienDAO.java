package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.NhanVienDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class NhanVienDAO {

  public ArrayList<NhanVienDTO> getAllNhanVien() {
    ArrayList<NhanVienDTO> ds = new ArrayList<>();

    String sql =
      "SELECT n.*, t.Email FROM NhanVien n LEFT JOIN TaiKhoan t ON n.MaTK = t.MaTK";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        NhanVienDTO nv = new NhanVienDTO();
        nv.setMaNhanVien(rs.getString("MaNV"));
        nv.setMaTaiKhoan(rs.getString("MaTK"));

        // Database has HoTen as single field - split for display
        String hoTen = rs.getString("HoTen");
        if (hoTen != null && !hoTen.isEmpty()) {
          String[] parts = hoTen.trim().split("\\s+", 2);
          if (parts.length == 1) {
            nv.setHo("");
            nv.setTen(parts[0]);
          } else {
            nv.setHo(parts[0]);
            nv.setTen(parts[1]);
          }
        } else {
          nv.setHo("");
          nv.setTen("");
        }

        nv.setGioiTinh(""); // No GioiTinh in DB, ChucVu is different
        nv.setDiaChi(rs.getString("DiaChi"));
        nv.setSDT(rs.getString("SDT"));
        nv.setEmail(rs.getString("Email"));

        ds.add(nv);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  // Tạo mã nhân viên tự động (NV001, NV002, ...)
  public String generateMaNV() {
    String sql = "SELECT MaNV FROM NhanVien ORDER BY MaNV DESC LIMIT 1";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      if (rs.next()) {
        String lastMa = rs.getString("MaNV");
        try {
          // Lấy số từ mã cuối (VD: NV001 -> 001)
          String numberPart = lastMa.substring(2);
          long number = Long.parseLong(numberPart);
          number++;
          // Format lại thành NV + số với độ dài tương tự
          int length = Math.max(3, numberPart.length());
          return String.format("NV%0" + length + "d", number);
        } catch (NumberFormatException e) {
          // Nếu parse thất bại, dùng timestamp
          return "NV" + System.currentTimeMillis();
        }
      } else {
        return "NV001";
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return "NV001";
  }

  public boolean insertNhanVien(NhanVienDTO nv) {
    // Schema: MaNV, HoTen, SDT, DiaChi, MaTK (no ChucVu column in database)
    String sql =
      "INSERT INTO NhanVien (MaNV, HoTen, SDT, DiaChi, MaTK) VALUES (?,?,?,?,?)";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, nv.getMaNhanVien());

      // Combine Ho and Ten into HoTen
      String hoTen = (nv.getHo() + " " + nv.getTen()).trim();
      ps.setString(2, hoTen);

      ps.setString(3, nv.getSDT());
      ps.setString(4, nv.getDiaChi());
      ps.setString(5, nv.getMaTaiKhoan());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      System.err.println("Error inserting NhanVien: " + e.getMessage());
    }
    return false;
  }

  public boolean updateNhanVien(NhanVienDTO nv) {
    // Schema: HoTen, SDT, DiaChi, MaTK (no ChucVu column in database)
    String sql =
      "UPDATE NhanVien SET HoTen=?, SDT=?, DiaChi=?, MaTK=? WHERE MaNV=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      // Combine Ho and Ten into HoTen
      String hoTen = (nv.getHo() + " " + nv.getTen()).trim();
      ps.setString(1, hoTen);

      ps.setString(2, nv.getSDT());
      ps.setString(3, nv.getDiaChi());
      ps.setString(4, nv.getMaTaiKhoan());
      ps.setString(5, nv.getMaNhanVien());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      System.err.println("Error updating NhanVien: " + e.getMessage());
    }
    return false;
  }

  public boolean deleteNhanVien(String MaNhanVien) {
    String sql = "DELETE FROM NhanVien WHERE MaNV=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaNhanVien);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }
}
