package java.db;
public class TestConnection {
    public static void main(String[] args) {
        if(DBConnection.getConnection() != null) {
            System.out.println("Connect Database thành công");
            DBConnection.closeConnection();
        } else {
            System.out.println("Không thể kết nối database");
        }
    }
}
