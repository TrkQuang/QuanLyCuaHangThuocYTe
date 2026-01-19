package com.quanlycuahangthuoc.db;
import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

  private static final String URL =
    "jdbc:mysql://tramway.proxy.rlwy.net:57864/QuanLyNhaThuoc";
  private static final String Username = "root";
  private static final String Password = "RSfJaDbgzwfGdkHBtEGwLPhFyXVemcGZ";

  private static Connection connection = null;

  private DBConnection() {}

  public static Connection getConnection() {
    try {
      if (connection == null || connection.isClosed()) {
        Class.forName("com.mysql.cj.jdbc.Driver");
        connection = DriverManager.getConnection(URL, Username, Password);
        System.out.println("Kết nối vào database thành công!");
      }
    } catch (Exception e) {
      System.out.println("Lỗi kết nối database");
      e.printStackTrace();
    }
    return connection;
  }

  public static void closeConnection() {
    try {
      if (connection != null && !connection.isClosed()) {
        connection.close();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
