package com.quanlycuahangthuoc.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.quanlycuahangthuoc.dao.KhachHangDAO;
import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.dto.KhachHangDTO;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.util.ArrayList;

public class SimpleAPITest {

  public static void main(String[] args) {
    try {
      ObjectMapper mapper = new ObjectMapper();
      mapper.enable(SerializationFeature.INDENT_OUTPUT);

      // Test Thuoc
      System.out.println("=== THUOC DTO TO JSON ===");
      ThuocDAO thuocDAO = new ThuocDAO();
      ArrayList<ThuocDTO> thuocs = thuocDAO.getAllThuoc();
      if (!thuocs.isEmpty()) {
        ThuocDTO thuoc = thuocs.get(0);
        System.out.println("Java object values:");
        System.out.println("  DonViTinh: " + thuoc.getDonViTinh());
        System.out.println("  SoLuongTon: " + thuoc.getSoLuongTon());
        System.out.println("  GiaBan: " + thuoc.getGiaBan());

        String json = mapper.writeValueAsString(thuoc);
        System.out.println("\nJSON output:");
        System.out.println(json);
      }

      // Test KhachHang
      System.out.println("\n=== KHACH HANG DTO TO JSON ===");
      KhachHangDAO khDAO = new KhachHangDAO();
      ArrayList<KhachHangDTO> khs = khDAO.getAllKhachHang();
      if (!khs.isEmpty()) {
        KhachHangDTO kh = khs.get(0);
        System.out.println("Java object values:");
        System.out.println("  Ho: " + kh.getHo());
        System.out.println("  Ten: " + kh.getTen());
        System.out.println("  SDT: " + kh.getSDT());

        String json = mapper.writeValueAsString(kh);
        System.out.println("\nJSON output:");
        System.out.println(json);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
