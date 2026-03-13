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
        hd.setTrangThai(rs.getString("TrangThai"));
        ds.add(hd);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertHoaDon(HoaDonDTO hd) {
    String sql =
      "INSERT INTO HoaDon (MaHD, NgayTao, TongTien, MaKH, MaNV, TrangThai) VALUES (?,?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, hd.getMaHoaDon());
      ps.setString(2, hd.getNgayTao());
      ps.setFloat(3, hd.getTongTien());
      ps.setString(4, hd.getMaKhachHang());
      ps.setString(5, hd.getMaNhanVien());
      ps.setString(
        6,
        (hd.getTrangThai() == null || hd.getTrangThai().isBlank())
          ? "CHO_XAC_NHAN"
          : hd.getTrangThai()
      );
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean insertHoaDon(Connection conn, HoaDonDTO hd)
    throws SQLException {
    String sql =
      "INSERT INTO HoaDon (MaHD, NgayTao, TongTien, MaKH, MaNV, TrangThai) VALUES (?,?,?,?,?,?)";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, hd.getMaHoaDon());
      ps.setString(2, hd.getNgayTao());
      ps.setFloat(3, hd.getTongTien());
      ps.setString(4, hd.getMaKhachHang());
      ps.setString(5, hd.getMaNhanVien());
      ps.setString(
        6,
        (hd.getTrangThai() == null || hd.getTrangThai().isBlank())
          ? "CHO_XAC_NHAN"
          : hd.getTrangThai()
      );
      return ps.executeUpdate() > 0;
    }
  }

  public boolean updateTongTien(Connection conn, String maHD, float tongTien)
    throws SQLException {
    String sql = "UPDATE HoaDon SET TongTien=? WHERE MaHD=?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setFloat(1, tongTien);
      ps.setString(2, maHD);
      return ps.executeUpdate() > 0;
    }
  }

  public boolean updateHoaDon(HoaDonDTO hd) {
    String sql =
      "UPDATE HoaDon SET MaKH=?, NgayTao=?, TongTien=?, MaNV=?, TrangThai=? WHERE MaHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, hd.getMaKhachHang());
      ps.setString(2, hd.getNgayTao());
      ps.setFloat(3, hd.getTongTien());
      ps.setString(4, hd.getMaNhanVien());
      ps.setString(5, hd.getTrangThai());
      ps.setString(6, hd.getMaHoaDon());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public HoaDonDTO getByMaHoaDon(String maHoaDon) {
    String sql = "SELECT * FROM HoaDon WHERE MaHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maHoaDon);
      ResultSet rs = ps.executeQuery();
      if (rs.next()) {
        HoaDonDTO hd = new HoaDonDTO();
        hd.setMaHoaDon(rs.getString("MaHD"));
        hd.setMaKhachHang(rs.getString("MaKH"));
        hd.setMaNhanVien(rs.getString("MaNV"));
        java.sql.Date ngayTao = rs.getDate("NgayTao");
        hd.setNgayTao(ngayTao != null ? ngayTao.toString() : "");
        hd.setTongTien(rs.getFloat("TongTien"));
        hd.setTrangThai(rs.getString("TrangThai"));
        return hd;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public HoaDonDTO getByMaHoaDon(Connection conn, String maHoaDon)
    throws SQLException {
    String sql = "SELECT * FROM HoaDon WHERE MaHD=?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, maHoaDon);
      try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
          HoaDonDTO hd = new HoaDonDTO();
          hd.setMaHoaDon(rs.getString("MaHD"));
          hd.setMaKhachHang(rs.getString("MaKH"));
          hd.setMaNhanVien(rs.getString("MaNV"));
          java.sql.Date ngayTao = rs.getDate("NgayTao");
          hd.setNgayTao(ngayTao != null ? ngayTao.toString() : "");
          hd.setTongTien(rs.getFloat("TongTien"));
          hd.setTrangThai(rs.getString("TrangThai"));
          return hd;
        }
      }
    }
    return null;
  }

  public boolean updateTrangThai(String maHoaDon, String trangThai) {
    String sql = "UPDATE HoaDon SET TrangThai=? WHERE MaHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, trangThai);
      ps.setString(2, maHoaDon);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateTrangThai(
    Connection conn,
    String maHoaDon,
    String trangThai
  ) throws SQLException {
    String sql = "UPDATE HoaDon SET TrangThai=? WHERE MaHD=?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, trangThai);
      ps.setString(2, maHoaDon);
      return ps.executeUpdate() > 0;
    }
  }

  public boolean updateTrangThaiAndTongTien(
    String maHoaDon,
    String trangThai,
    float tongTien
  ) {
    String sql = "UPDATE HoaDon SET TrangThai=?, TongTien=? WHERE MaHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, trangThai);
      ps.setFloat(2, tongTien);
      ps.setString(3, maHoaDon);
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
