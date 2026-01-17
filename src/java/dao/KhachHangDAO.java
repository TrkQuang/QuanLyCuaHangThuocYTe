package java.dao;

import java.db.DBConnection;
import java.dto.KhachHangDTO;

import java.sql.*;
import java.util.ArrayList;

public class KhachHangDAO {

    // Lấy danh sách tất cả khách hàng
    public ArrayList<KhachHangDTO> getAllKhachHang() {
        ArrayList<KhachHangDTO> ds = new ArrayList<>();
        String sql = "SELECT * FROM khachhang";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                KhachHangDTO kh = new KhachHangDTO();
                kh.setMaKhachHang(rs.getString("MaKhachHang"));
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
        String sql = "INSERT INTO khachhang VALUES (?,?,?,?,?,?,?,?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, kh.getMaKhachHang());
            ps.setString(2, kh.getHo());
            ps.setString(3, kh.getTen());
            ps.setString(4, kh.getNgaySinh());
            ps.setString(5, kh.getGioiTinh());
            ps.setString(6, kh.getSDT());
            ps.setString(7, kh.getDiaChi());
            ps.setString(8, kh.getTienSuBenhLy());

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Cập nhật khách hàng
    public boolean updateKhachHang(KhachHangDTO kh) {
        String sql = "UPDATE khachhang SET Ho=?, Ten=?, NgaySinh=?, GioiTinh=?, SDT=?, DiaChi=?, TienSuBenhLy=? WHERE MaKhachHang=?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

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
    public boolean deleteKhachHang(String maKH) {
        String sql = "DELETE FROM khachhang WHERE MaKhachHang=?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, maKH);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
