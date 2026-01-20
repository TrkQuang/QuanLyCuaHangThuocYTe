package com.quanlycuahangthuoc.dao;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import org.springframework.stereotype.Repository;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.HoaDonDTO;

@Repository
public class HoaDonDAO {
    public ArrayList<HoaDonDTO> getAllHoaDon(){
        ArrayList<HoaDonDTO> ds = new ArrayList<>();
        String sql = "SELECT * FROM HoaDon";
        try(
            Connection conn = DBConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ){
            while(rs.next()){
                HoaDonDTO hd = new HoaDonDTO();
                hd.setMaHoaDon(rs.getString("MaHoaDon"));
                hd.setMaKhachHang(rs.getString("MaKhachHang"));
                hd.setNgayTao(rs.getString("NgayTao"));
                hd.setTrangThai(rs.getString("TrangThai"));
                hd.setTongTien(rs.getFloat("TongTien"));
                ds.add(hd);
            }
        }catch(SQLException e){
            e.printStackTrace();
        }
        return ds;
    }

    public boolean insertHoaDon(HoaDonDTO hd){
        String sql = "INSERT INTO HoaDon VALUES (?,?,?,?,?)";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, hd.getMaHoaDon());
            ps.setString(2, hd.getMaKhachHang());
            ps.setString(3, hd.getNgayTao());
            ps.setString(4, hd.getTrangThai());
            ps.setFloat(5, hd.getTongTien());
            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateHoaDon(HoaDonDTO hd){
        String sql = "UPDATE HoaDon SET MaKhachHang=?, NgayTao=?, TrangThai=?, TongTien=? WHERE MaHoaDon=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, hd.getMaKhachHang());
            ps.setString(2, hd.getNgayTao());
            ps.setString(3, hd.getTrangThai());
            ps.setFloat(4, hd.getTongTien());
            ps.setString(5, hd.getMaHoaDon());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteHoaDon(String MaHoaDon){
        String sql = "DELETE FROM HoaDon WHERE MaHoaDon=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, MaHoaDon);
            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }
    
    public int countByNhanVien(String maNV) {
        String sql = "SELECT COUNT(*) FROM HoaDon WHERE MaNhanVien=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
        ) {
            ps.setString(1, maNV);
            ResultSet rs = ps.executeQuery();
            if(rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }
    public int countByKhachHang(String maKH) {
        String sql = "SELECT COUNT(*) FROM HoaDon WHERE MaKhachHang=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
        ) {
            ps.setString(1, maKH);
            ResultSet rs = ps.executeQuery();
            if(rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

}
