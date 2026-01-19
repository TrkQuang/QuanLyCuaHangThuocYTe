package com.quanlycuahangthuoc.dto.requests;

import com.quanlycuahangthuoc.dto.CTHoaDonDTO;
import com.quanlycuahangthuoc.dto.HoaDonDTO;

public class CTHoaDonRequest {

  private CTHoaDonDTO ctHoaDon;
  private HoaDonDTO hoaDon;
  private float giaBan;

  public CTHoaDonDTO getCtHoaDon() {
    return ctHoaDon;
  }

  public void setCtHoaDon(CTHoaDonDTO ctHoaDon) {
    this.ctHoaDon = ctHoaDon;
  }

  public HoaDonDTO getHoaDon() {
    return hoaDon;
  }

  public void setHoaDon(HoaDonDTO hoaDon) {
    this.hoaDon = hoaDon;
  }

  public float getGiaBan() {
    return giaBan;
  }

  public void setGiaBan(float giaBan) {
    this.giaBan = giaBan;
  }
}
