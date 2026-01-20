package com.quanlycuahangthuoc.dao;

import org.springframework.stereotype.Repository;
import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.CTHoaDonDTO;
import java.sql.*;
import java.util.ArrayList;

@Repository
public class CTHoaDonDAO {
    public ArrayList<CTHoaDonDTO> getAllCTHoaDon(){
        ArrayList<CTHoaDonDTO> ds = new ArrayList<>();
        String sql = "SELECT * FROM CTHoaDon";

        try(
            Connection conn = DBConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ){
            while(rs.next()){
                CTHoaDonDTO cthd = new CTHoaDonDTO();
                cthd.setMaCTHD(rs.getString("MaCTHD"));
                cthd.setMaHoaDon(rs.getString("MaHoaDon"));
                cthd.setMaThuoc(rs.getString("MaThuoc"));
                cthd.setSoLuong(rs.getInt("SoLuong"));
                cthd.setHDSD(rs.getString("HDSD"));
                ds.add(cthd);
            }
        }catch(SQLException e){
            e.printStackTrace();
        }
        return ds;
    }

    public boolean insertCTHoaDon(CTHoaDonDTO cthd){
        String sql = "INSERT  INTO CTHoaDon VALUES (?,?,?,?,?)";

        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, cthd.getMaCTHD());
            ps.setString(2, cthd.getMaHoaDon());
            ps.setString(3, cthd.getMaThuoc());
            ps.setInt(4, cthd.getSoLuong());
            ps.setString(5, cthd.getHDSD());

            return ps.executeUpdate() > 0;
        } catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateCTHoaDon(CTHoaDonDTO cthd){
        String sql = "UPDATE CTHoaDon SET MaHoaDon=?, MaThuoc=?, SoLuong=?, HDSD=? WHERE MaCTHoaDon=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1, cthd.getMaHoaDon());
            ps.setString(2, cthd.getMaThuoc());
            ps.setInt(3, cthd.getSoLuong());
            ps.setString(4, cthd.getHDSD());
            ps.setString(5, cthd.getMaCTHD());
            
            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteCTHoaDon(String MaCTHD){
        String sql = "DELETE FROM CTHoaDon WHERE MaCTHD=?";
        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
        ){
            ps.setString(1, MaCTHD);
            return ps.executeUpdate() > 0;
        }catch(SQLException e){
            e.printStackTrace();
        }
        return false;
    }
    
    public ArrayList<CTHoaDonDTO> getCTHoaDonByMaHoaDon(String maHoaDon) {
        ArrayList<CTHoaDonDTO> ds = new ArrayList<>();
        String sql = "SELECT * FROM CTHoaDon WHERE MaHoaDon=?";

        try (Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, maHoaDon);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                CTHoaDonDTO ct = new CTHoaDonDTO();
                ct.setMaCTHD(rs.getString("MaCTHD"));
                ct.setMaHoaDon(rs.getString("MaHoaDon"));
                ct.setMaThuoc(rs.getString("MaThuoc"));
                ct.setSoLuong(rs.getInt("SoLuong"));
                ct.setHDSD(rs.getString("HDSD"));
                ds.add(ct);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ds;
    }
}
