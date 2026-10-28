// 离线缓存：首页走网络优先（拿到新版），其余静态文件缓存优先
var C = "rsgx-web-c27b0852";
var FILES = ["./", "apple-touch-icon.png", "cloudbase.min.js", "hark-charts.css", "hark-hero.css", "hark.css", "hark.js", "icon-192.png", "icon-512.png", "logo.png", "manifest.webmanifest"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (e.request.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith("index.html")) {
    e.respondWith(fetch(e.request).then(function (r) { var cp = r.clone(); caches.open(C).then(function (c) { c.put("./", cp); }); return r; }).catch(function () { return caches.match("./"); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
self.addEventListener("notificationclick", function (e) { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: "window" }).then(function (cs) { if (cs[0]) return cs[0].focus(); return self.clients.openWindow("./"); })); });
