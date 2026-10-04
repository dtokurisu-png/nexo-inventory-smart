(() => {
  const REV="r96-mi-espacio-broker-20261003-27";
  const SESSION_KEY="r96-developer-session-v3";
  localStorage.removeItem("r96-developer-session");
  localStorage.removeItem("r96-developer-session-v2");
  const norm=(v)=>String(v||"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const isTarget=()=>{
    const og=document.querySelector('meta[property="og:title"]')?.getAttribute("content")||"";
    const tw=document.querySelector('meta[name="twitter:title"]')?.getAttribute("content")||"";
    return [location.pathname,document.title,og,tw].some(v=>norm(v).includes("risin96ames"));
  };
  if(!isTarget()) return;
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
  const params=()=>new URLSearchParams(location.search);
  const functionBase=()=>{
    const host=location.hostname.toLowerCase();
    const freeHost=host.endsWith(".wixsite.com")||host.endsWith(".wixstudio.com");
    if(!freeHost)return location.origin+"/_functions";
    const first=location.pathname.split("/").filter(Boolean)[0]||"";
    return first?location.origin+"/"+first+"/_functions":location.origin+"/_functions";
  };
  const functionUrl=(name)=>functionBase()+"/"+name;
  const sessionToken=()=>localStorage.getItem(SESSION_KEY)||"";
  const publicApi=async(action,payload={})=>{
    const res=await fetch(functionUrl("risin96amesPublic"),{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action,...payload})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false) throw new Error(data.error||"R96_REQUEST_FAILED");
    return data.data;
  };
  const uiApi=async(action,payload={})=>{
    const token=sessionToken();
    const res=await fetch(functionUrl("risin96amesUi"),{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action,sessionToken:token,...payload})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false){
      const err=new Error(data.error||"R96_REQUEST_FAILED");
      if(["AUTH_REQUIRED","SESSION_EXPIRED"].includes(err.message)) localStorage.removeItem(SESSION_KEY);
      throw err;
    }
    return data.data??data;
  };
  const cleanAuthQuery=()=>{
    const u=new URL(location.href);
    ["r96b","r96s","r96e","r96dev","r96code","r96invite","r96AccountAction","r96ReturnPath","nxav"].forEach(k=>u.searchParams.delete(k));
    history.replaceState({},document.title,u.pathname+(u.search||"")+u.hash);
  };
  const wixAccessUrl=(code="")=>{
    const u=new URL("/blank-8",location.origin);
    u.searchParams.set("r96Bridge","1");
    u.searchParams.set("nxoAccountAction","switch");
    if(code){
      u.searchParams.set("r96invite","1");
      u.searchParams.set("r96code",code);
    }
    return u.toString();
  };
  const exchangeBoot=async(bootToken)=>{
    const res=await fetch(functionUrl("risin96amesUi"),{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action:"exchange",bootToken})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false) throw new Error(data.error||"R96_BOOT_FAILED");
    return data;
  };

  const shell=()=>`
    <header class="r96-header">
      <nav class="r96-nav">
        <div class="r96-nav-left">
          <div class="r96-menu-wrap">
            <button id="r96-menu" class="r96-menu" type="button" aria-label="Abrir menú"><span></span><span></span><span></span></button>
            <div id="r96-menu-panel" class="r96-menu-panel" hidden>
              <div id="r96-menu-profile" class="r96-menu-profile" hidden><strong id="r96-menu-name"></strong><small id="r96-menu-role"></small></div>
              <a href="#games">Explorar juegos</a>
              <button id="r96-dev" type="button" hidden>Panel de desarrollador</button>
              <button id="r96-menu-invite" type="button" hidden>Invitar desarrollador</button>
            </div>
          </div>
          <a class="r96-brand" href="#home"><span class="r96-mark">R96</span><span class="r96-name">RISIN96AMES</span></a>
        </div>
        <div class="r96-nav-right">
          <div class="r96-links"><a href="#games">Juegos</a><a href="#reviews">Reseñas</a><a href="#community">Comunidad</a><button class="r96-nav-link" id="r96-dev-link" type="button" hidden>Panel de desarrollador</button></div>
          <div class="r96-stats"><span>Juegos <strong id="r96-games-count">0</strong></span><span>Reseñas <strong id="r96-reviews-count">0</strong></span></div>
          <button class="r96-icon-button" id="r96-theme-toggle" type="button" aria-label="Cambiar tema"></button>
          <a class="r96-secondary r96-login-button" id="r96-login" href="${esc(wixAccessUrl())}">Iniciar con Google</a>
          <button class="r96-profile-chip" id="r96-profile-chip" type="button" hidden></button>
        </div>
      </nav>
    </header>
    <main id="home">
      <section class="r96-band r96-hero">
        <div class="r96-inner r96-hero-grid">
          <div class="r96-hero-copy"><p class="r96-eyebrow">Beta games in development</p><h1 class="r96-h1">Prueba betas jugables y ayuda a construir mejores juegos.</h1></div>
          <div class="r96-hero-side"><p class="r96-copy">RISIN96AMES reúne builds web en desarrollo para jugar directamente desde la plataforma, registrar sesiones y devolver feedback a sus desarrolladores.</p><div class="r96-actions"><a class="r96-primary" href="#games">Explorar juegos</a><a class="r96-secondary" id="r96-hero-login" href="${esc(wixAccessUrl())}">Iniciar con Google</a><button class="r96-secondary" id="r96-hero-dev" hidden>Panel de desarrollador</button></div></div>
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

  const showNotice=(msg,type="")=>{
    const box=root.querySelector("#r96-dev-message");
    if(!box)return;
    box.textContent=msg||"";
    box.dataset.type=type;
  };

  const renderDeveloperLogin=({invite=false,error=""}={})=>{
    const main=root.querySelector("main");
    const code=params().get("r96code")||"";
    main.innerHTML=`<section class="r96-band r96-games r96-dev-page"><div class="r96-inner r96-dev-narrow">
      <button class="r96-secondary" id="r96-dev-back">← Volver</button>
      <div class="r96-panel r96-dev-auth">
        <p class="r96-eyebrow">${invite?"Invitación de desarrollador":"Acceso R96"}</p>
        <h1 class="r96-h2">${invite?"Aceptar invitación":"Iniciar sesión"}</h1>
        <p class="r96-desc">${invite?"Inicia sesión con Google usando el mismo correo al que llegó la invitación. El código ya viene incluido en el enlace.":"Inicia sesión con Google. El Panel de desarrollador solo se habilita para cuentas R96 autorizadas."}</p>
        <div class="r96-actions"><a class="r96-primary" id="r96-login-google" href="${esc(wixAccessUrl(invite?code:""))}">Iniciar con Google</a></div>
        <p id="r96-dev-message" class="r96-form-message" data-type="${error?"error":""}">${esc(error)}</p>
      </div>
    </div></section>`;

    main.querySelector("#r96-dev-back")?.addEventListener("click",async()=>{
      cleanAuthQuery();
      await renderPublicSurface({skipInvite:true});
    });
    root.scrollTo({top:0,behavior:"smooth"});
  };

  const workspaceShell=(data)=>`
    <section class="r96-band r96-games r96-dev-page">
      <div class="r96-inner">
        <div class="r96-dev-identity">
          <div class="r96-dev-avatar">R96</div>
          <div class="r96-dev-who">
            <p class="r96-eyebrow">Developer environment</p>
            <h1 class="r96-h2">${esc(data.developer.displayName||"Desarrollador")}</h1>
            <p class="r96-desc">Acceso: <strong>${esc(data.developer.roleKey||"developer")}</strong></p>
          </div>
          <div class="r96-dev-top-actions">
            <button class="r96-secondary" id="r96-public-home">Ver plataforma pública</button>
          </div>
        </div>

        <div class="r96-dev-tabs">
          <button class="r96-dev-tab on" data-tab="games">Mis juegos</button>
          <button class="r96-dev-tab" data-tab="new">+ Agregar juego</button>
          <button class="r96-dev-tab" data-tab="reviews">Reseñas</button>
          ${data.developer.canInviteDevelopers?'<button class="r96-dev-tab" data-tab="invites">Invitar desarrollador</button>':""}
        </div>

        <div id="r96-dev-content"></div>
      </div>
    </section>`;

  const gamesPanel=(data)=>{
    const games=data.games||[];
    return `<div class="r96-dev-grid">
      <section class="r96-panel r96-dev-main">
        <div class="r96-dev-panel-head"><div><p class="r96-eyebrow">Game library</p><h3 class="r96-h3">Tus juegos</h3></div><button class="r96-primary" data-open-tab="new">+ Agregar juego</button></div>
        <div class="r96-game-tray">${games.length?games.map(g=>`<article class="r96-dev-game-card">
          <div class="r96-dev-game-cover">${g.thumbnailUrl?`<img src="${esc(g.thumbnailUrl)}" alt="">`:`<span>${esc((g.title||"R96").slice(0,3).toUpperCase())}</span>`}</div>
          <div class="r96-dev-game-info"><span class="r96-status">${esc(g.status)}</span><h3 class="r96-h3">${esc(g.title)}</h3><p class="r96-desc">${esc(g.shortDescription||"Sin descripción todavía.")}</p><div class="r96-dev-row-actions"><button class="r96-secondary" data-version-game="${esc(g.id)}">Nueva versión</button><button class="r96-primary" data-build-game="${esc(g.id)}">Administrar juego</button></div></div>
        </article>`).join(""):`<button class="r96-add-game-card" data-open-tab="new"><strong>＋</strong><span>Agregar tu primer juego</span><small>Crea la ficha, portada, galería y build.</small></button>`}</div>
      </section>
      <aside class="r96-panel r96-dev-side">
        <p class="r96-eyebrow">Feedback</p><h3 class="r96-h3">Reseñas</h3>
        <p class="r96-desc">Consulta comentarios y puntuaciones vinculados a cada juego y versión.</p>
        <button class="r96-secondary" data-open-tab="reviews">Ver reseñas</button>
        ${data.developer.canInviteDevelopers?'<div class="r96-dev-owner-box"><p class="r96-eyebrow">Owner</p><button class="r96-secondary" data-open-tab="invites">Invitar desarrollador</button></div>':""}
      </aside>
    </div>`;
  };

  const newGamePanel=()=>`<section class="r96-panel r96-dev-form-shell">
    <p class="r96-eyebrow">New game</p><h3 class="r96-h3">Agregar juego</h3>
    <p class="r96-desc">Esta ficha será la base de la presentación pública del juego, con una estructura similar a una tienda de juegos: portada, descripción, galería y build jugable.</p>
    <div class="r96-form-grid">
      <label class="r96-field"><span>Nombre</span><input id="r96-game-title" placeholder="Nombre del juego"></label>
      <label class="r96-field"><span>Género</span><input id="r96-game-genre" placeholder="Estrategia, RPG, cartas..."></label>
      <label class="r96-field r96-wide"><span>Descripción corta</span><textarea id="r96-game-short" placeholder="Resumen para la tarjeta del catálogo"></textarea></label>
      <label class="r96-field r96-wide"><span>Descripción completa</span><textarea id="r96-game-long" placeholder="Descripción completa del juego, mecánicas y propuesta"></textarea></label>
      <label class="r96-field"><span>Estado</span><select id="r96-game-status"><option>DRAFT</option><option>PROTOTYPE</option><option>ALPHA</option><option>BETA</option><option>RELEASE</option></select></label>
      <label class="r96-field"><span>Visibilidad</span><select id="r96-game-visibility"><option>PRIVATE</option><option>UNLISTED</option><option>PUBLIC</option></select></label>
    </div>
    <div class="r96-media-grid">
      <label class="r96-media-slot"><span>Portada / cápsula</span><input type="file" id="r96-cover-file" accept="image/*"><small>Imagen principal del juego.</small></label>
      <label class="r96-media-slot"><span>Capturas y videos</span><input type="file" id="r96-gallery-files" accept="image/*,video/*" multiple><small>Galería para la página pública.</small></label>
      <label class="r96-media-slot r96-media-build"><span>Build jugable</span><input type="file" id="r96-build-file" accept=".zip,application/zip"><small>Paquete web del juego. La subida binaria se conecta en el siguiente bloque técnico.</small></label>
    </div>
    <div class="r96-actions"><button class="r96-primary" id="r96-create-game">Crear ficha del juego</button></div>
    <p id="r96-dev-message" class="r96-form-message"></p>
  </section>`;

  const invitePanel=(data)=>`<div class="r96-dev-grid">
    <section class="r96-panel r96-dev-main">
      <p class="r96-eyebrow">One-time access</p><h3 class="r96-h3">Invitar desarrollador</h3>
      <p class="r96-desc">La invitación queda vinculada al correo indicado. El enlace incluye el código de un solo uso y solo se activa después de iniciar sesión con Google usando ese mismo correo.</p>
      <label class="r96-field"><span>Correo del desarrollador</span><input id="r96-invite-email" type="email" placeholder="persona@correo.com"></label>
      <div class="r96-actions"><button class="r96-primary" id="r96-create-invite">Generar invitación</button></div>
      <p id="r96-dev-message" class="r96-form-message"></p>
      <div id="r96-invite-result"></div>
    </section>
    <aside class="r96-panel r96-dev-side"><p class="r96-eyebrow">Recent invites</p><h3 class="r96-h3">Invitaciones</h3><div class="r96-tool-list">${(data.invites||[]).length?(data.invites||[]).map(i=>`<span>${esc(i.inviteeEmail)} · ${esc(i.status)} · ${esc(i.codeHint||"")}</span>`).join(""):"<span>No hay invitaciones creadas todavía.</span>"}</div></aside>
  </div>`;

  const reviewsPanel=()=>`<section class="r96-panel r96-dev-form-shell"><div class="r96-dev-panel-head"><div><p class="r96-eyebrow">Feedback</p><h3 class="r96-h3">Reseñas</h3></div><button class="r96-secondary" id="r96-refresh-reviews">Actualizar</button></div><div id="r96-review-list"><p class="r96-desc">Cargando reseñas...</p></div><p id="r96-dev-message" class="r96-form-message"></p></section>`;

  const versionPanel=(game)=>`<section class="r96-panel r96-dev-form-shell">
    <button class="r96-secondary" id="r96-version-back">← Mis juegos</button>
    <p class="r96-eyebrow">Version</p><h3 class="r96-h3">Nueva versión · ${esc(game.title)}</h3>
    <div class="r96-form-grid"><label class="r96-field"><span>Versión</span><input id="r96-version-name" placeholder="0.1.0"></label><label class="r96-field r96-wide"><span>Changelog</span><textarea id="r96-version-changelog" placeholder="Cambios de esta build"></textarea></label></div>
    <div class="r96-actions"><button class="r96-primary" id="r96-create-version">Crear versión</button></div><p id="r96-dev-message" class="r96-form-message"></p>
  </section>`;

  async function renderReviews(){
    const list=root.querySelector("#r96-review-list");
    if(!list)return;
    try{
      const data=await uiApi("developer.reviews.list");
      const reviews=data.reviews||[];
      list.innerHTML=reviews.length?reviews.map(r=>`<article class="r96-review-row"><div><strong>${esc(r.gameTitle)}</strong> · ${"★".repeat(Math.max(0,Math.min(5,Number(r.rating||0))))}</div><p>${esc(r.comment||"Sin comentario")}</p><small>${esc(r.userNameSnapshot||"Jugador")}</small></article>`).join(""):`<div class="r96-dev-empty"><h3 class="r96-h3">Todavía no hay reseñas</h3><p class="r96-desc">Cuando haya sesiones y feedback, aparecerán aquí.</p></div>`;
    }catch(e){showNotice("No se pudieron cargar las reseñas: "+e.message,"error");}
  }

  function bindWorkspace(data,initialTab="games"){
    const content=root.querySelector("#r96-dev-content");
    const setTab=(tab)=>{
      root.querySelectorAll(".r96-dev-tab").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab));
      if(tab==="games")content.innerHTML=gamesPanel(data);
      if(tab==="new")content.innerHTML=newGamePanel();
      if(tab==="reviews"){content.innerHTML=reviewsPanel();renderReviews();}
      if(tab==="invites")content.innerHTML=invitePanel(data);
      bindPanel(tab);
    };
    const bindPanel=(tab)=>{
      content.querySelectorAll("[data-open-tab]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.openTab)));
      content.querySelectorAll("[data-version-game]").forEach(b=>b.addEventListener("click",()=>{
        const game=(data.games||[]).find(g=>g.id===b.dataset.versionGame);if(!game)return;
        content.innerHTML=versionPanel(game);
        content.querySelector("#r96-version-back")?.addEventListener("click",()=>setTab("games"));
        content.querySelector("#r96-create-version")?.addEventListener("click",async()=>{
          const version=content.querySelector("#r96-version-name")?.value||"";
          const changelog=content.querySelector("#r96-version-changelog")?.value||"";
          if(!version.trim()){showNotice("Escribe un número de versión.","error");return;}
          showNotice("Creando versión...");
          try{await uiApi("version.create",{gameId:game.id,input:{version,changelog}});showNotice("Versión creada. Ya está lista para recibir una build.","ok");}
          catch(e){showNotice("No se pudo crear la versión: "+e.message,"error");}
        });
      }));
      content.querySelectorAll("[data-build-game]").forEach(b=>b.addEventListener("click",()=>{
        const game=(data.games||[]).find(g=>g.id===b.dataset.buildGame);
        content.innerHTML=`<section class="r96-panel r96-dev-form-shell"><button class="r96-secondary" id="r96-build-back">← Mis juegos</button><p class="r96-eyebrow">Build uploader</p><h3 class="r96-h3">Cargar build · ${esc(game?.title||"Juego")}</h3><p class="r96-desc">El espacio de carga ya está reservado para este proyecto. El siguiente bloque conecta el paquete HTML/JS/CSS/assets con Wix Media Manager y el Player versionado.</p><div class="r96-upload-zone"><strong>Build web</strong><span>ZIP / carpeta de distribución</span><button class="r96-primary" disabled>Seleccionar build · próximo bloque</button></div></section>`;
        content.querySelector("#r96-build-back")?.addEventListener("click",()=>setTab("games"));
      }));
      content.querySelector("#r96-create-game")?.addEventListener("click",async()=>{
        const input={
          title:content.querySelector("#r96-game-title")?.value||"",
          genre:content.querySelector("#r96-game-genre")?.value||"",
          shortDescription:content.querySelector("#r96-game-short")?.value||"",
          longDescription:content.querySelector("#r96-game-long")?.value||"",
          status:content.querySelector("#r96-game-status")?.value||"DRAFT",
          visibility:content.querySelector("#r96-game-visibility")?.value||"PRIVATE"
        };
        if(!input.title.trim()){showNotice("El nombre del juego es obligatorio.","error");return;}
        showNotice("Creando proyecto...");
        try{await uiApi("game.create",{input});showNotice("Juego creado.","ok");setTimeout(()=>openDeveloperWorkspace(),450);}
        catch(e){showNotice("No se pudo crear el juego: "+e.message,"error");}
      });
      content.querySelector("#r96-create-invite")?.addEventListener("click",async()=>{
        const email=content.querySelector("#r96-invite-email")?.value||"";
        if(!email.trim()){showNotice("Escribe el correo del desarrollador.","error");return;}
        showNotice("Generando invitación...");
        try{
          const result=await uiApi("developer.invite.create",{input:{email}});
          const code=result.code;
          const link=wixAccessUrl(code);
          const message=`Únete a RISIN96AMES como desarrollador.\n\nAbre este enlace: ${link}\n\nInicia sesión con Google usando ${result.invite.inviteeEmail}. El código de un solo uso ya viene incluido en el enlace.`;
          const out=content.querySelector("#r96-invite-result");
          out.innerHTML=`<div class="r96-invite-card"><strong>Invitación creada</strong><div><span>Enlace</span><code>${esc(link)}</code></div><div><span>Código de un solo uso</span><code class="r96-code">${esc(code)}</code></div><button class="r96-secondary" id="r96-copy-invite">Copiar mensaje</button></div>`;
          out.querySelector("#r96-copy-invite")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(message);showNotice("Mensaje copiado.","ok");}catch(_){showNotice("No se pudo copiar automáticamente.","error");}});
          showNotice("Invitación lista. El código solo puede usarse una vez.","ok");
        }catch(e){showNotice("No se pudo crear la invitación: "+e.message,"error");}
      });
      content.querySelector("#r96-refresh-reviews")?.addEventListener("click",renderReviews);
    };

    root.querySelectorAll(".r96-dev-tab").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.tab)));
    root.querySelector("#r96-public-home")?.addEventListener("click",async()=>{cleanAuthQuery();await renderPublicSurface({skipInvite:true});});
    setTab(initialTab);
  }

  async function openDeveloperWorkspace(initialTab="games"){
    if(!sessionToken()){
      renderDeveloperLogin({invite:params().get("r96invite")==="1"});
      return;
    }
    try{
      const data=await uiApi("developer.bootstrap");
      const main=root.querySelector("main");
      main.innerHTML=workspaceShell(data);
      bindWorkspace(data,initialTab);
      cleanAuthQuery();
      root.scrollTo({top:0,behavior:"smooth"});
    }catch(e){
      if(["AUTH_REQUIRED","SESSION_EXPIRED","R96_DEVELOPER_REQUIRED"].includes(e.message)){
        localStorage.removeItem(SESSION_KEY);
        renderDeveloperLogin({invite:params().get("r96invite")==="1"});
        return;
      }
      alert("No se pudo abrir el entorno de desarrollador: "+e.message);
    }
  }

  const setThemeButton=()=>{
    const button=root.querySelector("#r96-theme-toggle");
    if(button)button.textContent=root.dataset.theme==="dark"?"☀️":"🌙";
  };

  const applyGuestUi=()=>{
    ["#r96-dev","#r96-dev-link","#r96-hero-dev","#r96-menu-invite","#r96-profile-chip","#r96-menu-profile"].forEach((selector)=>{
      const el=root.querySelector(selector);
      if(el)el.hidden=true;
    });
    const login=root.querySelector("#r96-login");if(login)login.hidden=false;
    const heroLogin=root.querySelector("#r96-hero-login");if(heroLogin)heroLogin.hidden=false;
  };

  const applyDeveloperUi=(data)=>{
    ["#r96-dev","#r96-dev-link","#r96-hero-dev","#r96-menu-invite","#r96-profile-chip","#r96-menu-profile"].forEach((selector)=>{
      const el=root.querySelector(selector);
      if(el)el.hidden=false;
    });
    const login=root.querySelector("#r96-login");if(login)login.hidden=true;
    const heroLogin=root.querySelector("#r96-hero-login");if(heroLogin)heroLogin.hidden=true;
    const name=data?.developer?.displayName||"Desarrollador";
    const role=data?.developer?.roleKey||"developer";
    const chip=root.querySelector("#r96-profile-chip");if(chip)chip.textContent=name;
    const menuName=root.querySelector("#r96-menu-name");if(menuName)menuName.textContent=name;
    const menuRole=root.querySelector("#r96-menu-role");if(menuRole)menuRole.textContent=role;
  };

  const refreshAuthorization=async()=>{
    if(!sessionToken()){applyGuestUi();return null;}
    try{
      const data=await uiApi("developer.bootstrap");
      applyDeveloperUi(data);
      return data;
    }catch(e){
      if(["AUTH_REQUIRED","SESSION_EXPIRED","R96_DEVELOPER_REQUIRED"].includes(e.message)){
        localStorage.removeItem(SESSION_KEY);
        applyGuestUi();
        return null;
      }
      throw e;
    }
  };

  const bindPublic=()=>{
    const menu=root.querySelector("#r96-menu"),panel=root.querySelector("#r96-menu-panel");
    menu?.addEventListener("click",()=>{panel.hidden=!panel.hidden});
    root.querySelector("#r96-theme-toggle")?.addEventListener("click",()=>{
      const next=root.dataset.theme==="dark"?"light":"dark";
      root.dataset.theme=next;
      localStorage.setItem("risin96ames-theme",next);
      setThemeButton();
    });
    ["#r96-dev","#r96-dev-link","#r96-hero-dev","#r96-profile-chip"].forEach(sel=>root.querySelector(sel)?.addEventListener("click",(ev)=>{ev.preventDefault();openDeveloperWorkspace()}));
    root.querySelector("#r96-menu-invite")?.addEventListener("click",()=>openDeveloperWorkspace("invites"));
    root.addEventListener("click",async(ev)=>{
      const b=ev.target.closest("[data-r96-game]");if(!b)return;
      try{
        const data=await publicApi("game.get",{gameId:b.dataset.r96Game});
        const g=data.game,v=data.version||{};
        root.querySelector("main").innerHTML=`<section class="r96-band r96-games r96-detail"><div class="r96-inner"><div class="r96-back"><button id="r96-back" class="r96-secondary">← Volver a juegos</button></div><div class="r96-detail-grid"><article class="r96-panel"><p class="r96-eyebrow">${esc(g.status)}</p><h1 class="r96-h2">${esc(g.title)}</h1><p class="r96-desc">${esc(g.longDescription||g.shortDescription||"")}</p><div class="r96-actions">${v.runtimeUrl?`<a class="r96-primary" href="${esc(v.runtimeUrl)}">Jugar ahora</a>`:`<span class="r96-secondary">Build jugable pendiente</span>`}</div></article><aside class="r96-panel"><h3 class="r96-h3">Información</h3><p class="r96-desc"><strong>Género:</strong> ${esc(g.genre||"No especificado")}<br><strong>Versión:</strong> ${esc(v.version||"Pendiente")}<br><strong>Estado:</strong> ${esc(g.status)}</p></aside></div></div></section>`;
        root.querySelector("#r96-back")?.addEventListener("click",()=>renderPublicSurface({skipInvite:true}));
        root.scrollTo({top:0,behavior:"smooth"});
      }catch(e){alert("No se pudo abrir este juego.");}
    });
    setThemeButton();
  };

  const renderPublicSurface=async({skipInvite=false}={})=>{
    root.innerHTML=shell();
    bindPublic();
    applyGuestUi();

    try{
      const data=await publicApi("games.list");
      const games=Array.isArray(data?.games)?data.games:[];
      root.querySelector("#r96-games-count").textContent=String(games.length);
      root.querySelector("#r96-games-grid").innerHTML=games.length?games.map(card).join(""):emptyCard();
    }catch(e){
      root.querySelector("#r96-games-grid").innerHTML=emptyCard();
    }

    await refreshAuthorization();
  };

  const authErrorMessage=(code)=>{
    const map={
      R96_DEVELOPER_REQUIRED:"Esta cuenta no tiene acceso al Panel de desarrollador.",
      R96_INVITE_EMAIL_MISMATCH:"La cuenta de Google no coincide con el correo invitado.",
      R96_INVITE_CODE_USED_OR_INVALID:"La invitación no existe o ya fue utilizada.",
      R96_INVITE_CODE_EXPIRED:"La invitación expiró. Solicita una nueva.",
      R96_INVITE_CODE_INVALID:"El código de invitación no es válido.",
      AUTH_REQUIRED:"No se pudo iniciar la sesión de Wix."
    };
    return map[code]||("No se pudo iniciar sesión: "+code);
  };

  const consumeAuthResult=async()=>{
    const q=params();
    const error=q.get("r96e");
    if(error){
      const invite=q.get("r96invite")==="1";
      const message=authErrorMessage(error);
      cleanAuthQuery();
      await renderPublicSurface({skipInvite:true});
      renderDeveloperLogin({invite,error:message});
      return true;
    }

    const boot=q.get("r96b");
    if(!boot)return false;

    try{
      const result=await exchangeBoot(boot);
      if(!result.sessionToken)throw new Error("NO_SESSION_TOKEN");
      localStorage.setItem(SESSION_KEY,result.sessionToken);
      cleanAuthQuery();
      await renderPublicSurface({skipInvite:true});
      await openDeveloperWorkspace();
    }catch(e){
      cleanAuthQuery();
      await renderPublicSurface({skipInvite:true});
      renderDeveloperLogin({error:"No se pudo completar la sesión R96: "+e.message});
    }
    return true;
  };

  const load=async()=>{
    await renderPublicSurface();

    if(await consumeAuthResult())return;

    if(params().get("r96dev")==="1" && sessionToken()){
      await openDeveloperWorkspace();
      return;
    }

    if(params().get("r96invite")==="1" && !sessionToken()){
      renderDeveloperLogin({invite:true});
    }
  };
  load();
})();