/* Đèn Vàng — thỉnh thoảng thả một con đom đóm bay lượn qua màn hình (chỉ ban đêm) */
(function () {
  "use strict";

  var CONFIG = {
    minGap: 6000,     // khoảng nghỉ ngắn nhất giữa hai con (ms)
    maxGap: 16000,    // khoảng nghỉ dài nhất (ms)
    maxAtOnce: 3,     // tối đa bao nhiêu con cùng lúc
    lifeMin: 9000,    // mỗi con sống bao lâu (ms)
    lifeMax: 16000
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var alive = 0;
  function rand(a, b) { return a + Math.random() * (b - a); }
  function isNight() { return document.documentElement.getAttribute("data-mode") !== "day"; }

  function spawn() {
    if (document.hidden || !isNight() || alive >= CONFIG.maxAtOnce) return;
    alive++;

    var el = document.createElement("span");
    el.className = "firefly";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);

    var W = window.innerWidth, H = window.innerHeight;
    var fromLeft = Math.random() < 0.5;
    var x = fromLeft ? -10 : W + 10;
    var y = rand(H * 0.15, H * 0.85);
    var heading = fromLeft ? rand(-0.5, 0.5) : Math.PI + rand(-0.5, 0.5);
    var speed = rand(0.6, 1.2);
    var life = rand(CONFIG.lifeMin, CONFIG.lifeMax);
    var blinkSpeed = rand(0.002, 0.004);
    var start = performance.now();
    var color = getComputedStyle(document.documentElement).getPropertyValue("--firefly").trim() || "#f3d878";

    function frame(now) {
      var t = now - start;
      heading += rand(-0.08, 0.08);                      // bay ngoằn ngoèo
      x += Math.cos(heading) * speed;
      y += Math.sin(heading) * speed * 0.7 + Math.sin(t / 600) * 0.25;

      var blink = 0.35 + 0.65 * Math.abs(Math.sin(t * blinkSpeed));
      var fade = Math.min(1, t / 1200, (life - t) / 1500);
      var glow = 6 + 8 * blink;
      el.style.opacity = Math.max(0, blink * fade);
      el.style.boxShadow = "0 0 " + glow + "px " + (glow / 2.5) + "px " + color;
      el.style.transform = "translate(" + x + "px, " + y + "px)";

      if (t < life && isNight()) requestAnimationFrame(frame);
      else { el.remove(); alive--; }
    }
    requestAnimationFrame(frame);
  }

  function loop() {
    spawn();
    setTimeout(loop, rand(CONFIG.minGap, CONFIG.maxGap));
  }
  setTimeout(loop, rand(2000, 5000));
})();
