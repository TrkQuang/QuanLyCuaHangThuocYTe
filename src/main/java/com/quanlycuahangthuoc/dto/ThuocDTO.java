package com.quanlycuahangthuoc.dto;

public class ThuocDTO {

  private String MaThuoc;
  private String MaNhaCungCap;
  private String TenThuoc;
  private String HinhAnh;
  private String DonViTinh;
  private String NSX;
  private String HSD;
  private float GiaBan;
  private int SoLuongTon;

  public ThuocDTO() {
    MaThuoc = "";
    MaNhaCungCap = "";
    TenThuoc = "";
    HinhAnh = "";
    DonViTinh = "";
    NSX = "";
    HSD = "";
    GiaBan = 0;
    SoLuongTon = 0;
  }

  public ThuocDTO(
    String MaThuoc,
    String MaNhaCungCap,
    String TenThuoc,
    String HinhAnh,
    String DonViTinh,
    String NSX,
    String HSD,
    float GiaBan,
    int SoLuongTon
  ) {
    this.MaThuoc = MaThuoc;
    this.MaNhaCungCap = MaNhaCungCap;
    this.TenThuoc = TenThuoc;
    this.HinhAnh = HinhAnh;
    this.DonViTinh = DonViTinh;
    this.NSX = NSX;
    this.HSD = HSD;
    this.GiaBan = GiaBan;
    this.SoLuongTon = SoLuongTon;
  }

  public ThuocDTO(ThuocDTO t) {
    this.MaThuoc = t.MaThuoc;
    this.MaNhaCungCap = t.MaNhaCungCap;
    this.TenThuoc = t.TenThuoc;
    this.HinhAnh = t.HinhAnh;
    this.DonViTinh = t.DonViTinh;
    this.NSX = t.NSX;
    this.HSD = t.HSD;
    this.GiaBan = t.GiaBan;
    this.SoLuongTon = t.SoLuongTon;
  }

  public String getMaThuoc() {
    return MaThuoc;
  }

  public String getMaNhaCungCap() {
    return MaNhaCungCap;
  }

  public String getTenThuoc() {
    return TenThuoc;
  }

  public String getHinhAnh() {
    return HinhAnh;
  }

  public String getDonViTinh() {
    return DonViTinh;
  }

  public String getNSX() {
    return NSX;
  }

  public String getHSD() {
    return HSD;
  }

  public float getGiaBan() {
    return GiaBan;
  }

  public int getSoLuongTon() {
    return SoLuongTon;
  }

  public void setMaThuoc(String MaThuoc) {
    this.MaThuoc = MaThuoc;
  }

  public void setMaNhaCungCap(String MaNhaCungCap) {
    this.MaNhaCungCap = MaNhaCungCap;
  }

  public void setTenThuoc(String TenThuoc) {
    this.TenThuoc = TenThuoc;
  }

  public void setHinhAnh(String HinhAnh) {
    this.HinhAnh = HinhAnh;
  }

  public void setDonViTinh(String DonViTinh) {
    this.DonViTinh = DonViTinh;
  }

  public void setNSX(String NSX) {
    this.NSX = NSX;
  }

  public void setHSD(String HSD) {
    this.HSD = HSD;
  }

  public void setGiaBan(float GiaBan) {
    this.GiaBan = GiaBan;
  }

  public void setSoLuongTon(int SoLuongTon) {
    this.SoLuongTon = SoLuongTon;
  }
}
