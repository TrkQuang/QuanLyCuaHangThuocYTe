USE QuanLyNhaThuoc;

-- Full schema creation script (MySQL 8+)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS LichLamViec;
DROP TABLE IF EXISTS CT_PhieuNhap;
DROP TABLE IF EXISTS PhieuNhap;
DROP TABLE IF EXISTS CT_HoaDon;
DROP TABLE IF EXISTS HoaDon;
DROP TABLE IF EXISTS Thuoc;
DROP TABLE IF EXISTS NhaCungCap;
DROP TABLE IF EXISTS KhachHang;
DROP TABLE IF EXISTS NhanVien;
DROP TABLE IF EXISTS TaiKhoan;

SET FOREIGN_KEY_CHECKS = 1;

-- 1) TaiKhoan
CREATE TABLE TaiKhoan (
    MaTK VARCHAR(20) PRIMARY KEY,
    TenDangNhap VARCHAR(50) NOT NULL,
    MatKhau VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    LoaiTK VARCHAR(30) NOT NULL,
    CONSTRAINT uq_taikhoan_tendangnhap UNIQUE (TenDangNhap),
    CONSTRAINT uq_taikhoan_email UNIQUE (Email),
    CONSTRAINT ck_taikhoan_loaitk CHECK (LoaiTK IN ('ADMIN', 'NHANVIEN', 'KHACHHANG', 'BANNED'))
) ENGINE=InnoDB;

-- 2) NhanVien
CREATE TABLE NhanVien (
    MaNV VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SDT VARCHAR(15) NOT NULL,
    DiaChi VARCHAR(200) NOT NULL,
    MaTK VARCHAR(20) NOT NULL,
    CONSTRAINT uq_nhanvien_sdt UNIQUE (SDT),
    CONSTRAINT uq_nhanvien_matk UNIQUE (MaTK),
    CONSTRAINT fk_nhanvien_taikhoan FOREIGN KEY (MaTK)
        REFERENCES TaiKhoan(MaTK)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT ck_nhanvien_sdt CHECK (CHAR_LENGTH(SDT) BETWEEN 10 AND 15)
) ENGINE=InnoDB;

-- 3) KhachHang
CREATE TABLE KhachHang (
    MaKH VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE NOT NULL,
    GioiTinh VARCHAR(10) NOT NULL,
    SDT VARCHAR(15) NOT NULL,
    DiaChi VARCHAR(200) NOT NULL,
    TienSuBenhLy VARCHAR(255),
    MaTK VARCHAR(20) NOT NULL,
    CONSTRAINT uq_khachhang_sdt UNIQUE (SDT),
    CONSTRAINT uq_khachhang_matk UNIQUE (MaTK),
    CONSTRAINT fk_khachhang_taikhoan FOREIGN KEY (MaTK)
        REFERENCES TaiKhoan(MaTK)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT ck_khachhang_gioitinh CHECK (GioiTinh IN ('Nam', 'Nu', 'Khac')),
    CONSTRAINT ck_khachhang_sdt CHECK (CHAR_LENGTH(SDT) BETWEEN 10 AND 15),
    CONSTRAINT ck_khachhang_ngaysinh_min CHECK (NgaySinh >= '1900-01-01'),
    CONSTRAINT ck_khachhang_ngaysinh_max CHECK (NgaySinh <= '2100-12-31')
) ENGINE=InnoDB;

DROP TRIGGER IF EXISTS trg_khachhang_ngaysinh_bi;
DROP TRIGGER IF EXISTS trg_khachhang_ngaysinh_bu;

DELIMITER $$
CREATE TRIGGER trg_khachhang_ngaysinh_bi
BEFORE INSERT ON KhachHang
FOR EACH ROW
BEGIN
    IF NEW.NgaySinh > CURRENT_DATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'NgaySinh khong duoc lon hon ngay hien tai';
    END IF;
END$$

CREATE TRIGGER trg_khachhang_ngaysinh_bu
BEFORE UPDATE ON KhachHang
FOR EACH ROW
BEGIN
    IF NEW.NgaySinh > CURRENT_DATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'NgaySinh khong duoc lon hon ngay hien tai';
    END IF;
END$$
DELIMITER ;

-- 4) Thuoc
CREATE TABLE Thuoc (
    MaThuoc VARCHAR(20) PRIMARY KEY,
    TenThuoc VARCHAR(100) NOT NULL,
    HinhAnh LONGTEXT,
    DonViTinh VARCHAR(50) NOT NULL,
    GiaBan FLOAT NOT NULL,
    SoLuongTon INT NOT NULL,
    HanSuDung DATE NOT NULL,
    NgaySanXuat DATE NOT NULL,
    CONSTRAINT ck_thuoc_giaban CHECK (GiaBan > 0),
    CONSTRAINT ck_thuoc_soluongton CHECK (SoLuongTon >= 0),
    CONSTRAINT ck_thuoc_hansudung CHECK (HanSuDung > NgaySanXuat)
) ENGINE=InnoDB;

-- 5) HoaDon
CREATE TABLE HoaDon (
    MaHD VARCHAR(20) PRIMARY KEY,
    NgayTao DATE NOT NULL,
    TongTien FLOAT NOT NULL,
    MaKH VARCHAR(20) NOT NULL,
    MaNV VARCHAR(20) NOT NULL,
    TrangThai VARCHAR(50) NOT NULL,
    CONSTRAINT fk_hoadon_khachhang FOREIGN KEY (MaKH)
        REFERENCES KhachHang(MaKH)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_hoadon_nhanvien FOREIGN KEY (MaNV)
        REFERENCES NhanVien(MaNV)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT ck_hoadon_tongtien CHECK (TongTien >= 0),
    CONSTRAINT ck_hoadon_trangthai CHECK (TrangThai IN ('CHO_XAC_NHAN', 'DA_THANH_TOAN', 'HUY'))
) ENGINE=InnoDB;

-- 6) CT_HoaDon
CREATE TABLE CT_HoaDon (
    MaCTHD VARCHAR(20) PRIMARY KEY,
    MaHD VARCHAR(20) NOT NULL,
    MaThuoc VARCHAR(20) NOT NULL,
    SoLuong INT NOT NULL,
    HuongDanSD VARCHAR(255),
    DonGiaBan FLOAT NOT NULL,
    CONSTRAINT fk_cthoadon_hoadon FOREIGN KEY (MaHD)
        REFERENCES HoaDon(MaHD)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_cthoadon_thuoc FOREIGN KEY (MaThuoc)
        REFERENCES Thuoc(MaThuoc)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT ck_cthoadon_soluong CHECK (SoLuong > 0),
    CONSTRAINT ck_cthoadon_dongiaban CHECK (DonGiaBan > 0)
) ENGINE=InnoDB;

-- 7) NhaCungCap
CREATE TABLE NhaCungCap (
    MaNCC VARCHAR(20) PRIMARY KEY,
    TenNCC VARCHAR(100) NOT NULL,
    SDT VARCHAR(15) NOT NULL,
    DiaChi VARCHAR(200) NOT NULL,
    TrangThai VARCHAR(50) NOT NULL,
    CONSTRAINT uq_ncc_sdt UNIQUE (SDT),
    CONSTRAINT ck_ncc_sdt CHECK (CHAR_LENGTH(SDT) BETWEEN 10 AND 15),
    CONSTRAINT ck_ncc_trangthai CHECK (TrangThai IN ('HOAT_DONG', 'TAM_NGUNG'))
) ENGINE=InnoDB;

-- 8) PhieuNhap
CREATE TABLE PhieuNhap (
    MaPN VARCHAR(20) PRIMARY KEY,
    NgayNhap DATE NOT NULL,
    TongTien FLOAT NOT NULL,
    MaNV VARCHAR(20) NOT NULL,
    MaNCC VARCHAR(20) NOT NULL,
    TrangThai VARCHAR(50) NOT NULL DEFAULT 'CHO_XAC_NHAN',
    CONSTRAINT fk_phieunhap_nhanvien FOREIGN KEY (MaNV)
        REFERENCES NhanVien(MaNV)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_phieunhap_ncc FOREIGN KEY (MaNCC)
        REFERENCES NhaCungCap(MaNCC)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT ck_phieunhap_tongtien CHECK (TongTien >= 0),
    CONSTRAINT ck_phieunhap_trangthai CHECK (TrangThai IN ('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DA_HUY'))
) ENGINE=InnoDB;

-- 9) CT_PhieuNhap
CREATE TABLE CT_PhieuNhap (
    MaCTPN VARCHAR(20) PRIMARY KEY,
    MaPN VARCHAR(20) NOT NULL,
    MaThuoc VARCHAR(20) NOT NULL,
    SoLuong INT NOT NULL,
    DonGiaNhap FLOAT NOT NULL,
    CONSTRAINT fk_ctphieunhap_phieunhap FOREIGN KEY (MaPN)
        REFERENCES PhieuNhap(MaPN)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_ctphieunhap_thuoc FOREIGN KEY (MaThuoc)
        REFERENCES Thuoc(MaThuoc)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT ck_ctphieunhap_soluong CHECK (SoLuong > 0),
    CONSTRAINT ck_ctphieunhap_dongianhap CHECK (DonGiaNhap > 0)
) ENGINE=InnoDB;

-- 10) LichLamViec
CREATE TABLE LichLamViec (
    MaLich VARCHAR(20) PRIMARY KEY,
    MaNV VARCHAR(20) NOT NULL,
    NgayLam DATE NOT NULL,
    GioBD TIME NOT NULL,
    GioKT TIME NOT NULL,
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'DA_DUYET',
    CONSTRAINT fk_lichlam_nhanvien FOREIGN KEY (MaNV)
        REFERENCES NhanVien(MaNV)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT ck_lichlam_gio CHECK (GioKT > GioBD),
    CONSTRAINT ck_lichlam_trangthai CHECK (TrangThai IN ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI'))
) ENGINE=InnoDB;

-- Helpful indexes
CREATE INDEX idx_hoadon_makh ON HoaDon(MaKH);
CREATE INDEX idx_hoadon_manv ON HoaDon(MaNV);
CREATE INDEX idx_cthoadon_mahd ON CT_HoaDon(MaHD);
CREATE INDEX idx_cthoadon_mathuoc ON CT_HoaDon(MaThuoc);
CREATE INDEX idx_phieunhap_manv ON PhieuNhap(MaNV);
CREATE INDEX idx_phieunhap_mancc ON PhieuNhap(MaNCC);
CREATE INDEX idx_ctphieunhap_mapn ON CT_PhieuNhap(MaPN);
CREATE INDEX idx_ctphieunhap_mathuoc ON CT_PhieuNhap(MaThuoc);
CREATE INDEX idx_lichlam_manv_ngay ON LichLamViec(MaNV, NgayLam);
