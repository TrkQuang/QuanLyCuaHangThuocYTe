-- Add image URL column for Thuoc and seed existing product image paths.
-- Run this once on existing databases.

ALTER TABLE Thuoc
    ADD COLUMN IF NOT EXISTS HinhAnh VARCHAR(255) NULL AFTER TenThuoc;

UPDATE Thuoc
SET HinhAnh = 'img/paracetamol.png'
WHERE MaThuoc = 'T01';

UPDATE Thuoc
SET HinhAnh = 'img/amocxicilin.jpg'
WHERE MaThuoc = 'T02';

UPDATE Thuoc
SET HinhAnh = 'img/vitaminC.webp'
WHERE MaThuoc = 'T03';

UPDATE Thuoc
SET HinhAnh = 'img/ORESOL-oresol.jpg'
WHERE MaThuoc = 'T04';

UPDATE Thuoc
SET HinhAnh = 'img/loratadin.webp'
WHERE MaThuoc = 'T05';

-- Fallback image for any medicine not mapped yet.
UPDATE Thuoc
SET HinhAnh = 'img/UATThuoc.jpg'
WHERE HinhAnh IS NULL OR TRIM(HinhAnh) = '';
