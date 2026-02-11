package com.quanlycuahangthuoc.dto;

public class HoaDonDTO {

  private String MaHoaDon;
  private String MaKhachHang;
  private String MaNhanVien;
  private String NgayTao;
  private String TrangThai;
  private float TongTien;

  public HoaDonDTO() {
    MaHoaDon = "";
    MaKhachHang = "";
    NgayTao = "";
    TrangThai = "CHOXACNHAN";
    TongTien = 0;
  }

  public HoaDonDTO(
    String MaHoaDon,
    String MaKhachHang,
    String NgayTao,
    String TrangThai,
    float TongTien
  ) {
    this.MaHoaDon = MaHoaDon;
    this.MaKhachHang = MaKhachHang;
    this.NgayTao = NgayTao;
    this.TrangThai = TrangThai;
    this.TongTien = TongTien;
  }

  public HoaDonDTO(HoaDonDTO hd) {
    this.MaHoaDon = hd.MaHoaDon;
    this.MaKhachHang = hd.MaKhachHang;
    this.NgayTao = hd.NgayTao;
    this.TrangThai = hd.TrangThai;
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

  public String getTrangThai() {
    return TrangThai;
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

  public void setTrangThai(String a) {
    this.TrangThai = a;
  }

  public String getMaNhanVien() {
    return MaNhanVien;
  }

  public void setMaNhanVien(String MaNhanVien) {
    this.MaNhanVien = MaNhanVien;
  }
}
