USE QuanLyNhaThuoc;

-- Full data seed script.
SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO TaiKhoan (MaTK, TenDangNhap, MatKhau, Email, LoaiTK) VALUES
('TKAD01', 'admin', '123456', 'admin@nhathuoc.local', 'ADMIN'),
('TKNV01', 'nv01', '123456', 'nv01@nhathuoc.local', 'NHANVIEN'),
('TKNV02', 'nv02', '123456', 'nv02@nhathuoc.local', 'NHANVIEN'),
('TKKH01', 'kh01', '123456', 'kh01@nhathuoc.local', 'KHACHHANG'),
('TKKH02', 'kh02', '123456', 'kh02@nhathuoc.local', 'KHACHHANG'),
('TKNV10', 'nv10', '123456', 'nv10@nhathuoc.local', 'NHANVIEN'),
('TKNV11', 'nv11', '123456', 'nv11@nhathuoc.local', 'NHANVIEN'),
('TKNV12', 'nv12', '123456', 'nv12@nhathuoc.local', 'NHANVIEN'),
('TKNV13', 'nv13', '123456', 'nv13@nhathuoc.local', 'NHANVIEN'),
('TKNV14', 'nv14', '123456', 'nv14@nhathuoc.local', 'NHANVIEN'),
('TKNV15', 'nv15', '123456', 'nv15@nhathuoc.local', 'NHANVIEN'),
('TKNV16', 'nv16', '123456', 'nv16@nhathuoc.local', 'NHANVIEN'),
('TKNV17', 'nv17', '123456', 'nv17@nhathuoc.local', 'NHANVIEN'),
('TKKH10', 'kh10', '123456', 'kh10@nhathuoc.local', 'KHACHHANG'),
('TKKH11', 'kh11', '123456', 'kh11@nhathuoc.local', 'KHACHHANG'),
('TKKH12', 'kh12', '123456', 'kh12@nhathuoc.local', 'KHACHHANG'),
('TKKH13', 'kh13', '123456', 'kh13@nhathuoc.local', 'KHACHHANG'),
('TKKH14', 'kh14', '123456', 'kh14@nhathuoc.local', 'KHACHHANG'),
('TKKH15', 'kh15', '123456', 'kh15@nhathuoc.local', 'KHACHHANG'),
('TKKH16', 'kh16', '123456', 'kh16@nhathuoc.local', 'KHACHHANG'),
('TKKH17', 'kh17', '123456', 'kh17@nhathuoc.local', 'KHACHHANG');

INSERT INTO NhanVien (MaNV, HoTen, SDT, DiaChi, MaTK) VALUES
('NV01', 'Le Van Admin', '0901000001', 'Q1, TP HCM', 'TKAD01'),
('NV02', 'Tran Thi BanHang', '0901000002', 'Q3, TP HCM', 'TKNV01'),
('NV03', 'Pham Van Kho', '0901000003', 'Q7, TP HCM', 'TKNV02'),
('NV10', 'Nguyen Hoang Long', '0901000010', 'Go Vap, TP HCM', 'TKNV10'),
('NV11', 'Le Thi Hanh', '0901000011', 'Tan Phu, TP HCM', 'TKNV11'),
('NV12', 'Pham Quoc Huy', '0901000012', 'Quan 5, TP HCM', 'TKNV12'),
('NV13', 'Tran Minh Chau', '0901000013', 'Quan 10, TP HCM', 'TKNV13'),
('NV14', 'Doan Gia Bao', '0901000014', 'Thu Duc, TP HCM', 'TKNV14'),
('NV15', 'Vo Ngoc Anh', '0901000015', 'Binh Thanh, TP HCM', 'TKNV15'),
('NV16', 'Bui Khanh Linh', '0901000016', 'Quan 8, TP HCM', 'TKNV16'),
('NV17', 'Dang Tuan Kiet', '0901000017', 'Nha Be, TP HCM', 'TKNV17');

INSERT INTO KhachHang (MaKH, HoTen, NgaySinh, GioiTinh, SDT, DiaChi, TienSuBenhLy, MaTK) VALUES
('KH01', 'Nguyen Van A', '1995-04-12', 'Nam', '0912000001', 'Thu Duc, TP HCM', 'Viem mui di ung', 'TKKH01'),
('KH02', 'Tran Thi B', '1992-08-20', 'Nu', '0912000002', 'Binh Thanh, TP HCM', 'Da day', 'TKKH02'),
('KH10', 'Phan Van Nam', '1989-03-12', 'Nam', '0912000010', 'Di An, Binh Duong', 'Tang huyet ap', 'TKKH10'),
('KH11', 'Huynh Thi Lan', '1994-07-22', 'Nu', '0912000011', 'Bien Hoa, Dong Nai', 'Viem xoang', 'TKKH11'),
('KH12', 'Nguyen Quynh Nhu', '1998-11-10', 'Nu', '0912000012', 'Quan 7, TP HCM', 'Khong', 'TKKH12'),
('KH13', 'Le Tuan Anh', '1986-01-30', 'Nam', '0912000013', 'Thu Dau Mot, Binh Duong', 'Dai thao duong type 2', 'TKKH13'),
('KH14', 'Tran Gia Han', '2000-05-19', 'Nu', '0912000014', 'Quan 12, TP HCM', 'Viem da co dia', 'TKKH14'),
('KH15', 'Do Minh Tri', '1991-09-08', 'Nam', '0912000015', 'Hoc Mon, TP HCM', 'Khong', 'TKKH15'),
('KH16', 'Pham Bao Yen', '1996-12-25', 'Nu', '0912000016', 'Quan 4, TP HCM', 'Hen phe quan', 'TKKH16'),
('KH17', 'Vo Tien Dat', '1988-06-02', 'Nam', '0912000017', 'Tan Binh, TP HCM', 'Dau da day', 'TKKH17');

INSERT INTO NhaCungCap (MaNCC, TenNCC, SDT, DiaChi, TrangThai) VALUES
('NCC01', 'Duoc Sai Gon', '02873000001', 'Tan Binh, TP HCM', 'HOAT_DONG'),
('NCC02', 'Duoc Hau Giang', '02873000002', 'Can Tho', 'HOAT_DONG'),
('NCC03', 'Medi Wholesale', '02873000003', 'Ha Noi', 'TAM_NGUNG'),
('NCC10', 'Duoc Pham Mekong', '02873000010', 'Can Tho', 'HOAT_DONG'),
('NCC11', 'Viet Pharma Trading', '02873000011', 'Quan 1, TP HCM', 'HOAT_DONG'),
('NCC12', 'An Khang Medical Supply', '02873000012', 'Hai Chau, Da Nang', 'HOAT_DONG'),
('NCC13', 'An Phuc Healthcare', '02873000013', 'Hai Ba Trung, Ha Noi', 'TAM_NGUNG'),
('NCC14', 'Truong Son Pharma', '02873000014', 'Nha Trang, Khanh Hoa', 'HOAT_DONG'),
('NCC15', 'Binh Minh Duoc', '02873000015', 'Long Xuyen, An Giang', 'HOAT_DONG'),
('NCC16', 'BlueCare Distribution', '02873000016', 'Quy Nhon, Binh Dinh', 'TAM_NGUNG'),
('NCC17', 'Nam Viet Medi', '02873000017', 'Vung Tau, Ba Ria - Vung Tau', 'HOAT_DONG');

INSERT INTO Thuoc (
    MaThuoc,
    TenThuoc,
    HinhAnh,
    DonViTinh,
    GiaBan,
    SoLuongTon,
    HanSuDung,
    NgaySanXuat
) VALUES
('T01', 'Paracetamol 500mg', 'img/paracetamol.png', 'Vien', 3000, 194, '2027-12-31', '2025-12-31'),
('T02', 'Amoxicillin 500mg', 'img/amocxicilin.jpg', 'Vien', 12000, 118, '2027-11-30', '2025-11-30'),
('T03', 'Vitamin C 1000mg', 'img/vitaminC.webp', 'Vien', 2500, 146, '2027-10-31', '2025-10-31'),
('T04', 'Oresol', 'img/ORESOL-oresol.jpg', 'Goi', 4500, 97, '2027-09-30', '2025-09-30'),
('T05', 'Loratadin 10mg', 'img/Loratadin10mg.jpg', 'Hop', 60000, 70, '2028-08-31', '2026-01-12'),
('T06', 'Efferalgan 500mg', 'img/effaralgan.webp', 'Hop', 52000, 80, '2028-12-31', '2026-01-15'),
('T07', 'Hapacol Extra', 'img/hapacol_extra.png', 'Hop', 53000, 80, '2028-11-30', '2026-02-01'),
('T08', 'Panadol Extra', 'img/panadolextra.png', 'Hop', 60000, 70, '2028-12-31', '2026-01-20'),
('T09', 'Claminat 500mg/62.5mg', 'img/Claminat.avif', 'Hop', 90000, 60, '2028-10-31', '2026-01-10'),
('T10', 'Cefuroxim 500mg', 'img/Cefuroxim.jpg', 'Hop', 120000, 50, '2028-12-31', '2026-02-10'),
('T11', 'Gaviscon Suspension', 'img/GavisconSuspension.jpg', 'Chai', 70000, 40, '2028-09-30', '2026-01-05'),
('T12', 'Brufen 400mg', 'img/brufen.jpg', 'Hop', 65000, 60, '2028-08-31', '2026-01-25'),
('T13', 'Augmentin 625mg', 'img/Augmentin.webp', 'Hop', 150000, 40, '2028-12-31', '2026-02-15'),
('T14', 'Alphachymotrypsin 4200IU', 'img/Alphachymotrypsin.jpg', 'Hop', 55000, 50, '2028-10-31', '2026-01-18'),
('T15', 'Telfast 180mg', 'img/Telfast.jpg', 'Hop', 130000, 50, '2028-12-31', '2026-02-08'),
('T16', 'Aerius 5mg', 'img/Aerius5mg.webp', 'Hop', 140000, 45, '2028-11-30', '2026-02-01'),
('T17', 'Zinnat 500mg', 'img/Zinnat500mg.webp', 'Hop', 180000, 40, '2028-12-31', '2026-02-20'),
('T18', 'Cefixim 200mg', 'img/Cefixim200mg.jpg', 'Hop', 160000, 45, '2028-12-31', '2026-02-22'),
('T19', 'Klamentin 875mg', 'img/Klamenti 875mg.png', 'Hop', 170000, 40, '2028-11-30', '2026-02-25'),
('T20', 'Centrum Multivitamin', 'img/CentrumMultivitamin.jpg', 'Hop', 250000, 30, '2029-01-31', '2026-03-01');

INSERT INTO PhieuNhap (MaPN, NgayNhap, TongTien, MaNV, MaNCC, TrangThai) VALUES
('PN01', '2026-02-01', 1050000, 'NV03', 'NCC01', 'DA_XAC_NHAN'),
('PN02', '2026-02-10', 1520000, 'NV03', 'NCC02', 'DA_XAC_NHAN'),
('PN03', '2026-03-05', 0, 'NV03', 'NCC01', 'DA_XAC_NHAN'),
('PN04', '2026-03-06', 0, 'NV03', 'NCC02', 'DA_XAC_NHAN'),
('PN10', '2026-03-01', 280000, 'NV10', 'NCC10', 'DA_XAC_NHAN'),
('PN11', '2026-03-02', 900000, 'NV11', 'NCC11', 'DA_XAC_NHAN'),
('PN12', '2026-03-03', 360000, 'NV12', 'NCC12', 'CHO_XAC_NHAN'),
('PN13', '2026-03-04', 550000, 'NV13', 'NCC14', 'DA_XAC_NHAN'),
('PN14', '2026-03-05', 810000, 'NV14', 'NCC15', 'DA_XAC_NHAN'),
('PN15', '2026-03-06', 420000, 'NV15', 'NCC17', 'DA_HUY'),
('PN16', '2026-03-07', 490000, 'NV16', 'NCC10', 'DA_XAC_NHAN'),
('PN17', '2026-03-08', 960000, 'NV17', 'NCC11', 'CHO_XAC_NHAN');

INSERT INTO CT_PhieuNhap (MaCTPN, MaPN, MaThuoc, SoLuong, DonGiaNhap) VALUES
('CTPN01', 'PN01', 'T01', 200, 2000),
('CTPN02', 'PN01', 'T03', 150, 1500),
('CTPN03', 'PN01', 'T04', 100, 2500),
('CTPN04', 'PN01', 'T05', 50, 3500),
('CTPN05', 'PN02', 'T02', 120, 9000),
('CTPN06', 'PN02', 'T05', 80, 5500),
('CTPN07', 'PN03', 'T06', 80, 38000),
('CTPN08', 'PN03', 'T07', 80, 39000),
('CTPN09', 'PN03', 'T08', 70, 44000),
('CTPN10', 'PN03', 'T12', 60, 48000),
('CTPN11', 'PN03', 'T14', 50, 40000),
('CTPN12', 'PN03', 'T05', 70, 45000),
('CTPN13', 'PN03', 'T11', 40, 52000),
('CTPN14', 'PN03', 'T20', 30, 190000),
('CTPN15', 'PN04', 'T09', 60, 68000),
('CTPN16', 'PN04', 'T10', 50, 90000),
('CTPN17', 'PN04', 'T13', 40, 115000),
('CTPN18', 'PN04', 'T15', 50, 98000),
('CTPN19', 'PN04', 'T16', 45, 105000),
('CTPN20', 'PN04', 'T17', 40, 135000),
('CTPN21', 'PN04', 'T18', 45, 120000),
('CTPN22', 'PN04', 'T19', 40, 128000),
('CTPN10B', 'PN10', 'T01', 140, 2000),
('CTPN11B', 'PN11', 'T02', 100, 9000),
('CTPN12B', 'PN12', 'T03', 240, 1500),
('CTPN13B', 'PN13', 'T04', 220, 2500),
('CTPN14B', 'PN14', 'T05', 180, 4500),
('CTPN15B', 'PN15', 'T01', 210, 2000),
('CTPN16B', 'PN16', 'T04', 140, 3500),
('CTPN17B', 'PN17', 'T02', 120, 8000);

INSERT INTO HoaDon (MaHD, NgayTao, TongTien, MaKH, MaNV, TrangThai) VALUES
('HD01', '2026-02-12', 41000, 'KH01', 'NV02', 'DA_THANH_TOAN'),
('HD02', '2026-02-15', 24500, 'KH02', 'NV02', 'DA_THANH_TOAN'),
('HD10', '2026-03-09', 24000, 'KH10', 'NV10', 'DA_THANH_TOAN'),
('HD11', '2026-03-10', 36000, 'KH11', 'NV11', 'DA_THANH_TOAN'),
('HD12', '2026-03-10', 37500, 'KH12', 'NV12', 'CHO_XAC_NHAN'),
('HD13', '2026-03-11', 45000, 'KH13', 'NV13', 'DA_THANH_TOAN'),
('HD14', '2026-03-11', 28000, 'KH14', 'NV14', 'CHO_XAC_NHAN'),
('HD15', '2026-03-12', 24000, 'KH15', 'NV15', 'HUY'),
('HD16', '2026-03-12', 70000, 'KH16', 'NV16', 'DA_THANH_TOAN'),
('HD17', '2026-03-13', 37500, 'KH17', 'NV17', 'CHO_XAC_NHAN');

INSERT INTO CT_HoaDon (MaCTHD, MaHD, MaThuoc, SoLuong, HuongDanSD, DonGiaBan) VALUES
('CTHD01', 'HD01', 'T01', 4, 'Ngay 2 lan, moi lan 1 vien sau an', 3000),
('CTHD02', 'HD01', 'T02', 2, 'Ngay 2 lan, moi lan 1 vien', 12000),
('CTHD03', 'HD01', 'T03', 2, 'Ngay 1 vien sau an sang', 2500),
('CTHD04', 'HD02', 'T04', 3, 'Pha 1 goi voi 200ml nuoc', 4500),
('CTHD05', 'HD02', 'T01', 2, 'Sot tren 38 do C moi dung', 3000),
('CTHD06', 'HD02', 'T03', 2, 'Ngay 1 vien sau bua trua', 2500),
('CTHD10', 'HD10', 'T01', 8, 'Ngay 2 lan, moi lan 1 vien sau an', 3000),
('CTHD11', 'HD11', 'T02', 3, 'Ngay 2 lan, moi lan 1 vien', 12000),
('CTHD12', 'HD12', 'T03', 15, 'Ngay 1 vien sau bua sang', 2500),
('CTHD13', 'HD13', 'T04', 10, 'Pha 1 goi voi 200ml nuoc am', 4500),
('CTHD14', 'HD14', 'T05', 4, 'Ngay 1 vien truoc khi ngu', 7000),
('CTHD15', 'HD15', 'T02', 2, 'Ngay 2 lan, moi lan 1 vien', 12000),
('CTHD16', 'HD16', 'T04', 10, 'Bo sung dien giai khi mat nuoc', 7000),
('CTHD17', 'HD17', 'T03', 15, 'Ngay 1 vien sau bua trua', 2500);

INSERT INTO LichLamViec (MaLich, MaNV, NgayLam, GioBD, GioKT, TrangThai) VALUES
('LICH01', 'NV02', '2026-03-14', '08:00:00', '17:00:00', 'DA_DUYET'),
('LICH02', 'NV03', '2026-03-14', '09:00:00', '18:00:00', 'DA_DUYET'),
('LICH03', 'NV02', '2026-03-15', '08:00:00', '17:00:00', 'DA_DUYET'),
('LICH04', 'NV03', '2026-03-15', '09:00:00', '18:00:00', 'DA_DUYET'),
('LICH10', 'NV10', '2026-03-17', '08:00:00', '17:00:00', 'DA_DUYET'),
('LICH11', 'NV11', '2026-03-17', '09:00:00', '18:00:00', 'DA_DUYET'),
('LICH12', 'NV12', '2026-03-17', '13:00:00', '21:00:00', 'CHO_DUYET'),
('LICH13', 'NV13', '2026-03-18', '08:00:00', '17:00:00', 'DA_DUYET'),
('LICH14', 'NV14', '2026-03-18', '09:00:00', '18:00:00', 'DA_DUYET'),
('LICH15', 'NV15', '2026-03-18', '13:00:00', '21:00:00', 'TU_CHOI'),
('LICH16', 'NV16', '2026-03-19', '08:00:00', '17:00:00', 'CHO_DUYET'),
('LICH17', 'NV17', '2026-03-19', '09:00:00', '18:00:00', 'DA_DUYET');

-- Recalculate totals after detail insert to avoid mismatch.
UPDATE PhieuNhap pn
SET pn.TongTien = (
    SELECT IFNULL(SUM(ct.SoLuong * ct.DonGiaNhap), 0)
    FROM CT_PhieuNhap ct
    WHERE ct.MaPN = pn.MaPN
);

COMMIT;
