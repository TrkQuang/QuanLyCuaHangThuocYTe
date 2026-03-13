// Shared frontend configuration and helper functions.
const API_URL = "http://localhost:8080/api";

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toUpperCase();
}

function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem("currentUser");
    return null;
  }
}

function isBannedUser(user) {
  return normalizeRole(user?.loaiTaiKhoan) === "BANNED";
}

function enforceBannedAccessGuard() {
  const user = getCurrentUser();
  if (!user || !isBannedUser(user)) {
    return;
  }

  const path = String(window.location.pathname || "").toLowerCase();
  const allowWhenBanned =
    path.endsWith("/login.html") ||
    path.endsWith("/register.html") ||
    path.endsWith("/frontend/html/login.html") ||
    path.endsWith("/frontend/html/register.html");

  if (allowWhenBanned) {
    return;
  }

  clearCurrentUser();
  alert("Tài khoản của bạn đã bị cấm. Vui lòng liên hệ quản trị viên.");
  window.location.href = "login.html";
}

enforceBannedAccessGuard();

function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem("currentUser");
    return;
  }
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.error || "Yeu cau that bai";
    throw new Error(message);
  }

  return data;
}

async function logoutSession() {
  try {
    await apiFetch("/taikhoan/session/logout", { method: "POST" });
  } catch (e) {
    // Ignore network/session errors while forcing client logout.
  } finally {
    clearCurrentUser();
  }
}

function escapeHtml(unsafe) {
  if (unsafe == null) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount || 0));
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function formatDateTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN");
}
