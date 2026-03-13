package com.quanlycuahangthuoc.dao;

import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.LichLamDTO;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class LichLamDAO {

  private Boolean hasTrangThaiColumnCache = null;

  private boolean hasTrangThaiColumn(Connection conn) {
    if (hasTrangThaiColumnCache != null) {
      return hasTrangThaiColumnCache;
    }
    try {
      DatabaseMetaData meta = conn.getMetaData();
      try (
        ResultSet rs = meta.getColumns(
          conn.getCatalog(),
          null,
          "LichLamViec",
          "TrangThai"
        )
      ) {
        hasTrangThaiColumnCache = rs.next();
      }
    } catch (SQLException e) {
      hasTrangThaiColumnCache = false;
    }
    return hasTrangThaiColumnCache;
  }

  private LichLamDTO mapLichLam(ResultSet rs, boolean hasTrangThai)
    throws SQLException {
    LichLamDTO ll = new LichLamDTO();
    ll.setMaLich(rs.getString("MaLich"));
    ll.setMaNhanVien(rs.getString("MaNV"));
    ll.setNgayLam(rs.getString("NgayLam"));
    ll.setGioBatDau(rs.getString("GioBD"));
    ll.setGioKetThuc(rs.getString("GioKT"));
    ll.setTrangThai(hasTrangThai ? rs.getString("TrangThai") : "DA_DUYET");
    return ll;
  }

  public ArrayList<LichLamDTO> getAllLichLam() {
    ArrayList<LichLamDTO> ds = new ArrayList<>();
    try (Connection conn = DBConnection.getConnection()) {
      boolean hasTrangThai = hasTrangThaiColumn(conn);
      String sql = hasTrangThai
        ? "SELECT * FROM LichLamViec"
        : "SELECT MaLich, MaNV, NgayLam, GioBD, GioKT FROM LichLamViec";
      try (
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql)
      ) {
        while (rs.next()) {
          ds.add(mapLichLam(rs, hasTrangThai));
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean insertLichLam(LichLamDTO ll) {
    try (Connection conn = DBConnection.getConnection()) {
      boolean hasTrangThai = hasTrangThaiColumn(conn);
      String sql = hasTrangThai
        ? "INSERT INTO LichLamViec (MaLich, MaNV, NgayLam, GioBD, GioKT, TrangThai) VALUES (?,?,?,?,?,?)"
        : "INSERT INTO LichLamViec (MaLich, MaNV, NgayLam, GioBD, GioKT) VALUES (?,?,?,?,?)";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, ll.getMaLich());
        ps.setString(2, ll.getMaNhanVien());
        ps.setString(3, ll.getNgayLam());
        ps.setString(4, ll.getGioBatDau());
        ps.setString(5, ll.getGioKetThuc());
        if (hasTrangThai) {
          ps.setString(
            6,
            ll.getTrangThai() == null || ll.getTrangThai().isBlank()
              ? "CHO_DUYET"
              : ll.getTrangThai()
          );
        }
        return ps.executeUpdate() > 0;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateLichLam(LichLamDTO ll) {
    try (Connection conn = DBConnection.getConnection()) {
      boolean hasTrangThai = hasTrangThaiColumn(conn);
      String sql = hasTrangThai
        ? "UPDATE LichLamViec SET MaNV=?, NgayLam=?, GioBD=?, GioKT=?, TrangThai=? WHERE MaLich=?"
        : "UPDATE LichLamViec SET MaNV=?, NgayLam=?, GioBD=?, GioKT=? WHERE MaLich=?";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, ll.getMaNhanVien());
        ps.setString(2, ll.getNgayLam());
        ps.setString(3, ll.getGioBatDau());
        ps.setString(4, ll.getGioKetThuc());
        if (hasTrangThai) {
          ps.setString(
            5,
            ll.getTrangThai() == null || ll.getTrangThai().isBlank()
              ? "CHO_DUYET"
              : ll.getTrangThai()
          );
          ps.setString(6, ll.getMaLich());
        } else {
          ps.setString(5, ll.getMaLich());
        }
        return ps.executeUpdate() > 0;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean deleteLichLam(String MaLich) {
    String sql = "DELETE FROM LichLamViec WHERE MaLich=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      ps.setString(1, MaLich);

      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public LichLamDTO getById(String maLich) {
    try (Connection conn = DBConnection.getConnection()) {
      boolean hasTrangThai = hasTrangThaiColumn(conn);
      String sql = hasTrangThai
        ? "SELECT * FROM LichLamViec WHERE MaLich=?"
        : "SELECT MaLich, MaNV, NgayLam, GioBD, GioKT FROM LichLamViec WHERE MaLich=?";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, maLich);
      ResultSet rs = ps.executeQuery();

      if (rs.next()) {
        return mapLichLam(rs, hasTrangThai);
      }
      rs.close();
      ps.close();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public ArrayList<LichLamDTO> getLichLamByNhanVien(String maNhanVien) {
    ArrayList<LichLamDTO> ds = new ArrayList<>();
    try (Connection conn = DBConnection.getConnection()) {
      boolean hasTrangThai = hasTrangThaiColumn(conn);
      String sql = hasTrangThai
        ? "SELECT * FROM LichLamViec WHERE MaNV=?"
        : "SELECT MaLich, MaNV, NgayLam, GioBD, GioKT FROM LichLamViec WHERE MaNV=?";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, maNhanVien);
      ResultSet rs = ps.executeQuery();

      while (rs.next()) {
        ds.add(mapLichLam(rs, hasTrangThai));
      }
      rs.close();
      ps.close();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public ArrayList<LichLamDTO> getByTrangThai(String trangThai) {
    ArrayList<LichLamDTO> ds = new ArrayList<>();
    try (Connection conn = DBConnection.getConnection()) {
      boolean hasTrangThai = hasTrangThaiColumn(conn);
      if (!hasTrangThai) {
        return ds;
      }

      String sql =
        "SELECT * FROM LichLamViec WHERE TrangThai=? ORDER BY NgayLam, GioBD";
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, trangThai);
        try (ResultSet rs = ps.executeQuery()) {
          while (rs.next()) {
            ds.add(mapLichLam(rs, true));
          }
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return ds;
  }

  public boolean updateTrangThai(String maLich, String trangThai) {
    String sql = "UPDATE LichLamViec SET TrangThai=? WHERE MaLich=?";
    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement ps = conn.prepareStatement(sql)
    ) {
      if (!hasTrangThaiColumn(conn)) {
        return false;
      }
      ps.setString(1, trangThai);
      ps.setString(2, maLich);
      return ps.executeUpdate() > 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean existsByNhanVienAndCaLam(
    String maNhanVien,
    String ngayLam,
    String gioBatDau,
    String gioKetThuc,
    String[] trangThaiFilter
  ) {
    StringBuilder sql = new StringBuilder(
      "SELECT 1 FROM LichLamViec WHERE MaNV=? AND NgayLam=? AND GioBD=? AND GioKT=?"
    );
    if (trangThaiFilter != null && trangThaiFilter.length > 0) {
      sql.append(" AND TrangThai IN (");
      for (int i = 0; i < trangThaiFilter.length; i++) {
        if (i > 0) sql.append(",");
        sql.append("?");
      }
      sql.append(")");
    }

    try (Connection conn = DBConnection.getConnection()) {
      boolean hasTrangThai = hasTrangThaiColumn(conn);
      if (
        !hasTrangThai && trangThaiFilter != null && trangThaiFilter.length > 0
      ) {
        return false;
      }

      String effectiveSql = hasTrangThai
        ? sql.toString()
        : "SELECT 1 FROM LichLamViec WHERE MaNV=? AND NgayLam=? AND GioBD=? AND GioKT=?";

      try (PreparedStatement ps = conn.prepareStatement(effectiveSql)) {
        ps.setString(1, maNhanVien);
        ps.setString(2, ngayLam);
        ps.setString(3, gioBatDau);
        ps.setString(4, gioKetThuc);
        int idx = 5;
        if (hasTrangThai && trangThaiFilter != null) {
          for (String tt : trangThaiFilter) {
            ps.setString(idx++, tt);
          }
        }
        try (ResultSet rs = ps.executeQuery()) {
          return rs.next();
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public String generateMaLich() {
    String sql = "SELECT MaLich FROM LichLamViec ORDER BY MaLich DESC LIMIT 1";
    try (
      Connection conn = DBConnection.getConnection();
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(sql)
    ) {
      if (rs.next()) {
        String lastMa = rs.getString("MaLich");
        try {
          String numberPart = lastMa.substring(4);
          long number = Long.parseLong(numberPart) + 1;
          int len = Math.max(4, numberPart.length());
          return String.format("LICH%0" + len + "d", number);
        } catch (Exception ignored) {
          return "LICH" + System.currentTimeMillis();
        }
      }
      return "LICH0001";
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return "LICH" + System.currentTimeMillis();
  }
}
