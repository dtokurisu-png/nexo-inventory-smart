(() => {
  const REV="r96-wix-shell-20261003-1";
  const PATH_KEY=location.pathname.toLowerCase().replace(/[^a-z0-9]/g,"");
  if(!PATH_KEY.endsWith("risin96ames")) return;
  if(document.getElementById("r96-app")) return;

  const css=document.createElement("link");
  css.rel="stylesheet";
  css.href="https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/risin96ames/risin96ames-ui.css?v="+REV;
  document.head.appendChild(css);

  const root=document.createElement("div");
  root.id="r96-app";
  root.dataset.theme=localStorage.getItem("risin96ames-theme")||"dark";
  document.body.appendChild(root);

  const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const api=async(action,payload={})=>{
    const res=await fetch("/_functions/risin96amesPublic",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action,...payload})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false) throw new Error(data.error||"R96_REQUEST_FAILED");
    return data.data;
  };

  const shell=()=>`
    <header class="r96-header">
      <nav class="r96-nav">
        <div class="r96-nav-left">
          <div class="r96-menu-wrap">
            <button id="r96-menu" class="r96-menu" type="button" aria-label="Abrir menú"><span></span><span></span><span></span></button>
            <div id="r96-menu-panel" class="r96-menu-panel" hidden>
              <button id="r96-theme" type="button">Cambiar tema</button>
              <a href="#games">Explorar juegos</a>
              <button id="r96-dev" type="button">Mis juegos</button>
            </div>
          </div>
          <a class="r96-brand" href="#home"><span class="r96-mark">R96</span><span class="r96-name">RISIN96AMES</span></a>
        </div>
        <div class="r96-nav-right">
          <div class="r96-links"><a href="#games">Juegos</a><a href="#reviews">Reseñas</a><a href="#community">Comunidad</a><a href="#" id="r96-dev-link">Mis juegos</a></div>
          <div class="r96-stats"><span>Juegos <strong id="r96-games-count">0</strong></span><span>Reseñas <strong id="r96-reviews-count">0</strong></span></div>
        </div>
      </nav>
    </header>
    <main id="home">
      <section class="r96-band r96-hero">
        <div class="r96-inner r96-hero-grid">
          <div class="r96-hero-copy"><p class="r96-eyebrow">Beta games in development</p><h1 class="r96-h1">Prueba betas jugables y ayuda a construir mejores juegos.</h1></div>
          <div class="r96-hero-side"><p class="r96-copy">RISIN96AMES reúne builds web en desarrollo para jugar directamente desde la plataforma, registrar sesiones y devolver feedback a sus desarrolladores.</p><div class="r96-actions"><a class="r96-primary" href="#games">Explorar juegos</a></div></div>
        </div>
      </section>
      <section id="games" class="r96-band r96-games">
        <div class="r96-inner r96-title-row"><div><p class="r96-eyebrow">Playable betas</p><h2 class="r96-h2">Explorar juegos</h2></div><p class="r96-copy">Los juegos aparecen aquí cuando sus desarrolladores publican una build web activa.</p></div>
        <div class="r96-inner"><div id="r96-games-grid" class="r96-carousel"><article class="r96-card r96-empty"><div class="r96-thumb"><span>R96</span></div><div class="r96-card-body"><p class="r96-eyebrow">Catálogo nuevo</p><h3 class="r96-h3">Cargando juegos...</h3></div></article></div></div>
      </section>
      <section id="reviews" class="r96-band r96-reviews">
        <div class="r96-inner r96-title-row"><div><p class="r96-eyebrow">Feedback loop</p><h2 class="r96-h2">Reseñas y comentarios</h2></div><p class="r96-copy">El feedback quedará asociado al juego, a la versión concreta y, cuando corresponda, a la sesión que acabas de jugar.</p></div>
        <div class="r96-inner r96-two"><div class="r96-panel"><h3 class="r96-h3">Reseñas recientes</h3><p class="r96-desc">Todavía no hay reseñas publicadas.</p></div><div class="r96-panel"><p class="r96-eyebrow">Post-session</p><h3 class="r96-h3">Juega primero</h3><p class="r96-desc">Después de una sesión podrás calificar y comentar la build que realmente probaste.</p></div></div>
      </section>
      <section id="community" class="r96-band r96-community">
        <div class="r96-inner r96-title-row"><div><p class="r96-eyebrow">Community</p><h2 class="r96-h2">Comunidad</h2></div><p class="r96-copy">Devlogs, pruebas, discusión y comunidad por juego se conectarán en fases posteriores.</p></div>
        <div class="r96-inner r96-community-grid"><article class="r96-panel"><h3 class="r96-h3">Devlogs</h3><p class="r96-desc">Historial de versiones y progreso del proyecto.</p></article><article class="r96-panel"><h3 class="r96-h3">Feedback</h3><p class="r96-desc">Comentarios vinculados a la build realmente jugada.</p></article><article class="r96-panel"><h3 class="r96-h3">Desarrolladores</h3><p class="r96-desc">Publicación y administración de proyectos autorizados.</p></article></div>
      </section>
    </main>
    <footer class="r96-footer"><p>RISIN96AMES · Plataforma de betas jugables.</p><p class="r96-note">Nexo / Wix · ${REV}</p></footer>`;

  const emptyCard=()=>`<article class="r96-card r96-empty"><div class="r96-thumb"><span>R96</span></div><div class="r96-card-body"><p class="r96-eyebrow">Catálogo nuevo</p><h3 class="r96-h3">Aún no hay juegos publicados</h3><p class="r96-desc">La estructura ya está lista para recibir las nuevas builds. Los juegos antiguos no fueron migrados.</p></div></article>`;
  const card=(g)=>`<article class="r96-card"><div class="r96-thumb"${g.thumbnailUrl?` style="background-image:url('${esc(g.thumbnailUrl)}')"`:""}><span>${g.thumbnailUrl?"":esc((g.title||"R96").slice(0,3).toUpperCase())}</span></div><div class="r96-card-body"><div><span class="r96-status">${esc(g.status||"Beta")}</span></div><h3 class="r96-h3">${esc(g.title)}</h3><p class="r96-desc">${esc(g.shortDescription||"Beta web jugable en RISIN96AMES.")}</p><div class="r96-meta"><span><strong>Género:</strong> ${esc(g.genre||"No especificado")}</span></div><div class="r96-card-actions"><button class="r96-primary" data-r96-game="${esc(g.id)}">Ver juego</button></div></div></article>`;

  const showDevPending=(ev)=>{
    ev?.preventDefault?.();
    alert("El área de desarrollador de RISIN96AMES está siendo conectada a la sesión de Nexo. El catálogo público ya funciona.");
  };

  const bind=()=>{
    const menu=root.querySelector("#r96-menu"),panel=root.querySelector("#r96-menu-panel");
    menu?.addEventListener("click",()=>{panel.hidden=!panel.hidden});
    root.querySelector("#r96-theme")?.addEventListener("click",()=>{
      const next=root.dataset.theme==="dark"?"light":"dark";
      root.dataset.theme=next;localStorage.setItem("risin96ames-theme",next);
    });
    root.querySelector("#r96-dev")?.addEventListener("click",showDevPending);
    root.querySelector("#r96-dev-link")?.addEventListener("click",showDevPending);
    root.addEventListener("click",async(ev)=>{
      const b=ev.target.closest("[data-r96-game]");if(!b)return;
      try{
        const data=await api("game.get",{gameId:b.dataset.r96Game});
        const g=data.game,v=data.version||{};
        root.querySelector("main").innerHTML=`<section class="r96-band r96-games r96-detail"><div class="r96-inner"><div class="r96-back"><button id="r96-back" class="r96-secondary">← Volver a juegos</button></div><div class="r96-detail-grid"><article class="r96-panel"><p class="r96-eyebrow">${esc(g.status)}</p><h1 class="r96-h2">${esc(g.title)}</h1><p class="r96-desc">${esc(g.longDescription||g.shortDescription||"")}</p><div class="r96-actions">${v.runtimeUrl?`<a class="r96-primary" href="${esc(v.runtimeUrl)}">Jugar ahora</a>`:`<span class="r96-secondary">Build jugable pendiente</span>`}</div></article><aside class="r96-panel"><h3 class="r96-h3">Información</h3><p class="r96-desc"><strong>Género:</strong> ${esc(g.genre||"No especificado")}<br><strong>Versión:</strong> ${esc(v.version||"Pendiente")}<br><strong>Estado:</strong> ${esc(g.status)}</p></aside></div></div></section>`;
        root.querySelector("#r96-back")?.addEventListener("click",()=>location.reload());
        root.scrollTo({top:0,behavior:"smooth"});
      }catch(e){alert("No se pudo abrir este juego.");}
    });
  };

  const load=async()=>{
    root.innerHTML=shell();bind();
    try{
      const data=await api("games.list");
      const games=Array.isArray(data?.games)?data.games:[];
      root.querySelector("#r96-games-count").textContent=String(games.length);
      root.querySelector("#r96-games-grid").innerHTML=games.length?games.map(card).join(""):emptyCard();
    }catch(e){
      root.querySelector("#r96-games-grid").innerHTML=emptyCard();
    }
  };
  load();
})();