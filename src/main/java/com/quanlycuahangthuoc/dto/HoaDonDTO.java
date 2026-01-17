package com.quanlycuahangthuoc.dto;

public class HoaDonDTO {

  private String MaHoaDon;
  private String MaKhachHang;
  private String NgayTao;
  private float TongTien;

  public HoaDonDTO() {
    MaHoaDon = "";
    MaKhachHang = "";
    NgayTao = "";
    TongTien = 0;
  }

  public HoaDonDTO(
    String MaHoaDon,
    String MaKhachHang,
    String NgayTao,
    float TongTien
  ) {
    this.MaHoaDon = MaHoaDon;
    this.MaKhachHang = MaKhachHang;
    this.NgayTao = NgayTao;
    this.TongTien = TongTien;
  }

  public HoaDonDTO(HoaDonDTO hd) {
    this.MaHoaDon = hd.MaHoaDon;
    this.MaKhachHang = hd.MaKhachHang;
    this.NgayTao = hd.NgayTao;
    this.TongTien = hd.TongTien;
  }

  public String getMaHoaDon() {
    return MaHoaDon;
  }

  public String getMaKhachHang() {
    return MaKhachHang;
  }

  public String getNgayTao() {
    return NgayTao;
  }

  public float getTongTien() {
    return TongTien;
  }

  public void setMaHoaDon(String MaHoaDon) {
    this.MaHoaDon = MaHoaDon;
  }

  public void setMaKhachHang(String MaKhachHang) {
    this.MaKhachHang = MaKhachHang;
  }

  public void setNgayTao(String NgayTao) {
    this.NgayTao = NgayTao;
  }

  public void setTongTien(float TongTien) {
    this.TongTien = TongTien;
  }
}
