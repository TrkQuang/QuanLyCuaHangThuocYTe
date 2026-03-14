-- Thêm trạng thái duyệt đăng ký cho LichLamViec
ALTER TABLE LichLamViec
  ADD COLUMN TrangThai VARCHAR(20) NOT NULL DEFAULT 'DA_DUYET' AFTER GioKT;

-- Chuẩn hóa dữ liệu cũ
UPDATE LichLamViec
SET TrangThai = 'DA_DUYET'
WHERE TrangThai IS NULL OR TRIM(TrangThai) = '';

-- Ràng buộc giá trị hợp lệ
ALTER TABLE LichLamViec
  ADD CONSTRAINT ck_lichlam_trangthai
  CHECK (TrangThai IN ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI'));