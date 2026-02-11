package com.quanlycuahangthuoc.db;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class DBConnection {

  private static String URL;
  private static String USERNAME;
  private static String PASSWORD;

  static {
    try {
      Properties props = new Properties();
      InputStream input =
        DBConnection.class.getClassLoader().getResourceAsStream(
          "application.properties"
        );
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
    Connection connection = null;
    try {
      Class.forName("com.mysql.cj.jdbc.Driver");
      connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
      System.out.println("Kết nối database thành công!");
    } catch (Exception e) {
      System.out.println("Lỗi kết nối database");
      e.printStackTrace();
    }
    return connection;
  }
}
