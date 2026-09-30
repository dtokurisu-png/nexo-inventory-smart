const CACHE='nexo-recetario-v49';
const SHELL=[
  './pwa.html',
  './live.html',
  './mobile-v3.html',
  './notifications.html',
  './manifest.webmanifest',
  './data-recipes-current.json',
  './navigation-client-v1.js',
  './photo-system-v1.js',
  './taxonomy-core-v3.js',
  './reading-magnifier-v1.js',
  './recipe-workflow-v1.css',
  './recipe-workflow-v1.js',
  './unit-semantics-v1.js',
  './stripe-system-v3.css'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const networkFirst=async()=>{
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response&&response.ok){
        const cache=await caches.open(CACHE);
        cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      const hit=await caches.match(request,{ignoreSearch:true});
      if(hit)return hit;
      throw error;
    }
  };
  event.respondWith(networkFirst());
});

async function timerClients(){
  return self.clients.matchAll({type:'window',includeUncontrolled:true});
}

async function sendToTimerClients(message){
  const list=await timerClients();
  for(const client of list){
    try{client.postMessage(message)}catch(_){}
  }
  return list;
}

self.addEventListener('notificationclick',event=>{
  const notification=event.notification;
  const data=notification?.data||{};
  const timerId=String(data.timerId||'');
  notification?.close();

  if(event.action==='stop'){
    event.waitUntil(
      sendToTimerClients({
        type:'NEXO_TIMER_NOTIFICATION_STOP',
        timerId
      })
    );
    return;
  }

  event.waitUntil((async()=>{
    const list=await sendToTimerClients({
      type:'NEXO_TIMER_NOTIFICATION_OPEN',
      timerId
    });
    for(const client of list){
      if(client.url.includes('/menu-dinamico/')){
        try{
          await client.focus();
          return;
        }catch(_){}
      }
    }
    if(self.clients.openWindow){
      await self.clients.openWindow(data.url||'./pwa.html');
    }
  })());
});
