package com.quanlycuahangthuoc.util;

import com.quanlycuahangthuoc.db.DBConnection;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

public class CheckTaiKhoanStructure {

  public static void main(String[] args) {
    try (Connection conn = DBConnection.getConnection()) {
      DatabaseMetaData metaData = conn.getMetaData();
      ResultSet columns = metaData.getColumns(null, null, "TaiKhoan", null);

      System.out.println("=== TAI KHOAN TABLE STRUCTURE ===");
      while (columns.next()) {
        String columnName = columns.getString("COLUMN_NAME");
        String dataType = columns.getString("TYPE_NAME");
        int size = columns.getInt("COLUMN_SIZE");
        System.out.println(columnName + " - " + dataType + "(" + size + ")");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
