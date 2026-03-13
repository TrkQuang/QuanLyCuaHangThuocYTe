package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class CTPhieuNhapDAO {

  private String detectGiaColumn(Connection conn) throws SQLException {
    DatabaseMetaData meta = conn.getMetaData();

    try (
      ResultSet rs = meta.getColumns(
        conn.getCatalog(),
        null,
        "CT_PhieuNhap",
        "DonGiaNhap"
      )
    ) {
      if (rs.next()) {
        return "DonGiaNhap";
      }
    }

    try (
      ResultSet rs = meta.getColumns(
        conn.getCatalog(),
        null,
        "CT_PhieuNhap",
        "DonGia"
      )
    ) {
      if (rs.next()) {
        return "DonGia";
      }
    }

    try (
      ResultSet rs = meta.getColumns(
        conn.getCatalog(),
        null,
        "CT_PhieuNhap",
        "GiaNhap"
      )
    ) {
      if (rs.next()) {
        return "GiaNhap";
      }
    }

    return "DonGia";
  }

  private float readGiaNhap(ResultSet rs) throws SQLException {
    try {
      return rs.getFloat("DonGiaNhap");
    } catch (SQLException ex) {
      // fallback for old schema names
    }

    try {
      return rs.getFloat("DonGia");
    } catch (SQLException ex) {
      return rs.getFloat("GiaNhap");
    }
  }

  public ArrayList<CTPhieuNhapDTO> getAllCTPhieuNhap() {
    ArrayList<CTPhieuNhapDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM CT_PhieuNhap";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        CTPhieuNhapDTO ctpn = new CTPhieuNhapDTO();
        ctpn.setMaCTPN(rs.getString("MACTPN"));
        ctpn.setMaPhieuNhap(rs.getString("MaPN"));
        ctpn.setMaThuoc(rs.getString("MaThuoc"));
        ctpn.setSoLuongNhap(rs.getInt("SoLuong"));
        ctpn.setDonGia(readGiaNhap(rs));
        ds.add(ctpn);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertCTPhieuNhap(CTPhieuNhapDTO ctpn) {
    try (Connection conn = DBConnection.getConnection()) {
      String giaColumn = detectGiaColumn(conn);
      String sql =
        "INSERT INTO CT_PhieuNhap (MACTPN, MaPN, MaThuoc, SoLuong, " +
        giaColumn +
        ") VALUES (?,?,?,?,?)";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, ctpn.getMaCTPN());
        ps.setString(2, ctpn.getMaPhieuNhap());
        ps.setString(3, ctpn.getMaThuoc());
        ps.setInt(4, ctpn.getSoLuongNhap());
        ps.setFloat(5, ctpn.getDonGia());

        return ps.executeUpdate() > 0;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean insertCTPhieuNhap(Connection conn, CTPhieuNhapDTO ctpn)
    throws SQLException {
    String giaColumn = detectGiaColumn(conn);
    String sql =
      "INSERT INTO CT_PhieuNhap (MACTPN, MaPN, MaThuoc, SoLuong, " +
      giaColumn +
      ") VALUES (?,?,?,?,?)";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, ctpn.getMaCTPN());
      ps.setString(2, ctpn.getMaPhieuNhap());
      ps.setString(3, ctpn.getMaThuoc());
      ps.setInt(4, ctpn.getSoLuongNhap());
      ps.setFloat(5, ctpn.getDonGia());
      return ps.executeUpdate() > 0;
    }
  }

  public boolean updateCTPhieuNhap(CTPhieuNhapDTO ctpn) {
    try (Connection conn = DBConnection.getConnection()) {
      String giaColumn = detectGiaColumn(conn);
      String sql =
        "UPDATE CT_PhieuNhap SET MaPN=?, MaThuoc=?, SoLuong=?, " +
        giaColumn +
        "=? WHERE MACTPN=?";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, ctpn.getMaPhieuNhap());
        ps.setString(2, ctpn.getMaThuoc());
        ps.setInt(3, ctpn.getSoLuongNhap());
        ps.setFloat(4, ctpn.getDonGia());
        ps.setString(5, ctpn.getMaCTPN());

        return ps.executeUpdate() > 0;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteCTPhieuNhap(String MaCTPN) {
    String sql = "DELETE FROM CT_PhieuNhap WHERE MACTPN=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaCTPN);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public CTPhieuNhapDTO getCTPhieuNhapById(String maCTPN) {
    String sql = "SELECT * FROM CT_PhieuNhap WHERE MACTPN=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maCTPN);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        CTPhieuNhapDTO ctpn = new CTPhieuNhapDTO();
        ctpn.setMaCTPN(rs.getString("MACTPN"));
        ctpn.setMaPhieuNhap(rs.getString("MaPN"));
        ctpn.setMaThuoc(rs.getString("MaThuoc"));
        ctpn.setSoLuongNhap(rs.getInt("SoLuong"));
        ctpn.setDonGia(readGiaNhap(rs));
        return ctpn;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public ArrayList<CTPhieuNhapDTO> getCTPhieuNhapTheoMaPN(String maPhieuNhap) {
    ArrayList<CTPhieuNhapDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM CT_PhieuNhap WHERE MaPN=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maPhieuNhap);
      ResultSet rs = ps.executeQuery();

      while (rs.next()) {
        CTPhieuNhapDTO ctpn = new CTPhieuNhapDTO();
        ctpn.setMaCTPN(rs.getString("MACTPN"));
        ctpn.setMaPhieuNhap(rs.getString("MaPN"));
        ctpn.setMaThuoc(rs.getString("MaThuoc"));
        ctpn.setSoLuongNhap(rs.getInt("SoLuong"));
        ctpn.setDonGia(readGiaNhap(rs));
        ds.add(ctpn);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public ArrayList<CTPhieuNhapDTO> getCTPhieuNhapTheoMaPN(
    Connection conn,
    String maPhieuNhap
  ) throws SQLException {
    ArrayList<CTPhieuNhapDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM CT_PhieuNhap WHERE MaPN=?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, maPhieuNhap);
      try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
          CTPhieuNhapDTO ctpn = new CTPhieuNhapDTO();
          ctpn.setMaCTPN(rs.getString("MACTPN"));
          ctpn.setMaPhieuNhap(rs.getString("MaPN"));
          ctpn.setMaThuoc(rs.getString("MaThuoc"));
          ctpn.setSoLuongNhap(rs.getInt("SoLuong"));
          ctpn.setDonGia(readGiaNhap(rs));
          ds.add(ctpn);
        }
      }
    }
    return ds;
  }

  public boolean deleteByMaPhieuNhap(Connection conn, String maPhieuNhap)
    throws SQLException {
    String sql = "DELETE FROM CT_PhieuNhap WHERE MaPN=?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, maPhieuNhap);
      ps.executeUpdate();
      return true;
    }
  }
}
