self.addEventListener("install", function (e) { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^bc20-/.test(k); }).map(function (k) { return caches.delete(k); })); })
    .catch(function () {})
    .then(function () { return self.registration.unregister(); }));
});
