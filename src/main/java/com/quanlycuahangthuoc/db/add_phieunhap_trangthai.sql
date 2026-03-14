-- Thêm trạng thái quy trình cho PhieuNhap
ALTER TABLE PhieuNhap
  ADD COLUMN TrangThai VARCHAR(50) NOT NULL DEFAULT 'CHO_XAC_NHAN' AFTER MaNCC;

-- Chuẩn hóa dữ liệu cũ
UPDATE PhieuNhap
SET TrangThai = 'CHO_XAC_NHAN'
WHERE TrangThai IS NULL OR TRIM(TrangThai) = '';

-- Ràng buộc giá trị hợp lệ
ALTER TABLE PhieuNhap
  ADD CONSTRAINT ck_phieunhap_trangthai
  CHECK (TrangThai IN ('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DA_HUY'));
