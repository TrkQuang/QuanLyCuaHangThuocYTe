package com.quanlycuahangthuoc.util;

import com.quanlycuahangthuoc.exception.AuthenticationException;
import jakarta.servlet.http.HttpSession;

public final class SessionAuthUtil {

  private SessionAuthUtil() {}

  public static void requireLoggedIn(HttpSession session) {
    if (session == null || session.getAttribute("CURRENT_USER") == null) {
      throw new AuthenticationException("Bạn chưa đăng nhập");
    }
  }

  public static void requireRole(HttpSession session, String... allowedRoles) {
    requireLoggedIn(session);
    Object roleObj = session.getAttribute("CURRENT_ROLE");
    String currentRole = roleObj == null ? "" : roleObj.toString();
    for (String role : allowedRoles) {
      if (role.equalsIgnoreCase(currentRole)) {
        return;
      }
    }
    throw new AuthenticationException(
      "Bạn không có quyền truy cập chức năng này"
    );
  }
}
