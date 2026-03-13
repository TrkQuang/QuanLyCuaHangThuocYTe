-- Them trang thai quy trinh cho PhieuNhap
ALTER TABLE PhieuNhap
  ADD COLUMN TrangThai VARCHAR(50) NOT NULL DEFAULT 'CHO_XAC_NHAN' AFTER MaNCC;

-- Chuan hoa du lieu cu
UPDATE PhieuNhap
SET TrangThai = 'CHO_XAC_NHAN'
WHERE TrangThai IS NULL OR TRIM(TrangThai) = '';

-- Rang buoc gia tri hop le
ALTER TABLE PhieuNhap
  ADD CONSTRAINT ck_phieunhap_trangthai
  CHECK (TrangThai IN ('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DA_HUY'));
