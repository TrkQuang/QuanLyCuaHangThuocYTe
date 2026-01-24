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
        nv.setHo(rs.getString("Ho"));
        nv.setTen(rs.getString("Ten"));
        nv.setGioiTinh(rs.getString("GioiTinh"));
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
        // Lấy số từ mã cuối (VD: NV001 -> 001)
        int number = Integer.parseInt(lastMa.substring(2));
        number++;
        // Format lại thành NV + 3 chữ số
        return String.format("NV%03d", number);
      } else {
        return "NV001";
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return "NV001";
  }

  public boolean insertNhanVien(NhanVienDTO nv) {
    String sql =
      "INSERT INTO NhanVien (MaNV, Ho, Ten, GioiTinh, SDT, DiaChi, MaTK) VALUES (?,?,?,?,?,?,?)";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, nv.getMaNhanVien());
      ps.setString(2, nv.getHo());
      ps.setString(3, nv.getTen());
      ps.setString(4, nv.getGioiTinh());
      ps.setString(5, nv.getSDT());
      ps.setString(6, nv.getDiaChi());
      ps.setString(7, nv.getMaTaiKhoan());
      ps.setString(7, nv.getMaTaiKhoan());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateNhanVien(NhanVienDTO nv) {
    String sql =
      "UPDATE NhanVien SET MaTK=?, Ho=?, Ten=?, GioiTinh=?, SDT=?, DiaChi=? WHERE MaNV=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, nv.getMaTaiKhoan());
      ps.setString(2, nv.getHo());
      ps.setString(3, nv.getTen());
      ps.setString(4, nv.getGioiTinh());
      ps.setString(5, nv.getSDT());
      ps.setString(6, nv.getDiaChi());
      ps.setString(7, nv.getMaNhanVien());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
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
