-- Them trang thai duyet dang ky cho LichLamViec
ALTER TABLE LichLamViec
  ADD COLUMN TrangThai VARCHAR(20) NOT NULL DEFAULT 'DA_DUYET' AFTER GioKT;

-- Chuan hoa du lieu cu
UPDATE LichLamViec
SET TrangThai = 'DA_DUYET'
WHERE TrangThai IS NULL OR TRIM(TrangThai) = '';

-- Rang buoc gia tri hop le
ALTER TABLE LichLamViec
  ADD CONSTRAINT ck_lichlam_trangthai
  CHECK (TrangThai IN ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI'));