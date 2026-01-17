package java.dto;

public class NhanVienDTO {
    private String maNNV;
    private String hoTen;
    private String sdt;
    private String diaChi;
    private String chucVu;
    private String maTK;
    
    public NhanVienDTO() {
        this.maNNV = "";
        this.hoTen = "";
        this.sdt = "";
        this.diaChi = "";
        this.chucVu = "";
        this.maTK = "";
    }
    
    public NhanVienDTO(String maNNV, String hoTen, String sdt, String diaChi, String chucVu, String maTK) {
        this.maNNV = maNNV;
        this.hoTen = hoTen;
        this.sdt = sdt;
        this.diaChi = diaChi;
        this.chucVu = chucVu;
        this.maTK = maTK;
    }
    
    public NhanVienDTO(NhanVienDTO other) {
        this.maNNV = other.maNNV;
        this.hoTen = other.hoTen;
        this.sdt = other.sdt;
        this.diaChi = other.diaChi;
        this.chucVu = other.chucVu;
        this.maTK = other.maTK;
    }
    public String getMaNNV() {
        return maNNV;
    }
    
    public void setMaNNV(String maNNV) {
        this.maNNV = maNNV;
    }
    
    public String getHoTen() {
        return hoTen;
    }
    
    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }
    
    public String getSdt() {
        return sdt;
    }
    
    public void setSdt(String sdt) {
        this.sdt = sdt;
    }
    public String getDiaChi() {
        return diaChi;
    }
    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }
    
    public String getChucVu() {
        return chucVu;
    }
    public void setChucVu(String chucVu) {
        this.chucVu = chucVu;
    }
    public String getMaTK() {
        return maTK;
    }
    public void setMaTK(String maTK) {
        this.maTK = maTK;
    }
}
