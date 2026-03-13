package com.quanlycuahangthuoc.dto;

public class PhieuNhapDTO {

  private String MaPhieuNhap;
  private String MaNhanVien;
  private String MaNhaCungCap;
  private String NgayNhap;
  private float TongTien;
  private String TrangThai;

  public PhieuNhapDTO() {
    MaPhieuNhap = "";
    MaNhanVien = "";
    MaNhaCungCap = "";
    NgayNhap = "";
    TongTien = 0;
    TrangThai = "CHO_XAC_NHAN";
  }

  public PhieuNhapDTO(
    String MaPhieuNhap,
    String MaNhanVien,
    String MaNhaCungCap,
    String NgayNhap,
    float TongTien,
    String TrangThai
  ) {
    this.MaPhieuNhap = MaPhieuNhap;
    this.MaNhanVien = MaNhanVien;
    this.MaNhaCungCap = MaNhaCungCap;
    this.NgayNhap = NgayNhap;
    this.TongTien = TongTien;
    this.TrangThai = TrangThai;
  }

  public PhieuNhapDTO(PhieuNhapDTO pn) {
    this.MaPhieuNhap = pn.MaPhieuNhap;
    this.MaNhanVien = pn.MaNhanVien;
    this.MaNhaCungCap = pn.MaNhaCungCap;
    this.NgayNhap = pn.NgayNhap;
    this.TongTien = pn.TongTien;
    this.TrangThai = pn.TrangThai;
  }

  public String getMaPhieuNhap() {
    return MaPhieuNhap;
  }

  public String getMaNhanVien() {
    return MaNhanVien;
  }

  public String getMaNhaCungCap() {
    return MaNhaCungCap;
  }

  public String getNgayNhap() {
    return NgayNhap;
  }

  public float getTongTien() {
    return TongTien;
  }

  public String getTrangThai() {
    return TrangThai;
  }

  public void setMaPhieuNhap(String MaPhieuNhap) {
    this.MaPhieuNhap = MaPhieuNhap;
  }

  public void setMaNhanVien(String MaNhanVien) {
    this.MaNhanVien = MaNhanVien;
  }

  public void setMaNhaCungCap(String MaNhaCungCap) {
    this.MaNhaCungCap = MaNhaCungCap;
  }

  public void setNgayNhap(String NgayNhap) {
    this.NgayNhap = NgayNhap;
  }

  public void setTongTien(float TongTien) {
    this.TongTien = TongTien;
  }

  public void setTrangThai(String TrangThai) {
    this.TrangThai = TrangThai;
  }
}
