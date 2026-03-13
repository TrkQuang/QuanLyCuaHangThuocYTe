package com.quanlycuahangthuoc.db;

import com.quanlycuahangthuoc.exception.DatabaseException;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnection {

  private static HikariDataSource dataSource;

  static {
    try {
      Properties props = new Properties();
      try (
        InputStream input =
          DBConnection.class.getClassLoader().getResourceAsStream(
            "application.properties"
          )
      ) {
        if (input != null) {
          props.load(input);
        }
      }

      String url = getFirstNonBlank(
        props.getProperty("db.url"),
        props.getProperty("spring.datasource.url")
      );
      String username = getFirstNonBlank(
        props.getProperty("db.username"),
        props.getProperty("spring.datasource.username")
      );
      String password = getFirstNonBlank(
        props.getProperty("db.password"),
        props.getProperty("spring.datasource.password")
      );
      String driver = getFirstNonBlank(
        props.getProperty("db.driver"),
        props.getProperty("spring.datasource.driver-class-name"),
        "com.mysql.cj.jdbc.Driver"
      );

      if (url == null || url.isBlank()) {
        throw new DatabaseException(
          "Thieu cau hinh db.url (hoac spring.datasource.url) trong application.properties"
        );
      }

      HikariConfig config = new HikariConfig();
      config.setJdbcUrl(url);
      config.setUsername(username);
      config.setPassword(password);
      config.setDriverClassName(driver);
      config.setMaximumPoolSize(
        parseInt(props.getProperty("db.hikari.maximum-pool-size"), 10)
      );
      config.setMinimumIdle(
        parseInt(props.getProperty("db.hikari.minimum-idle"), 2)
      );
      config.setConnectionTimeout(
        parseLong(props.getProperty("db.hikari.connection-timeout"), 30000L)
      );
      config.setIdleTimeout(
        parseLong(props.getProperty("db.hikari.idle-timeout"), 600000L)
      );
      config.setMaxLifetime(
        parseLong(props.getProperty("db.hikari.max-lifetime"), 1800000L)
      );
      config.setPoolName("QuanLyThuocHikariPool");

      dataSource = new HikariDataSource(config);

      Runtime.getRuntime().addShutdownHook(
        new Thread(() -> {
          if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
          }
        })
      );
    } catch (Exception e) {
      throw new DatabaseException("Khong the khoi tao HikariCP", e);
    }
  }

  private DBConnection() {}

  public static Connection getConnection() {
    try {
      return dataSource.getConnection();
    } catch (Exception e) {
      throw new DatabaseException("Ket noi CSDL that bai", e);
    }
  }

  public static void rollbackQuietly(Connection conn) {
    if (conn == null) {
      return;
    }
    try {
      conn.rollback();
    } catch (SQLException ignored) {}
  }

  private static String getFirstNonBlank(String... values) {
    for (String value : values) {
      if (value != null && !value.isBlank()) {
        return value;
      }
    }
    return null;
  }

  private static int parseInt(String value, int defaultValue) {
    try {
      if (value == null || value.isBlank()) {
        return defaultValue;
      }
      return Integer.parseInt(value.trim());
    } catch (Exception ignored) {
      return defaultValue;
    }
  }

  private static long parseLong(String value, long defaultValue) {
    try {
      if (value == null || value.isBlank()) {
        return defaultValue;
      }
      return Long.parseLong(value.trim());
    } catch (Exception ignored) {
      return defaultValue;
    }
  }
}
