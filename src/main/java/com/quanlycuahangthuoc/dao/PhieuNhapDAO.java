package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.PhieuNhapDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class PhieuNhapDAO {

  public ArrayList<PhieuNhapDTO> getAllPhieuNhap() {
    ArrayList<PhieuNhapDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM PhieuNhap";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        PhieuNhapDTO pn = new PhieuNhapDTO();
        pn.setMaPhieuNhap(rs.getString("MaPN"));
        pn.setMaNhanVien(rs.getString("MaNV"));
        pn.setMaNhaCungCap(rs.getString("MaNCC"));
        java.sql.Date ngayNhap = rs.getDate("NgayNhap");
        pn.setNgayNhap(ngayNhap != null ? ngayNhap.toString() : "");
        pn.setTongTien(rs.getFloat("TongTien"));

        ds.add(pn);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertPhieuNhap(PhieuNhapDTO pn) {
    String sql =
      "INSERT INTO PhieuNhap (MaPN, NgayNhap, TongTien, MaNV, MaNCC) VALUES (?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, pn.getMaPhieuNhap());
      ps.setString(2, pn.getNgayNhap());
      ps.setFloat(3, pn.getTongTien());
      ps.setString(4, pn.getMaNhanVien());
      ps.setString(5, pn.getMaNhaCungCap());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updatePhieuNhap(PhieuNhapDTO pn) {
    String sql =
      "UPDATE PhieuNhap SET MaNhanVien=?, MaNhaCungCap=?, NgayNhap=?, TongTien=? WHERE MaPhieuNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, pn.getMaNhanVien());
      ps.setString(2, pn.getMaNhaCungCap());
      ps.setString(3, pn.getNgayNhap());
      ps.setFloat(4, pn.getTongTien());
      ps.setString(5, pn.getMaPhieuNhap());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deletePhieuNhap(String MaPhieuNhap) {
    String sql = "DELETE FROM PhieuNhap WHERE MaPhieuNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaPhieuNhap);

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public PhieuNhapDTO getById(String maPhieuNhap) {
    String sql = "SELECT * FROM PhieuNhap WHERE MaPhieuNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maPhieuNhap);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        PhieuNhapDTO pn = new PhieuNhapDTO();
        pn.setMaPhieuNhap(rs.getString("MaPhieuNhap"));
        pn.setMaNhanVien(rs.getString("MaNhanVien"));
        pn.setMaNhaCungCap(rs.getString("MaNhaCungCap"));
        pn.setNgayNhap(rs.getString("NgayNhap"));
        pn.setTongTien(rs.getFloat("TongTien"));
        return pn;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  //hàm để CTPhieuNhap cộng tiền vào phiếu nhập
  public boolean CongTongTien(String maPhieuNhap, float tien) {
    String sql =
      "UPDATE PhieuNhap SET TongTien = TongTien + ? WHERE MaPhieuNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setFloat(1, tien);
      ps.setString(2, maPhieuNhap);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  //đếm số chi tiết nhập theo mã phiếu nhập
  public int demSoCTTheoMaPhieuNhap(String maPN) {
    String sql = "SELECT COUNT(*) FROM CTPhieuNhap WHERE MaPhieuNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maPN);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) return rs.getInt(1);
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return 0;
  }

  //đếm số phiếu nhập theo mã nhà cung cấp
  public int countByNhaCungCap(String maNhaCungCap) {
    String sql = "SELECT COUNT(*) FROM PhieuNhap WHERE MaNhaCungCap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maNhaCungCap);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) return rs.getInt(1);
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return 0;
  }

  public int countByNhanVien(String maNV) {
    String sql = "SELECT COUNT(*) FROM PhieuNhap WHERE MaNhanVien=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql);
    ) {
      ps.setString(1, maNV);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) return rs.getInt(1);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return 0;
  }
}
