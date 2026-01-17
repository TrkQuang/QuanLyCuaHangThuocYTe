package java.dto;

public class LichLamDTO {
    private String MaLich;
    private String MaNhanVien;
    private String NgayLam;
    private String GioBatDau;
    private String GioKetThuc;

    public LichLamDTO(){
        MaLich = "";
        MaNhanVien = "";
        NgayLam = "";
        GioBatDau = "";
        GioKetThuc = "";
    }

    public LichLamDTO(String MaLich, String MaNhanVien, String NgayLam, String GioBatDau, String GioKetThuc){
        this.MaLich = MaLich;
        this.MaNhanVien = MaNhanVien;
        this.NgayLam = NgayLam;
        this.GioBatDau = GioBatDau;
        this.GioKetThuc = GioKetThuc;
    }

    public LichLamDTO(LichLamDTO ll){
        this.MaLich = ll.MaLich;
        this.MaNhanVien = ll.MaNhanVien;
        this.NgayLam = ll.NgayLam;
        this.GioBatDau = ll.GioBatDau;
        this.GioKetThuc = ll.GioKetThuc;
    }

    public String getMaLich() {return MaLich;}
    public String getMaNhanVien() {return MaNhanVien;}
    public String getNgayLam() {return NgayLam;}
    public String getGioBatDau() {return GioBatDau;}
    public String getGioKetThuc() {return GioKetThuc;}

    public void setMaLich(String MaLich) {this.MaLich = MaLich;}
    public void setMaNhanVien(String MaNhanVien) {this.MaNhanVien = MaNhanVien;}
    public void setNgayLam(String NgayLam) {this.NgayLam = NgayLam;}
    public void setGioBatDau(String GioBatDau) {this.GioBatDau = GioBatDau;}
    public void setGioKetThuc(String GioKetThuc) {this.GioKetThuc = GioKetThuc;}
}
