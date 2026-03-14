-- Cho phep trạng thái tài khoản BANNED trong rang buoc LoaiTK
-- Chay script nay tren DB hien tai neu thao tac ban không cap nhat duoc.

ALTER TABLE TaiKhoan
  DROP CHECK ck_taikhoan_loaitk;

ALTER TABLE TaiKhoan
  ADD CONSTRAINT ck_taikhoan_loaitk
  CHECK (LoaiTK IN ('ADMIN', 'NHANVIEN', 'KHACHHANG', 'BANNED'));
