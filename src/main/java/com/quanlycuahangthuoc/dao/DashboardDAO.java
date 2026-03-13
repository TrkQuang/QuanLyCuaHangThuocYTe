package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.DashboardStatsDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardDAO {

  public DashboardStatsDTO getAdminStats() {
    DashboardStatsDTO stats = new DashboardStatsDTO();
    stats.setTotalMedicines(getCount("SELECT COUNT(*) FROM Thuoc"));
    stats.setTotalInvoices(getCount("SELECT COUNT(*) FROM HoaDon"));
    stats.setTotalCustomers(getCount("SELECT COUNT(*) FROM KhachHang"));
    stats.setTotalEmployees(getCount("SELECT COUNT(*) FROM NhanVien"));
    stats.setTotalRevenue(
      getSum("SELECT COALESCE(SUM(TongTien), 0) FROM HoaDon")
    );
    return stats;
  }

  private int getCount(String sql) {
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql);
      ResultSet rs = ps.executeQuery()
    ) {
      if (rs.next()) {
        return rs.getInt(1);
      }
    } catch (Exception e) {
      throw new RuntimeException("Lỗi truy vấn thống kê: " + e.getMessage(), e);
    }
    return 0;
  }

  private double getSum(String sql) {
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql);
      ResultSet rs = ps.executeQuery()
    ) {
      if (rs.next()) {
        return rs.getDouble(1);
      }
    } catch (Exception e) {
      throw new RuntimeException(
        "Lỗi truy vấn doanh thu: " + e.getMessage(),
        e
      );
    }
    return 0;
  }
}
