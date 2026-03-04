self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Basic fetch handler to satisfy PWA requirements for "Install" button
  // In a real app, you'd add caching logic here
  event.respondWith(fetch(event.request));
});
