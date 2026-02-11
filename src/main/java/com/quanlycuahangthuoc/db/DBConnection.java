package com.quanlycuahangthuoc.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.io.InputStream;
import java.util.Properties;

public class DBConnection {

  private static String URL;
  private static String USERNAME;
  private static String PASSWORD;
  private static Connection connection = null;

  static {
    try {
      Properties props = new Properties();
      InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("application.properties");
      if (input != null) {
        props.load(input);
        URL = props.getProperty("db.url");
        USERNAME = props.getProperty("db.username");
        PASSWORD = props.getProperty("db.password");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private DBConnection() {}

  public static Connection getConnection() {
    try {
      if (connection == null || connection.isClosed()) {
        Class.forName("com.mysql.cj.jdbc.Driver");
        connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        System.out.println("Kết nối database thành công!");
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
