(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function setupMobileSidebar() {
    var sidebar = document.querySelector(".sidebar");
    var header = document.querySelector(".header");
    if (!sidebar || !header) return;

    if (!document.querySelector(".ui-menu-toggle")) {
      var btn = document.createElement("button");
      btn.className = "ui-menu-toggle";
      btn.setAttribute("aria-label", "Toggle menu");
      btn.innerHTML = "&#9776;";
      btn.addEventListener("click", function () {
        sidebar.classList.toggle("sidebar-open");
      });
      header.insertBefore(btn, header.firstChild);
    }

    document.addEventListener("click", function (e) {
      if (window.innerWidth > 980) return;
      if (!sidebar.classList.contains("sidebar-open")) return;
      if (sidebar.contains(e.target)) return;
      if (e.target.classList.contains("ui-menu-toggle")) return;
      sidebar.classList.remove("sidebar-open");
    });
  }

  function setupRolePill() {
    var page = document.body;
    var role = "";
    if (location.pathname.includes("idx_admin")) role = "Admin";
    if (location.pathname.includes("idx_nv")) role = "Nhân Viên";
    if (!role) return;

    var target = document.querySelector(".sidebar-header p");
    if (!target) return;
    if (document.querySelector(".ui-role-pill")) return;

    var pill = document.createElement("span");
    pill.className = "ui-role-pill";
    pill.textContent = role + " Workspace";
    target.insertAdjacentElement("afterend", pill);
  }

  function normalizeFilterText(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function parseMoneyValue(text) {
    var num = String(text || "").replace(/[^\d.-]/g, "");
    return Number(num || 0);
  }

  function parseDateValue(text) {
    var raw = String(text || "").trim();
    if (!raw) return "";

    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
      return raw.slice(0, 10);
    }

    if (/^\d{2}\/\d{2}\/\d{4}/.test(raw)) {
      var parts = raw.split(/[\s/]/).filter(Boolean);
      if (parts.length >= 3) {
        return parts[2] + "-" + parts[1] + "-" + parts[0];
      }
    }

    var parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }

    return "";
  }

  function getCellText(row, index) {
    var cells = row.querySelectorAll("td");
    if (typeof index !== "number" || !cells[index]) return "";
    return String(cells[index].textContent || "").trim();
  }

  function getBusinessFilterProfile(tableId) {
    var profiles = {
      thuocTable: [
        {
          key: "unit",
          type: "dynamic-select",
          label: "Don vi",
          placeholder: "Tat ca don vi",
          column: 2,
        },
        {
          key: "stockLevel",
          type: "stock-level",
          label: "Ton kho",
          column: 4,
        },
        { key: "priceMin", type: "number-min", label: "Giá từ", column: 3 },
        {
          key: "priceMax",
          type: "number-max",
          label: "Giá đến",
          column: 3,
        },
        {
          key: "expDateFrom",
          type: "date-from",
          label: "HSD từ",
          column: 5,
        },
        {
          key: "expDateTo",
          type: "date-to",
          label: "HSD đến",
          column: 5,
        },
      ],
      phieunhapTable: [
        {
          key: "status",
          type: "dynamic-select",
          label: "Trạng thái",
          placeholder: "Tất cả trạng thái",
          column: 5,
        },
        {
          key: "dateFrom",
          type: "date-from",
          label: "Từ ngày",
          column: 1,
        },
        { key: "dateTo", type: "date-to", label: "Đến ngày", column: 1 },
        {
          key: "amountMin",
          type: "number-min",
          label: "Tien tu",
          column: 4,
        },
        {
          key: "amountMax",
          type: "number-max",
          label: "Tien den",
          column: 4,
        },
      ],
      hoadonTable: [
        {
          key: "status",
          type: "dynamic-select",
          label: "Trang thai",
          placeholder: "Tat ca trang thai",
          column: 5,
        },
        {
          key: "dateFrom",
          type: "date-from",
          label: "Tu ngay",
          column: 1,
        },
        { key: "dateTo", type: "date-to", label: "Den ngay", column: 1 },
        {
          key: "amountMin",
          type: "number-min",
          label: "Tien tu",
          column: 4,
        },
        {
          key: "amountMax",
          type: "number-max",
          label: "Tien den",
          column: 4,
        },
      ],
      taikhoanTable: [
        {
          key: "role",
          type: "dynamic-select",
          label: "Loai tai khoan",
          placeholder: "Tat ca vai tro",
          column: 3,
        },
      ],
      lichlamTable: [
        {
          key: "status",
          type: "dynamic-select",
          label: "Trang thai",
          placeholder: "Tat ca trang thai",
          column: 5,
        },
        {
          key: "dateFrom",
          type: "date-from",
          label: "Tu ngay",
          column: 2,
        },
        { key: "dateTo", type: "date-to", label: "Den ngay", column: 2 },
      ],
      lichdangkyTable: [
        {
          key: "status",
          type: "dynamic-select",
          label: "Trang thai",
          placeholder: "Tat ca trang thai",
          column: 4,
        },
        {
          key: "dateFrom",
          type: "date-from",
          label: "Tu ngay",
          column: 1,
        },
        { key: "dateTo", type: "date-to", label: "Den ngay", column: 1 },
      ],
    };

    return profiles[tableId] || [];
  }

  function mountTableTools(table) {
    var container = table.closest(".table-container");
    var tbody = table.querySelector("tbody");
    if (!container || !tbody) return;

    if (container.querySelector(".ui-table-tools")) return;

    var tableId = table.id || "";
    var pageSection = container.closest(".page") || container.parentNode;
    var theadCells = table.querySelectorAll("thead th");
    var headerTitles = Array.prototype.slice
      .call(theadCells)
      .map(function (th) {
        return th.textContent.trim();
      });

    var tools = document.createElement("div");
    tools.className = "ui-table-tools";
    tools.innerHTML =
      '<select class="ui-filter-column"></select>' +
      '<input class="ui-table-search" type="text" placeholder="Tìm kiếm..." />' +
      '<div class="ui-business-filters"></div>' +
      '<select class="ui-page-size">' +
      '  <option value="8">8 / trang</option>' +
      '  <option value="12">12 / trang</option>' +
      '  <option value="20">20 / trang</option>' +
      "</select>" +
      '<button type="button" class="ui-btn-reset">Xóa bộ lọc</button>' +
      '<div class="ui-table-meta"></div>';

    var pagination = document.createElement("div");
    pagination.className = "ui-pagination";

    container.parentNode.insertBefore(tools, container);
    container.parentNode.insertBefore(pagination, container.nextSibling);

    var state = {
      page: 1,
      pageSize: 8,
      column: "__all__",
      query: "",
      businessFilters: {},
    };

    var columnSelect = tools.querySelector(".ui-filter-column");
    var searchInput = tools.querySelector(".ui-table-search");
    var pageSizeSelect = tools.querySelector(".ui-page-size");
    var resetBtn = tools.querySelector(".ui-btn-reset");
    var businessFiltersWrap = tools.querySelector(".ui-business-filters");
    var businessProfile = getBusinessFilterProfile(tableId);

    if (columnSelect) {
      var options = ['<option value="__all__">Tất cả cột</option>'];
      headerTitles.forEach(function (title, idx) {
        options.push(
          '<option value="' + String(idx) + '">' + title + "</option>",
        );
      });
      columnSelect.innerHTML = options.join("");
    }

    if (businessFiltersWrap && businessProfile.length) {
      businessProfile.forEach(function (rule) {
        var field = document.createElement("label");
        field.className = "ui-biz-field";

        var caption = document.createElement("span");
        caption.className = "ui-biz-label";
        caption.textContent = rule.label;
        field.appendChild(caption);

        var control = null;
        if (rule.type === "dynamic-select") {
          control = document.createElement("select");
          control.className = "ui-biz-input";
          control.setAttribute("data-biz-key", rule.key);
          control.innerHTML =
            '<option value="">' + (rule.placeholder || "Tat ca") + "</option>";
        }

        if (rule.type === "stock-level") {
          control = document.createElement("select");
          control.className = "ui-biz-input";
          control.setAttribute("data-biz-key", rule.key);
          control.innerHTML =
            '<option value="">Tat ca ton kho</option>' +
            '<option value="low">Sap het (< 10)</option>' +
            '<option value="normal">Con hang (>= 10)</option>' +
            '<option value="out">Het hang (= 0)</option>';
        }

        if (rule.type === "date-from" || rule.type === "date-to") {
          control = document.createElement("input");
          control.type = "date";
          control.className = "ui-biz-input";
          control.setAttribute("data-biz-key", rule.key);
        }

        if (rule.type === "number-min" || rule.type === "number-max") {
          control = document.createElement("input");
          control.type = "number";
          control.min = "0";
          control.className = "ui-biz-input";
          control.setAttribute("data-biz-key", rule.key);
          control.placeholder = rule.type === "number-min" ? "Tu" : "Den";
        }

        if (!control) return;

        control.addEventListener("input", function (e) {
          state.businessFilters[rule.key] = e.target.value || "";
          state.page = 1;
          render();
        });

        control.addEventListener("change", function (e) {
          state.businessFilters[rule.key] = e.target.value || "";
          state.page = 1;
          render();
        });

        field.appendChild(control);
        businessFiltersWrap.appendChild(field);
      });
    }

    var legacySearchInput = pageSection
      ? pageSection.querySelector(".search-box input")
      : null;

    function normalizeText(value) {
      return normalizeFilterText(value);
    }

    function getRowText(row, column) {
      var cells = row.querySelectorAll("td");
      if (column === "__all__") return normalizeText(row.textContent);
      var index = Number(column);
      if (Number.isNaN(index) || !cells[index]) return "";
      return normalizeText(cells[index].textContent);
    }

    function rows() {
      return Array.prototype.slice
        .call(tbody.querySelectorAll("tr"))
        .filter(function (row) {
          var cols = row.querySelectorAll("td");
          if (!cols.length) return false;
          if (cols.length === 1 && cols[0].hasAttribute("colspan")) {
            return false;
          }
          return true;
        });
    }

    function refreshDynamicOptions(allRows) {
      if (!businessProfile.length) return;

      businessProfile.forEach(function (rule) {
        if (rule.type !== "dynamic-select") return;

        var select = tools.querySelector(
          '.ui-biz-input[data-biz-key="' + rule.key + '"]',
        );
        if (!select) return;

        var current = select.value;
        var uniqueMap = {};
        allRows.forEach(function (row) {
          var key = normalizeFilterText(getCellText(row, rule.column));
          var display = getCellText(row, rule.column);
          if (!key) return;
          if (!uniqueMap[key]) {
            uniqueMap[key] = display;
          }
        });

        var keys = Object.keys(uniqueMap).sort();
        var options = [
          '<option value="">' + (rule.placeholder || "Tat ca") + "</option>",
        ];
        keys.forEach(function (key) {
          options.push(
            '<option value="' + key + '">' + uniqueMap[key] + "</option>",
          );
        });
        select.innerHTML = options.join("");

        if (current && uniqueMap[current]) {
          select.value = current;
        } else {
          select.value = "";
          state.businessFilters[rule.key] = "";
        }
      });
    }

    function passesBusinessFilters(row) {
      if (!businessProfile.length) return true;

      for (var i = 0; i < businessProfile.length; i += 1) {
        var rule = businessProfile[i];
        var inputValue = state.businessFilters[rule.key];
        if (!inputValue) continue;

        var cellText = getCellText(row, rule.column);

        if (rule.type === "dynamic-select") {
          if (
            normalizeFilterText(cellText) !== normalizeFilterText(inputValue)
          ) {
            return false;
          }
        }

        if (rule.type === "stock-level") {
          var qty = Number(parseMoneyValue(cellText));
          if (inputValue === "low" && !(qty > 0 && qty < 10)) return false;
          if (inputValue === "normal" && !(qty >= 10)) return false;
          if (inputValue === "out" && !(qty === 0)) return false;
        }

        if (rule.type === "date-from") {
          var dateValue = parseDateValue(cellText);
          if (!dateValue || dateValue < inputValue) return false;
        }

        if (rule.type === "date-to") {
          var dateValueTo = parseDateValue(cellText);
          if (!dateValueTo || dateValueTo > inputValue) return false;
        }

        if (rule.type === "number-min") {
          var minValue = Number(inputValue || 0);
          var amount = parseMoneyValue(cellText);
          if (amount < minValue) return false;
        }

        if (rule.type === "number-max") {
          var maxValue = Number(inputValue || 0);
          var amountTo = parseMoneyValue(cellText);
          if (amountTo > maxValue) return false;
        }
      }

      return true;
    }

    function render() {
      var allRows = rows();
      refreshDynamicOptions(allRows);

      var filtered = allRows.filter(function (row) {
        if (!state.query) return true;
        return getRowText(row, state.column).includes(state.query);
      });

      filtered = filtered.filter(function (row) {
        return passesBusinessFilters(row);
      });

      var totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
      if (state.page > totalPages) state.page = totalPages;

      allRows.forEach(function (row) {
        row.style.display = "none";
      });

      var start = (state.page - 1) * state.pageSize;
      filtered.slice(start, start + state.pageSize).forEach(function (row) {
        row.style.display = "";
      });

      var meta = tools.querySelector(".ui-table-meta");
      meta.textContent =
        filtered.length + " ban ghi | Trang " + state.page + "/" + totalPages;

      pagination.innerHTML = "";
      if (totalPages <= 1) return;

      var prevBtn = document.createElement("button");
      prevBtn.className = "ui-page-btn";
      prevBtn.textContent = "<";
      prevBtn.disabled = state.page === 1;
      prevBtn.addEventListener("click", function () {
        if (state.page > 1) {
          state.page -= 1;
          render();
        }
      });
      pagination.appendChild(prevBtn);

      var startPage = Math.max(1, state.page - 2);
      var endPage = Math.min(totalPages, state.page + 2);

      if (startPage > 1) {
        var firstBtn = document.createElement("button");
        firstBtn.className = "ui-page-btn";
        firstBtn.textContent = "1";
        firstBtn.addEventListener("click", function () {
          state.page = 1;
          render();
        });
        pagination.appendChild(firstBtn);

        if (startPage > 2) {
          var dotsStart = document.createElement("span");
          dotsStart.className = "ui-page-ellipsis";
          dotsStart.textContent = "...";
          pagination.appendChild(dotsStart);
        }
      }

      for (var i = startPage; i <= endPage; i += 1) {
        var b = document.createElement("button");
        b.className = "ui-page-btn" + (i === state.page ? " active" : "");
        b.textContent = String(i);
        (function (pageNum) {
          b.addEventListener("click", function () {
            state.page = pageNum;
            render();
          });
        })(i);
        pagination.appendChild(b);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          var dotsEnd = document.createElement("span");
          dotsEnd.className = "ui-page-ellipsis";
          dotsEnd.textContent = "...";
          pagination.appendChild(dotsEnd);
        }

        var lastBtn = document.createElement("button");
        lastBtn.className = "ui-page-btn";
        lastBtn.textContent = String(totalPages);
        lastBtn.addEventListener("click", function () {
          state.page = totalPages;
          render();
        });
        pagination.appendChild(lastBtn);
      }

      var nextBtn = document.createElement("button");
      nextBtn.className = "ui-page-btn";
      nextBtn.textContent = ">";
      nextBtn.disabled = state.page === totalPages;
      nextBtn.addEventListener("click", function () {
        if (state.page < totalPages) {
          state.page += 1;
          render();
        }
      });
      pagination.appendChild(nextBtn);
    }

    if (columnSelect) {
      columnSelect.addEventListener("change", function (e) {
        state.column = e.target.value;
        state.page = 1;
        render();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        state.query = e.target.value.trim().toLowerCase();
        state.page = 1;
        if (legacySearchInput && legacySearchInput !== e.target) {
          legacySearchInput.value = e.target.value;
        }
        render();
      });
    }

    if (pageSizeSelect) {
      pageSizeSelect.addEventListener("change", function (e) {
        state.pageSize = Number(e.target.value) || 8;
        state.page = 1;
        render();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.query = "";
        state.column = "__all__";
        state.page = 1;
        state.businessFilters = {};
        if (searchInput) searchInput.value = "";
        if (columnSelect) columnSelect.value = "__all__";
        if (legacySearchInput) legacySearchInput.value = "";
        if (businessFiltersWrap) {
          businessFiltersWrap
            .querySelectorAll(".ui-biz-input")
            .forEach(function (input) {
              input.value = "";
            });
        }
        render();
      });
    }

    if (legacySearchInput) {
      legacySearchInput.addEventListener("input", function (e) {
        state.query = e.target.value.trim().toLowerCase();
        state.page = 1;
        if (searchInput && searchInput !== e.target) {
          searchInput.value = e.target.value;
        }
        render();
      });
    }

    var observer = new MutationObserver(function () {
      render();
    });
    observer.observe(tbody, { childList: true, subtree: true });

    render();
  }

  function setupTableEnhancements() {
    var tables = document.querySelectorAll(".table-container table");
    tables.forEach(mountTableTools);
  }

  function bootstrap() {
    setupMobileSidebar();
    setupRolePill();
    setupTableEnhancements();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
