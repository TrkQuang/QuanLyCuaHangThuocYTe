package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.CTHoaDonDTO;
import java.sql.*;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class CTHoaDonDAO {

  public ArrayList<CTHoaDonDTO> getAllCTHoaDon() {
    ArrayList<CTHoaDonDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM CT_HoaDon";

    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        CTHoaDonDTO cthd = new CTHoaDonDTO();
        cthd.setMaCTHD(rs.getString("MaCTHD"));
        cthd.setMaHoaDon(rs.getString("MaHD"));
        cthd.setMaThuoc(rs.getString("MaThuoc"));
        cthd.setSoLuong(rs.getInt("SoLuong"));
        cthd.setHDSD(rs.getString("HuongDanSD"));
        cthd.setDonGiaBan(rs.getFloat("DonGiaBan"));
        ds.add(cthd);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertCTHoaDon(CTHoaDonDTO cthd) {
    String sql =
      "INSERT INTO CT_HoaDon (MaCTHD, MaHD, MaThuoc, SoLuong, HuongDanSD, DonGiaBan) VALUES (?,?,?,?,?,?)";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, cthd.getMaCTHD());
      ps.setString(2, cthd.getMaHoaDon());
      ps.setString(3, cthd.getMaThuoc());
      ps.setInt(4, cthd.getSoLuong());
      ps.setString(5, cthd.getHDSD());
      ps.setFloat(6, cthd.getDonGiaBan());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean insertCTHoaDon(Connection conn, CTHoaDonDTO cthd)
    throws SQLException {
    String sql =
      "INSERT INTO CT_HoaDon (MaCTHD, MaHD, MaThuoc, SoLuong, HuongDanSD, DonGiaBan) VALUES (?,?,?,?,?,?)";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, cthd.getMaCTHD());
      ps.setString(2, cthd.getMaHoaDon());
      ps.setString(3, cthd.getMaThuoc());
      ps.setInt(4, cthd.getSoLuong());
      ps.setString(5, cthd.getHDSD());
      ps.setFloat(6, cthd.getDonGiaBan());
      return ps.executeUpdate() > 0;
    }
  }

  public boolean updateCTHoaDon(CTHoaDonDTO cthd) {
    String sql =
      "UPDATE CT_HoaDon SET MaHD=?, MaThuoc=?, SoLuong=?, HuongDanSD=?, DonGiaBan=? WHERE MaCTHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, cthd.getMaHoaDon());
      ps.setString(2, cthd.getMaThuoc());
      ps.setInt(3, cthd.getSoLuong());
      ps.setString(4, cthd.getHDSD());
      ps.setFloat(5, cthd.getDonGiaBan());
      ps.setString(6, cthd.getMaCTHD());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteCTHoaDon(String MaCTHD) {
    String sql = "DELETE FROM CT_HoaDon WHERE MaCTHD=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql);
    ) {
      ps.setString(1, MaCTHD);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public ArrayList<CTHoaDonDTO> getCTHoaDonByMaHoaDon(String maHoaDon) {
    ArrayList<CTHoaDonDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM CT_HoaDon WHERE MaHD=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maHoaDon);
      ResultSet rs = ps.executeQuery();

      while (rs.next()) {
        CTHoaDonDTO ct = new CTHoaDonDTO();
        ct.setMaCTHD(rs.getString("MaCTHD"));
        ct.setMaHoaDon(rs.getString("MaHD"));
        ct.setMaThuoc(rs.getString("MaThuoc"));
        ct.setSoLuong(rs.getInt("SoLuong"));
        ct.setHDSD(rs.getString("HuongDanSD"));
        ct.setDonGiaBan(rs.getFloat("DonGiaBan"));
        ds.add(ct);
      }
      rs.close();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public ArrayList<CTHoaDonDTO> getCTHoaDonByMaHoaDon(
    Connection conn,
    String maHoaDon
  ) throws SQLException {
    ArrayList<CTHoaDonDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM CT_HoaDon WHERE MaHD=?";

    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, maHoaDon);
      try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
          CTHoaDonDTO ct = new CTHoaDonDTO();
          ct.setMaCTHD(rs.getString("MaCTHD"));
          ct.setMaHoaDon(rs.getString("MaHD"));
          ct.setMaThuoc(rs.getString("MaThuoc"));
          ct.setSoLuong(rs.getInt("SoLuong"));
          ct.setHDSD(rs.getString("HuongDanSD"));
          ct.setDonGiaBan(rs.getFloat("DonGiaBan"));
          ds.add(ct);
        }
      }
    }
    return ds;
  }
}
