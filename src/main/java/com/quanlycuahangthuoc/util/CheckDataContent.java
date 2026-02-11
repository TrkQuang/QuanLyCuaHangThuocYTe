package com.quanlycuahangthuoc.util;

import com.quanlycuahangthuoc.db.DBConnection;
import java.sql.*;

public class CheckDataContent {

  public static void main(String[] args) {
    checkThuocData();
    checkKhachHangData();
  }

  public static void checkThuocData() {
    System.out.println("\n=== THUOC DATA (first 3 rows) ===");
    String sql = "SELECT * FROM Thuoc LIMIT 3";

    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        System.out.println("MaThuoc: " + rs.getString("MaThuoc"));
        System.out.println("  TenThuoc: " + rs.getString("TenThuoc"));
        System.out.println("  DonViTinh: " + rs.getString("DonViTinh"));
        System.out.println("  GiaBan: " + rs.getFloat("GiaBan"));
        System.out.println("  SoLuong: " + rs.getInt("SoLuong"));
        System.out.println("  MaNCC: " + rs.getString("MaNCC"));
        System.out.println("---");
      }
    } catch (SQLException e) {
      System.out.println("Error: " + e.getMessage());
    }
  }

  public static void checkKhachHangData() {
    System.out.println("\n=== KHACH HANG DATA (first 3 rows) ===");
    String sql = "SELECT * FROM KhachHang LIMIT 3";

    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      while (rs.next()) {
        System.out.println("MaKH: " + rs.getString("MaKH"));
        System.out.println("  HoTen: " + rs.getString("HoTen"));
        System.out.println("  SDT: " + rs.getString("SDT"));
        System.out.println("  GioiTinh: " + rs.getString("GioiTinh"));
        System.out.println("  DiaChi: " + rs.getString("DiaChi"));
        System.out.println("---");
      }
    } catch (SQLException e) {
      System.out.println("Error: " + e.getMessage());
    }
  }
}
