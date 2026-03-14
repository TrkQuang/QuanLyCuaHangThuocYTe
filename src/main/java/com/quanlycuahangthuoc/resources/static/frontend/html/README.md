# HTML (Frontend Pages)

Chứa các file giao diện HTML cho từng chức năng của hệ thống.

## Chức năng:

- Hiển thị form nhập liệu
- Hiển thị danh sách dữ liệu (bảng)
- Tạo layout và cấu trúc trang
- Liên kết với CSS và JavaScript

## Cấu Trúc Trang Web

### 🔐 **PHẦN CHUNG (Public)**

#### 1. `login.html` - Trang đăng nhập

- Form đăng nhập cho khách hàng và nhân viên
- Link đăng ký tài khoản
- Quên mật khẩu
- Phân quyền: Redirect khách hàng → trang chủ, nhân viên → dashboard

#### 2. `register.html` - Đăng ký tài khoản

- Form đăng ký cho khách hàng
- Validate email, số điện thoại, mật khẩu

---

### 🛒 **PHẦN KHÁCH HÀNG (Customer)**

#### 3. `index.html` - Trang chủ khách hàng

- Banner quảng cáo/sale
- Danh sách thuốc bán chạy
- Sản phẩm khuyến mãi
- Tìm kiếm nhanh
- Menu điều hướng (Trang chủ, Sản phẩm, Giỏ hàng, Đơn hàng, Tài khoản)

#### 4. `shop.html` - Cửa hàng/Danh sách thuốc

- Hiển thị tất cả thuốc (dạng grid/card)
- Tìm kiếm thuốc (theo tên, loại)
- Lọc theo: giá, loại thuoc, hãng
- Sắp xếp: giá tăng/giảm, bán chạy, mới nhất
- Phân trang
- Nút "Thêm vào giỏ hàng"

#### 5. `product-detail.html` - Chi tiết sản phẩm

- Hình ảnh thuốc
- Tên, giá, mô tả chi tiết
- Thông tin: hạn sử dụng, công dụng, liều lượng
- Số lượng tồn kho
- Nút "Thêm vào giỏ", "Mua ngay"
- Sản phẩm liên quan

#### 6. `cart.html` - Giỏ hàng

- Danh sách thuốc trong giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- Tính tổng tiền
- Mã giảm giá
- Nút "Thanh toán"

#### 7. `checkout.html` - Thanh toán

- Thông tin người nhận
- Địa chỉ giao hàng
- Phương thức thanh toán (COD, chuyển khoản, ví điện tử)
- Xác nhận đơn hàng

#### 8. `order-history.html` - Lịch sử đơn hàng

- Danh sách đơn hàng đã đặt
- Trạng thái: Chờ xử lý, Đang giao, Hoàn thành, Đã hủy
- Xem chi tiết đơn hàng
- Hủy đơn hàng (nếu chưa xử lý)

#### 9. `order-detail.html` - Chi tiết đơn hàng

- Mã đơn hàng
- Danh sách thuốc đã mua
- Tổng tiền
- Địa chỉ giao hàng
- Trạng thái vận chuyển
- In hóa đơn

#### 10. `profile.html` - Tài khoản cá nhân

- Thông tin khách hàng
- Cập nhật thông tin
- Đổi mật khẩu
- Địa chỉ giao hàng
- Điểm tích lũy/thành viên

---

### 👨‍⚕️ **PHẦN NHÂN VIÊN/ADMIN (Staff/Admin)**

#### 11. `admin/dashboard.html` - Dashboard/Tổng quan

- Thống kê doanh thu ngày/tháng/năm
- Số lượng đơn hàng
- Thuoc sắp hết hạn (cảnh báo)
- Thuoc sắp hết tồn kho
- Biểu đồ doanh thu
- Top thuốc bán chạy

#### 12. `admin/ban-hang.html` - Bán hàng tại quầy

- Tìm kiếm thuốc nhanh
- Thêm thuốc vào hóa đơn
- Tính tổng tiền
- Nhập thông tin khách hàng (nếu có)
- In hóa đơn
- Thanh toán tiền mặt

#### 13. `admin/quan-ly-thuoc.html` - Quản lý thuốc

- Danh sách tất cả thuốc
- Thêm thuốc mới
- Sửa thông tin thuốc
- Xóa thuốc
- Tìm kiếm, lọc
- Cảnh báo hết hạn/tồn kho thấp

#### 14. `admin/nhap-kho.html` - Nhập kho

- Form nhập thuốc mới
- Chọn nhà cung cấp
- Nhập số lượng, giá nhập
- Ngày nhập, hạn sử dụng
- In phiếu nhập kho
- Lịch sử nhập kho

#### 15. `admin/xuat-kho.html` - Xuất kho

- Xuất thuốc (hủy, trả nhà cung cấp)
- Lý do xuất kho
- Số lượng xuất
- In phiếu xuất kho
- Lịch sử xuất kho

#### 16. `admin/kiem-ke.html` - Kiểm kê kho

- Kiểm đếm tồn kho thực tế
- So sánh với tồn kho hệ thống
- Cập nhật chênh lệch
- Xuất báo cáo kiểm kê
- Lịch sử kiểm kê

#### 17. `admin/quan-ly-hoa-don.html` - Quản lý hóa đơn

- Danh sách tất cả hóa đơn
- Xem chi tiết hóa đơn
- Cập nhật trạng thái đơn
- In hóa đơn
- Hủy hóa đơn
- Tìm kiếm theo ngày, khách hàng

#### 18. `admin/quan-ly-khach-hang.html` - Quản lý khách hàng

- Danh sách khách hàng
- Thêm khách hàng mới
- Sửa thông tin
- Xem lịch sử mua hàng
- Quản lý công nợ

#### 19. `admin/bao-cao.html` - Báo cáo & thống kê

- Báo cáo doanh thu theo ngày/tháng/năm
- Báo cáo tồn kho
- Báo cáo thuốc bán chạy
- Báo cáo thuốc hết hạn
- Báo cáo công nợ
- Xuất Excel/PDF

---

## Tổng Kết Số Lượng Trang

**Phần chung:** 2 trang  
**Phần khách hàng:** 8 trang  
**Phần nhân viên/admin:** 12 trang  
**TỔNG CỘNG:** **22 trang HTML**

--
