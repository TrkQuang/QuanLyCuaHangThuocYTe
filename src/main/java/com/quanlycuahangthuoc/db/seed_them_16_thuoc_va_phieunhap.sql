USE QuanLyNhaThuoc;

-- Seed 16 thuốc theo danh sách mới + tạo phiếu nhập mẫu (idempotent)
SET NAMES utf8mb4;
START TRANSACTION;

-- 1) Thêm/cập nhật danh mục thuốc
-- Lưu ý: T05 (Loratadin 10mg) đã tồn tại trong seed cũ, script này cập nhật lại theo giá mới.
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
    ('T06', 'Efferalgan 500mg', 'img/effaralgan.webp', 'Hộp', 52000, 80, '2028-12-31', '2026-01-15'),
    ('T07', 'Hapacol Extra', 'img/hapacol_extra.png', 'Hộp', 53000, 80, '2028-11-30', '2026-02-01'),
    ('T08', 'Panadol Extra', 'img/panadolextra.png', 'Hộp', 60000, 70, '2028-12-31', '2026-01-20'),
    ('T09', 'Claminat 500mg/62.5mg', 'img/Claminat.avif', 'Hộp', 90000, 60, '2028-10-31', '2026-01-10'),
    ('T10', 'Cefuroxim 500mg', 'img/Cefuroxim.jpg', 'Hộp', 120000, 50, '2028-12-31', '2026-02-10'),
    ('T11', 'Gaviscon Suspension', 'img/GavisconSuspension.jpg', 'Chai', 70000, 40, '2028-09-30', '2026-01-05'),
    ('T12', 'Brufen 400mg', 'img/brufen.jpg', 'Hộp', 65000, 60, '2028-08-31', '2026-01-25'),
    ('T13', 'Augmentin 625mg', 'img/Augmentin.webp', 'Hộp', 150000, 40, '2028-12-31', '2026-02-15'),
    ('T14', 'Alphachymotrypsin 4200IU', 'img/Alphachymotrypsin.jpg', 'Hộp', 55000, 50, '2028-10-31', '2026-01-18'),
    ('T15', 'Telfast 180mg', 'img/Telfast.jpg', 'Hộp', 130000, 50, '2028-12-31', '2026-02-08'),
    ('T05', 'Loratadin 10mg', 'img/Loratadin10mg.jpg', 'Hộp', 60000, 70, '2028-08-31', '2026-01-12'),
    ('T16', 'Aerius 5mg', 'img/Aerius5mg.webp', 'Hộp', 140000, 45, '2028-11-30', '2026-02-01'),
    ('T17', 'Zinnat 500mg', 'img/Zinnat500mg.webp', 'Hộp', 180000, 40, '2028-12-31', '2026-02-20'),
    ('T18', 'Cefixim 200mg', 'img/Cefixim200mg.jpg', 'Hộp', 160000, 45, '2028-12-31', '2026-02-22'),
    ('T19', 'Klamentin 875mg', 'img/Klamenti 875mg.png', 'Hộp', 170000, 40, '2028-11-30', '2026-02-25'),
    ('T20', 'Centrum Multivitamin', 'img/CentrumMultivitamin.jpg', 'Hộp', 250000, 30, '2029-01-31', '2026-03-01')
ON DUPLICATE KEY UPDATE
    TenThuoc = VALUES(TenThuoc),
    HinhAnh = VALUES(HinhAnh),
    DonViTinh = VALUES(DonViTinh),
    GiaBan = VALUES(GiaBan),
    SoLuongTon = VALUES(SoLuongTon),
    HanSuDung = VALUES(HanSuDung),
    NgaySanXuat = VALUES(NgaySanXuat);

-- 2) Tạo 2 phiếu nhập cho 16 thuốc trên
-- Chọn NV03 (kho) và NCC đang hoạt động để phù hợp ràng buộc khóa ngoại.
DELETE FROM CT_PhieuNhap WHERE MaPN IN ('PN03', 'PN04');
DELETE FROM PhieuNhap WHERE MaPN IN ('PN03', 'PN04');

INSERT INTO PhieuNhap (MaPN, NgayNhap, TongTien, MaNV, MaNCC, TrangThai) VALUES
    ('PN03', '2026-03-05', 0, 'NV03', 'NCC01', 'DA_XAC_NHAN'),
    ('PN04', '2026-03-06', 0, 'NV03', 'NCC02', 'DA_XAC_NHAN');

INSERT INTO CT_PhieuNhap (MaCTPN, MaPN, MaThuoc, SoLuong, DonGiaNhap) VALUES
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
    ('CTPN22', 'PN04', 'T19', 40, 128000);

-- 3) Tính tổng tiền phiếu nhập tự động để tránh sai số học
UPDATE PhieuNhap pn
SET pn.TongTien = (
    SELECT IFNULL(SUM(ct.SoLuong * ct.DonGiaNhap), 0)
    FROM CT_PhieuNhap ct
    WHERE ct.MaPN = pn.MaPN
)
WHERE pn.MaPN IN ('PN03', 'PN04');

-- 4) Đồng bộ tồn kho theo số lượng nhập trong 2 phiếu nhập mới
UPDATE Thuoc t
JOIN (
    SELECT MaThuoc, SUM(SoLuong) AS TongSoLuongNhap
    FROM CT_PhieuNhap
    WHERE MaPN IN ('PN03', 'PN04')
    GROUP BY MaThuoc
) x ON x.MaThuoc = t.MaThuoc
SET t.SoLuongTon = x.TongSoLuongNhap;

COMMIT;

-- Kiểm tra nhanh kết quả
SELECT MaThuoc, TenThuoc, GiaBan, SoLuongTon, HinhAnh
FROM Thuoc
WHERE MaThuoc IN ('T05','T06','T07','T08','T09','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19','T20')
ORDER BY MaThuoc;

SELECT MaPN, NgayNhap, TongTien, MaNV, MaNCC, TrangThai
FROM PhieuNhap
WHERE MaPN IN ('PN03','PN04')
ORDER BY MaPN;
