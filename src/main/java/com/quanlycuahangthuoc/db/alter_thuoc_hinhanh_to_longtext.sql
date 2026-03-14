-- Convert Thuoc.HinhAnh to LONGTEXT so it can store data URI base64 images.
-- Run this once on existing databases.

ALTER TABLE Thuoc
    MODIFY COLUMN HinhAnh LONGTEXT NULL;
