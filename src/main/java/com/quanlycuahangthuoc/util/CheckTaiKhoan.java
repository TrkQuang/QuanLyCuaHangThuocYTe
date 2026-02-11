package com.quanlycuahangthuoc.util;

import com.quanlycuahangthuoc.db.DBConnection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckTaiKhoan {

  public static void main(String[] args) {
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery("SELECT * FROM TaiKhoan LIMIT 10")
    ) {
      System.out.println("=== TAI KHOAN DATA ===");
      while (rs.next()) {
        System.out.println("MaTK: " + rs.getString("MaTK"));
        System.out.println("  TenDangNhap: " + rs.getString("TenDangNhap"));
        System.out.println("  Email: " + rs.getString("Email"));
        System.out.println("  LoaiTK: " + rs.getString("LoaiTK"));
        System.out.println("---");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
