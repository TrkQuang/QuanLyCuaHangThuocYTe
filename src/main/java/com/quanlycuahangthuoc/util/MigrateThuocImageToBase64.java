package com.quanlycuahangthuoc.util;

import com.quanlycuahangthuoc.dao.ThuocDAO;
import com.quanlycuahangthuoc.db.DBConnection;
import com.quanlycuahangthuoc.dto.ThuocDTO;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.Base64;

public class MigrateThuocImageToBase64 {

  private static final Path FRONTEND_HTML_ROOT = Paths.get(
    "src/main/java/com/quanlycuahangthuoc/resources/static/frontend/html"
  );

  public static void main(String[] args) {
    boolean dryRun = false;
    for (String arg : args) {
      if ("--dry-run".equalsIgnoreCase(String.valueOf(arg).trim())) {
        dryRun = true;
        break;
      }
    }

    int converted = 0;
    int skipped = 0;
    int failed = 0;
    ArrayList<String> missingFiles = new ArrayList<>();

    try (
      Connection conn = DBConnection.getConnection();
      PreparedStatement update = conn.prepareStatement(
        "UPDATE Thuoc SET HinhAnh=? WHERE MaThuoc=?"
      )
    ) {
      ThuocDAO thuocDAO = new ThuocDAO();
      ArrayList<ThuocDTO> thuocs = thuocDAO.getAllThuoc();

      for (ThuocDTO thuoc : thuocs) {
        String imageValue = String.valueOf(
          thuoc.getHinhAnh() == null ? "" : thuoc.getHinhAnh()
        ).trim();

        if (imageValue.isEmpty() || imageValue.startsWith("data:")) {
          skipped++;
          continue;
        }

        String normalizedRelPath = imageValue
          .replace("\\", "/")
          .replaceFirst("^/+", "");
        Path imagePath = FRONTEND_HTML_ROOT.resolve(
          normalizedRelPath
        ).normalize();

        if (!Files.exists(imagePath)) {
          failed++;
          missingFiles.add(thuoc.getMaThuoc() + " -> " + normalizedRelPath);
          continue;
        }

        byte[] bytes = Files.readAllBytes(imagePath);
        String mimeType = detectMimeType(imagePath);
        String dataUri =
          "data:" +
          mimeType +
          ";base64," +
          Base64.getEncoder().encodeToString(bytes);

        if (!dryRun) {
          update.setString(1, dataUri);
          update.setString(2, thuoc.getMaThuoc());
          update.executeUpdate();
        }
        converted++;
      }

      System.out.println("=== MIGRATE THUOC IMAGE TO BASE64 ===");
      System.out.println("Mode     : " + (dryRun ? "DRY_RUN" : "APPLY"));
      System.out.println("Converted: " + converted);
      System.out.println("Skipped  : " + skipped);
      System.out.println("Failed   : " + failed);

      if (!missingFiles.isEmpty()) {
        System.out.println("\nMissing files:");
        for (String item : missingFiles) {
          System.out.println("- " + item);
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static String detectMimeType(Path imagePath) {
    try {
      String mime = Files.probeContentType(imagePath);
      if (mime != null && mime.startsWith("image/")) {
        return mime;
      }
    } catch (Exception ignored) {}

    String fileName = imagePath.getFileName().toString().toLowerCase();
    if (fileName.endsWith(".png")) return "image/png";
    if (
      fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
    ) return "image/jpeg";
    if (fileName.endsWith(".webp")) return "image/webp";
    if (fileName.endsWith(".gif")) return "image/gif";

    return "application/octet-stream";
  }
}
