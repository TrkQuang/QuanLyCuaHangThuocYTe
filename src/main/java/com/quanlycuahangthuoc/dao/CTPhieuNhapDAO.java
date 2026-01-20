package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.CTPhieuNhapDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class CTPhieuNhapDAO {

  public ArrayList<CTPhieuNhapDTO> getAllCTPhieuNhap() {
    ArrayList<CTPhieuNhapDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM CTPhieuNhap";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        CTPhieuNhapDTO ctpn = new CTPhieuNhapDTO();
        ctpn.setMaCTPN(rs.getString("MaCTPN"));
        ctpn.setMaPhieuNhap(rs.getString("MaPhieuNhap"));
        ctpn.setMaThuoc(rs.getString("MaThuoc"));
        ctpn.setSoLuongNhap(rs.getInt("SoLuongNhap"));
        ctpn.setDonGia(rs.getFloat("DonGia"));
        ds.add(ctpn);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertCTPhieuNhap(CTPhieuNhapDTO ctpn) {
    String sql = "INSERT INTO CTPhieuNhap VALUES (?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, ctpn.getMaCTPN());
      ps.setString(2, ctpn.getMaPhieuNhap());
      ps.setString(3, ctpn.getMaThuoc());
      ps.setInt(4, ctpn.getSoLuongNhap());
      ps.setFloat(5, ctpn.getDonGia());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateCTPhieuNhap(CTPhieuNhapDTO ctpn) {
    String sql =
      "UPDATE CTPhieuNhap SET MaPhieuNhap=?, MaThuoc=?, SoLuongNhap=?, DonGia=? WHERE MaCTPN=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, ctpn.getMaPhieuNhap());
      ps.setString(2, ctpn.getMaThuoc());
      ps.setInt(3, ctpn.getSoLuongNhap());
      ps.setFloat(4, ctpn.getDonGia());
      ps.setString(5, ctpn.getMaCTPN());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteCTPhieuNhap(String MaCTPN) {
    String sql = "DELETE FROM CTPhieuNhap WHERE MaCTPN=?";
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
    String sql = "SELECT * FROM CTPhieuNhap WHERE MaCTPN=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maCTPN);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        CTPhieuNhapDTO ctpn = new CTPhieuNhapDTO();
        ctpn.setMaCTPN(rs.getString("MaCTPN"));
        ctpn.setMaPhieuNhap(rs.getString("MaPhieuNhap"));
        ctpn.setMaThuoc(rs.getString("MaThuoc"));
        ctpn.setSoLuongNhap(rs.getInt("SoLuongNhap"));
        ctpn.setDonGia(rs.getFloat("DonGia"));
        return ctpn;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public ArrayList<CTPhieuNhapDTO> getCTPhieuNhapTheoMaPN(String maPhieuNhap) {
    ArrayList<CTPhieuNhapDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM CTPhieuNhap WHERE MaPhieuNhap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maPhieuNhap);
      ResultSet rs = ps.executeQuery();

      while (rs.next()) {
        CTPhieuNhapDTO ctpn = new CTPhieuNhapDTO();
        ctpn.setMaCTPN(rs.getString("MaCTPN"));
        ctpn.setMaPhieuNhap(rs.getString("MaPhieuNhap"));
        ctpn.setMaThuoc(rs.getString("MaThuoc"));
        ctpn.setSoLuongNhap(rs.getInt("SoLuongNhap"));
        ctpn.setDonGia(rs.getFloat("DonGia"));
        ds.add(ctpn);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }
}
