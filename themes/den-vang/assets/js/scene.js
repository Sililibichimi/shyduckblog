/*
 * Đèn Vàng — người que và Last.fm
 *
 * - Không nghe nhạc: thỉnh thoảng người que đi ngang qua ghế đá.
 * - Đang nghe nhạc (Last.fm báo "nowplaying"): người que đi tới, ngồi xuống ghế,
 *   đeo tai nghe, gật gù. Khi nhạc tắt, người que đứng dậy đi tiếp.
 * - Ô "đang nghe" ở cột bên được cập nhật tên bài và nghệ sĩ.
 */
(function () {
  "use strict";

  var scene = document.querySelector(".scene");
  var walker = document.getElementById("walker");
  if (!scene || !walker) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* toạ độ trong khung SVG 360 × 300 */
  var START = -24, END = 384, BENCH = 187, GROUND = 260;
  var SPEED = 30;                       // đơn vị SVG mỗi giây

  var listening = false;
  var state = "off";                    // off | walk | sit | stand
  var x = START, satThisTrip = false, wait = rand(1.5, 4), last = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pose(p) { walker.setAttribute("class", "walker is-" + p); }
  function place() { walker.setAttribute("transform", "translate(" + x.toFixed(1) + " " + GROUND + ")"); }

  function tick(t) {
    var dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
    last = t;

    if (state === "off") {
      wait -= dt;
      if (wait <= 0) { state = "walk"; x = START; satThisTrip = false; pose("walk"); place(); }
    } else if (state === "walk") {
      x += SPEED * dt;
      if (listening && !satThisTrip && x >= BENCH && x < BENCH + 30) {
        x = BENCH; state = "sit"; satThisTrip = true; pose("sit");
      }
      if (x >= END) {
        state = "off"; pose("off");
        wait = listening ? rand(2, 5) : rand(18, 40);   // không nghe nhạc thì lâu lâu mới đi qua
      }
      place();
    } else if (state === "sit") {
      if (!listening) { state = "stand"; wait = 0.9; } // ngồi thêm chút rồi đứng dậy
    } else if (state === "stand") {
      wait -= dt;
      if (wait <= 0) { state = "walk"; pose("walk"); }
    }
    requestAnimationFrame(tick);
  }

  function setListening(on) {
    if (on === listening) return;
    listening = on;
    if (reduceMotion) { staticPose(); return; }
    if (on && state === "off") wait = Math.min(wait, rand(1, 3));
  }

  function staticPose() {
    if (listening) { x = BENCH; pose("sit"); place(); }
    else pose("off");
  }

  if (reduceMotion) staticPose();
  else requestAnimationFrame(tick);

  /* ---------- Last.fm ---------- */
  var user = scene.getAttribute("data-lastfm-user");
  var key = scene.getAttribute("data-lastfm-key");
  if (!user || !key) return;

  var card = document.querySelector("[data-nowplaying]");
  var elLabel = card && card.querySelector("[data-np-label]");
  var elTitle = card && card.querySelector("[data-np-title]");
  var elArtist = card && card.querySelector("[data-np-artist]");

  function updateCard(now, track) {
    if (!card) return;
    card.classList.toggle("is-live", now);
    elLabel.textContent = now ? "đang nghe" : "vừa nghe";
    if (!track) { elTitle.textContent = "lúc này đang im lặng."; elArtist.textContent = ""; return; }
    elTitle.textContent = "";
    var a = document.createElement("a");
    a.href = track.url || "#";
    a.rel = "noopener";
    a.textContent = track.name;
    elTitle.appendChild(a);
    elArtist.textContent = track.artist;
  }

  var url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&format=json" +
            "&user=" + encodeURIComponent(user) + "&api_key=" + encodeURIComponent(key);

  function poll() {
    if (document.hidden) return;
    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var tr = data && data.recenttracks && data.recenttracks.track;
        if (Array.isArray(tr)) tr = tr[0];
        if (!tr) { setListening(false); updateCard(false, null); return; }
        var now = !!(tr["@attr"] && tr["@attr"].nowplaying === "true");
        var artist = tr.artist ? (tr.artist["#text"] || tr.artist.name || "") : "";
        setListening(now);
        updateCard(now, { name: tr.name, artist: artist, url: tr.url });
      })
      .catch(function () {
        /* Last.fm lỗi: giữ nguyên trạng thái, nếu chưa có gì thì coi như im lặng */
        if (elTitle && elTitle.textContent === "đang dò sóng…") updateCard(false, null);
      });
  }

  var every = Math.max(20, parseInt(scene.getAttribute("data-lastfm-poll"), 10) || 60) * 1000;
  poll();
  setInterval(poll, every);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) poll(); });
})();
