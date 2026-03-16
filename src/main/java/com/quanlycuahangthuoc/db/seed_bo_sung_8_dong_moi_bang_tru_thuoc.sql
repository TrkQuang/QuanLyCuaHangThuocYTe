USE QuanLyNhaThuoc;

-- Seed bo sung du lieu hop ly cho cac bang, tru bang Thuoc.
-- Luu y: De bo sung 8 dong cho NhanVien va 8 dong cho KhachHang,
-- bang TaiKhoan can bo sung 16 dong moi (do rang buoc MaTK duy nhat theo tung ho so).

START TRANSACTION;

-- 1) TaiKhoan (16 dong moi: 8 NHANVIEN + 8 KHACHHANG)
INSERT INTO TaiKhoan (MaTK, TenDangNhap, MatKhau, Email, LoaiTK) VALUES
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

-- 2) NhanVien (8 dong)
INSERT INTO NhanVien (MaNV, HoTen, SDT, DiaChi, MaTK) VALUES
('NV10', 'Nguyen Hoang Long', '0901000010', 'Go Vap, TP HCM', 'TKNV10'),
('NV11', 'Le Thi Hanh', '0901000011', 'Tan Phu, TP HCM', 'TKNV11'),
('NV12', 'Pham Quoc Huy', '0901000012', 'Quan 5, TP HCM', 'TKNV12'),
('NV13', 'Tran Minh Chau', '0901000013', 'Quan 10, TP HCM', 'TKNV13'),
('NV14', 'Doan Gia Bao', '0901000014', 'Thu Duc, TP HCM', 'TKNV14'),
('NV15', 'Vo Ngoc Anh', '0901000015', 'Binh Thanh, TP HCM', 'TKNV15'),
('NV16', 'Bui Khanh Linh', '0901000016', 'Quan 8, TP HCM', 'TKNV16'),
('NV17', 'Dang Tuan Kiet', '0901000017', 'Nha Be, TP HCM', 'TKNV17');

-- 3) KhachHang (8 dong)
INSERT INTO KhachHang (MaKH, HoTen, NgaySinh, GioiTinh, SDT, DiaChi, TienSuBenhLy, MaTK) VALUES
('KH10', 'Phan Van Nam', '1989-03-12', 'Nam', '0912000010', 'Di An, Binh Duong', 'Tang huyet ap', 'TKKH10'),
('KH11', 'Huynh Thi Lan', '1994-07-22', 'Nu', '0912000011', 'Bien Hoa, Dong Nai', 'Viem xoang', 'TKKH11'),
('KH12', 'Nguyen Quynh Nhu', '1998-11-10', 'Nu', '0912000012', 'Quan 7, TP HCM', 'Khong', 'TKKH12'),
('KH13', 'Le Tuan Anh', '1986-01-30', 'Nam', '0912000013', 'Thu Dau Mot, Binh Duong', 'Dai thao duong type 2', 'TKKH13'),
('KH14', 'Tran Gia Han', '2000-05-19', 'Nu', '0912000014', 'Quan 12, TP HCM', 'Viem da co dia', 'TKKH14'),
('KH15', 'Do Minh Tri', '1991-09-08', 'Nam', '0912000015', 'Hoc Mon, TP HCM', 'Khong', 'TKKH15'),
('KH16', 'Pham Bao Yen', '1996-12-25', 'Nu', '0912000016', 'Quan 4, TP HCM', 'Hen phe quan', 'TKKH16'),
('KH17', 'Vo Tien Dat', '1988-06-02', 'Nam', '0912000017', 'Tan Binh, TP HCM', 'Dau da day', 'TKKH17');

-- 4) NhaCungCap (8 dong)
INSERT INTO NhaCungCap (MaNCC, TenNCC, SDT, DiaChi, TrangThai) VALUES
('NCC10', 'Duoc Pham Mekong', '02873000010', 'Can Tho', 'HOAT_DONG'),
('NCC11', 'Viet Pharma Trading', '02873000011', 'Quan 1, TP HCM', 'HOAT_DONG'),
('NCC12', 'An Khang Medical Supply', '02873000012', 'Hai Chau, Da Nang', 'HOAT_DONG'),
('NCC13', 'An Phuc Healthcare', '02873000013', 'Hai Ba Trung, Ha Noi', 'TAM_NGUNG'),
('NCC14', 'Truong Son Pharma', '02873000014', 'Nha Trang, Khanh Hoa', 'HOAT_DONG'),
('NCC15', 'Binh Minh Duoc', '02873000015', 'Long Xuyen, An Giang', 'HOAT_DONG'),
('NCC16', 'BlueCare Distribution', '02873000016', 'Quy Nhon, Binh Dinh', 'TAM_NGUNG'),
('NCC17', 'Nam Viet Medi', '02873000017', 'Vung Tau, Ba Ria - Vung Tau', 'HOAT_DONG');

-- 5) PhieuNhap (8 dong)
INSERT INTO PhieuNhap (MaPN, NgayNhap, TongTien, MaNV, MaNCC, TrangThai) VALUES
('PN10', '2026-03-01', 280000, 'NV10', 'NCC10', 'DA_XAC_NHAN'),
('PN11', '2026-03-02', 900000, 'NV11', 'NCC11', 'DA_XAC_NHAN'),
('PN12', '2026-03-03', 360000, 'NV12', 'NCC12', 'CHO_XAC_NHAN'),
('PN13', '2026-03-04', 550000, 'NV13', 'NCC14', 'DA_XAC_NHAN'),
('PN14', '2026-03-05', 810000, 'NV14', 'NCC15', 'DA_XAC_NHAN'),
('PN15', '2026-03-06', 420000, 'NV15', 'NCC17', 'DA_HUY'),
('PN16', '2026-03-07', 490000, 'NV16', 'NCC10', 'DA_XAC_NHAN'),
('PN17', '2026-03-08', 960000, 'NV17', 'NCC11', 'CHO_XAC_NHAN');

-- 6) CT_PhieuNhap (8 dong, dung cac MaThuoc da co)
INSERT INTO CT_PhieuNhap (MaCTPN, MaPN, MaThuoc, SoLuong, DonGiaNhap) VALUES
('CTPN10', 'PN10', 'T01', 140, 2000),
('CTPN11', 'PN11', 'T02', 100, 9000),
('CTPN12', 'PN12', 'T03', 240, 1500),
('CTPN13', 'PN13', 'T04', 220, 2500),
('CTPN14', 'PN14', 'T05', 180, 4500),
('CTPN15', 'PN15', 'T01', 210, 2000),
('CTPN16', 'PN16', 'T04', 140, 3500),
('CTPN17', 'PN17', 'T02', 120, 8000);

-- 7) HoaDon (8 dong)
INSERT INTO HoaDon (MaHD, NgayTao, TongTien, MaKH, MaNV, TrangThai) VALUES
('HD10', '2026-03-09', 24000, 'KH10', 'NV10', 'DA_THANH_TOAN'),
('HD11', '2026-03-10', 36000, 'KH11', 'NV11', 'DA_THANH_TOAN'),
('HD12', '2026-03-10', 37500, 'KH12', 'NV12', 'CHO_XAC_NHAN'),
('HD13', '2026-03-11', 45000, 'KH13', 'NV13', 'DA_THANH_TOAN'),
('HD14', '2026-03-11', 28000, 'KH14', 'NV14', 'CHO_XAC_NHAN'),
('HD15', '2026-03-12', 24000, 'KH15', 'NV15', 'HUY'),
('HD16', '2026-03-12', 70000, 'KH16', 'NV16', 'DA_THANH_TOAN'),
('HD17', '2026-03-13', 37500, 'KH17', 'NV17', 'CHO_XAC_NHAN');

-- 8) CT_HoaDon (8 dong, moi hoa don 1 dong chi tiet de tong tien de doi chieu)
INSERT INTO CT_HoaDon (MaCTHD, MaHD, MaThuoc, SoLuong, HuongDanSD, DonGiaBan) VALUES
('CTHD10', 'HD10', 'T01', 8, 'Ngay 2 lan, moi lan 1 vien sau an', 3000),
('CTHD11', 'HD11', 'T02', 3, 'Ngay 2 lan, moi lan 1 vien', 12000),
('CTHD12', 'HD12', 'T03', 15, 'Ngay 1 vien sau bua sang', 2500),
('CTHD13', 'HD13', 'T04', 10, 'Pha 1 goi voi 200ml nuoc am', 4500),
('CTHD14', 'HD14', 'T05', 4, 'Ngay 1 vien truoc khi ngu', 7000),
('CTHD15', 'HD15', 'T02', 2, 'Ngay 2 lan, moi lan 1 vien', 12000),
('CTHD16', 'HD16', 'T04', 10, 'Bo sung dien giai khi mat nuoc', 7000),
('CTHD17', 'HD17', 'T03', 15, 'Ngay 1 vien sau bua trua', 2500);

-- 9) LichLamViec (8 dong)
INSERT INTO LichLamViec (MaLich, MaNV, NgayLam, GioBD, GioKT, TrangThai) VALUES
('LICH10', 'NV10', '2026-03-17', '08:00:00', '17:00:00', 'DA_DUYET'),
('LICH11', 'NV11', '2026-03-17', '09:00:00', '18:00:00', 'DA_DUYET'),
('LICH12', 'NV12', '2026-03-17', '13:00:00', '21:00:00', 'CHO_DUYET'),
('LICH13', 'NV13', '2026-03-18', '08:00:00', '17:00:00', 'DA_DUYET'),
('LICH14', 'NV14', '2026-03-18', '09:00:00', '18:00:00', 'DA_DUYET'),
('LICH15', 'NV15', '2026-03-18', '13:00:00', '21:00:00', 'TU_CHOI'),
('LICH16', 'NV16', '2026-03-19', '08:00:00', '17:00:00', 'CHO_DUYET'),
('LICH17', 'NV17', '2026-03-19', '09:00:00', '18:00:00', 'DA_DUYET');

COMMIT;
