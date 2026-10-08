/*
 * Đèn Vàng — người que và Last.fm
 *
 * - Đang nghe nhạc (Last.fm báo "nowplaying"): người que ngồi trên ghế đá,
 *   đeo tai nghe, gật gù.
 * - Không nghe nhạc: người que mờ dần rồi biến mất.
 * - Ô "đang nghe" ở cột bên được cập nhật tên bài và nghệ sĩ.
 */
(function () {
  "use strict";

  var scene = document.querySelector(".scene");
  var walker = document.getElementById("walker");
  if (!scene || !walker) return;

  function setListening(on) {
    walker.setAttribute("class", "walker" + (on ? " is-sit" : ""));
  }

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
