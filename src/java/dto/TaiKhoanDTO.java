package java.dto;

public class TaiKhoanDTO {
    private String MaTaiKhoan;
    private String TenDangNhap;
    private String MatKhau;
    private String Email;
    private String LoaiTaiKhoan;

    public TaiKhoanDTO(){
        MaTaiKhoan = "";
        TenDangNhap = "";
        MatKhau = "";
        Email = "";
        LoaiTaiKhoan = "";
    }

    public TaiKhoanDTO(String MaTaiKhoan, String TenDangNhap, String MatKhau, String Email, String LoaiTaiKhoan){
        this.MaTaiKhoan = MaTaiKhoan;
        this.TenDangNhap = TenDangNhap;
        this.MatKhau = MatKhau;
        this.Email = Email;
        this.LoaiTaiKhoan = LoaiTaiKhoan;
    }
    
    public TaiKhoanDTO(TaiKhoanDTO tk){
        this.MaTaiKhoan = tk.MaTaiKhoan;
        this.TenDangNhap = tk.TenDangNhap;
        this.MatKhau = tk.MatKhau;
        this.Email = tk.Email;
        this.LoaiTaiKhoan = tk.LoaiTaiKhoan;
    }

    public String getMaTaiKhoan() {return MaTaiKhoan;}
    public String getTenDangNhap() {return TenDangNhap;}
    public String getMatKhau() {return MatKhau;}
    public String getEmail() {return Email;}
    public String getLoaiTaiKhoan() {return LoaiTaiKhoan;}

    public void setMaTaiKhoan(String MaTaiKhoan) {this.MaTaiKhoan = MaTaiKhoan;}
    public void setTenDangNhap(String TenDangNhap) {this.TenDangNhap = TenDangNhap;}
    public void setMatKhau(String MatKhau) {this.MatKhau = MatKhau;}
    public void setEmail(String Email) {this.Email = Email;}
    public void setLoaiTaiKhoan(String LoaiTaiKhoan) {this.LoaiTaiKhoan = LoaiTaiKhoan;}
}
