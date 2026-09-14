const C="bc20-v16";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./"]))); self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener("fetch",e=>{ if(e.request.method!=="GET") return;
  /* v19.8：自サイト（同一オリジン）のGETだけを扱う。外部サイト・API・画像プロキシ・中継の要求は素通し
     ＝以前は外部サイトへの取得が失敗した際にアプリ本体（./）を200で返してしまい、
       「公式サイトから画像を取得」「全項目の案をAIが作成」が自分自身のHTMLを読む不具合になっていた */
  let u; try{ u=new URL(e.request.url); }catch(x){ return; }
  if(u.origin!==self.location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ const cl=r.clone(); caches.open(C).then(c=>c.put(e.request,cl)); return r; })
    .catch(()=>caches.match(e.request).then(m=>m||caches.match("./"))));});
