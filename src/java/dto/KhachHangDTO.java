package java.dto;

public class KhachHangDTO{
    private String MaKhachHang;
    private String MaTaiKhoan;
    private String Ho;
    private String Ten;
    private String NgaySinh;
    private String GioiTinh;
    private String SDT;
    private String DiaChi;
    private String TienSuBenhLy;

    public KhachHangDTO(){
        MaKhachHang = "";
        MaTaiKhoan = "";
        Ho = "";
        Ten = "";
        NgaySinh = "";
        GioiTinh = "";
        SDT = "";
        DiaChi = "";
        TienSuBenhLy = "";
    }

    public KhachHangDTO(String MaKhachHang, String MaTaiKhoan, String Ho, String Ten, String NgaySinh, String GioiTinh, String SDT, String DiaChi, String TienSuBenhLy){
        this.MaKhachHang = MaKhachHang;
        this.MaTaiKhoan = MaTaiKhoan;
        this.Ho = Ho;
        this.Ten = Ten;
        this.NgaySinh = NgaySinh;
        this.GioiTinh = GioiTinh;
        this.SDT = SDT;
        this.DiaChi = DiaChi;
        this.TienSuBenhLy = TienSuBenhLy;
    }

    public KhachHangDTO(KhachHangDTO kh){
        this.MaKhachHang = kh.MaKhachHang;
        this.MaTaiKhoan = kh.MaTaiKhoan;
        this.Ho = kh.Ho;
        this.Ten = kh.Ten;
        this.NgaySinh = kh.NgaySinh;
        this.GioiTinh = kh.GioiTinh;
        this.SDT = kh.SDT;
        this.DiaChi = kh.DiaChi;
        this.TienSuBenhLy = kh.TienSuBenhLy;
    }

    public String getMaKhachHang() {return MaKhachHang;}
    public String getMaTaiKhoan() {return MaTaiKhoan;}
    public String getHo() {return Ho;}
    public String getTen() {return Ten;}
    public String getNgaySinh() {return NgaySinh;}
    public String getGioiTinh() {return GioiTinh;}
    public String getSDT() {return SDT;}
    public String getDiaChi() {return DiaChi;}
    public String getTienSuBenhLy() {return TienSuBenhLy;}

    public void setMaKhachHang(String MaKhachHang) {this.MaKhachHang = MaKhachHang;}
    public void setMaTaiKhoan(String MaTaiKhoan) {this.MaTaiKhoan = MaTaiKhoan;}
    public void setHo(String Ho) {this.Ho = Ho;} 
    public void setTen(String Ten) {this.Ten = Ten;}
    public void setNgaySinh(String NgaySinh) {this.NgaySinh = NgaySinh;}
    public void setGioiTinh(String GioiTinh) {this.GioiTinh = GioiTinh;}
    public void setSDT(String SDT) {this.SDT = SDT;}
    public void setDiaChi(String DiaChi) {this.DiaChi = DiaChi;}
    public void setTienSuBenhLy(String TienSuBenhLy) {this.TienSuBenhLy = TienSuBenhLy;}
}