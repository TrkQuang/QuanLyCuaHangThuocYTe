package com.quanlycuahangthuoc.controller;

import com.quanlycuahangthuoc.bus.ThuocBUS;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/thuoc")
@CrossOrigin
public class ThuocController {

  @Autowired
  private ThuocBUS thuocBUS;

  // Lấy tất cả thuoc
  @GetMapping
  public ArrayList<ThuocDTO> getAll(
    @RequestParam(
      name = "includeImage",
      defaultValue = "true"
    ) boolean includeImage
  ) {
    return thuocBUS.getAllThuoc(includeImage);
  }

  // Lấy thuoc theo ID
  @GetMapping("/{maThuoc}")
  public ResponseEntity<?> getById(@PathVariable String maThuoc) {
    ThuocDTO thuoc = thuocBUS.getById(maThuoc);
    if (thuoc != null) {
      return ResponseEntity.ok(thuoc);
    }
    return ResponseEntity.notFound().build();
  }

  // Thêm thuoc
  @PostMapping("/them-thuoc")
  public ResponseEntity<?> themThuoc(@RequestBody ThuocDTO th) {
    try {
      if (thuocBUS.themThuoc(th)) {
        return ResponseEntity.ok("Thêm thuoc thành công");
      }
      return ResponseEntity.badRequest().body("Thêm thuoc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping(
    value = "/them-thuoc-upload",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public ResponseEntity<?> themThuocUpload(
    @RequestParam("tenThuoc") String tenThuoc,
    @RequestParam("donViTinh") String donViTinh,
    @RequestParam("giaBan") String giaBan,
    @RequestParam("soLuongTon") String soLuongTon,
    @RequestParam(value = "hsd", required = false) String hsd,
    @RequestParam(value = "nsx", required = false) String nsx,
    @RequestParam(value = "maNhaCungCap", required = false) String maNhaCungCap,
    @RequestParam(value = "hinhAnh", required = false) MultipartFile hinhAnh
  ) {
    try {
      ThuocDTO th = new ThuocDTO();
      th.setTenThuoc(tenThuoc);
      th.setDonViTinh(donViTinh);
      th.setGiaBan(Float.parseFloat(giaBan));
      th.setSoLuongTon(Integer.parseInt(soLuongTon));
      th.setHSD(hsd == null ? "" : hsd.trim());
      th.setNSX(nsx == null ? "" : nsx.trim());
      th.setMaNhaCungCap(maNhaCungCap == null ? "" : maNhaCungCap.trim());

      if (hinhAnh != null && !hinhAnh.isEmpty()) {
        th.setHinhAnh(toDataUri(hinhAnh));
      }

      if (thuocBUS.themThuoc(th)) {
        return ResponseEntity.ok("Thêm thuoc thành công");
      }
      return ResponseEntity.badRequest().body("Thêm thuoc thất bại");
    } catch (NumberFormatException e) {
      return ResponseEntity.badRequest().body(
        "Gia ban/So luong ton khong hop le"
      );
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/paged")
  public ResponseEntity<?> getPaged(
    @RequestParam(name = "page", defaultValue = "1") int page,
    @RequestParam(name = "size", defaultValue = "8") int size,
    @RequestParam(name = "keyword", required = false) String keyword,
    @RequestParam(name = "priceFilter", required = false) String priceFilter,
    @RequestParam(name = "sortBy", defaultValue = "name-asc") String sortBy,
    @RequestParam(
      name = "includeImage",
      defaultValue = "true"
    ) boolean includeImage
  ) {
    int safePage = Math.max(1, page);
    int safeSize = Math.min(50, Math.max(1, size));

    ArrayList<ThuocDTO> items = thuocBUS.getThuocPaged(
      keyword,
      priceFilter,
      sortBy,
      safePage,
      safeSize,
      includeImage
    );
    int totalItems = thuocBUS.countThuocPaged(keyword, priceFilter);
    int totalPages = (int) Math.ceil(totalItems / (double) safeSize);

    Map<String, Object> payload = new HashMap<>();
    payload.put("items", items);
    payload.put("page", safePage);
    payload.put("size", safeSize);
    payload.put("totalItems", totalItems);
    payload.put("totalPages", Math.max(1, totalPages));

    return ResponseEntity.ok(payload);
  }

  // Cập nhật thuoc
  @PutMapping
  public ResponseEntity<?> suaThuoc(@RequestBody ThuocDTO th) {
    try {
      if (thuocBUS.suaThuoc(th)) {
        return ResponseEntity.ok("Cập nhật thuoc thành công");
      }
      return ResponseEntity.badRequest().body("Cập nhật thuoc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Xóa thuoc
  @DeleteMapping("/{maThuoc}")
  public ResponseEntity<?> xoaThuoc(@PathVariable String maThuoc) {
    try {
      if (thuocBUS.xoaThuoc(maThuoc)) {
        return ResponseEntity.ok("Xóa thuoc thành công");
      }
      return ResponseEntity.badRequest().body("Xóa thuoc thất bại");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  private String toDataUri(MultipartFile file) throws IOException {
    if (file.getSize() > 2 * 1024 * 1024) {
      throw new RuntimeException("Anh qua lon, toi da 2MB");
    }

    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new RuntimeException("Chi chap nhan file anh");
    }

    String base64 = Base64.getEncoder().encodeToString(file.getBytes());
    return "data:" + contentType + ";base64," + base64;
  }
}
