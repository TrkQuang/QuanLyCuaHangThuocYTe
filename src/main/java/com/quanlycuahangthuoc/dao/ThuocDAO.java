package com.quanlycuahangthuoc.dao;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.sql.SQLException;

import org.springframework.stereotype.Repository;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.ThuocDTO;

@Repository
public class ThuocDAO {
    public ArrayList<ThuocDTO> getAllThuoc(){
        ArrayList<ThuocDTO> ds = new ArrayList<>();

        String sql = "SELECT * FROM Thuoc";
        try(
            Connection conn = DBConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
        ){
            while(rs.next()){
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
        }catch(SQLException e){
            e.printStackTrace();
        }
        return ds;
    }

    public boolean insertThuoc(ThuocDTO t){
        String sql = "INSERT INTO Thuoc VALUES (?,?,?,?,?,?,?,?)";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, t.getMaThuoc());
            ps.setString(2, t.getMaNhaCungCap());
            ps.setString(3, t.getTenThuoc());
            ps.setString(4, t.getDonViTinh());
            ps.setString(5, t.getNSX());
            ps.setString(6, t.getHSD());
            ps.setFloat(7, t.getGiaBan());
            ps.setInt(8, t.getSoLuongTon());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateThuoc(ThuocDTO t){
        String sql = "UPDATE Thuoc SET MaNhaCungCap=?, TenThuoc=?, DonViTinh=?, NSX=?,HSD=?, GiaBan=?, SoLuongTon=? WHERE MaThuoc=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, t.getMaThuoc());
            ps.setString(2, t.getMaNhaCungCap());
            ps.setString(3, t.getTenThuoc());
            ps.setString(4, t.getDonViTinh());
            ps.setString(5, t.getNSX());
            ps.setString(6, t.getHSD());
            ps.setFloat(7, t.getGiaBan());
            ps.setInt(8, t.getSoLuongTon());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteThuoc(String MaThuoc){
        String sql = "DELETE FROM Thuoc WHERE MaThuoc=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, MaThuoc);
            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }
}
