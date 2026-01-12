const CACHE_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./words.json"
];

self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
  );
});
;

