package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import java.sql.*;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository //giúp Spring hiểu đây là lớp truy xuất dữ liệu.
public class KhachHangDAO {

  // Lấy danh sách tất cả khách hàng
  public ArrayList<KhachHangDTO> getAllKhachHang() {
    ArrayList<KhachHangDTO> ds = new ArrayList<>();
    String sql = "SELECT * FROM KhachHang"; //Lấy toàn bộ bảng

    try (
      Connection conn = DBConnection.getConnection(); //mở kết nối csdl
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        KhachHangDTO kh = new KhachHangDTO();
        kh.setMaKhachHang(rs.getString("MaKH")); // MaKH in DB
        kh.setMaTaiKhoan(rs.getString("MaTK")); // MaTK in DB

        // Database has HoTen as single field
        String hoTen = rs.getString("HoTen");
        if (hoTen != null && !hoTen.isEmpty()) {
          String[] parts = hoTen.trim().split("\\s+", 2);
          kh.setHo(parts.length > 0 ? parts[0] : "");
          kh.setTen(parts.length > 1 ? parts[1] : "");
        }

        java.sql.Date ngaySinh = rs.getDate("NgaySinh");
        kh.setNgaySinh(ngaySinh != null ? ngaySinh.toString() : "");
        kh.setGioiTinh(rs.getString("GioiTinh"));
        kh.setSDT(rs.getString("SDT"));
        kh.setDiaChi(rs.getString("DiaChi"));
        kh.setTienSuBenhLy(rs.getString("TienSuBenhLy"));

        ds.add(kh);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  // Thêm khách hàng
  public boolean insertKhachHang(KhachHangDTO kh) {
    String sql =
      "INSERT INTO KhachHang (MaKH, HoTen, NgaySinh, GioiTinh, SDT, DiaChi, TienSuBenhLy, MaTK) VALUES (?,?,?,?,?,?,?,?)";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, kh.getMaKhachHang());
      String hoTen = (kh.getHo() + " " + kh.getTen()).trim();
      ps.setString(2, hoTen);
      ps.setString(3, kh.getNgaySinh());
      ps.setString(4, kh.getGioiTinh());
      ps.setString(5, kh.getSDT());
      ps.setString(6, kh.getDiaChi());
      ps.setString(7, kh.getTienSuBenhLy());
      ps.setString(8, kh.getMaTaiKhoan());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  // Cập nhật khách hàng
  public boolean updateKhachHang(KhachHangDTO kh) {
    String sql =
      "UPDATE KhachHang SET HoTen=?, NgaySinh=?, GioiTinh=?, SDT=?, DiaChi=?, TienSuBenhLy=?, MaTK=? WHERE MaKH=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      String hoTen = (kh.getHo() + " " + kh.getTen()).trim();
      ps.setString(1, hoTen);
      ps.setString(2, kh.getNgaySinh());
      ps.setString(3, kh.getGioiTinh());
      ps.setString(4, kh.getSDT());
      ps.setString(5, kh.getDiaChi());
      ps.setString(6, kh.getTienSuBenhLy());
      ps.setString(7, kh.getMaTaiKhoan());
      ps.setString(8, kh.getMaKhachHang());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  // Xóa khách hàng
  public boolean deleteKhachHang(String MaKhachHang) {
    String sql = "DELETE FROM KhachHang WHERE MaKH=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaKhachHang);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }
}
