
USE QuanLyNhaThuoc;

-- =============================
-- 1. TaiKhoan
-- =============================
CREATE TABLE TaiKhoan (
    MaTK VARCHAR(20) PRIMARY KEY,
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    LoaiTK VARCHAR(30)
) ENGINE=InnoDB;

-- =============================
-- 2. KhachHang
-- =============================
CREATE TABLE KhachHang (
    MaKH VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh VARCHAR(10),
    SDT VARCHAR(15),
    DiaChi VARCHAR(200),
    TienSuBenhLy VARCHAR(255),
    MaTK VARCHAR(20),
    CONSTRAINT fk_KH_TK
        FOREIGN KEY (MaTK) REFERENCES TaiKhoan(MaTK)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================
-- 3. NhanVien
-- =============================
CREATE TABLE NhanVien (
    MaNV VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SDT VARCHAR(15),
    DiaChi VARCHAR(200),
    ChucVu VARCHAR(50),
    MaTK VARCHAR(20),
    CONSTRAINT fk_NV_TK
        FOREIGN KEY (MaTK) REFERENCES TaiKhoan(MaTK)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================
-- 4. NhaCungCap
-- =============================
CREATE TABLE NhaCungCap (
    MaNCC VARCHAR(20) PRIMARY KEY,
    TenNCC VARCHAR(100) NOT NULL,
    SDT VARCHAR(15),
    DiaChi VARCHAR(200)
) ENGINE=InnoDB;

-- =============================
-- 5. Thuoc
-- =============================
CREATE TABLE Thuoc (
    MaThuoc VARCHAR(20) PRIMARY KEY,
    TenThuoc VARCHAR(100) NOT NULL,
    HinhAnh VARCHAR(255),
    DonViTinh VARCHAR(50),
    GiaNhap FLOAT,
    GiaBan FLOAT,
    SoLuong INT,
    HanSuDung DATE,
    MaNCC VARCHAR(20),
    CONSTRAINT fk_Thuoc_NCC
        FOREIGN KEY (MaNCC) REFERENCES NhaCungCap(MaNCC)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================
-- 6. HoaDon
-- =============================
CREATE TABLE HoaDon (
    MaHD VARCHAR(20) PRIMARY KEY,
    NgayTao DATE,
    TongTien FLOAT,
    MaKH VARCHAR(20),
    MaNV VARCHAR(20),
    CONSTRAINT fk_HD_KH
        FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_HD_NV
        FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================
-- 7. CT_HoaDon
-- =============================
CREATE TABLE CT_HoaDon (
    MACTHD VARCHAR(20) PRIMARY KEY,
    MaHD VARCHAR(20),
    MaThuoc VARCHAR(20),
    SoLuong INT,
    HUONGDANSD VARCHAR(255),
    CONSTRAINT fk_CTHD_HD
        FOREIGN KEY (MaHD) REFERENCES HoaDon(MaHD)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_CTHD_Thuoc
        FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================
-- 8. PhieuNhap
-- =============================
CREATE TABLE PhieuNhap (
    MaPN VARCHAR(20) PRIMARY KEY,
    NgayNhap DATE,
    TongTien FLOAT,
    MaNV VARCHAR(20),
    MaNCC VARCHAR(20),
    CONSTRAINT fk_PN_NV
        FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_PN_NCC
        FOREIGN KEY (MaNCC) REFERENCES NhaCungCap(MaNCC)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================
-- 9. CT_PhieuNhap
-- =============================
CREATE TABLE CT_PhieuNhap (
    MACTPN VARCHAR(20) PRIMARY KEY,
    MaPN VARCHAR(20),
    MaThuoc VARCHAR(20),
    SoLuong INT,
    DonGia FLOAT,
    CONSTRAINT fk_CTPN_PN
        FOREIGN KEY (MaPN) REFERENCES PhieuNhap(MaPN)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_CTPN_Thuoc
        FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================
-- 10. LichLamViec
-- =============================
CREATE TABLE LichLamViec (
    MaLich VARCHAR(20) PRIMARY KEY,
    MaNV VARCHAR(20),
    NgayLam DATE,
    CaLam VARCHAR(50),
    GhiChu VARCHAR(255),
    CONSTRAINT fk_LLV_NV
        FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
