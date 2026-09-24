const C="bc20-v21-4";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./"]))); self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener("fetch",e=>{ if(e.request.method!=="GET") return;
  /* v19.8：自サイト（同一オリジン）のGETだけを扱う。外部サイト・API・画像プロキシ・中継の要求は素通し
     ＝以前は外部サイトへの取得が失敗した際にアプリ本体（./）を200で返してしまい、
       「公式サイトから画像を取得」「全項目の案をAIが作成」が自分自身のHTMLを読む不具合になっていた */
  let u; try{ u=new URL(e.request.url); }catch(x){ return; }
  if(u.origin!==self.location.origin) return;
  /* v21.4：画面本体（ページの読み込み）と版情報（version.json）は、ブラウザのキャッシュを使わず毎回サーバーに確認する
     ＝タブの復元や再起動のあとに古い版の画面が動き続け、直した判定が使われないことを防ぐ（変わっていなければ 304 で軽い） */
  const ver=/\/version\.json$/.test(u.pathname), fresh=e.request.mode==="navigate"||ver;
  const net=fresh?fetch(e.request.url,{cache:"no-cache",credentials:"same-origin"}).then(r=>r.redirected?fetch(e.request):r):fetch(e.request);
  e.respondWith(net.then(r=>{ if(r&&r.ok&&!ver){ const cl=r.clone(); caches.open(C).then(c=>c.put(e.request,cl)); } return r; })
    .catch(()=>caches.match(e.request).then(m=>m||caches.match("./"))));});
