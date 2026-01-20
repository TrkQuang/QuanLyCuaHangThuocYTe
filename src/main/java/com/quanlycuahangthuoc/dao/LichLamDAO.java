package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.LichLamDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class LichLamDAO {

  public ArrayList<LichLamDTO> getAllLichLam() {
    ArrayList<LichLamDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM LichLam";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        LichLamDTO ll = new LichLamDTO();
        ll.setMaLich(rs.getString("MaLich"));
        ll.setMaNhanVien(rs.getString("MaNhanVien"));
        ll.setNgayLam(rs.getString("NgayLam"));
        ll.setGioBatDau(rs.getString("GioBatDau"));
        ll.setGioKetThuc(rs.getString("GioKetThuc"));

        ds.add(ll);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertLichLam(LichLamDTO ll) {
    String sql = "INSERT INTO LichLam VALUES (?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, ll.getMaLich());
      ps.setString(2, ll.getMaNhanVien());
      ps.setString(3, ll.getNgayLam());
      ps.setString(4, ll.getGioBatDau());
      ps.setString(5, ll.getGioKetThuc());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateLichLam(LichLamDTO ll) {
    String sql =
      "UPDATE LichLam SET MaNhanVien=?, NgayLam=?, GioBatDau=?, GioKetThuc=? WHERE MaLich=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, ll.getMaNhanVien());
      ps.setString(2, ll.getNgayLam());
      ps.setString(3, ll.getGioBatDau());
      ps.setString(4, ll.getGioKetThuc());
      ps.setString(5, ll.getMaLich());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteLichLam(String MaLich) {
    String sql = "DELETE FROM LichLam WHERE MaLich=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaLich);

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public LichLamDTO getById(String maLich) {
    String sql = "SELECT * FROM LichLam WHERE MaLich=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maLich);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        LichLamDTO ll = new LichLamDTO();
        ll.setMaLich(rs.getString("MaLich"));
        ll.setMaNhanVien(rs.getString("MaNhanVien"));
        ll.setNgayLam(rs.getString("NgayLam"));
        ll.setGioBatDau(rs.getString("GioBatDau"));
        ll.setGioKetThuc(rs.getString("GioKetThuc"));
        return ll;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public ArrayList<LichLamDTO> getLichLamByNhanVien(String maNhanVien) {
    ArrayList<LichLamDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM LichLam WHERE MaNhanVien=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maNhanVien);
      ResultSet rs = ps.executeQuery();

      while (rs.next()) {
        LichLamDTO ll = new LichLamDTO();
        ll.setMaLich(rs.getString("MaLich"));
        ll.setMaNhanVien(rs.getString("MaNhanVien"));
        ll.setNgayLam(rs.getString("NgayLam"));
        ll.setGioBatDau(rs.getString("GioBatDau"));
        ll.setGioKetThuc(rs.getString("GioKetThuc"));
        ds.add(ll);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }
}
