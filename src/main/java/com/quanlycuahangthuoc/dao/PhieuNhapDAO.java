package com.quanlycuahangthuoc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.springframework.stereotype.Repository;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.PhieuNhapDTO;

@Repository
public class PhieuNhapDAO {
    ArrayList<PhieuNhapDTO> getAllPhieuNhap(){
        ArrayList<PhieuNhapDTO> ds = new ArrayList<>();

        String sql = "SELECT * FROM PhieuNhap";
        try(
            Connection conn = DBConnection.getConnection(); 
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ){
            while(rs.next()){
                PhieuNhapDTO pn = new PhieuNhapDTO();
                pn.setMaPhieuNhap(rs.getString("MaPhieuNhap"));
                pn.setMaNhanVien(rs.getString("MaNhanVien"));
                pn.setMaNhaCungCap(rs.getString("MaNhaCungCap"));
                pn.setNgayNhap(rs.getString("NgayNhap"));
                pn.setTongTien(rs.getFloat("TongTien"));

                ds.add(pn);
            }
        }catch(SQLException e){
            e.printStackTrace();
        }
        return ds;
    }

    public boolean insertPhieuNhap(PhieuNhapDTO pn){
        String sql = "INSERT INTO PhieuNhap VALUES (?,?,?,?,?)";
        try(
            Connection conn = DBConnection.getConnection(); 
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, pn.getMaPhieuNhap());
            ps.setString(2, pn.getMaNhanVien());
            ps.setString(3, pn.getMaNhaCungCap());
            ps.setString(4, pn.getNgayNhap());
            ps.setFloat(5, pn.getTongTien());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean updatePhieuNhap(PhieuNhapDTO pn){
         String sql = "UPDATE PhieuNhap SET MaNhanVien=?, MaNhaCungCap=?, NgayNhap=?, TongTien=? WHERE MaPhieuNhap";
        try(
            Connection conn = DBConnection.getConnection(); 
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, pn.getMaPhieuNhap());
            ps.setString(2, pn.getMaNhanVien());
            ps.setString(3, pn.getMaNhaCungCap());
            ps.setString(4, pn.getNgayNhap());
            ps.setFloat(5, pn.getTongTien());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean deletePhieuNhap(String MaPhieuNhap){
        String sql = "DELETE PhieuNhap WHERE MaPhieuNhap=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, MaPhieuNhap);

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }
}
