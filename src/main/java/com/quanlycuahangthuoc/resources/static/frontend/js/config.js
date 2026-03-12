// ============================================================
// config.js — File cấu hình dùng chung cho toàn bộ frontend
// Nhúng file này TRƯỚC tất cả các file JS khác
// ============================================================

const API_URL = "http://localhost:8080/api";

// Lấy hoặc tạo Session ID cho giỏ hàng (không cần đăng nhập)
function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId =
      "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

// XSS Protection — Escape HTML trước khi render vào innerHTML
function escapeHtml(unsafe) {
  if (unsafe == null) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Format số tiền VND
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
}

// Format ngày dd/mm/yyyy
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// Format ngày giờ
function formatDateTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN");
}