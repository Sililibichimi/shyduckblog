/*
 * Đèn Vàng — con trỏ đom đóm (chỉ trên máy có chuột)
 *
 * - Ẩn con trỏ hệ thống, vẽ một con đom đóm bám theo chuột (không trễ).
 * - Bụng đom đóm luôn toả một quầng sáng nhỏ.
 * - Rê vào chỗ bấm được: bụng sáng rực và đom đóm vỗ cánh.
 * - Bấm chuột: quầng sáng loé lên một cái.
 * - Ô nhập chữ: trả lại con trỏ chữ I bình thường.
 * Không có JS thì main.css vẫn dùng ảnh img/cursor.svg làm con trỏ.
 */
(function () {
  "use strict";

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var HOT = 3;                          // điểm bấm (đầu đom đóm) cách góc trên trái 3px
  var CLICKABLE = 'a, button, [role="tab"], summary, label, select';
  var TEXT = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable]';

  /* cùng hình với img/cursor.svg, tách cánh ra để vỗ được */
  var fly = document.createElement("div");
  fly.className = "cursor-fly";
  fly.setAttribute("aria-hidden", "true");
  fly.innerHTML =
    '<span class="cursor-halo"></span>' +
    '<svg width="32" height="32" viewBox="0 0 32 32">' +
      '<g transform="rotate(-45 16 16)" stroke="#17150f" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M15 6 Q 14 3, 12.5 2 M17 6 Q 18 3, 19.5 2" fill="none" stroke="#e6dcc3" stroke-width="1.1"/>' +
        '<ellipse class="cursor-belly" cx="16" cy="19" rx="2.9" ry="4"/>' +
        '<g class="cursor-wing cursor-wing-l"><ellipse cx="13.2" cy="15.6" rx="5.6" ry="2.5" transform="rotate(-64 13.2 15.6)" fill="#e6dcc3" fill-opacity=".5"/></g>' +
        '<g class="cursor-wing cursor-wing-r"><ellipse cx="18.8" cy="15.6" rx="5.6" ry="2.5" transform="rotate(64 18.8 15.6)" fill="#e6dcc3" fill-opacity=".5"/></g>' +
        '<ellipse cx="16" cy="11" rx="2.3" ry="2.6" fill="#e6dcc3"/>' +
        '<circle cx="16" cy="7.3" r="1.9" fill="#e6dcc3"/>' +
      '</g>' +
    '</svg>';
  document.body.appendChild(fly);
  document.documentElement.classList.add("cursor-live");

  document.addEventListener("mousemove", function (e) {
    fly.style.transform = "translate(" + (e.clientX - HOT) + "px, " + (e.clientY - HOT) + "px)";
    var t = e.target.closest ? e.target : null;
    fly.classList.toggle("is-lit", !!(t && t.closest(CLICKABLE)));
    fly.classList.toggle("is-on", !(t && t.closest(TEXT)));
  });

  document.documentElement.addEventListener("mouseleave", function () { fly.classList.remove("is-on"); });

  document.addEventListener("mousedown", function () {
    fly.classList.remove("is-flash");
    void fly.offsetWidth;               // chạy lại hiệu ứng loé nếu bấm liên tục
    fly.classList.add("is-flash");
  });
})();
