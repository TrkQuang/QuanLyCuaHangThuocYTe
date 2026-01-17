package com.quanlycuahangthuoc.dto;

public class NhaCungCapDTO {

  private String MaNhaCungCap;
  private String TenNhaCungCap;
  private String SDT;
  private String DiaChi;

  public NhaCungCapDTO() {
    MaNhaCungCap = "";
    TenNhaCungCap = "";
    SDT = "";
    DiaChi = "";
  }

  public NhaCungCapDTO(
    String MaNhaCungCap,
    String TenNhaCungCap,
    String SDT,
    String DiaChi
  ) {
    this.MaNhaCungCap = MaNhaCungCap;
    this.TenNhaCungCap = TenNhaCungCap;
    this.SDT = SDT;
    this.DiaChi = DiaChi;
  }

  public NhaCungCapDTO(NhaCungCapDTO ncc) {
    this.MaNhaCungCap = ncc.MaNhaCungCap;
    this.TenNhaCungCap = ncc.TenNhaCungCap;
    this.SDT = ncc.SDT;
    this.DiaChi = ncc.DiaChi;
  }

  public String getMaNhaCungCap() {
    return MaNhaCungCap;
  }

  public String getTenNhaCungCap() {
    return TenNhaCungCap;
  }

  public String getSDT() {
    return SDT;
  }

  public String getDiaChi() {
    return DiaChi;
  }

  public void setMaNhaCungCap(String MaNhaCungCap) {
    this.MaNhaCungCap = MaNhaCungCap;
  }

  public void setTenNhaCungCap(String TenNhaCungCap) {
    this.TenNhaCungCap = TenNhaCungCap;
  }

  public void setSDT(String SDT) {
    this.SDT = SDT;
  }

  public void setDiaChi(String DiaChi) {
    this.DiaChi = DiaChi;
  }
}
