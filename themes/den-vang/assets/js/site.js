/* Đèn Vàng — chế độ ngày/đêm và các tab ở trang chủ */
(function () {
  "use strict";

  /* ---------- ngày / đêm ---------- */
  var root = document.documentElement;
  var toggle = document.querySelector(".mode-toggle");

  function currentMode() { return root.getAttribute("data-mode") === "day" ? "day" : "night"; }
  function syncToggle() {
    if (!toggle) return;
    var day = currentMode() === "day";
    toggle.setAttribute("aria-pressed", day ? "true" : "false");
    toggle.setAttribute("title", day ? "Tắt đèn (chế độ đêm)" : "Bật sáng (chế độ ngày)");
  }
  if (toggle) {
    syncToggle();
    toggle.addEventListener("click", function () {
      var next = currentMode() === "day" ? "night" : "day";
      root.setAttribute("data-mode", next);
      try { localStorage.setItem("dv-mode", next); } catch (e) {}
      syncToggle();
      /* báo cho khung bình luận giscus đổi màu theo */
      var frame = document.querySelector("iframe.giscus-frame");
      if (frame) {
        frame.contentWindow.postMessage({ giscus: { setConfig: { theme: next === "day" ? "light" : "dark_dimmed" } } }, "https://giscus.app");
      }
    });
  }

  /* ---------- tab "gần đây" ---------- */
  var tablist = document.querySelector('.tabs[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    var initial = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    select(initial, false);
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        var j = null;
        if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") j = 0;
        if (e.key === "End") j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  }
})();
