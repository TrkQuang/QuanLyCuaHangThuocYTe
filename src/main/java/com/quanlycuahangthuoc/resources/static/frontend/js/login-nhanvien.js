      function togglePassword() {
        const passwordInput = document.getElementById("password");
        const toggleIcon = document.getElementById("toggleIcon");

        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          toggleIcon.classList.remove("fa-eye");
          toggleIcon.classList.add("fa-eye-slash");
        } else {
          passwordInput.type = "password";
          toggleIcon.classList.remove("fa-eye-slash");
          toggleIcon.classList.add("fa-eye");
        }
      }

      document
        .getElementById("loginForm")
        .addEventListener("submit", async function (e) {
          e.preventDefault();

          const username = document.getElementById("username").value.trim();
          const password = document.getElementById("password").value;
          const errorMessage = document.getElementById("errorMessage");
          const btnLogin = document.querySelector(".btn-login");

          // Validation
          if (!username || !password) {
            errorMessage.textContent = "Vui lòng nhập đầy đủ thông tin!";
            return;
          }

          // Disable button và hiển thị loading
          btnLogin.disabled = true;
          btnLogin.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
          errorMessage.textContent = "";

          try {
            // Gọi API đăng nhập nhân viên
            const response = await fetch("/api/taikhoan/login-nhanvien", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tenDangNhap: username,
                matKhau: password,
              }),
            });

            if (!response.ok) {
              throw new Error("Đăng nhập thất bại!");
            }

            const data = await response.json();

            if (data && data.maTK) {
              // Lưu thông tin đăng nhập
              if (document.getElementById("rememberMe").checked) {
                localStorage.setItem("taiKhoan", JSON.stringify(data));
              } else {
                sessionStorage.setItem("taiKhoan", JSON.stringify(data));
              }

              // Hiển thị thông báo thành công
              errorMessage.style.background = "#d4edda";
              errorMessage.style.color = "#155724";
              errorMessage.textContent =
                "Đăng nhập thành công! Đang chuyển hướng...";

              // Chuyển hướng sau 1 giây
              setTimeout(() => {
                window.location.href = "/dashboard.html"; // Thay đổi URL theo trang dashboard của bạn
              }, 1000);
            } else {
              errorMessage.textContent =
                "Tên đăng nhập hoặc mật khẩu không đúng!";
              btnLogin.disabled = false;
              btnLogin.innerHTML =
                '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
            }
          } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            errorMessage.textContent =
              "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.";
            btnLogin.disabled = false;
            btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
          }
        });