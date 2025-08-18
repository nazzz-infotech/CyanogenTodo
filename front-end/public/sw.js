// sw.js — runs in Service Worker context

// --- Push Notifications ---
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "Default title", body: "Default body" };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "No body text",
      icon: "/icon.png",
    })
  );
});

// Handle clicks on the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // Opens your app when notification is clicked
  );
});

// --- PWA Lifecycle Events ---
self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});

self.addEventListener("fetch", (event) => {
  // Let network requests go through (you can add caching later if you want)
  event.respondWith(fetch(event.request));
});