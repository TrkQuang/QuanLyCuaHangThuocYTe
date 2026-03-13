package com.quanlycuahangthuoc.controller;

import jakarta.servlet.http.HttpSession;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

  // Model cho cart item
  public static class CartItem {

    private String id;
    private String name;
    private String title;
    private double price;
    private String image;
    private int quantity;

    // Constructors
    public CartItem() {}

    public CartItem(
      String id,
      String name,
      String title,
      double price,
      String image,
      int quantity
    ) {
      this.id = id;
      this.name = name;
      this.title = title;
      this.price = price;
      this.image = image;
      this.quantity = quantity;
    }

    // Getters and Setters
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }

    public double getPrice() {
      return price;
    }

    public void setPrice(double price) {
      this.price = price;
    }

    public String getImage() {
      return image;
    }

    public void setImage(String image) {
      this.image = image;
    }

    public int getQuantity() {
      return quantity;
    }

    public void setQuantity(int quantity) {
      this.quantity = quantity;
    }
  }

  // Request body cho add to cart
  public static class AddToCartRequest {

    private String id;
    private String name;
    private String title;
    private double price;
    private String image;
    private int quantity;

    // Getters and Setters
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }

    public double getPrice() {
      return price;
    }

    public void setPrice(double price) {
      this.price = price;
    }

    public String getImage() {
      return image;
    }

    public void setImage(String image) {
      this.image = image;
    }

    public int getQuantity() {
      return quantity;
    }

    public void setQuantity(int quantity) {
      this.quantity = quantity;
    }
  }

  @SuppressWarnings("unchecked")
  private List<CartItem> getSessionCart(HttpSession session) {
    Object raw = session.getAttribute("CART_ITEMS");
    if (raw instanceof List<?>) {
      return (List<CartItem>) raw;
    }
    List<CartItem> cart = new ArrayList<>();
    session.setAttribute("CART_ITEMS", cart);
    return cart;
  }

  // Lấy giỏ hàng
  @GetMapping
  public ResponseEntity<List<CartItem>> getCart(HttpSession session) {
    List<CartItem> cart = getSessionCart(session);
    return ResponseEntity.ok(cart);
  }

  // Thêm vào giỏ hàng
  @PostMapping("/add")
  public ResponseEntity<?> addToCart(
    @RequestBody AddToCartRequest request,
    HttpSession session
  ) {
    // Validate input
    if (request == null) {
      return ResponseEntity.badRequest().body(
        Map.of("error", "Dữ liệu không hợp lệ")
      );
    }
    if (request.getId() == null || request.getId().trim().isEmpty()) {
      return ResponseEntity.badRequest().body(
        Map.of("error", "ID sản phẩm không hợp lệ")
      );
    }
    if (request.getPrice() <= 0) {
      return ResponseEntity.badRequest().body(
        Map.of("error", "Giá phải lớn hơn 0")
      );
    }
    if (request.getQuantity() <= 0 || request.getQuantity() > 1000) {
      return ResponseEntity.badRequest().body(
        Map.of("error", "Số lượng phải từ 1-1000")
      );
    }

    List<CartItem> cart = getSessionCart(session);

    // Tìm sản phẩm đã có trong giỏ chưa
    Optional<CartItem> existingItem = cart
      .stream()
      .filter(item -> item.getId().equals(request.getId()))
      .findFirst();

    if (existingItem.isPresent()) {
      int newQuantity =
        existingItem.get().getQuantity() + request.getQuantity();
      if (newQuantity > 1000) {
        return ResponseEntity.badRequest().body(
          Map.of("error", "Số lượng vượt quá giới hạn")
        );
      }
      existingItem.get().setQuantity(newQuantity);
    } else {
      CartItem newItem = new CartItem(
        request.getId(),
        request.getName(),
        request.getTitle(),
        request.getPrice(),
        request.getImage(),
        request.getQuantity()
      );
      cart.add(newItem);
    }

    session.setAttribute("CART_ITEMS", cart);
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Đã thêm vào giỏ hàng");
    response.put(
      "cartCount",
      cart.stream().mapToInt(CartItem::getQuantity).sum()
    );

    return ResponseEntity.ok(response);
  }

  // Cập nhật số lượng
  @PutMapping("/update")
  public ResponseEntity<?> updateQuantity(
    @RequestBody Map<String, Object> request,
    HttpSession session
  ) {
    String productId = (String) request.get("id");
    int quantity = (int) request.get("quantity");

    List<CartItem> cart = getSessionCart(session);

    Optional<CartItem> item = cart
      .stream()
      .filter(i -> i.getId().equals(productId))
      .findFirst();

    if (item.isPresent()) {
      if (quantity <= 0) {
        cart.remove(item.get());
      } else {
        item.get().setQuantity(quantity);
      }
      session.setAttribute("CART_ITEMS", cart);
      return ResponseEntity.ok(Map.of("success", true));
    }

    return ResponseEntity.badRequest().body(
      Map.of("error", "Sản phẩm không tồn tại")
    );
  }

  // Xóa sản phẩm
  @DeleteMapping("/{productId}")
  public ResponseEntity<?> removeItem(
    @PathVariable String productId,
    HttpSession session
  ) {
    List<CartItem> cart = getSessionCart(session);

    cart.removeIf(item -> item.getId().equals(productId));
    session.setAttribute("CART_ITEMS", cart);

    return ResponseEntity.ok(Map.of("success", true));
  }

  // Xóa toàn bộ giỏ hàng
  @DeleteMapping
  public ResponseEntity<?> clearCart(HttpSession session) {
    session.setAttribute("CART_ITEMS", new ArrayList<CartItem>());

    return ResponseEntity.ok(
      Map.of("success", true, "message", "Đã xóa giỏ hàng")
    );
  }

  // Đếm số lượng item trong giỏ
  @GetMapping("/count")
  public ResponseEntity<?> getCartCount(HttpSession session) {
    List<CartItem> cart = getSessionCart(session);
    int count = cart.stream().mapToInt(CartItem::getQuantity).sum();

    return ResponseEntity.ok(Map.of("count", count));
  }
}
