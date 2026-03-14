(function () {
  const script = document.currentScript;
  if (!script) return;

  const activeKey = String(script.getAttribute("data-active") || "").trim();
  const partialPath = String(
    script.getAttribute("data-partial") || "partials/shared-header.html",
  );

  const xhr = new XMLHttpRequest();
  xhr.open("GET", partialPath, false);
  xhr.send(null);

  if (!xhr.responseText || (xhr.status !== 0 && (xhr.status < 200 || xhr.status >= 300))) {
    script.remove();
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = xhr.responseText;

  if (activeKey) {
    const activeNav = wrapper.querySelector(`[data-nav="${activeKey}"]`);
    if (activeNav) {
      activeNav.classList.add("active");
    }
  }

  const fragment = document.createDocumentFragment();
  while (wrapper.firstChild) {
    fragment.appendChild(wrapper.firstChild);
  }
  script.replaceWith(fragment);
})();