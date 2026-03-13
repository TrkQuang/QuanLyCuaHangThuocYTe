USE QuanLyNhaThuoc;

-- Reset full schema + seed data (MySQL 8+)
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
    HinhAnh VARCHAR(255),
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

-- Helpful indexes for query performance
CREATE INDEX idx_hoadon_makh ON HoaDon(MaKH);
CREATE INDEX idx_hoadon_manv ON HoaDon(MaNV);
CREATE INDEX idx_cthoadon_mahd ON CT_HoaDon(MaHD);
CREATE INDEX idx_cthoadon_mathuoc ON CT_HoaDon(MaThuoc);
CREATE INDEX idx_phieunhap_manv ON PhieuNhap(MaNV);
CREATE INDEX idx_phieunhap_mancc ON PhieuNhap(MaNCC);
CREATE INDEX idx_ctphieunhap_mapn ON CT_PhieuNhap(MaPN);
CREATE INDEX idx_ctphieunhap_mathuoc ON CT_PhieuNhap(MaThuoc);
CREATE INDEX idx_lichlam_manv_ngay ON LichLamViec(MaNV, NgayLam);

-- ============================
-- SEED DATA
-- ============================

INSERT INTO TaiKhoan (MaTK, TenDangNhap, MatKhau, Email, LoaiTK) VALUES
('TKAD01', 'admin', '123456', 'admin@nhathuoc.local', 'ADMIN'),
('TKNV01', 'nv01', '123456', 'nv01@nhathuoc.local', 'NHANVIEN'),
('TKNV02', 'nv02', '123456', 'nv02@nhathuoc.local', 'NHANVIEN'),
('TKKH01', 'kh01', '123456', 'kh01@nhathuoc.local', 'KHACHHANG'),
('TKKH02', 'kh02', '123456', 'kh02@nhathuoc.local', 'KHACHHANG');

INSERT INTO NhanVien (MaNV, HoTen, SDT, DiaChi, MaTK) VALUES
('NV01', 'Le Van Admin', '0901000001', 'Q1, TP HCM', 'TKAD01'),
('NV02', 'Tran Thi BanHang', '0901000002', 'Q3, TP HCM', 'TKNV01'),
('NV03', 'Pham Van Kho', '0901000003', 'Q7, TP HCM', 'TKNV02');

INSERT INTO KhachHang (MaKH, HoTen, NgaySinh, GioiTinh, SDT, DiaChi, TienSuBenhLy, MaTK) VALUES
('KH01', 'Nguyen Van A', '1995-04-12', 'Nam', '0912000001', 'Thu Duc, TP HCM', 'Viem mui di ung', 'TKKH01'),
('KH02', 'Tran Thi B', '1992-08-20', 'Nu', '0912000002', 'Binh Thanh, TP HCM', 'Da day', 'TKKH02');

INSERT INTO NhaCungCap (MaNCC, TenNCC, SDT, DiaChi, TrangThai) VALUES
('NCC01', 'Duoc Sai Gon', '02873000001', 'Tan Binh, TP HCM', 'HOAT_DONG'),
('NCC02', 'Duoc Hau Giang', '02873000002', 'Can Tho', 'HOAT_DONG'),
('NCC03', 'Medi Wholesale', '02873000003', 'Ha Noi', 'TAM_NGUNG');

INSERT INTO Thuoc (MaThuoc, TenThuoc, HinhAnh, DonViTinh, GiaBan, SoLuongTon, HanSuDung, NgaySanXuat) VALUES
('T01', 'Paracetamol 500mg', 'img/paracetamol.png', 'Vien', 3000, 194, '2027-12-31', '2025-12-31'),
('T02', 'Amoxicillin 500mg', 'img/amocxicilin.jpg', 'Vien', 12000, 118, '2027-11-30', '2025-11-30'),
('T03', 'Vitamin C 1000mg', 'img/vitaminC.webp', 'Vien', 2500, 146, '2027-10-31', '2025-10-31'),
('T04', 'Oresol', 'img/ORESOL-oresol.jpg', 'Goi', 4500, 97, '2027-09-30', '2025-09-30'),
('T05', 'Loratadin 10mg', 'img/loratadin.webp', 'Vien', 7000, 130, '2027-08-31', '2025-08-31');

INSERT INTO PhieuNhap (MaPN, NgayNhap, TongTien, MaNV, MaNCC, TrangThai) VALUES
('PN01', '2026-02-01', 1050000, 'NV03', 'NCC01', 'DA_XAC_NHAN'),
('PN02', '2026-02-10', 1520000, 'NV03', 'NCC02', 'DA_XAC_NHAN');

INSERT INTO CT_PhieuNhap (MaCTPN, MaPN, MaThuoc, SoLuong, DonGiaNhap) VALUES
('CTPN01', 'PN01', 'T01', 200, 2000),
('CTPN02', 'PN01', 'T03', 150, 1500),
('CTPN03', 'PN01', 'T04', 100, 2500),
('CTPN04', 'PN01', 'T05', 50, 3500),
('CTPN05', 'PN02', 'T02', 120, 9000),
('CTPN06', 'PN02', 'T05', 80, 5500);

INSERT INTO HoaDon (MaHD, NgayTao, TongTien, MaKH, MaNV, TrangThai) VALUES
('HD01', '2026-02-12', 41000, 'KH01', 'NV02', 'DA_THANH_TOAN'),
('HD02', '2026-02-15', 24500, 'KH02', 'NV02', 'DA_THANH_TOAN');

INSERT INTO CT_HoaDon (MaCTHD, MaHD, MaThuoc, SoLuong, HuongDanSD, DonGiaBan) VALUES
('CTHD01', 'HD01', 'T01', 4, 'Ngay 2 lan, moi lan 1 vien sau an', 3000),
('CTHD02', 'HD01', 'T02', 2, 'Ngay 2 lan, moi lan 1 vien', 12000),
('CTHD03', 'HD01', 'T03', 2, 'Ngay 1 vien sau an sang', 2500),
('CTHD04', 'HD02', 'T04', 3, 'Pha 1 goi voi 200ml nuoc', 4500),
('CTHD05', 'HD02', 'T01', 2, 'Sot tren 38 do C moi dung', 3000),
('CTHD06', 'HD02', 'T03', 2, 'Ngay 1 vien sau bua trua', 2500);

INSERT INTO LichLamViec (MaLich, MaNV, NgayLam, GioBD, GioKT) VALUES
('LICH01', 'NV02', '2026-03-14', '08:00:00', '17:00:00'),
('LICH02', 'NV03', '2026-03-14', '09:00:00', '18:00:00'),
('LICH03', 'NV02', '2026-03-15', '08:00:00', '17:00:00'),
('LICH04', 'NV03', '2026-03-15', '09:00:00', '18:00:00');
