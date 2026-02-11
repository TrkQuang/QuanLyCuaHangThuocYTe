package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.NhaCungCapDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class NhaCungCapDAO {

  public ArrayList<NhaCungCapDTO> getAllNhaCungCap() {
    ArrayList<NhaCungCapDTO> ds = new ArrayList<>();

    String sql = "SELECT * FROM NhaCungCap";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        NhaCungCapDTO ncc = new NhaCungCapDTO();
        ncc.setMaNhaCungCap(rs.getString("MaNCC"));
        ncc.setTenNhaCungCap(rs.getString("TenNCC"));
        ncc.setDiaChi(rs.getString("DiaChi"));
        ncc.setSDT(rs.getString("SDT"));
        // TrangThai not in DB
        ncc.setTrangThai("");
        ds.add(ncc);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertNhaCungCap(NhaCungCapDTO ncc) {
    String sql =
      "INSERT INTO NhaCungCap (MaNCC, TenNCC, SDT, DiaChi) VALUES (?,?,?,?)";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, ncc.getMaNhaCungCap());
      ps.setString(2, ncc.getTenNhaCungCap());
      ps.setString(3, ncc.getSDT());
      ps.setString(4, ncc.getDiaChi());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateNhaCungCap(NhaCungCapDTO ncc) {
    String sql =
      "UPDATE NhaCungCap SET TenNhaCungCap=?, DiaChi=?, SDT=?, TrangThai=? WHERE MaNhaCungCap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, ncc.getTenNhaCungCap());
      ps.setString(2, ncc.getDiaChi());
      ps.setString(3, ncc.getSDT());
      ps.setString(4, ncc.getTrangThai());
      ps.setString(5, ncc.getMaNhaCungCap());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteNhaCungCap(String MaNhaCungCap) {
    String sql = "DELETE FROM NhaCungCap WHERE MaNhaCungCap=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaNhaCungCap);

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public NhaCungCapDTO getById(String maNCC) {
    String sql = "SELECT * FROM NhaCungCap WHERE MaNhaCungCap=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, maNCC);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        NhaCungCapDTO ncc = new NhaCungCapDTO();
        ncc.setMaNhaCungCap(rs.getString("MaNhaCungCap"));
        ncc.setTenNhaCungCap(rs.getString("TenNhaCungCap"));
        ncc.setSDT(rs.getString("SDT"));
        ncc.setDiaChi(rs.getString("DiaChi"));
        ncc.setTrangThai(rs.getString("TrangThai"));
        return ncc;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }
}
