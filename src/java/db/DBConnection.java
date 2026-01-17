package java.db;
import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

  private static final String URL = "";
  private static final String Username = "";
  private static final String Password = "";

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
