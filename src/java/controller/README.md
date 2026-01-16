# Controller (Servlet)

Chứa các Servlet xử lý HTTP request/response từ frontend.

## Chức năng:
- Nhận request từ HTML/JS
- Parse parameters
- Gọi BUS để xử lý logic
- Trả JSON response về frontend

## Ví dụ:
```java
@WebServlet("/thuoc")
public class ThuocServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res) {
        String action = req.getParameter("action");
        if ("getAll".equals(action)) {
            List<Thuoc> list = new ThuocBUS().getAll();
            res.getWriter().write(new Gson().toJson(list));
        }
    }
}
```
