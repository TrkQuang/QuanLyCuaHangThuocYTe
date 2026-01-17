package com.quanlycuahangthuoc.dto;

public class CTPhieuNhapDTO {

  private String MaCTPN;
  private String MaPhieuNhap;
  private String MaThuoc;
  private int SoLuongNhap;
  private float DonGia;

  public CTPhieuNhapDTO() {
    MaCTPN = "";
    MaPhieuNhap = "";
    MaThuoc = "";
    SoLuongNhap = 0;
    DonGia = 0;
  }

  public CTPhieuNhapDTO(
    String MaCTPN,
    String MaPhieuNhap,
    String MaThuoc,
    int SoLuongNhap,
    float DonGia
  ) {
    this.MaCTPN = MaCTPN;
    this.MaPhieuNhap = MaPhieuNhap;
    this.MaThuoc = MaThuoc;
    this.SoLuongNhap = SoLuongNhap;
    this.DonGia = DonGia;
  }

  public CTPhieuNhapDTO(CTPhieuNhapDTO ctpn) {
    this.MaCTPN = ctpn.MaCTPN;
    this.MaPhieuNhap = ctpn.MaPhieuNhap;
    this.MaThuoc = ctpn.MaThuoc;
    this.SoLuongNhap = ctpn.SoLuongNhap;
    this.DonGia = ctpn.DonGia;
  }

  public String getMaCTPN() {
    return MaCTPN;
  }

  public String getMaPhieuNhap() {
    return MaPhieuNhap;
  }

  public String getMaThuoc() {
    return MaThuoc;
  }

  public int getSoLuongNhap() {
    return SoLuongNhap;
  }

  public float getDonGia() {
    return DonGia;
  }

  public void setMaCTPN(String MaCTPN) {
    this.MaCTPN = MaCTPN;
  }

  public void setMaPhieuNhap(String MaPhieuNhap) {
    this.MaPhieuNhap = MaPhieuNhap;
  }

  public void setMaThuoc(String MaThuoc) {
    this.MaThuoc = MaThuoc;
  }

  public void setSoLuongNhap(int SoLuongNhap) {
    this.SoLuongNhap = SoLuongNhap;
  }

  public void setDonGia(float DonGia) {
    this.DonGia = DonGia;
  }
}
