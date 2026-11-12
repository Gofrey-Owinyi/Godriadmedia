// GodriadMedia Service Worker - Shows push even when app is CLOSED (if browser is on + user allowed notifications)
// This file must be at https://godriadmedia.vercel.app/sw.js - same folder as index.html
self.addEventListener('install', e=>{ self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('push', e=>{
  let data = {title:'GodriadMedia', body:'New activity', type:'message'};
  try { if(e.data) data = Object.assign(data, e.data.json()); } catch(err){}
  const opts = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'godriad-'+(data.type||'message'),
    renotify: true,
    requireInteraction: data.type==='call',
    vibrate: data.type==='call' ? [500,200,500,200,500] : [200,100,200],
    data: { url: data.url || 'https://godriadmedia.vercel.app/', type: data.type||'message' },
    actions: data.type==='call' ? [{action:'answer', title:'✅ Answer'}, {action:'decline', title:'❌ Decline'}] : [{action:'open', title:'Open GodriadMedia'}]
  };
  // Facebook / Gmail / TikTok style: set phone home-screen badge on push
  e.waitUntil((async()=>{ try{ if('setAppBadge' in self.navigator){ var c = (data.badgeCount || data.count || 1); await self.navigator.setAppBadge(c); } }catch(e){} await self.registration.showNotification(data.title, opts); })());
});
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  try{ if('clearAppBadge' in self.navigator) self.navigator.clearAppBadge(); }catch(e){}
  const url = (e.notification.data && e.notification.data.url) || 'https://godriadmedia.vercel.app/';
  e.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(clients=>{
    for (const c of clients) { if (c.url.includes('godriadmedia') && 'focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  }));
});
self.addEventListener('fetch', e=>{ e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))); });
