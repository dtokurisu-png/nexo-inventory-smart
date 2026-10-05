(() => {
  const REV="r96-account-bar-20261005-43";
  if(document.getElementById("r96-app")) return;

  const css=document.createElement("link");
  css.rel="stylesheet";
  css.href="https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/risin96ames/risin96ames-ui.css?v="+REV;
  document.head.appendChild(css);

  const root=document.createElement("div");
  root.id="r96-app";
  root.dataset.theme=localStorage.getItem("risin96ames-theme")||"dark";
  document.body.appendChild(root);

  const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));

  const functionUrl=(name)=>{
    const host=location.hostname.toLowerCase();
    const path=location.pathname.split("/").filter(Boolean);
    const freeHost=host.endsWith(".wixstudio.com")||host.endsWith(".wixsite.com");
    const sitePrefix=freeHost&&path[0]?"/"+path[0]:"";
    return sitePrefix+"/_functions/"+name;
  };

  const publicApi=async(action,payload={})=>{
    const res=await fetch(functionUrl("risin96amesPublic"),{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action,...payload})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false) throw new Error(data.error||"R96_REQUEST_FAILED");
    return data.data;
  };

  let accountSessionToken="";
  let lastAccountBootToken="";

  const accountApi=async(payload={})=>{
    const requestPayload={...payload};
    if(accountSessionToken&&requestPayload.action!=="exchange"){
      requestPayload.sessionToken=accountSessionToken;
    }

    const res=await fetch(functionUrl("risin96amesAccount"),{
      method:"POST",
      credentials:"include",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(requestPayload)
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false) throw new Error(data.error||"AUTH_REQUIRED");
    return data.data;
  };

  const readAccountBootToken=()=>{
    try{
      return String(new URL(location.href).searchParams.get("r96ab")||"").trim();
    }catch(_){
      return "";
    }
  };

  const exchangeAccountBoot=async()=>{
    const bootToken=readAccountBootToken();
    if(!bootToken) return false;
    if(accountSessionToken&&bootToken===lastAccountBootToken) return true;

    const session=await accountApi({action:"exchange",bootToken});
    const token=String(session?.sessionToken||"").trim();
    if(!token) throw new Error("ACCOUNT_SESSION_REQUIRED");

    accountSessionToken=token;
    lastAccountBootToken=bootToken;
    return true;
  };

  const accountActionUrl=(action)=>{
    const u=new URL(location.href);
    ["r96login","r96switch","r96logout","r96state","r96error","r96ab","r96rev"].forEach(k=>u.searchParams.delete(k));
    u.hash="";
    u.searchParams.set(action,"1");
    return u.toString();
  };

  const shell=()=>`
    <header class="r96-header">
      <nav class="r96-nav">
        <div class="r96-nav-left">
          <div class="r96-menu-wrap">
            <button id="r96-menu" class="r96-menu" type="button" aria-label="Abrir menú">
              <span></span><span></span><span></span>
            </button>
            <div id="r96-menu-panel" class="r96-menu-panel" hidden>
              <a href="#games">Explorar juegos</a>
              <a href="#reviews">Reseñas</a>
              <a href="#community">Comunidad</a>
            </div>
          </div>
          <a class="r96-brand" href="#home">
            <span class="r96-mark">R96</span>
            <span class="r96-name">RISIN96AMES</span>
          </a>
        </div>
        <div class="r96-nav-right">
          <div class="r96-links">
            <a href="#games">Juegos</a>
            <a href="#reviews">Reseñas</a>
            <a href="#community">Comunidad</a>
          </div>
          <div class="r96-stats">
            <span>Juegos <strong id="r96-games-count">0</strong></span>
            <span>Reseñas <strong id="r96-reviews-count">0</strong></span>
          </div>
          <button class="r96-theme-toggle" id="r96-theme-toggle" type="button" aria-label="Cambiar tema"></button>
          <div class="r96-account-wrap">
            <button class="r96-secondary r96-account-button" id="r96-login" type="button">Iniciar sesión</button>
            <div id="r96-account-panel" class="r96-account-panel" hidden></div>
          </div>
        </div>
      </nav>
    </header>

    <main id="home">
      <section class="r96-band r96-hero">
        <div class="r96-inner r96-hero-grid">
          <div class="r96-hero-copy">
            <p class="r96-eyebrow">Beta games in development</p>
            <h1 class="r96-h1">Prueba betas jugables y ayuda a construir mejores juegos.</h1>
          </div>
          <div class="r96-hero-side">
            <p class="r96-copy">RISIN96AMES reúne builds web en desarrollo para jugar directamente desde la plataforma, registrar sesiones y devolver feedback a sus desarrolladores.</p>
            <div class="r96-actions">
              <a class="r96-primary" href="#games">Explorar juegos</a>
              <button class="r96-secondary" id="r96-hero-login" type="button">Iniciar sesión</button>
            </div>
          </div>
        </div>
      </section>

      <section id="games" class="r96-band r96-games">
        <div class="r96-inner r96-title-row">
          <div>
            <p class="r96-eyebrow">Playable betas</p>
            <h2 class="r96-h2">Explorar juegos</h2>
          </div>
          <p class="r96-copy">Los juegos aparecen aquí cuando sus desarrolladores publican una build web activa.</p>
        </div>
        <div class="r96-inner">
          <div id="r96-games-grid" class="r96-carousel">
            <article class="r96-card r96-empty">
              <div class="r96-thumb"><span>R96</span></div>
              <div class="r96-card-body">
                <p class="r96-eyebrow">Catálogo nuevo</p>
                <h3 class="r96-h3">Cargando juegos...</h3>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="reviews" class="r96-band r96-reviews">
        <div class="r96-inner r96-title-row">
          <div>
            <p class="r96-eyebrow">Feedback loop</p>
            <h2 class="r96-h2">Reseñas y comentarios</h2>
          </div>
          <p class="r96-copy">El feedback quedará asociado al juego, a la versión concreta y, cuando corresponda, a la sesión que acabas de jugar.</p>
        </div>
        <div class="r96-inner r96-two">
          <div class="r96-panel">
            <h3 class="r96-h3">Reseñas recientes</h3>
            <p class="r96-desc">Todavía no hay reseñas publicadas.</p>
          </div>
          <div class="r96-panel">
            <p class="r96-eyebrow">Post-session</p>
            <h3 class="r96-h3">Juega primero</h3>
            <p class="r96-desc">Después de una sesión podrás calificar y comentar la build que realmente probaste.</p>
          </div>
        </div>
      </section>

      <section id="community" class="r96-band r96-community">
        <div class="r96-inner r96-title-row">
          <div>
            <p class="r96-eyebrow">Community</p>
            <h2 class="r96-h2">Comunidad</h2>
          </div>
          <p class="r96-copy">Devlogs, pruebas, discusión y comunidad por juego se conectarán en fases posteriores.</p>
        </div>
        <div class="r96-inner r96-community-grid">
          <article class="r96-panel">
            <h3 class="r96-h3">Devlogs</h3>
            <p class="r96-desc">Historial de versiones y progreso del proyecto.</p>
          </article>
          <article class="r96-panel">
            <h3 class="r96-h3">Feedback</h3>
            <p class="r96-desc">Comentarios vinculados a la build realmente jugada.</p>
          </article>
          <article class="r96-panel">
            <h3 class="r96-h3">Desarrolladores</h3>
            <p class="r96-desc">Publicación y administración de proyectos autorizados.</p>
          </article>
        </div>
      </section>
    </main>

    <footer class="r96-footer">
      <p>RISIN96AMES · Plataforma de betas jugables.</p>
      <p class="r96-note">Nexo / Wix · ${REV}</p>
    </footer>`;

  const emptyCard=()=>`
    <article class="r96-card r96-empty">
      <div class="r96-thumb"><span>R96</span></div>
      <div class="r96-card-body">
        <p class="r96-eyebrow">Catálogo nuevo</p>
        <h3 class="r96-h3">Aún no hay juegos publicados</h3>
        <p class="r96-desc">La estructura ya está lista para recibir las nuevas builds.</p>
      </div>
    </article>`;

  const card=(g)=>`
    <article class="r96-card">
      <div class="r96-thumb"${g.thumbnailUrl?` style="background-image:url('${esc(g.thumbnailUrl)}')"`:""}>
        <span>${g.thumbnailUrl?"":esc((g.title||"R96").slice(0,3).toUpperCase())}</span>
      </div>
      <div class="r96-card-body">
        <div><span class="r96-status">${esc(g.status||"Beta")}</span></div>
        <h3 class="r96-h3">${esc(g.title)}</h3>
        <p class="r96-desc">${esc(g.shortDescription||"Beta web jugable en RISIN96AMES.")}</p>
        <div class="r96-meta"><span><strong>Género:</strong> ${esc(g.genre||"No especificado")}</span></div>
        <div class="r96-card-actions">
          <button class="r96-primary" data-r96-game="${esc(g.id)}">Ver juego</button>
        </div>
      </div>
    </article>`;

  let accountState=null;
  let parentAccountBridgeBound=false;

  const parentBridgeOrigin=()=>{
    try{
      return document.referrer?new URL(document.referrer).origin:"*";
    }catch(_){
      return "*";
    }
  };

  const postToWixParent=(payload)=>{
    if(window.parent===window) return false;
    try{
      window.parent.postMessage(payload,parentBridgeOrigin());
      return true;
    }catch(_){
      return false;
    }
  };

  const requestParentAccountAction=(action)=>{
    return postToWixParent({
      type:"r96-account-action",
      action:String(action||""),
      revision:REV
    });
  };

  const setThemeButton=()=>{
    const button=root.querySelector("#r96-theme-toggle");
    if(!button) return;
    const dark=root.dataset.theme==="dark";
    button.textContent=dark?"☀":"☾";
    button.setAttribute("aria-label",dark?"Cambiar a modo claro":"Cambiar a modo oscuro");
    button.title=dark?"Modo claro":"Modo oscuro";
  };

  const accountTypeLabel=(developer)=>{
    if(developer?.roleKey==="owner") return "Cuenta propietaria";
    if(developer) return "Cuenta desarrollador";
    return "Cuenta invitado";
  };

  const closeProfileModal=()=>{
    document.querySelector("#r96-profile-overlay")?.remove();
  };

  const openProfileSettings=()=>{
    const member=accountState?.member;
    const developer=accountState?.developer;
    if(!member) return;

    closeProfileModal();

    const role=accountTypeLabel(developer);

    const overlay=document.createElement("div");
    overlay.id="r96-profile-overlay";
    overlay.className="r96-profile-overlay";
    overlay.innerHTML=`
      <div class="r96-profile-modal" role="dialog" aria-modal="true" aria-labelledby="r96-profile-title">
        <div class="r96-profile-modal-head">
          <div>
            <p class="r96-eyebrow">Cuenta</p>
            <h3 id="r96-profile-title">Ajustes de perfil</h3>
          </div>
          <button class="r96-profile-close" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="r96-profile-summary">
          <div class="r96-profile-avatar-large">${member.photoUrl
            ? `<img src="${esc(member.photoUrl)}" alt="">`
            : esc((member.displayName||"U").slice(0,1).toUpperCase())}</div>
          <div>
            <strong>${esc(member.displayName||"Usuario")}</strong>
            <span>${esc(member.loginEmail||"")}</span>
            <small>${esc(role)}</small>
          </div>
        </div>
        <label class="r96-profile-field">
          <span>Nombre visible</span>
          <input id="r96-profile-name" maxlength="120" autocomplete="name" value="${esc(member.displayName||"")}">
          <small>Este nombre se mostrará en tu barra de usuario de R96.</small>
        </label>
        <label class="r96-profile-field">
          <span>Correo de acceso</span>
          <input value="${esc(member.loginEmail||"")}" disabled>
          <small>El correo de inicio de sesión se administra desde tu cuenta Wix.</small>
        </label>
        <div class="r96-profile-actions">
          <button class="r96-secondary" id="r96-profile-cancel" type="button">Cancelar</button>
          <button class="r96-primary" id="r96-profile-save" type="button">Guardar perfil</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector(".r96-profile-close")?.addEventListener("click",closeProfileModal);
    overlay.querySelector("#r96-profile-cancel")?.addEventListener("click",closeProfileModal);
    overlay.addEventListener("click",(event)=>{
      if(event.target===overlay) closeProfileModal();
    });

    overlay.querySelector("#r96-profile-save")?.addEventListener("click",async(event)=>{
      const button=event.currentTarget;
      const input=overlay.querySelector("#r96-profile-name");
      const displayName=String(input?.value||"").trim().replace(/\s+/g," ");

      if(displayName.length<2){
        input?.focus();
        return;
      }

      button.disabled=true;
      button.textContent="Guardando…";

      try{
        const data=await accountApi({action:"profile.update",displayName});
        accountState=data;
        applyAccountState(data);
        closeProfileModal();
      }catch(error){
        button.disabled=false;
        button.textContent="Guardar perfil";
        alert(error?.message||"No se pudo actualizar el perfil.");
      }
    });
  };
  const renderAccountPanel=(data)=>{
    const member=data?.member;
    const developer=data?.developer;
    if(!member) return;

    const panel=root.querySelector("#r96-account-panel");
    if(!panel) return;

    const initial=esc((member.displayName||"U").slice(0,1).toUpperCase());
    const role=accountTypeLabel(developer);

    panel.innerHTML=`
      <div class="r96-account-head">
        <div class="r96-account-avatar">${initial}</div>
        <div class="r96-account-copy">
          <strong>${esc(member.displayName||"Usuario")}</strong>
          <span>${esc(member.loginEmail||"")}</span>
        </div>
      </div>
      <div class="r96-account-role">${esc(role)}</div>
      ${developer?`<div class="r96-account-access">Acceso de desarrollador activo</div>`:""}
      <button id="r96-profile-settings" type="button">Ajustes de perfil</button>
      <button id="r96-switch-account" type="button">Cambiar cuenta</button>
      <button id="r96-logout-account" class="r96-account-danger" type="button">Cerrar sesión</button>
    `;

    panel.querySelector("#r96-profile-settings")?.addEventListener("click",()=>{
      panel.hidden=true;
      openProfileSettings();
    });

    panel.querySelector("#r96-switch-account")?.addEventListener("click",()=>{
      if(requestParentAccountAction("switch")) return;
      window.location.assign(accountActionUrl("r96switch"));
    });

    panel.querySelector("#r96-logout-account")?.addEventListener("click",()=>{
      if(requestParentAccountAction("logout")) return;
      window.location.assign(accountActionUrl("r96logout"));
    });
  };

  const applyAccountState=(data)=>{
    const member=data?.member;
    const developer=data?.developer;
    if(!member) return false;

    accountState=data;

    const header=root.querySelector("#r96-login");
    const hero=root.querySelector("#r96-hero-login");
    const role=accountTypeLabel(developer);
    const accountLabel=role;
    const avatar=member.photoUrl
      ? `<span class="r96-account-avatar r96-account-avatar-image"><img src="${esc(member.photoUrl)}" alt=""></span>`
      : `<span class="r96-account-avatar">${esc((member.displayName||"U").slice(0,1).toUpperCase())}</span>`;

    if(header){
      header.classList.add("is-authenticated");
      header.innerHTML=`
        ${avatar}
        <span class="r96-account-button-copy">
          <strong>${esc(member.displayName||"Usuario")}</strong>
          <small>${esc(member.loginEmail||"")}</small>
          <em class="r96-account-type">${esc(accountLabel)}</em>
        </span>
        <span class="r96-account-caret">⌄</span>`;
      header.dataset.authenticated="1";
      header.title="Abrir opciones de usuario";
    }

    if(hero){
      hero.textContent="Ver perfil";
      hero.dataset.authenticated="1";
    }

    renderAccountPanel(data);
    return true;
  };

  const clearAccountState=()=>{
    accountState=null;

    const header=root.querySelector("#r96-login");
    const hero=root.querySelector("#r96-hero-login");
    const panel=root.querySelector("#r96-account-panel");

    if(header){
      header.classList.remove("is-authenticated");
      header.textContent="Iniciar sesión";
      delete header.dataset.authenticated;
      header.title="";
    }

    if(hero){
      hero.textContent="Iniciar sesión";
      delete hero.dataset.authenticated;
    }

    if(panel){
      panel.hidden=true;
      panel.innerHTML="";
    }
  };

  const bindParentAccountBridge=()=>{
    if(parentAccountBridgeBound) return;
    parentAccountBridgeBound=true;

    window.addEventListener("message",(event)=>{
      if(window.parent!==window&&event.source!==window.parent) return;

      const expected=parentBridgeOrigin();
      if(expected!=="*"&&event.origin!==expected) return;

      const message=event?.data||{};
      if(message?.type!=="r96-account-state") return;

      if(message.data?.member){
        applyAccountState(message.data);
      }else{
        clearAccountState();
      }
    });
  };

  const announceAccountBridgeReady=()=>{
    [0,180,600,1400].forEach((delay)=>{
      setTimeout(()=>{
        postToWixParent({
          type:"r96-account-ready",
          revision:REV
        });
      },delay);
    });
  };

  const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

  const refreshAccountState=async(attempt=0)=>{
    try{
      if(!accountSessionToken){
        const exchanged=await exchangeAccountBoot();
        if(!exchanged) throw new Error("ACCOUNT_BRIDGE_WAIT");
      }

      const data=await accountApi({action:"state"});
      return applyAccountState(data);
    }catch(_){
      if(attempt<12){
        const delays=[180,260,360,500,650,800,950,1100,1250,1400,1600,1800];
        await sleep(delays[attempt]||1800);
        return refreshAccountState(attempt+1);
      }
      return false;
    }
  };

  const renderHome=async()=>{
    root.innerHTML=shell();
    bind();
    setThemeButton();
    bindParentAccountBridge();
    announceAccountBridgeReady();
    refreshAccountState();

    try{
      const data=await publicApi("games.list");
      const games=Array.isArray(data?.games)?data.games:[];
      root.querySelector("#r96-games-count").textContent=String(games.length);
      root.querySelector("#r96-games-grid").innerHTML=games.length?games.map(card).join(""):emptyCard();
    }catch(_){
      root.querySelector("#r96-games-grid").innerHTML=emptyCard();
    }
  };

  const openGame=async(gameId)=>{
    try{
      const data=await publicApi("game.get",{gameId});
      const g=data.game;
      const v=data.version||{};

      root.querySelector("main").innerHTML=`
        <section class="r96-band r96-games r96-detail">
          <div class="r96-inner">
            <div class="r96-back">
              <button id="r96-back" class="r96-secondary">← Volver a juegos</button>
            </div>
            <div class="r96-detail-grid">
              <article class="r96-panel">
                <p class="r96-eyebrow">${esc(g.status)}</p>
                <h1 class="r96-h2">${esc(g.title)}</h1>
                <p class="r96-desc">${esc(g.longDescription||g.shortDescription||"")}</p>
                <div class="r96-actions">
                  ${v.runtimeUrl?`<a class="r96-primary" href="${esc(v.runtimeUrl)}">Jugar ahora</a>`:`<span class="r96-secondary">Build jugable pendiente</span>`}
                </div>
              </article>
              <aside class="r96-panel">
                <h3 class="r96-h3">Información</h3>
                <p class="r96-desc">
                  <strong>Género:</strong> ${esc(g.genre||"No especificado")}<br>
                  <strong>Versión:</strong> ${esc(v.version||"Pendiente")}<br>
                  <strong>Estado:</strong> ${esc(g.status)}
                </p>
              </aside>
            </div>
          </div>
        </section>`;

      root.querySelector("#r96-back")?.addEventListener("click",renderHome);
      root.scrollTo({top:0,behavior:"smooth"});
    }catch(_){
      alert("No se pudo abrir este juego.");
    }
  };

  const toggleAccountPanel=()=>{
    const panel=root.querySelector("#r96-account-panel");
    if(panel) panel.hidden=!panel.hidden;
  };

  const bind=()=>{
    const menu=root.querySelector("#r96-menu");
    const panel=root.querySelector("#r96-menu-panel");
    const accountPanel=root.querySelector("#r96-account-panel");

    menu?.addEventListener("click",(event)=>{
      event.stopPropagation();
      panel.hidden=!panel.hidden;
      if(accountPanel) accountPanel.hidden=true;
    });

    root.querySelector("#r96-theme-toggle")?.addEventListener("click",(event)=>{
      event.stopPropagation();
      const next=root.dataset.theme==="dark"?"light":"dark";
      root.dataset.theme=next;
      localStorage.setItem("risin96ames-theme",next);
      setThemeButton();
    });

    root.querySelector("#r96-login")?.addEventListener("click",(event)=>{
      if(event.currentTarget.dataset.authenticated==="1"){
        event.stopPropagation();
        if(panel) panel.hidden=true;
        toggleAccountPanel();
        return;
      }
      if(requestParentAccountAction("login")) return;
      window.location.assign(accountActionUrl("r96login"));
    });

    root.querySelector("#r96-hero-login")?.addEventListener("click",(event)=>{
      if(event.currentTarget.dataset.authenticated==="1"){
        event.stopPropagation();
        toggleAccountPanel();
        return;
      }
      if(requestParentAccountAction("login")) return;
      window.location.assign(accountActionUrl("r96login"));
    });

    root.querySelectorAll('a[href^="#"]').forEach((link)=>{
      link.addEventListener("click",(event)=>{
        const target=root.querySelector(link.getAttribute("href"));
        if(!target) return;
        event.preventDefault();
        target.scrollIntoView({behavior:"smooth"});
        if(panel) panel.hidden=true;
      });
    });

    root.addEventListener("click",(event)=>{
      const button=event.target.closest("[data-r96-game]");
      if(button){
        openGame(button.dataset.r96Game);
        return;
      }
      if(!event.target.closest(".r96-menu-wrap")&&panel) panel.hidden=true;
      if(!event.target.closest(".r96-account-wrap")&&accountPanel) accountPanel.hidden=true;
    },{once:false});
  };

  renderHome();
})();