package com.quanlycuahangthuoc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.NhanVienDTO;

@Repository
public class NhanVienDAO {
    public ArrayList<NhanVienDTO> getAllNhanVien(){
        ArrayList<NhanVienDTO> ds = new ArrayList<>();

        String sql = "SELECT * FROM NhanVien";
        try(
            Connection conn = DBConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ){
            while(rs.next()){
                NhanVienDTO nv = new NhanVienDTO();
                nv.setMaNhanVien(rs.getString("MaNhanVien"));
                nv.setMaTaiKhoan(rs.getString("MaTaiKhoan"));
                nv.setHo(rs.getString("Ho"));
                nv.setTen(rs.getString("Ten"));
                nv.setDiaChi(rs.getString("DiaChi"));
                nv.setSDT(rs.getString("SDT"));
                
                ds.add(nv);
            }
        }catch(SQLException e){
            e.printStackTrace();
        }
        return ds;
    }

    public boolean insertNhanVien(NhanVienDTO nv){
        String sql = "INSERT INTO NhanVien VALUES (?,?,?,?,?,?)";

        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, nv.getMaNhanVien());
            ps.setString(2, nv.getMaTaiKhoan());
            ps.setString(3, nv.getHo());
            ps.setString(4, nv.getTen());
            ps.setString(5, nv.getDiaChi());
            ps.setString(6, nv.getSDT());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateNhanVien(NhanVienDTO nv){
        String sql = "UPDATE NhanVien SET MaTaiKhoan=?, Ho=?, Ten=?, DiaChi=?, SDT=? WHERE MaNhanVien=?";

        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, nv.getMaTaiKhoan());
            ps.setString(2, nv.getHo());
            ps.setString(3, nv.getTen());
            ps.setString(4, nv.getDiaChi());
            ps.setString(5, nv.getSDT());
            ps.setString(6, nv.getMaNhanVien());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteNhanVien(String MaNhanVien){
        String sql = "DELETE FROM NhanVien WHERE MaNhanVien=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, MaNhanVien);
            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }
}
