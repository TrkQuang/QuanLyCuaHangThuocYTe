# Controller (Spring Boot)

Thư mục này sẽ chứa các REST Controller sử dụng Spring Boot để xử lý HTTP request/response từ frontend.

## Chức năng:

- Nhận request từ frontend (HTML/JS hoặc client khác)
- Ánh xạ các endpoint bằng annotation (`@RestController`, `@RequestMapping`, ...)
- Tự động parse parameters và body (Spring Boot hỗ trợ tự động binding)
- Gọi BUS/service để xử lý logic nghiệp vụ
- Trả về JSON response cho frontend (Spring Boot tự động chuyển đổi object sang JSON)

## Ví dụ:

```java
@RestController
@RequestMapping("/thuoc")
public class ThuocController {
    private final ThuocBUS thuocBUS;

    public ThuocController(ThuocBUS thuocBUS) {
        this.thuocBUS = thuocBUS;
    }

    @GetMapping("/all")
    public List<Thuoc> getAllThuoc() {
        return thuocBUS.getAll();
    }
}
```

> **Lưu ý:**
>
> - Không cần kế thừa `HttpServlet`.
> - Không cần tự parse JSON, Spring Boot sẽ tự động chuyển đổi.
> - Có thể sử dụng Dependency Injection để inject các lớp BUS/service.
