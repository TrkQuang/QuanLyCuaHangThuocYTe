package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.DashboardBUS;
import com.quanlycuahangthuoc.util.SessionAuthUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

  @Autowired
  private DashboardBUS dashboardBUS;

  @GetMapping("/stats")
  public Object getStats(HttpSession session) {
    SessionAuthUtil.requireRole(session, "Admin");
    return dashboardBUS.getAdminStats();
  }
}
