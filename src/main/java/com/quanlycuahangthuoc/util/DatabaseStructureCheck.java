package com.quanlycuahangthuoc.util;

import com.quanlycuahangthuoc.db.DBConnection;
import java.sql.*;

public class DatabaseStructureCheck {

  public static void main(String[] args) {
    if (args.length > 0) {
      for (String tableName : args) {
        checkTableStructure(tableName);
      }
    } else {
      checkTableStructure("NhanVien");
      checkTableStructure("Thuoc");
      checkTableStructure("KhachHang");
      checkTableStructure("HoaDon");
      checkTableStructure("PhieuNhap");
      checkTableStructure("NhaCungCap");
    }
  }

  public static void checkTableStructure(String tableName) {
    System.out.println("\n=== Structure of table: " + tableName + " ===");
    String sql = "SELECT * FROM " + tableName + " LIMIT 1";

    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      ResultSetMetaData metaData = rs.getMetaData();
      int columnCount = metaData.getColumnCount();

      for (int i = 1; i <= columnCount; i++) {
        System.out.println(
          i +
            ". " +
            metaData.getColumnName(i) +
            " (" +
            metaData.getColumnTypeName(i) +
            ")"
        );
      }
    } catch (SQLException e) {
      System.out.println("Error: " + e.getMessage());
    }
  }
}
