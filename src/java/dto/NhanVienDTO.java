package java.dto;

public class NhanVienDTO {
    private String MaNhanVien;
    private String Ho;
    private String Ten;
    private String SDT;
    private String DiaChi;
    private String MaTaiKhoan;
    
    public NhanVienDTO() {
        this.MaNhanVien = "";
        this.Ho = "";
        this.Ten = "";
        this.SDT = "";
        this.DiaChi = "";
        this.MaTaiKhoan = "";
    }
    
    public NhanVienDTO(String MaNhanVien, String Ho, String Ten, String SDT, String DiaChi, String MaTaiKhoan) {
        this.MaNhanVien = MaNhanVien;
        this.Ho = Ho;
        this.Ten = Ten;
        this.SDT = SDT;
        this.DiaChi = DiaChi;
        this.MaTaiKhoan = MaTaiKhoan;
    }
    
    public NhanVienDTO(NhanVienDTO nv) {
        this.MaNhanVien = nv.MaNhanVien;
        this.Ho = nv.Ho;
        this.Ten = nv.Ten;
        this.SDT = nv.SDT;
        this.DiaChi = nv.DiaChi;
        this.MaTaiKhoan = nv.MaTaiKhoan;
    }
    public String getMaNhanVien() {
        return MaNhanVien;
    }
    
    public void setMaNhanVien(String MaNhanVien) {
        this.MaNhanVien = MaNhanVien;
    }
    
    public String getHo() {
        return Ho;
    }
    
    public void setHo(String Ho) {
        this.Ho = Ho;
    }

    public String getTen() {
        return Ten;
    }

    public void setTen(String Ten){
        this.Ten = Ten;
    }
    
    public String getSDT() {
        return SDT;
    }
    
    public void setSDT(String SDT) {
        this.SDT = SDT;
    }
    public String getDiaChi() {
        return DiaChi;
    }
    public void setDiaChi(String DiaChi) {
        this.DiaChi = DiaChi;
    }
 
    public String getMaTaiKhoan() {
        return MaTaiKhoan;
    }
    public void setMaTaiKhoan(String MaTaiKhoan) {
        this.MaTaiKhoan = MaTaiKhoan;
    }
}
