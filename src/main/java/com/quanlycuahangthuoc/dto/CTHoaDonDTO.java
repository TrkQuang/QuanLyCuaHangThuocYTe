package com.quanlycuahangthuoc.dto;

public class CTHoaDonDTO {

  private String MaCTHD;
  private String MaHoaDon;
  private String MaThuoc;
  private int SoLuong;
  private String HDSD;
  private float DonGiaBan;

  public CTHoaDonDTO() {
    MaCTHD = "";
    MaHoaDon = "";
    MaThuoc = "";
    SoLuong = 0;
    HDSD = "";
    DonGiaBan = 0;
  }

  public CTHoaDonDTO(
    String MaCTHD,
    String MaHoaDon,
    String MaThuoc,
    int SoLuong,
    String HDSD,
    float DonGiaBan
  ) {
    this.MaCTHD = MaCTHD;
    this.MaHoaDon = MaHoaDon;
    this.MaThuoc = MaThuoc;
    this.SoLuong = SoLuong;
    this.HDSD = HDSD;
    this.DonGiaBan = DonGiaBan;
  }

  public CTHoaDonDTO(CTHoaDonDTO cthd) {
    this.MaCTHD = cthd.MaCTHD;
    this.MaHoaDon = cthd.MaHoaDon;
    this.MaThuoc = cthd.MaThuoc;
    this.SoLuong = cthd.SoLuong;
    this.HDSD = cthd.HDSD;
    this.DonGiaBan = cthd.DonGiaBan;
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

  public float getDonGiaBan() {
    return DonGiaBan;
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

  public void setDonGiaBan(float donGiaBan) {
    this.DonGiaBan = donGiaBan;
  }
}
