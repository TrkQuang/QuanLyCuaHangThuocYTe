package com.quanlycuahangthuoc.db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestConnection {

  public static void main(String[] args) {
    Connection conn = DBConnection.getConnection();

    if (conn != null) {
      System.out.println("✅ Kết nối Database thành công!");
      System.out.println("========================================");

      try {
        // Test query: Lấy danh sách các bảng trong database
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SHOW TABLES");

        System.out.println("📋 Danh sách bảng trong database:");
        while (rs.next()) {
          System.out.println("  - " + rs.getString(1));
        }

        System.out.println("========================================");

        // Test query: Đếm số lượng thuốc
        ResultSet rsThuoc = stmt.executeQuery(
          "SELECT COUNT(*) as total FROM Thuoc"
        );
        if (rsThuoc.next()) {
          System.out.println("💊 Tổng số thuốc: " + rsThuoc.getInt("total"));
        }

        // Test query: Đếm số lượng nhân viên
        ResultSet rsNV = stmt.executeQuery(
          "SELECT COUNT(*) as total FROM NhanVien"
        );
        if (rsNV.next()) {
          System.out.println("👥 Tổng số nhân viên: " + rsNV.getInt("total"));
        }

        // Test query: Đếm số lượng khách hàng
        ResultSet rsKH = stmt.executeQuery(
          "SELECT COUNT(*) as total FROM KhachHang"
        );
        if (rsKH.next()) {
          System.out.println("🛒 Tổng số khách hàng: " + rsKH.getInt("total"));
        }

        System.out.println("========================================");
        System.out.println("✅ Test truy vấn SQL thành công!");

        rs.close();
        rsThuoc.close();
        rsNV.close();
        rsKH.close();
        stmt.close();
      } catch (Exception e) {
        System.out.println("❌ Lỗi khi test truy vấn:");
        e.printStackTrace();
      } finally {
        DBConnection.closeConnection();
      }
    } else {
      System.out.println("❌ Không thể kết nối database");
    }
  }
}
