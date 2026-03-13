package com.quanlycuahangthuoc.dto.requests;

public class CreateKhachHangRequest {

  private String tenDangNhap;
  private String matKhau;
  private String email;
  private String loaiTaiKhoan;
  private String hoTen;
  private String soDienThoai;
  private String diaChi;
  private String ngaySinh;
  private String tienSuBenhLy;

  public String getTenDangNhap() {
    return tenDangNhap;
  }

  public void setTenDangNhap(String tenDangNhap) {
    this.tenDangNhap = tenDangNhap;
  }

  public String getMatKhau() {
    return matKhau;
  }

  public void setMatKhau(String matKhau) {
    this.matKhau = matKhau;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getLoaiTaiKhoan() {
    return loaiTaiKhoan;
  }

  public void setLoaiTaiKhoan(String loaiTaiKhoan) {
    this.loaiTaiKhoan = loaiTaiKhoan;
  }

  public String getHoTen() {
    return hoTen;
  }

  public void setHoTen(String hoTen) {
    this.hoTen = hoTen;
  }

  public String getSoDienThoai() {
    return soDienThoai;
  }

  public void setSoDienThoai(String soDienThoai) {
    this.soDienThoai = soDienThoai;
  }

  public String getDiaChi() {
    return diaChi;
  }

  public void setDiaChi(String diaChi) {
    this.diaChi = diaChi;
  }

  public String getNgaySinh() {
    return ngaySinh;
  }

  public void setNgaySinh(String ngaySinh) {
    this.ngaySinh = ngaySinh;
  }

  public String getTienSuBenhLy() {
    return tienSuBenhLy;
  }

  public void setTienSuBenhLy(String tienSuBenhLy) {
    this.tienSuBenhLy = tienSuBenhLy;
  }
}
