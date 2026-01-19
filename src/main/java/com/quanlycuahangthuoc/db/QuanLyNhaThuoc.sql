-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: tramway.proxy.rlwy.net    Database: QuanLyNhaThuoc
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CTHoaDon`
--

DROP TABLE IF EXISTS `CTHoaDon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTHoaDon` (
  `MACTHD` varchar(20) NOT NULL,
  `MaHD` varchar(20) DEFAULT NULL,
  `MaThuoc` varchar(20) DEFAULT NULL,
  `SoLuong` int DEFAULT NULL,
  `HUONGDANSD` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`MACTHD`),
  KEY `MaHD` (`MaHD`),
  KEY `MaThuoc` (`MaThuoc`),
  CONSTRAINT `CTHoaDon_ibfk_1` FOREIGN KEY (`MaHD`) REFERENCES `HoaDon` (`MaHD`),
  CONSTRAINT `CTHoaDon_ibfk_2` FOREIGN KEY (`MaThuoc`) REFERENCES `Thuoc` (`MaThuoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CTPhieuNhap`
--

DROP TABLE IF EXISTS `CTPhieuNhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTPhieuNhap` (
  `MACTPN` varchar(20) NOT NULL,
  `MaPN` varchar(20) DEFAULT NULL,
  `MaThuoc` varchar(20) DEFAULT NULL,
  `SoLuong` int DEFAULT NULL,
  `DonGia` float DEFAULT NULL,
  PRIMARY KEY (`MACTPN`),
  KEY `MaPN` (`MaPN`),
  KEY `MaThuoc` (`MaThuoc`),
  CONSTRAINT `CTPhieuNhap_ibfk_1` FOREIGN KEY (`MaPN`) REFERENCES `PhieuNhap` (`MaPN`),
  CONSTRAINT `CTPhieuNhap_ibfk_2` FOREIGN KEY (`MaThuoc`) REFERENCES `Thuoc` (`MaThuoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `HoaDon`
--

DROP TABLE IF EXISTS `HoaDon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HoaDon` (
  `MaHD` varchar(20) NOT NULL,
  `NgayTao` date DEFAULT NULL,
  `TongTien` float DEFAULT NULL,
  `TrangThai` varchar(30) DEFAULT NULL,
  `MaKH` varchar(20) DEFAULT NULL,
  `MaNV` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaHD`),
  KEY `MaKH` (`MaKH`),
  KEY `MaNV` (`MaNV`),
  CONSTRAINT `HoaDon_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `KhachHang` (`MaKH`),
  CONSTRAINT `HoaDon_ibfk_2` FOREIGN KEY (`MaNV`) REFERENCES `NhanVien` (`MaNV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `KhachHang`
--

DROP TABLE IF EXISTS `KhachHang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KhachHang` (
  `MaKH` varchar(20) NOT NULL,
  `HoTen` varchar(100) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `GioiTinh` varchar(10) DEFAULT NULL,
  `SDT` varchar(20) DEFAULT NULL,
  `DiaChi` varchar(200) DEFAULT NULL,
  `TienSuBenhLy` varchar(200) DEFAULT NULL,
  `MaTK` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaKH`),
  KEY `MaTK` (`MaTK`),
  CONSTRAINT `KhachHang_ibfk_1` FOREIGN KEY (`MaTK`) REFERENCES `TaiKhoan` (`MaTK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LichLamViec`
--

DROP TABLE IF EXISTS `LichLamViec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LichLamViec` (
  `MaLich` varchar(20) NOT NULL,
  `MaNV` varchar(20) DEFAULT NULL,
  `NgayLam` date DEFAULT NULL,
  `CaLam` varchar(20) DEFAULT NULL,
  `GhiChu` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`MaLich`),
  KEY `MaNV` (`MaNV`),
  CONSTRAINT `LichLamViec_ibfk_1` FOREIGN KEY (`MaNV`) REFERENCES `NhanVien` (`MaNV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `NhaCungCap`
--

DROP TABLE IF EXISTS `NhaCungCap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NhaCungCap` (
  `MaNCC` varchar(20) NOT NULL,
  `TenNCC` varchar(100) DEFAULT NULL,
  `SDT` varchar(20) DEFAULT NULL,
  `DiaChi` varchar(200) DEFAULT NULL,
  `TrangThai` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`MaNCC`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `NhanVien`
--

DROP TABLE IF EXISTS `NhanVien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NhanVien` (
  `MaNV` varchar(20) NOT NULL,
  `HoTen` varchar(100) DEFAULT NULL,
  `SDT` varchar(20) DEFAULT NULL,
  `DiaChi` varchar(200) DEFAULT NULL,
  `ChucVu` varchar(50) DEFAULT NULL,
  `MaTK` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaNV`),
  KEY `MaTK` (`MaTK`),
  CONSTRAINT `NhanVien_ibfk_1` FOREIGN KEY (`MaTK`) REFERENCES `TaiKhoan` (`MaTK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PhieuNhap`
--

DROP TABLE IF EXISTS `PhieuNhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PhieuNhap` (
  `MaPN` varchar(20) NOT NULL,
  `NgayNhap` date DEFAULT NULL,
  `TongTien` float DEFAULT NULL,
  `MaNV` varchar(20) DEFAULT NULL,
  `MaNCC` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaPN`),
  KEY `MaNV` (`MaNV`),
  KEY `MaNCC` (`MaNCC`),
  CONSTRAINT `PhieuNhap_ibfk_1` FOREIGN KEY (`MaNV`) REFERENCES `NhanVien` (`MaNV`),
  CONSTRAINT `PhieuNhap_ibfk_2` FOREIGN KEY (`MaNCC`) REFERENCES `NhaCungCap` (`MaNCC`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaiKhoan`
--

DROP TABLE IF EXISTS `TaiKhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TaiKhoan` (
  `MaTK` varchar(20) NOT NULL,
  `TenDangNhap` varchar(50) DEFAULT NULL,
  `MatKhau` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `LoaiTK` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`MaTK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Thuoc`
--

DROP TABLE IF EXISTS `Thuoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Thuoc` (
  `MaThuoc` varchar(20) NOT NULL,
  `TenThuoc` varchar(100) DEFAULT NULL,
  `DonViTinh` varchar(30) DEFAULT NULL,
  `GiaNhap` float DEFAULT NULL,
  `GiaBan` float DEFAULT NULL,
  `SoLuong` int DEFAULT NULL,
  `HanSuDung` date DEFAULT NULL,
  `MaNCC` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaThuoc`),
  KEY `MaNCC` (`MaNCC`),
  CONSTRAINT `Thuoc_ibfk_1` FOREIGN KEY (`MaNCC`) REFERENCES `NhaCungCap` (`MaNCC`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'QuanLyNhaThuoc'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-20  0:04:46
