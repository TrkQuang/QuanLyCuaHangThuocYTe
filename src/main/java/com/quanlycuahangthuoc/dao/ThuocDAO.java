package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class ThuocDAO {

  public ArrayList<ThuocDTO> getAllThuoc() {
    ArrayList<ThuocDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM Thuoc";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql);
    ) {
      while (rs.next()) {
        ThuocDTO t = new ThuocDTO();
        t.setMaThuoc(rs.getString("MaThuoc"));
        t.setMaNhaCungCap(rs.getString("MaNhaCungCap"));
        t.setTenThuoc(rs.getString("TenThuoc"));
        t.setDonViTinh(rs.getString("DonViTinh"));
        t.setNSX(rs.getString("NSX"));
        t.setHSD(rs.getString("HSD"));
        t.setGiaBan(rs.getFloat("GiaBan"));
        t.setSoLuongTon(rs.getInt("SoLuongTon"));

        ds.add(t);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertThuoc(ThuocDTO t) {
    String sql = "INSERT INTO Thuoc VALUES (?,?,?,?,?,?,?,?)";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, t.getMaThuoc());
      ps.setString(2, t.getMaNhaCungCap());
      ps.setString(3, t.getTenThuoc());
      ps.setString(4, t.getDonViTinh());
      ps.setString(5, t.getNSX());
      ps.setString(6, t.getHSD());
      ps.setFloat(7, t.getGiaBan());
      ps.setInt(8, t.getSoLuongTon());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateThuoc(ThuocDTO t) {
    String sql =
      "UPDATE Thuoc SET MaNhaCungCap=?, TenThuoc=?, DonViTinh=?, NSX=?,HSD=?, GiaBan=?, SoLuongTon=? WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, t.getMaNhaCungCap());
      ps.setString(2, t.getTenThuoc());
      ps.setString(3, t.getDonViTinh());
      ps.setString(4, t.getNSX());
      ps.setString(5, t.getHSD());
      ps.setFloat(6, t.getGiaBan());
      ps.setInt(7, t.getSoLuongTon());
      ps.setString(8, t.getMaThuoc());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteThuoc(String MaThuoc) {
    String sql = "DELETE FROM Thuoc WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaThuoc);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public ThuocDTO getById(String maThuoc) {
    String sql = "SELECT * FROM Thuoc WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maThuoc);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        ThuocDTO t = new ThuocDTO();
        t.setMaThuoc(rs.getString("MaThuoc"));
        t.setMaNhaCungCap(rs.getString("MaNhaCungCap"));
        t.setTenThuoc(rs.getString("TenThuoc"));
        t.setDonViTinh(rs.getString("DonViTinh"));
        t.setNSX(rs.getString("NSX"));
        t.setHSD(rs.getString("HSD"));
        t.setGiaBan(rs.getFloat("GiaBan"));
        t.setSoLuongTon(rs.getInt("SoLuongTon"));
        return t;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public boolean CongSoLuongTon(String maThuoc, int soLuong) {
    String sql = "UPDATE Thuoc SET SoLuongTon = SoLuongTon + ? WHERE MaThuoc=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setInt(1, soLuong);
      ps.setString(2, maThuoc);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }
}
