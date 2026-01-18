package com.quanlycuahangthuoc.dao;
import org.springframework.stereotype.Repository;
import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import java.sql.*;
import java.util.ArrayList;
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
        kh.setMaKhachHang(rs.getString("MaKhachHang"));
        kh.setMaTaiKhoan(rs.getString("TaiKhoan"));
        kh.setHo(rs.getString("Ho"));
        kh.setTen(rs.getString("Ten"));
        kh.setNgaySinh(rs.getString("NgaySinh"));
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
    String sql = "INSERT INTO KhachHang VALUES (?,?,?,?,?,?,?,?,?)";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, kh.getMaKhachHang());
      ps.setString(2, kh.getMaTaiKhoan());
      ps.setString(3, kh.getHo());
      ps.setString(4, kh.getTen());
      ps.setString(5, kh.getNgaySinh());
      ps.setString(6, kh.getGioiTinh());
      ps.setString(7, kh.getSDT());
      ps.setString(8, kh.getDiaChi());
      ps.setString(9, kh.getTienSuBenhLy());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  // Cập nhật khách hàng
  public boolean updateKhachHang(KhachHangDTO kh) {
    String sql =
      "UPDATE KhachHang SET Ho=?, Ten=?, NgaySinh=?, GioiTinh=?, SDT=?, DiaChi=?, TienSuBenhLy=?, MaTaiKhoan=? WHERE MaKhachHang=?";

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, kh.getHo());
      ps.setString(2, kh.getTen());
      ps.setString(3, kh.getNgaySinh());
      ps.setString(4, kh.getGioiTinh());
      ps.setString(5, kh.getSDT());
      ps.setString(6, kh.getDiaChi());
      ps.setString(7, kh.getTienSuBenhLy());
      ps.setString(8, kh.getMaKhachHang());

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  // Xóa khách hàng
  public boolean deleteKhachHang(String MaKhachHang) {
    String sql = "DELETE FROM KhachHang WHERE MaKhachHang=?";

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
