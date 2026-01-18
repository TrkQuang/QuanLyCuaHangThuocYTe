package com.quanlycuahangthuoc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.springframework.stereotype.Repository;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.TaiKhoanDTO;

@Repository
public class TaiKhoanDAO {
    public ArrayList<TaiKhoanDTO> getAllTaiKhoan(){
        ArrayList<TaiKhoanDTO> ds = new ArrayList<>();

        String sql = "SELECT * FROM TaiKhoan";
        try(
            Connection conn = DBConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ){
            while(rs.next()){
                TaiKhoanDTO tk = new TaiKhoanDTO();
                tk.setMaTaiKhoan(rs.getString("MaTaiKhoan"));
                tk.setTenDangNhap(rs.getString("TenDangNhap"));
                tk.setEmail(rs.getString("Email"));
                tk.setLoaiTaiKhoan(rs.getString("LoaiTaiKhoan"));
                tk.setMatKhau(rs.getString("MatKhau"));

                ds.add(tk);
            }
        }catch(SQLException e){
            e.printStackTrace();
        }
        return ds;
    }

    public boolean insertTaiKhoan(TaiKhoanDTO tk){
        String sql = "INSERT INTO TaiKhoan VALUES (?,?,?,?,?)";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, tk.getMaTaiKhoan());
            ps.setString(2, tk.getTenDangNhap());
            ps.setString(3, tk.getEmail());
            ps.setString(4, tk.getLoaiTaiKhoan());
            ps.setString(5, tk.getMatKhau());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateTaiKhoan(TaiKhoanDTO tk){
        String sql = "UPDATE TaiKhoan SET TenDangNhap=?, Email=?, LoaiTaiKhoan=?, MatKhau=? WHERE MaTaiKhoan=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, tk.getMaTaiKhoan());
            ps.setString(2, tk.getTenDangNhap());
            ps.setString(3, tk.getEmail());
            ps.setString(4, tk.getLoaiTaiKhoan());
            ps.setString(5, tk.getMatKhau());

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteTaiKhoan(String MaTaiKhoan){
        String sql = "DELETE FROM TaiKhoan WHERE MaTaiKhoan=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, MaTaiKhoan);

            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }
    
}
