package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.HoaDonDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class HoaDonDAO {

  public ArrayList<HoaDonDTO> getAllHoaDon() {
    ArrayList<HoaDonDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM HoaDon";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        HoaDonDTO hd = new HoaDonDTO();
        hd.setMaHoaDon(rs.getString("MaHD"));
        hd.setMaKhachHang(rs.getString("MaKH"));
        hd.setMaNhanVien(rs.getString("MaNV"));
        java.sql.Date ngayTao = rs.getDate("NgayTao");
        hd.setNgayTao(ngayTao != null ? ngayTao.toString() : "");
        hd.setTongTien(rs.getFloat("TongTien"));
        // TrangThai not in DB, set default or skip
        hd.setTrangThai("");
        ds.add(hd);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertHoaDon(HoaDonDTO hd) {
    String sql =
      "INSERT INTO HoaDon (MaHD, NgayTao, TongTien, MaKH, MaNV) VALUES (?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, hd.getMaHoaDon());
      ps.setString(2, hd.getNgayTao());
      ps.setFloat(3, hd.getTongTien());
      ps.setString(4, hd.getMaKhachHang());
      ps.setString(5, hd.getMaNhanVien());
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateHoaDon(HoaDonDTO hd) {
    String sql =
      "UPDATE HoaDon SET MaKH=?, NgayTao=?, TongTien=?, MaNV=? WHERE MaHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, hd.getMaKhachHang());
      ps.setString(2, hd.getNgayTao());
      ps.setFloat(3, hd.getTongTien());
      ps.setString(4, hd.getMaNhanVien());
      ps.setString(5, hd.getMaHoaDon());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteHoaDon(String MaHoaDon) {
    String sql = "DELETE FROM HoaDon WHERE MaHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaHoaDon);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public int countByNhanVien(String maNV) {
    String sql = "SELECT COUNT(*) FROM HoaDon WHERE MaNV=?";
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

  public int countByKhachHang(String maKH) {
    String sql = "SELECT COUNT(*) FROM HoaDon WHERE MaKH=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql);
    ) {
      ps.setString(1, maKH);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) return rs.getInt(1);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return 0;
  }
}
