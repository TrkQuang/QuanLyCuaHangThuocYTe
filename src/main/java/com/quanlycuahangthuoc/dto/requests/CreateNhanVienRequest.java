package com.quanlycuahangthuoc.dto.requests;

/**
 * DTO để nhận request tạo nhân viên mới kèm tài khoản
 */
public class CreateNhanVienRequest {

  // Thông tin tài khoản
  private String tenDangNhap;
  private String matKhau;
  private String email;
  private String loaiTaiKhoan; // "NhanVien" hoặc "Admin"

  // Thông tin nhân viên
  private String hoTen;
  private String gioiTinh;
  private String soDienThoai;
  private String diaChi;

  // Constructors
  public CreateNhanVienRequest() {}

  public CreateNhanVienRequest(
    String tenDangNhap,
    String matKhau,
    String email,
    String loaiTaiKhoan,
    String hoTen,
    String gioiTinh,
    String soDienThoai,
    String diaChi
  ) {
    this.tenDangNhap = tenDangNhap;
    this.matKhau = matKhau;
    this.email = email;
    this.loaiTaiKhoan = loaiTaiKhoan;
    this.hoTen = hoTen;
    this.gioiTinh = gioiTinh;
    this.soDienThoai = soDienThoai;
    this.diaChi = diaChi;
  }

  // Getters and Setters
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

  public String getGioiTinh() {
    return gioiTinh;
  }

  public void setGioiTinh(String gioiTinh) {
    this.gioiTinh = gioiTinh;
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
}
