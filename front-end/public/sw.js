// sw.js — runs in Service Worker context

// --- Push Notifications ---
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { 
      title: "Default title", 
      body: "Default body", 
      url: "/", 
      id: null, 
      icon: "/icon.png" 
    };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "No body text",
      icon: data.icon || "/icon.png",
      data: {    
        url: data.url || "/",  
        id: data.id || null    
      },
      actions: [
        { action: "open", title: "Open" },      // ✅ custom button
        { action: "dismiss", title: "Dismiss" } // ✅ custom button
      ]
    })
  );
});

// --- Handle clicks on the notification (and buttons) ---
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { url, id } = event.notification.data;
  console.log("Notification clicked, ID:", id, "Action:", event.action);

  if (event.action === "dismiss") return;

  let targetUrl = url;

  // If URL doesn’t start with http(s), prepend origin (includes port in dev)
  if (url && !/^https?:\/\//i.test(url)) {
    targetUrl = self.location.origin + url;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
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
  // Simple passthrough (you can add caching here later)
  event.respondWith(fetch(event.request));
});