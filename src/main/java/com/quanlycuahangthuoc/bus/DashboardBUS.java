package com.quanlycuahangthuoc.bus;

import com.quanlycuahangthuoc.dao.DashboardDAO;
import com.quanlycuahangthuoc.dto.DashboardStatsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardBUS {

  @Autowired
  private DashboardDAO dashboardDAO;

  public DashboardStatsDTO getAdminStats() {
    return dashboardDAO.getAdminStats();
  }
}
