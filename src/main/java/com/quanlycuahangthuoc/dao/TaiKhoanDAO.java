package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class TaiKhoanDAO {

  public ArrayList<TaiKhoanDTO> getAllTaiKhoan() {
    ArrayList<TaiKhoanDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM TaiKhoan";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        TaiKhoanDTO tk = new TaiKhoanDTO();
        tk.setMaTaiKhoan(rs.getString("MaTK"));
        tk.setTenDangNhap(rs.getString("TenDangNhap"));
        tk.setEmail(rs.getString("Email"));
        tk.setLoaiTaiKhoan(rs.getString("LoaiTK"));
        tk.setMatKhau(rs.getString("MatKhau"));

        ds.add(tk);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertTaiKhoan(TaiKhoanDTO tk) {
    String sql =
      "INSERT INTO TaiKhoan (MaTK, TenDangNhap, MatKhau, Email, LoaiTK) VALUES (?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, tk.getMaTaiKhoan());
      ps.setString(2, tk.getTenDangNhap());
      ps.setString(3, tk.getMatKhau());
      ps.setString(4, tk.getEmail());
      ps.setString(5, tk.getLoaiTaiKhoan());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateTaiKhoan(TaiKhoanDTO tk) {
    String sql =
      "UPDATE TaiKhoan SET TenDangNhap=?, Email=?, LoaiTK=?, MatKhau=? WHERE MaTK=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, tk.getTenDangNhap());
      ps.setString(2, tk.getEmail());
      ps.setString(3, tk.getLoaiTaiKhoan());
      ps.setString(4, tk.getMatKhau());
      ps.setString(5, tk.getMaTaiKhoan());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteTaiKhoan(String MaTaiKhoan) {
    String sql = "DELETE FROM TaiKhoan WHERE MaTK=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaTaiKhoan);

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateMatKhau(String maTK, String matKhauMoi) {
    String sql = "UPDATE TaiKhoan SET MatKhau=? WHERE MaTK=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, matKhauMoi);
      ps.setString(2, maTK);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateLoaiTaiKhoan(String maTK, String loaiTaiKhoan) {
    String sql = "UPDATE TaiKhoan SET LoaiTK=? WHERE MaTK=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, loaiTaiKhoan);
      ps.setString(2, maTK);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean existUsername(String username) {
    String sql = "SELECT 1 FROM TaiKhoan WHERE TenDangNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, username);
      ResultSet rs = ps.executeQuery();
      return rs.next();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean existEmail(String email) {
    String sql = "SELECT 1 FROM TaiKhoan WHERE Email=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, email);
      ResultSet rs = ps.executeQuery();
      return rs.next();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public TaiKhoanDTO getByUsername(String username) {
    String sql = "SELECT * FROM TaiKhoan WHERE TenDangNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, username);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) {
        TaiKhoanDTO tk = new TaiKhoanDTO();
        tk.setMaTaiKhoan(rs.getString("MaTK"));
        tk.setTenDangNhap(rs.getString("TenDangNhap"));
        tk.setMatKhau(rs.getString("MatKhau"));
        tk.setEmail(rs.getString("Email"));
        tk.setLoaiTaiKhoan(rs.getString("LoaiTK"));
        return tk;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public TaiKhoanDTO getById(String maTK) {
    String sql = "SELECT * FROM TaiKhoan WHERE MaTK=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maTK);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) {
        TaiKhoanDTO tk = new TaiKhoanDTO();
        tk.setMaTaiKhoan(rs.getString("MaTK"));
        tk.setTenDangNhap(rs.getString("TenDangNhap"));
        tk.setMatKhau(rs.getString("MatKhau"));
        tk.setEmail(rs.getString("Email"));
        tk.setLoaiTaiKhoan(rs.getString("LoaiTK"));
        return tk;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  // Tạo mã tài khoản tự động (TK001, TK002, ...)
  public String generateMaTK() {
    String sql = "SELECT MaTK FROM TaiKhoan ORDER BY MaTK DESC LIMIT 1";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      if (rs.next()) {
        String lastMa = rs.getString("MaTK");
        try {
          // Lấy số từ mã cuối (VD: TK001 -> 001)
          String numberPart = lastMa.substring(2);
          long number = Long.parseLong(numberPart);
          number++;
          // Format lại thành TK + số với độ dài tương tự
          int length = Math.max(3, numberPart.length());
          return String.format("TK%0" + length + "d", number);
        } catch (NumberFormatException e) {
          // Nếu parse thất bại, dùng timestamp
          return "TK" + System.currentTimeMillis();
        }
      } else {
        return "TK001";
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return "TK001"; // Default nếu có lỗi
  }
}
