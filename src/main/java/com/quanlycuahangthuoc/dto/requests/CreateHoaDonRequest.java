package com.quanlycuahangthuoc.dto.requests;

import com.quanlycuahangthuoc.dto.CTHoaDonDTO;
import com.quanlycuahangthuoc.dto.HoaDonDTO;
import java.util.ArrayList;
import java.util.List;

public class CreateHoaDonRequest {

  private HoaDonDTO hoaDon;
  private List<CTHoaDonDTO> chiTiet;

  public HoaDonDTO getHoaDon() {
    return hoaDon;
  }

  public void setHoaDon(HoaDonDTO hoaDon) {
    this.hoaDon = hoaDon;
  }

  public List<CTHoaDonDTO> getChiTiet() {
    return chiTiet == null ? new ArrayList<>() : chiTiet;
  }

  public void setChiTiet(List<CTHoaDonDTO> chiTiet) {
    this.chiTiet = chiTiet;
  }
}
