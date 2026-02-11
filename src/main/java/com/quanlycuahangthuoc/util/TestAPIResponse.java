package com.quanlycuahangthuoc.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quanlycuahangthuoc.dao.KhachHangDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.util.ArrayList;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.quanlycuahangthuoc")
public class TestAPIResponse {

  public static void main(String[] args) {
    try {
      var context = new AnnotationConfigApplicationContext(
        TestAPIResponse.class
      );
      ThuocDAO thuocDAO = context.getBean(ThuocDAO.class);
      KhachHangDAO khachHangDAO = context.getBean(KhachHangDAO.class);
      ObjectMapper mapper = new ObjectMapper();

      // Test Thuoc
      System.out.println("=== THUOC API RESPONSE (first 1) ===");
      ArrayList<ThuocDTO> thuocs = thuocDAO.getAllThuoc();
      if (!thuocs.isEmpty()) {
        String json = mapper
          .writerWithDefaultPrettyPrinter()
          .writeValueAsString(thuocs.get(0));
        System.out.println(json);
      }

      // Test KhachHang
      System.out.println("\n=== KHACH HANG API RESPONSE (first 1) ===");
      ArrayList<KhachHangDTO> khachHangs = khachHangDAO.getAllKhachHang();
      if (!khachHangs.isEmpty()) {
        String json = mapper
          .writerWithDefaultPrettyPrinter()
          .writeValueAsString(khachHangs.get(0));
        System.out.println(json);
      }

      context.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
