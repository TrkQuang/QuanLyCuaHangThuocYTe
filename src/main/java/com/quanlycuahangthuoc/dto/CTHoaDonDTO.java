package com.quanlycuahangthuoc.dto;

public class CTHoaDonDTO {

  private String MaCTHD;
  private String MaHoaDon;
  private String MaThuoc;
  private int SoLuong;
  private String HDSD;

  public CTHoaDonDTO() {
    MaCTHD = "";
    MaHoaDon = "";
    MaThuoc = "";
    SoLuong = 0;
    HDSD = "";
  }

  public CTHoaDonDTO(
    String MaCTHD,
    String MaHoaDon,
    String MaThuoc,
    int SoLuong,
    String HDSD
  ) {
    this.MaCTHD = MaCTHD;
    this.MaHoaDon = MaHoaDon;
    this.MaThuoc = MaThuoc;
    this.SoLuong = SoLuong;
    this.HDSD = HDSD;
  }

  public CTHoaDonDTO(CTHoaDonDTO cthd) {
    this.MaCTHD = cthd.MaCTHD;
    this.MaHoaDon = cthd.MaHoaDon;
    this.MaThuoc = cthd.MaThuoc;
    this.SoLuong = cthd.SoLuong;
    this.HDSD = cthd.HDSD;
  }

  public String getMaCTHD() {
    return MaCTHD;
  }

  public String getMaHoaDon() {
    return MaHoaDon;
  }

  public String getMaThuoc() {
    return MaThuoc;
  }

  public int getSoLuong() {
    return SoLuong;
  }

  public String getHDSD() {
    return HDSD;
  }

  public void setMaCTHD(String MaCTHD) {
    this.MaCTHD = MaCTHD;
  }

  public void setMaHoaDon(String MaHoaDon) {
    this.MaHoaDon = MaHoaDon;
  }

  public void setMaThuoc(String MaThuoc) {
    this.MaThuoc = MaThuoc;
  }

  public void setSoLuong(int SoLuong) {
    this.SoLuong = SoLuong;
  }

  public void setHDSD(String HDSD) {
    this.HDSD = HDSD;
  }
}
