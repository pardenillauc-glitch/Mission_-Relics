/* Mission Relics: lógica de la plataforma (navegación, mapa 3D, páginas de misión). */
/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);
const AX_START = 1970, AX_END = 2027;
const TODAY = new Date();
const yearFrac = d => { const t = d ? new Date(d + "T12:00:00") : TODAY; return t.getFullYear() + (t - new Date(t.getFullYear(),0,1)) / 31557600000; };
const pct = y => ((y - AX_START) / (AX_END - AX_START)) * 100;
const cvar = m => `var(--c-${m.c})`;

/* ---------- Estrellas de la presentación ---------- */
(function(){
  let s = 7, g = document.getElementById("stars"), out = "";
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 170; i++){
    out += `<circle cx="${(r()*1600).toFixed(0)}" cy="${(r()*820).toFixed(0)}" r="${(r()*1.6+.3).toFixed(2)}" fill="#F3EBDD" opacity="${(r()*.6+.25).toFixed(2)}"/>`;
  }
  g.innerHTML = out;
})();

/* ---------- Línea del tiempo ---------- */
(function(){
  $("#ticks").innerHTML = [1970,1980,1990,2000,2010,2020].map(y => `<span style="left:${pct(y)}%">${y}</span>`).join("");
  const nowPct = pct(yearFrac(null));
  $("#tl-list").innerHTML = MISSIONS.map(m => {
    const a = pct(yearFrac(m.launch)), b = pct(yearFrac(m.end));
    return `<li><a class="tl-row${m.pilot ? " flag" : ""}" href="#${m.id}" style="--c:${cvar(m)}">
      <span class="tl-name"><i></i><span><strong>${m.name}</strong><small>${m.dest}</small></span></span>
      <span class="tl-date"><span class="lbl">Lanzamiento</span><b>${m.launchLabel}</b>${m.launchNote ? `<span>${m.launchNote}</span>` : ""}</span>
      <span class="tl-date"><span class="lbl">Fin de misión</span><b>${m.endLabel}</b></span>
      <span class="track" aria-hidden="true"><span class="bar${m.end ? "" : " ongoing"}" style="left:${a}%;width:${Math.max(b - a, .6)}%"></span><span class="now" style="left:${nowPct}%"></span></span>
    </a></li>`;
  }).join("");
})();

/* ---------- Página de misión ---------- */
function renderMission(m){
  const i = MISSIONS.indexOf(m), prev = MISSIONS[i - 1], next = MISSIONS[i + 1];
  const st = m.story;
  const storyLine = st && st.title ? `<p class="m-story">${st.title}</p>`
    : st && st.theme ? `<p class="m-story">${st.theme}</p>` : `<p class="m-story pending">Historia por escribir</p>`;
  const cast = m.cast ? `<div class="cast">${m.cast.map(c => `<div><h3>${c.name}</h3><p class="role">${c.role}</p><p class="desc">${c.desc}</p><blockquote>${c.quote}</blockquote></div>`).join("")}</div>`
    : `<div><p class="lede" style="margin-top:0">Los personajes y el guion de esta historia aún no se escriben.</p></div>`;
  const chapters = m.chapters ? `<ol class="chapters">${m.chapters.map(([n,t]) => `<li><span class="num">${n}</span>${t ? `<span>${t}</span>` : `<span class="pending">Por confirmar</span>`}</li>`).join("")}</ol>` : "";
  const parts = m.procedural === "ingenuity" ? `
      <div class="parts" role="group" aria-label="Partes del modelo">
        ${Object.entries(PART_INFO).map(([k,[t]]) => `<button type="button" data-part="${k}" aria-pressed="false">${t.split(" ")[0]}</button>`).join("")}
      </div>
      <div class="part-info" id="part-info" aria-live="polite"><h3>Elige una parte</h3><p>La pieza seleccionada se iluminará en el modelo.</p></div>`
    : `<p class="lede" style="margin-top:0">${m.media.model ? "Arrastra para girar el modelo y acércate con la rueda o pellizcando." : "El modelo 3D de este equipo se agregará pronto."}</p>`;

  $("#view-mision").innerHTML = `
  <div class="m-top" style="--c:${cvar(m)}">
    <div class="wrap">
      <a class="back" href="#explorar">‹ Volver a explorar</a>
      <div class="m-hero">
        <div>
          <p class="m-dest"><i></i>${m.dest}</p>
          <h1>${m.name}</h1>
          ${storyLine}
          <span class="status${m.live ? " live" : ""}">${m.status}</span>
        </div>
        <dl class="m-dates">
          <div><dt>Lanzamiento</dt><dd>${m.launchLabel}${m.launchNote ? `<small>${m.launchNote}</small>` : ""}</dd></div>
          <div><dt>Fin de misión</dt><dd>${m.endLabel}${m.endNote ? `<small>${m.endNote}</small>` : ""}</dd></div>
        </dl>
      </div>
    </div>
  </div>
  <nav class="subnav" aria-label="Secciones de la misión" style="--c:${cvar(m)}">
    <div class="wrap">
      <button type="button" data-sec="s-historia">Historia</button>
      <button type="button" data-sec="s-corto">Cortometraje</button>
      <button type="button" data-sec="s-3d">Diseño 3D</button>
      <button type="button" data-sec="s-juego">Minijuego</button>
      <button type="button" data-sec="s-datos">Datos</button>
    </div>
  </nav>
  <div style="--c:${cvar(m)}">
    <section class="m-sec" id="s-historia"><div class="wrap">
      <h2>La misión</h2>
      <div class="story-grid"><p>${m.summary}</p>${cast}</div>
    </div></section>

    <section class="m-sec" id="s-corto"><div class="wrap">
      <h2>Cortometraje</h2>
      <p class="lede">${st && st.title ? `«${st.title}», un corto animado de unos cinco minutos.` : "El corto animado de esta misión."}</p>
      <div class="screen" id="video-frame"><div class="screen-msg"><strong>${m.live ? "En producción" : "Próximamente"}</strong><p>Aquí podrás ver el cortometraje completo.</p></div></div>
      ${chapters}
    </div></section>

    <section class="m-sec" id="s-3d"><div class="wrap">
      <h2>Diseño 3D interactivo</h2>
      <p class="lede">Explora el equipo pieza por pieza.</p>
      <div class="viewer-grid">
        <div class="viewer" id="viewer"></div>
        <div>${parts}</div>
      </div>
    </div></section>

    <section class="m-sec" id="s-juego"><div class="wrap">
      <h2>Minijuego</h2>
      <p class="lede">Enfrenta los retos que vivió la misión.</p>
      <div class="screen" id="game-frame"><div class="screen-msg"><strong>${m.live ? "En desarrollo" : "Próximamente"}</strong><p>Podrás jugarlo aquí mismo, sin instalar nada.</p></div></div>
    </div></section>

    <section class="m-sec" id="s-datos"><div class="wrap">
      <h2>Datos de la misión</h2>
      <dl class="facts">${m.facts.map(([v,l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join("")}</dl>
      <p class="source">Datos de referencia; se contrastarán con las fuentes oficiales de cada agencia.</p>
    </div></section>

    <div class="wrap pager">
      ${prev ? `<a href="#${prev.id}"><span>‹ Anterior</span><strong>${prev.name}</strong></a>` : ""}
      ${next ? `<a class="next" href="#${next.id}"><span>Siguiente ›</span><strong>${next.name}</strong></a>` : ""}
    </div>
  </div>`;

  document.querySelectorAll("[data-sec]").forEach(b => b.addEventListener("click", () => document.getElementById(b.dataset.sec).scrollIntoView()));
  setupMedia(m);
  viewer.show(m);
  document.querySelectorAll("[data-part]").forEach(b => b.addEventListener("click", () => {
    const key = b.dataset.part, on = b.getAttribute("aria-pressed") !== "true";
    document.querySelectorAll("[data-part]").forEach(x => x.setAttribute("aria-pressed","false"));
    const info = $("#part-info");
    if (on){ b.setAttribute("aria-pressed","true"); const [t,d] = PART_INFO[key]; info.innerHTML = `<h3>${t}</h3><p>${d}</p>`; viewer.highlight(key); }
    else { info.innerHTML = "<h3>Elige una parte</h3><p>La pieza seleccionada se iluminará en el modelo.</p>"; viewer.highlight(null); }
  }));
}

function setupMedia(m){
  const md = m.media || {};
  if (md.video){
    const v = document.createElement("video"); v.controls = true; v.preload = "metadata"; v.playsInline = true; v.src = md.video;
    const f = $("#video-frame"); f.innerHTML = ""; f.appendChild(v);
  } else if (md.youtube){
    $("#video-frame").innerHTML = `<iframe src="${md.youtube}" title="Cortometraje de ${m.name}" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }
  if (md.game){
    const gf = $("#game-frame");
    gf.innerHTML = `<div class="screen-msg"><strong>Listo para jugar</strong><p>El juego tarda unos segundos en cargar.</p><button type="button" class="btn" id="start-game">Iniciar juego</button></div>`;
    $("#start-game").addEventListener("click", () => { gf.innerHTML = `<iframe src="${md.game}" title="Minijuego de ${m.name}" allow="fullscreen; autoplay" allowfullscreen></iframe>`; });
  }
}

/* ---------- Visor 3D ---------- */
const PART_INFO = {
  rotores:["Rotores coaxiales","Dos rotores que giran en sentidos opuestos a casi 3,000 revoluciones por minuto, necesarias para sostenerse en la atmósfera tenue de Marte."],
  panel:["Panel solar","Montado sobre los rotores, carga las baterías de iones de litio que alimentan el vuelo y la calefacción nocturna."],
  fuselaje:["Fuselaje","La caja central guarda las baterías, las computadoras y el sistema que lo calienta para sobrevivir las noches marcianas."],
  mastil:["Mástil","El eje central que une el fuselaje con los dos rotores y sostiene el panel solar en la parte superior."],
  patas:["Patas","Cuatro patas de aterrizaje que lo sostienen sobre el suelo de Jezero."],
  camaras:["Cámaras","Una cámara a color y otra en blanco y negro que mira al suelo para calcular cómo se mueve."]
};

const viewer = (() => {
  let renderer, scene, camera, controls, content, parts = {}, spinners = [], current = null;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ok = () => !!window.THREE;

  function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 1, .01, 100);
    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    scene.add(new THREE.HemisphereLight(0xfff1e0, 0x5a3a2a, .95));
    const sun = new THREE.DirectionalLight(0xffffff, .9); sun.position.set(2,3,1.5); scene.add(sun);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.enablePan = false;
    (function loop(){
      requestAnimationFrame(loop);
      const box = renderer.domElement.parentElement;
      if (!box || $("#view-mision").hidden) return;
      const w = box.clientWidth, h = box.clientHeight;
      const size = renderer.getSize(new THREE.Vector2());
      if (w && h && (size.x !== w || size.y !== h)){ renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
      if (!reduce) spinners.forEach(([o, s]) => o.rotation.y += s);
      controls.update();
      renderer.render(scene, camera);
    })();
  }

  function clear(){
    if (content){ scene.remove(content); content.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose && o.material.dispose(); }); }
    content = new THREE.Group(); scene.add(content); parts = {}; spinners = [];
  }

  function frame(dist, targetY){
    camera.position.set(dist * .78, dist * .5 + targetY, dist * .85);
    controls.target.set(0, targetY, 0);
    controls.minDistance = dist * .45; controls.maxDistance = dist * 2.6;
    controls.maxPolarAngle = Math.PI / 2 - .05;
    controls.update();
  }

  function ground(color){
    const g = new THREE.Mesh(new THREE.CircleGeometry(1.3, 64), new THREE.MeshStandardMaterial({ color, roughness:1 }));
    g.rotation.x = -Math.PI / 2; content.add(g);
  }

  function buildIngenuity(){
    ground(0xB4643A);
    const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color:c, roughness:.6, metalness:.2 }, o));
    parts = { rotores:[], panel:[], fuselaje:[], camaras:[], patas:[] };
    const add = (p, mesh, parent = content) => { parent.add(mesh); if (p) parts[p].push(mesh); return mesh; };
    add("fuselaje", new THREE.Mesh(new THREE.BoxGeometry(.2,.14,.16), mat(0xC9B48F,{metalness:.5,roughness:.35}))).position.y = .2;
    const up = new THREE.Vector3(0,1,0);
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx,sz]) => {
      const a = new THREE.Vector3(.07*sx,.14,.06*sz), b = new THREE.Vector3(.21*sx,.01,.19*sz);
      const leg = add("patas", new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,a.distanceTo(b),8), mat(0x2B2730)));
      leg.position.copy(a.clone().add(b).multiplyScalar(.5));
      leg.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
      add("patas", new THREE.Mesh(new THREE.SphereGeometry(.014,12,8), mat(0x2B2730))).position.copy(b);
    });
    add(null, new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.26,12), mat(0x34313A))).position.y = .39;
    const rotor = (y, rot) => {
      const g = new THREE.Group(); g.position.y = y; g.rotation.y = rot; content.add(g);
      add("rotores", new THREE.Mesh(new THREE.BoxGeometry(1.2,.008,.07), mat(0x2E2E36,{roughness:.45})), g);
      add("rotores", new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.03,16), mat(0x45424C)), g);
      return g;
    };
    spinners = [[rotor(.36,0), .05], [rotor(.45,Math.PI/2), -.05]];
    add("panel", new THREE.Mesh(new THREE.BoxGeometry(.24,.01,.15), mat(0x23305E,{metalness:.45,roughness:.3}))).position.y = .53;
    add("camaras", new THREE.Mesh(new THREE.BoxGeometry(.035,.03,.035), mat(0x1E1E24))).position.set(.05,.12,.05);
    add("camaras", new THREE.Mesh(new THREE.BoxGeometry(.03,.03,.03), mat(0x1E1E24))).position.set(-.04,.12,.05);
    frame(1.55, .28);
  }

  function loadModel(url, box){
    const loader = new THREE.GLTFLoader();
    loader.load(url, gltf => {
      const obj = gltf.scene;
      const b = new THREE.Box3().setFromObject(obj), size = b.getSize(new THREE.Vector3()), center = b.getCenter(new THREE.Vector3());
      const s = 1 / Math.max(size.x, size.y, size.z);
      obj.scale.setScalar(s);
      obj.position.set(-center.x * s, -b.min.y * s, -center.z * s);
      content.add(obj);
      frame(1.9, size.y * s / 2);
    }, undefined, () => { box.innerHTML = `<p class="note">No se pudo cargar el modelo 3D. Revisa que el archivo exista en la ruta indicada.</p>`; });
  }

  return {
    show(m){
      const box = $("#viewer");
      current = m;
      if (!ok()){ box.innerHTML = `<p class="note">No se pudo cargar el visor 3D. Revisa tu conexión y recarga la página.</p>`; return; }
      if (!m.media.model && !m.procedural){ box.innerHTML = `<p class="note">Modelo 3D en preparación.</p>`; return; }
      if (!renderer) init();
      box.innerHTML = `<span class="hint">Arrastra para girar, pellizca o usa la rueda para acercar</span>`;
      box.prepend(renderer.domElement);
      clear();
      if (m.media.model) loadModel(m.media.model, box);
      else if (m.procedural === "ingenuity") buildIngenuity();
    },
    highlight(key){
      const glow = new THREE.Color(0xE39A5E), none = new THREE.Color(0);
      for (const [k, list] of Object.entries(parts)) list.forEach(o => { o.material.emissive.copy(k === key ? glow : none); o.material.emissiveIntensity = k === key ? .7 : 0; });
    }
  };
})();

/* =========================================================
   EXPLORAR: mapa 3D de destinos
   Coordenadas reales (latitud, longitud este) de cada sitio.
   ========================================================= */
/* Datos de cada cuerpo celeste: NASA NSSDCA, Planetary Fact Sheet (métrico).
   https://nssdc.gsfc.nasa.gov/planetary/factsheet/ */
const DESTINOS = {
  luna:   { name:"La Luna", count:"1 equipo, 3 sitios", oblicuidad:6.7, color:"#BDBDBD",
            sub:"El rover lunar recorrió tres regiones distintas. Toca un marcador para ver cada una.",
            facts:[["Diámetro","3,475 km"],["Gravedad","1.6 m/s²"],["Duración del día","708.7 h"],["Temperatura media","−20 °C"]] },
  marte:  { name:"Marte", count:"3 equipos", oblicuidad:25.2, color:"#C0673C",
            sub:"Tres equipos en tres regiones del planeta. Gira Marte y toca un marcador.",
            facts:[["Diámetro","6,792 km"],["Gravedad","3.7 m/s²"],["Duración del día","24.7 h"],["Temperatura media","−65 °C"],["Lunas","2"]] },
  jupiter:{ name:"Júpiter", count:"2 sobrevuelos", oblicuidad:3.1, color:"#C9A27E",
            sub:"Voyager 1 y Cassini pasaron junto a Júpiter rumbo a Saturno. Trayectorias esquemáticas.",
            facts:[["Diámetro","142,984 km"],["Gravedad","23.1 m/s²"],["Duración del día","9.9 h"],["Temperatura media","−110 °C"],["Lunas","95"]] },
  saturno:{ name:"Saturno", count:"2 equipos", oblicuidad:26.7, color:"#D9C08E",
            sub:"Cassini orbitó Saturno, Huygens descendió en Titán y Voyager 1 lo sobrevoló. Trayectorias esquemáticas.",
            facts:[["Diámetro","120,536 km"],["Gravedad","9.0 m/s²"],["Duración del día","10.7 h"],["Temperatura media","−140 °C"],["Lunas","274"]] },
  sistema:{ name:"Sistema solar", count:"2 equipos", oblicuidad:0, color:"#5A5DC4",
            sub:"Un asteroide y el espacio interestelar. Esquema sin escala real: toca un planeta para viajar a él.",
            facts:null }
};
const SITIOS = {
  luna: [
    { m:"lrv", label:"Apolo 15", site:"Apolo 15, Hadley-Apenino", lat:26.13, lon:3.63 },
    { m:"lrv", label:"Apolo 16", site:"Apolo 16, tierras altas de Descartes", lat:-8.97, lon:15.50 },
    { m:"lrv", label:"Apolo 17", site:"Apolo 17, valle Taurus-Littrow", lat:20.19, lon:30.77 }
  ],
  marte: [
    { m:"sojourner", label:"Sojourner", site:"Ares Vallis", lat:19.13, lon:-33.22 },
    { m:"opportunity", label:"Opportunity", site:"Meridiani Planum", lat:-1.95, lon:-5.53 },
    { m:"ingenuity", label:"Ingenuity", site:"Cráter Jezero, junto a Perseverance", lat:18.44, lon:77.45 }
  ]
};

/* ---------- Texturas generadas (sin imágenes externas) ---------- */
function rng(seed){ return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
function texCanvas(w, h){ const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; }
function blob(ctx, W, H, lat, lon, rLat, rLon, color, alpha){
  const x = (lon + 180) / 360 * W, y = (90 - lat) / 180 * H, rx = rLon / 360 * W, ry = rLat / 180 * H;
  [x - W, x, x + W].forEach(cx => {
    ctx.save(); ctx.translate(cx, y); ctx.scale(rx / ry, 1);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
    g.addColorStop(0, color); g.addColorStop(.65, color); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, ry, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  });
  ctx.globalAlpha = 1;
}
function lumpy(ctx, W, H, r, lat, lon, rLat, rLon, color, alpha, n = 6){
  for (let i = 0; i < n; i++) blob(ctx, W, H, lat + (r() - .5) * rLat, lon + (r() - .5) * rLon, rLat * (.5 + r() * .5), rLon * (.5 + r() * .5), color, alpha / 1.6);
}
function speckle(ctx, W, H, r, n, colors, a){
  for (let i = 0; i < n; i++){ ctx.globalAlpha = a * r(); ctx.fillStyle = colors[(r() * colors.length) | 0]; const s = 1 + r() * 3; ctx.fillRect(r() * W, r() * H, s, s); }
  ctx.globalAlpha = 1;
}
function craters(ctx, W, H, r, n, maxR, dark, light){
  for (let i = 0; i < n; i++){
    const x = r() * W, y = H * .08 + r() * H * .84, rad = 1 + Math.pow(r(), 3) * maxR;
    ctx.globalAlpha = .28; ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    ctx.globalAlpha = .35; ctx.strokeStyle = light; ctx.lineWidth = Math.max(1, rad * .25); ctx.beginPath(); ctx.arc(x - rad * .15, y - rad * .15, rad, Math.PI * .9, Math.PI * 1.9); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
function moonTexture(){
  const W = 2048, H = 1024, [c, x] = texCanvas(W, H), r = rng(11);
  x.fillStyle = "#9C9B97"; x.fillRect(0, 0, W, H);
  speckle(x, W, H, r, 26000, ["#B4B3AE", "#7E7D79", "#A8A7A2"], .5);
  const mare = "#56575C";
  [[20,-57,26,32],[33,-16,12,15],[28,17,8,10],[8,31,10,13],[17,59,6,7],[-7,51,8,8],[-15,35,5,6],[-21,-17,8,11],[-24,-39,5,6],[57,0,5,26],[13,4,4,6],[7,-31,6,8],[-10,-23,4,6],[27,147,3,3],[-19,-93,4,4],[-2,85,4,5]]
    .forEach(([la, lo, a, b]) => lumpy(x, W, H, r, la, lo, a, b, mare, .9, 7));
  craters(x, W, H, r, 1400, 14, "#6E6D69", "#D6D5CF");
  // Tycho y Copérnico con rayos
  [[-43,-11,170],[9.6,-20,90]].forEach(([la, lo, len]) => {
    const cx = (lo + 180) / 360 * W, cy = (90 - la) / 180 * H;
    x.strokeStyle = "#E6E4DE"; x.lineWidth = 1.5;
    for (let i = 0; i < 26; i++){ const t = r() * Math.PI * 2, l = len * (.4 + r() * .6); x.globalAlpha = .18; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(t) * l * 2, cy + Math.sin(t) * l); x.stroke(); }
    x.globalAlpha = .9; x.fillStyle = "#EFEDE7"; x.beginPath(); x.arc(cx, cy, 6, 0, 7); x.fill(); x.globalAlpha = 1;
  });
  return c;
}
function marsTexture(){
  const W = 2048, H = 1024, [c, x] = texCanvas(W, H), r = rng(23);
  x.fillStyle = "#B4603B"; x.fillRect(0, 0, W, H);
  speckle(x, W, H, r, 24000, ["#C77447", "#A3512F", "#BE6A40"], .55);
  const dark = "#6A3021", light = "#D9956A";
  [[10,69,13,9],[-3,-3,4,16],[-8,22,5,24],[-25,-40,10,22],[47,-25,12,15],[-22,145,7,24],[-18,105,7,16],[-32,-150,7,20],[45,110,10,20],[-12,-50,5,8],[-40,170,6,20],[60,60,6,40]]
    .forEach(([la, lo, a, b]) => lumpy(x, W, H, r, la, lo, a, b, dark, .7, 6));
  [[-42,70,15,19],[-50,-43,7,10],[13,87,7,8],[25,147,8,11],[0,-112,24,32],[15,-160,12,16],[20,5,12,20]]
    .forEach(([la, lo, a, b]) => lumpy(x, W, H, r, la, lo, a, b, light, .5, 7));
  craters(x, W, H, r, 700, 10, "#7A3A24", "#D99A70");
  // Valles Marineris
  const P = (la, lo) => [(lo + 180) / 360 * W, (90 - la) / 180 * H];
  x.lineCap = "round"; x.lineJoin = "round";
  [[10,"rgba(90,38,24,.55)"],[4,"#4E2014"]].forEach(([w, col]) => {
    x.strokeStyle = col; x.lineWidth = w; x.beginPath();
    [[-6,-98],[-8,-80],[-10,-68],[-12,-58],[-14,-46],[-12,-38]].forEach(([la, lo], i) => { const [px, py] = P(la, lo); i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.stroke();
  });
  // Volcanes de Tharsis y Elysium
  [[18.6,-134,22],[-8.3,-120.5,10],[1.5,-112.8,10],[11.8,-104.5,10],[25,147,9]].forEach(([la, lo, rad]) => {
    const [px, py] = P(la, lo);
    x.globalAlpha = .55; x.fillStyle = "#E0A27A"; x.beginPath(); x.arc(px, py, rad, 0, 7); x.fill();
    x.globalAlpha = .8; x.fillStyle = "#5A2618"; x.beginPath(); x.arc(px, py, rad * .28, 0, 7); x.fill(); x.globalAlpha = 1;
  });
  // Casquetes polares
  [[0, 50, "#F2ECE4"], [H, -40, "#F2ECE4"]].forEach(([y0, h, col]) => {
    const g = x.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, col); g.addColorStop(.55, col); g.addColorStop(1, "rgba(242,236,228,0)");
    x.fillStyle = g; x.fillRect(0, Math.min(y0, y0 + h), W, Math.abs(h));
  });
  return c;
}
function bandTexture(colors){
  const [c, x] = texCanvas(512, 256), r = rng(5);
  let y = 0; while (y < 256){ const h = 6 + r() * 22; x.fillStyle = colors[(r() * colors.length) | 0]; x.fillRect(0, y, 512, h); y += h; }
  speckle(x, 512, 256, r, 3000, colors, .3);
  return c;
}
function latLon(lat, lon, rad){
  const a = THREE.MathUtils.degToRad(lat), b = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b)).multiplyScalar(rad);
}

/* ---------- Controlador del mapa 3D ---------- */
const warp = {
  on(color){ const w = $("#warp"); w.style.setProperty("--wc", color || "#C0673C"); w.classList.add("on"); },
  off(){ $("#warp").classList.remove("on"); },
  isOn(){ return $("#warp").classList.contains("on"); }
};
function ringTexture(){
  // Bandas de los anillos principales (C, B, división de Cassini, A), de dentro hacia fuera
  const [c, x] = texCanvas(512, 4), r = rng(9);
  const stops = [[0,.0],[.02,.18],[.26,.32],[.30,.62],[.70,.85],[.72,.15],[.78,.08],[.80,.6],[.97,.55],[1,0]];
  for (let i = 0; i < 512; i++){
    const u = i / 511; let a = 0;
    for (let k = 1; k < stops.length; k++) if (u <= stops[k][0]){ const [u0,a0] = stops[k-1], [u1,a1] = stops[k]; a = a0 + (a1 - a0) * (u - u0) / (u1 - u0); break; }
    a *= .75 + r() * .35;
    const shade = 190 + (r() * 40 | 0);
    x.fillStyle = `rgba(${shade},${shade - 18},${shade - 50},${Math.min(1, a)})`; x.fillRect(i, 0, 1, 4);
  }
  return c;
}
function curveLine(points, color, parent, dashed = true){
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
  const mat = dashed ? new THREE.LineDashedMaterial({ color, dashSize:.08, gapSize:.06, transparent:true, opacity:.85 })
                     : new THREE.LineBasicMaterial({ color, transparent:true, opacity:.6 });
  const line = new THREE.Line(geo, mat); if (dashed) line.computeLineDistances(); parent.add(line);
  line.userData.fo = true;
  return curve;
}

const explore = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = () => $("#view-explorar");
  const KEYS = ["luna", "marte", "jupiter", "saturno", "sistema"];
  let renderer, scene, camera, controls, ray, ptr, inited = false, loader, prep;
  let state = "overview", focusKey = null, tween = null, hovered = null, overviewPos = null, overviewTarget = null, saved = null;
  const bodies = {}, labels = [], pins = [], orbiters = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  function init(){
    inited = true;
    const box = stage();
    if (!window.THREE){
      box.insertAdjacentHTML("beforeend", `<div class="ex-fallback"><div><p>No se pudo cargar el mapa 3D. Revisa tu conexión y recarga la página.</p><a class="btn" href="#misiones">Ver la cronología</a></div></div>`);
      return;
    }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, .05, 600);
    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x0F1430);
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    box.prepend(renderer.domElement);
    ray = new THREE.Raycaster(); ptr = new THREE.Vector2();
    loader = new THREE.TextureLoader();
    prep = t => { if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t; };

    scene.add(new THREE.AmbientLight(0xffffff, .22));
    const sun = new THREE.DirectionalLight(0xfff4e6, 1.15); sun.position.set(-6, 3, 8); scene.add(sun);
    scene.add(starfield(2600, 160, 120));

    buildSurfaceBody("luna", .6, TEX.moon, moonTexture, .012);
    buildSurfaceBody("marte", .75, TEX.mars, marsTexture, .012);
    buildJupiter(); buildSaturn(); buildSystem();

    for (const key of KEYS){
      const el = document.createElement("button");
      el.type = "button"; el.className = "dest-label";
      el.innerHTML = `<strong>${DESTINOS[key].name}</strong><span>${DESTINOS[key].count}</span>`;
      el.addEventListener("click", () => focusOn(key));
      $("#ex-labels").appendChild(el);
      const anchor = new THREE.Object3D(); scene.add(anchor);
      labels.push({ key, el, anchor });
    }

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.enablePan = false; controls.enabled = false;

    let down = null;
    renderer.domElement.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; });
    renderer.domElement.addEventListener("pointerup", e => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      if (state === "overview"){ const k = pick(e); if (k) focusOn(k); }
    });
    renderer.domElement.addEventListener("pointermove", e => {
      if (state !== "overview") return;
      hovered = pick(e); renderer.domElement.style.cursor = hovered ? "pointer" : "default";
    });
    $("#ex-back").addEventListener("click", () => exitFocus());

    focusVisuals(null);
    layout(true);
    loop();
  }

  function focusVisuals(key){
    for (const k in bodies) bodies[k].group.traverse(o => { if (o.userData.fo) o.visible = k === key; });
  }

  function starfield(n, r0, dr){
    const g = new THREE.BufferGeometry(), pts = [], r = rng(3);
    for (let i = 0; i < n; i++){ const v = V(r() - .5, r() - .5, r() - .5).normalize().multiplyScalar(r0 + r() * dr); pts.push(v.x, v.y, v.z); }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color:0xF3EBDD, size:1.6, sizeAttenuation:false, transparent:true, opacity:.8 }));
  }

  function shell(key, radius){
    const group = new THREE.Group(), tilt = new THREE.Group();
    tilt.rotation.z = -THREE.MathUtils.degToRad(DESTINOS[key].oblicuidad);
    group.add(tilt); scene.add(group);
    return { key, group, tilt, r:radius, base:1 };
  }
  function texturedSphere(radius, url, fallback, bump, tint){
    const mat = new THREE.MeshStandardMaterial({ color:0x777777, roughness:1, metalness:0, bumpScale:bump || 0 });
    loader.load(url, t => { mat.map = prep(t); if (bump) mat.bumpMap = t; mat.color.set(tint || 0xffffff); mat.needsUpdate = true; },
      undefined, () => { if (!fallback) return; const c = fallback(); mat.map = prep(new THREE.CanvasTexture(c)); mat.color.set(0xffffff); mat.needsUpdate = true; });
    return new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), mat);
  }

  function buildSurfaceBody(key, radius, url, fallback, bump){
    const b = shell(key, radius);
    const mesh = texturedSphere(radius, url, fallback, bump);
    mesh.rotation.y = -Math.PI / 2; b.tilt.add(mesh);
    b.mesh = mesh; b.hit = mesh; b.spin = mesh; b.fit = 1; b.dist = 4.4;
    bodies[key] = b;
    (SITIOS[key] || []).forEach(s => {
      const a = new THREE.Object3D(); a.position.copy(latLon(s.lat, s.lon, radius)); mesh.add(a);
      addPin(key, a, s, true);
    });
  }

  function buildJupiter(){
    const R = 1.1, b = shell("jupiter", R);
    const mesh = texturedSphere(R, TEX.jupiter, null, 0); b.tilt.add(mesh);
    b.mesh = mesh; b.hit = mesh; b.spin = mesh; b.fit = 2.6; b.dist = 3.0;
    const k = R;
    const voy = curveLine([V(-3.8,.6,1.8),V(-1.6,.3,2.0),V(.4,.15,2.2),V(2.2,0,1.4),V(4,-.3,-.2)].map(v => v.multiplyScalar(k)), 0xA9AEF5, b.group);
    const cas = curveLine([V(-4.5,1.6,.5),V(-1.5,1.9,2.8),V(1.8,1.7,2.6),V(4.5,1.2,.2)].map(v => v.multiplyScalar(k)), 0xE0B456, b.group);
    const pa = new THREE.Object3D(); pa.position.copy(voy.getPoint(.47)); b.group.add(pa);
    const pc = new THREE.Object3D(); pc.position.copy(cas.getPoint(.62)); b.group.add(pc);
    addPin("jupiter", pa, { m:"voyager", label:"Voyager 1", site:"Sobrevuelo de Júpiter, máximo acercamiento el 5 mar 1979" }, false);
    addPin("jupiter", pc, { m:"cassini", label:"Cassini", site:"Sobrevuelo lejano de Júpiter rumbo a Saturno, dic 2000" }, false);
    bodies.jupiter = b;
  }

  function buildSaturn(){
    const R = .8, b = shell("saturno", R);
    const mesh = texturedSphere(R, TEX.saturn, null, 0, 0xE6DCC6); b.tilt.add(mesh);
    // Anillos A, B y C: de 1.239 a 2.269 radios de Saturno
    const inner = R * 1.239, outer = R * 2.269;
    const rg = new THREE.RingGeometry(inner, outer, 160, 1), pos = rg.attributes.position, uv = rg.attributes.uv;
    for (let i = 0; i < pos.count; i++){ const rr = Math.hypot(pos.getX(i), pos.getY(i)); uv.setXY(i, (rr - inner) / (outer - inner), .5); }
    const ringMat = new THREE.MeshBasicMaterial({ map:prep(new THREE.CanvasTexture(ringTexture())), side:THREE.DoubleSide, transparent:true, depthWrite:false });
    const ring = new THREE.Mesh(rg, ringMat); ring.rotation.x = -Math.PI / 2; b.tilt.add(ring);
    // Titán y Huygens
    const titanOrbit = R * 3.4;
    const tl = []; for (let i = 0; i <= 128; i++){ const t = i / 128 * Math.PI * 2; tl.push(V(Math.cos(t) * titanOrbit, 0, Math.sin(t) * titanOrbit)); }
    const tline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(tl), new THREE.LineBasicMaterial({ color:0x7B86B8, transparent:true, opacity:.45 }));
    tline.userData.fo = true; b.tilt.add(tline);
    const titan = new THREE.Mesh(new THREE.SphereGeometry(.07, 24, 16), new THREE.MeshStandardMaterial({ color:0xD19A4B, roughness:1 }));
    titan.position.set(Math.cos(.9) * titanOrbit, 0, Math.sin(.9) * titanOrbit); b.tilt.add(titan);
    // Órbita de Cassini (esquemática, inclinada) y paso de Voyager 1
    const cpts = []; for (let i = 0; i < 9; i++){ const t = i / 8 * Math.PI * 2; cpts.push(V(Math.cos(t) * R * 2.9 + R * .6, Math.sin(t) * R * .7, Math.sin(t) * R * 2.2)); }
    const cas = curveLine(cpts, 0xE0B456, b.tilt);
    const voy = curveLine([V(-4,1.8,1.5),V(-1.4,.9,2.4),V(1.2,.3,2.3),V(3.8,-.4,.8)].map(v => v.multiplyScalar(R)), 0xA9AEF5, b.group);
    const pc = new THREE.Object3D(); pc.position.copy(cas.getPoint(.18)); b.tilt.add(pc);
    const pv = new THREE.Object3D(); pv.position.copy(voy.getPoint(.33)); b.group.add(pv);
    addPin("saturno", pc, { m:"cassini", label:"Cassini", site:"Órbita de Saturno, 2004 a 2017" }, false);
    addPin("saturno", titan, { m:"cassini", label:"Huygens en Titán", site:"Huygens descendió en Titán el 14 ene 2005" }, false);
    addPin("saturno", pv, { m:"voyager", label:"Voyager 1", site:"Sobrevuelo de Saturno, máximo acercamiento el 12 nov 1980" }, false);
    b.mesh = mesh; b.hit = mesh; b.spin = mesh; b.fit = 2.4; b.dist = 3.0;
    // Objetivo de clic más amplio que incluye los anillos
    const hit = new THREE.Mesh(new THREE.SphereGeometry(outer, 16, 12), new THREE.MeshBasicMaterial({ transparent:true, opacity:0, depthWrite:false }));
    b.tilt.add(hit); b.hit = hit;
    bodies.saturno = b;
  }

  function buildSystem(){
    const b = shell("sistema", 1); b.base = .5;
    const outer = new THREE.Group(); outer.rotation.x = .42; b.group.add(outer);
    const sys = new THREE.Group(); outer.add(sys);
    sys.add(new THREE.Mesh(new THREE.SphereGeometry(.26, 32, 16), new THREE.MeshBasicMaterial({ color:0xFFB547 })));
    sys.add(new THREE.Mesh(new THREE.SphereGeometry(.38, 32, 16), new THREE.MeshBasicMaterial({ color:0xC8601A, transparent:true, opacity:.45, blending:THREE.AdditiveBlending, depthWrite:false })));
    const ringLine = (rad, color, op, dashed) => {
      const p = []; for (let i = 0; i <= 128; i++){ const t = i / 128 * Math.PI * 2; p.push(V(Math.cos(t) * rad, 0, Math.sin(t) * rad)); }
      const geo = new THREE.BufferGeometry().setFromPoints(p);
      const m = dashed ? new THREE.LineDashedMaterial({ color, transparent:true, opacity:op, dashSize:.05, gapSize:.04 }) : new THREE.LineBasicMaterial({ color, transparent:true, opacity:op });
      const l = new THREE.Line(geo, m); if (dashed) l.computeLineDistances(); sys.add(l);
    };
    const planet = (rad, size, color, speed, phase, map) => {
      ringLine(rad, 0x7B86B8, .45);
      const pivot = new THREE.Group(); pivot.rotation.y = phase; sys.add(pivot);
      const mat = new THREE.MeshStandardMaterial({ color, roughness:.9 });
      if (map) loader.load(map, t => { mat.map = prep(t); mat.color.set(0xffffff); mat.needsUpdate = true; });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 16), mat); mesh.position.x = rad; pivot.add(mesh);
      orbiters.push([pivot, speed]); return mesh;
    };
    const earth = planet(.6, .07, 0x4F86C6, .5, 1.2, TEX.earth);
    const mars = planet(.85, .055, 0xC1603A, .27, 2.6, TEX.marsSmall);
    const jupiter = planet(1.25, .16, 0xC9A27E, .08, 4.4, TEX.jupiter);
    const saturn = planet(1.7, .13, 0xD9C08E, .035, .6, TEX.saturn);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.17, .29, 64), new THREE.MeshBasicMaterial({ color:0xD9C69A, side:THREE.DoubleSide, transparent:true, opacity:.75 }));
    ring.rotation.x = Math.PI / 2.3; saturn.add(ring);
    ringLine(1.02, 0x8FBFB2, .5, true);
    const dPivot = new THREE.Group(); dPivot.rotation.y = 3.6; sys.add(dPivot); orbiters.push([dPivot, .2]);
    const didymos = new THREE.Mesh(new THREE.DodecahedronGeometry(.035), new THREE.MeshStandardMaterial({ color:0x9A958C, roughness:1 }));
    didymos.position.x = 1.02; dPivot.add(didymos);
    // Voyager 1 se aleja a 35.55° sobre el plano de la eclíptica (NSSDCA)
    const el = THREE.MathUtils.degToRad(35.55), h = Math.cos(el);
    const vDir = V(h * .76, Math.sin(el), -h * .65).normalize(), vEnd = vDir.clone().multiplyScalar(2.6);
    const vPath = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(.4, 0, .1), vDir.clone().multiplyScalar(1.3), vEnd]),
      new THREE.LineDashedMaterial({ color:0xA9AEF5, dashSize:.06, gapSize:.05, transparent:true, opacity:.8 }));
    vPath.computeLineDistances(); sys.add(vPath);
    const voy = new THREE.Mesh(new THREE.SphereGeometry(.03, 12, 8), new THREE.MeshBasicMaterial({ color:0xE8E9FF })); voy.position.copy(vEnd); sys.add(voy);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 16), new THREE.MeshBasicMaterial({ transparent:true, opacity:0, depthWrite:false }));
    sys.add(hit);
    Object.assign(b, { hit, spin:sys, r:1.3, fit:1.5, dist:2.9 });
    bodies.sistema = b;
    addPin("sistema", didymos, { m:"dart", label:"DART y LICIACube", site:"Asteroide Dimorphos, impacto el 26 sep 2022" }, false);
    addPin("sistema", voy, { m:"voyager", label:"Voyager 1", site:"Espacio interestelar, desde 2012" }, false);
    addPin("sistema", earth, { go:"luna", label:"Tierra: ir a la Luna" }, false);
    addPin("sistema", mars, { go:"marte", label:"Ir a Marte" }, false);
    addPin("sistema", jupiter, { go:"jupiter", label:"Ir a Júpiter" }, false);
    addPin("sistema", saturn, { go:"saturno", label:"Ir a Saturno" }, false);
  }

  function addPin(key, anchor, s, onSurface){
    const el = document.createElement("button");
    el.type = "button"; el.className = "pin" + (s.go ? " alt" : ""); el.hidden = true;
    const mission = s.m && MISSIONS.find(x => x.id === s.m);
    if (mission) el.style.setProperty("--pc", `var(--c-${mission.c})`);
    el.innerHTML = `<i></i><span>${s.label}</span>`;
    el.setAttribute("aria-label", s.go || s.site.startsWith(s.label) ? (s.site || s.label) : `${s.label}, ${s.site}`);
    const pin = { key, el, anchor, onSurface, s, mission };
    el.addEventListener("click", () => {
      if (s.go){ exitFocus(() => focusOn(s.go)); return; }
      pins.forEach(p => p.el.setAttribute("aria-pressed", "false"));
      el.setAttribute("aria-pressed", "true");
      showCard(pin);
    });
    $("#ex-labels").appendChild(el);
    pins.push(pin);
  }

  function pick(e){
    const rect = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    for (const k of KEYS) if (ray.intersectObject(bodies[k].hit, false).length) return k;
    return null;
  }

  // Distribución: fila en pantallas anchas, cuadrícula de 2 columnas en vertical
  const LAYOUTS = {
    wide:  { luna:[-6.7,0,1], marte:[-4.5,0,1], jupiter:[-1.5,0,1], saturno:[2.3,0,1], sistema:[6.1,0,1], half:[8.2,2.2] },
    tall:  { luna:[-1.3,3.5,1.05], marte:[1.3,3.5,1.05], jupiter:[-1.35,.35,.8], saturno:[1.45,.35,.55], sistema:[0,-2.6,1.0], half:[2.7,5.6] }
  };
  const visR = k => ({ luna:.6, marte:.75, jupiter:1.1, saturno:.8, sistema:1.0 })[k];

  function layout(snap){
    const box = stage(), w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (state !== "overview" && !snap) return;
    const tan = Math.tan(THREE.MathUtils.degToRad(20)), tall = camera.aspect < 1, L = tall ? LAYOUTS.tall : LAYOUTS.wide;
    for (const k of KEYS){
      const [x, y, s] = L[k], b = bodies[k];
      b.group.position.set(x, y, 0);
      b.layoutScale = s; b.group.scale.setScalar(s * b.base);
    }
    const d = Math.max(L.half[0] / (tan * camera.aspect), L.half[1] / tan);
    overviewTarget = V(0, tall ? .55 : .15, 0);
    overviewPos = V(0, tall ? .55 : .4, d);
    labels.forEach(l => {
      const [x, y, s] = L[l.key];
      l.anchor.position.set(x, y - visR(l.key) * s * (l.key === "sistema" ? .9 : 1) - (tall ? .32 : .5), 0);
    });
    if (state === "overview"){ camera.position.copy(overviewPos); controls.target.copy(overviewTarget); camera.lookAt(controls.target); }
  }

  function tweenTo(pos, tgt, dur, onHalf, done, fovTo){
    if (reduce) dur = 1;
    const p0 = camera.position.clone(), t0 = controls.target.clone(), f0 = camera.fov, start = performance.now();
    let half = false;
    tween = now => {
      const k = Math.min(1, (now - start) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      camera.position.lerpVectors(p0, pos, e); controls.target.lerpVectors(t0, tgt, e); camera.lookAt(controls.target);
      if (fovTo){ camera.fov = f0 + (fovTo - f0) * e; camera.updateProjectionMatrix(); }
      if (!half && k > .55){ half = true; onHalf && onHalf(); }
      if (k === 1){ tween = null; done && done(); }
    };
  }

  function setHead(focused){
    $("#ex-head-over").hidden = focused; $("#ex-head-focus").hidden = !focused;
    if (!focused) return;
    const d = DESTINOS[focusKey];
    $("#ex-title").textContent = d.name; $("#ex-sub").textContent = d.sub;
    const f = $("#ex-facts");
    if (d.facts){ f.hidden = false; f.innerHTML = d.facts.map(([a, v]) => `<div><dt>${a}</dt><dd>${v}</dd></div>`).join(""); }
    else { f.hidden = true; f.innerHTML = ""; }
  }

  function bodyMetrics(key){
    const b = bodies[key], center = b.group.getWorldPosition(V(0, 0, 0)), worldR = b.r * b.group.scale.x;
    return { b, center, worldR, fitR: worldR * b.fit };
  }

  function focusOn(key){
    if (state !== "overview" || tween) return;
    state = "moving"; focusKey = key; hideCard();
    labels.forEach(l => l.el.hidden = true);
    const { b, center, worldR, fitR } = bodyMetrics(key);
    const tan = Math.tan(THREE.MathUtils.degToRad(20)), asp = Math.min(camera.aspect, 1.4);
    let dir;
    if (key === "luna" || key === "marte"){
      const avg = V(0, 0, 0);
      pins.filter(p => p.key === key).forEach(p => avg.add(p.anchor.getWorldPosition(V(0, 0, 0)).sub(center)));
      dir = avg.normalize(); dir.y += .2; dir.normalize();
    } else dir = ({ jupiter:V(.15,.22,1), saturno:V(.12,.36,1), sistema:V(.12,.5,1) })[key].normalize();
    const dist = Math.max(fitR * b.dist, fitR * 1.25 / (tan * asp));
    const aim = center.clone().add(key === "sistema" ? V(fitR * .15, fitR * .1, 0) : V(0, worldR * .25, 0));
    tweenTo(center.clone().add(dir.multiplyScalar(dist)), aim, 1700,
      () => { for (const k in bodies) bodies[k].group.visible = k === key; focusVisuals(key); },
      () => {
        state = "focus"; setHead(true);
        controls.enabled = true; controls.target.copy(aim);
        controls.minDistance = Math.max(worldR * 1.5, .5); controls.maxDistance = dist * 1.7;
        pins.forEach(p => p.el.hidden = p.key !== key);
      });
  }

  function exitFocus(then){
    if (state !== "focus" || tween) return;
    state = "moving"; hideCard(); setHead(false);
    pins.forEach(p => { p.el.hidden = true; p.el.setAttribute("aria-pressed", "false"); });
    controls.enabled = false;
    for (const k in bodies) bodies[k].group.visible = true;
    focusVisuals(null);
    layout(true); state = "moving";
    tweenTo(overviewPos, overviewTarget.clone(), then ? 900 : 1300, null, () => {
      state = "overview";
      if (then) then(); else labels.forEach(l => l.el.hidden = false);
    });
  }

  function showCard(pin){
    const m = pin.mission, card = $("#ex-card");
    card.style.setProperty("--pc", `var(--c-${m.c})`);
    card.innerHTML = `
      <p class="m-dest"><i></i>${DESTINOS[pin.key].name}</p>
      <h3>${m.name}</h3>
      <p class="site">${pin.s.site}</p>
      <dl><div><dt>Lanzamiento</dt><dd>${m.launchLabel}</dd></div><div><dt>Fin de misión</dt><dd>${m.endLabel}</dd></div></dl>
      <p class="sum">${m.summary.split(". ")[0]}.</p>
      <div class="row"><button type="button" class="btn" id="ex-go">Explorar la misión</button><button type="button" class="btn btn-close" id="ex-close">Cerrar</button></div>`;
    card.hidden = false;
    $("#ex-close").addEventListener("click", () => { hideCard(); pins.forEach(p => p.el.setAttribute("aria-pressed", "false")); });
    $("#ex-go").addEventListener("click", () => dive(pin));
  }
  function hideCard(){ $("#ex-card").hidden = true; }

  // Acercamiento hacia el equipo antes de entrar a su página
  function dive(pin){
    if (state !== "focus" || tween) return;
    state = "diving"; hideCard();
    saved = { pos:camera.position.clone(), tgt:controls.target.clone(), fov:camera.fov };
    pins.forEach(p => p.el.hidden = true);
    controls.enabled = false;
    const { center, worldR } = bodyMetrics(pin.key);
    const wp = pin.anchor.getWorldPosition(V(0, 0, 0));
    const n = wp.clone().sub(center).normalize();
    const end = wp.clone().add(n.multiplyScalar(pin.onSurface ? worldR * .32 : worldR * .5));
    renderer.domElement.classList.add("diving");
    tweenTo(end, wp, 1600, () => warp.on(DESTINOS[pin.key].color), () => {
      setTimeout(() => { location.hash = pin.mission.id; restore(); }, reduce ? 0 : 220);
    }, 24);
  }
  function restore(){
    if (!saved) return;
    camera.position.copy(saved.pos); controls.target.copy(saved.tgt); camera.fov = saved.fov; camera.updateProjectionMatrix(); camera.lookAt(controls.target);
    saved = null; state = "focus"; controls.enabled = true;
    renderer.domElement.classList.remove("diving");
    pins.forEach(p => { p.el.hidden = p.key !== focusKey; p.el.setAttribute("aria-pressed", "false"); });
  }

  function place(el, worldPos, vis0, offset){
    const p = worldPos.clone().project(camera);
    const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
    const vis = vis0 && p.z < 1 && p.x > -1.2 && p.x < 1.2 && p.y > -1.2 && p.y < 1.2;
    el.style.visibility = vis ? "visible" : "hidden";
    if (!vis) return;
    const sx = (p.x * .5 + .5) * w, sy = (-p.y * .5 + .5) * h;
    if (offset === "pin"){
      const flip = sx + el.offsetWidth - 13 > w - 8;
      el.classList.toggle("flip", flip);
      offset = flip ? "translate(calc(-100% + 13px),-50%)" : "translate(-13px,-50%)";
    }
    el.style.transform = `translate(${sx}px,${sy}px) ${offset}`;
  }
  function occluded(wp, center, R){
    const o = camera.position, d = wp.clone().sub(o), len = d.length(); d.divideScalar(len);
    const oc = o.clone().sub(center), b = oc.dot(d), c = oc.lengthSq() - R * R, disc = b * b - c;
    if (disc < 0) return false;
    const t = -b - Math.sqrt(disc);
    return t > 0 && t < len - R * .02;
  }

  function loop(){
    requestAnimationFrame(loop);
    if (stage().hidden) return;
    const box = stage(), size = renderer.getSize(new THREE.Vector2());
    if (size.x !== box.clientWidth || size.y !== box.clientHeight) layout(false);
    const now = performance.now();
    if (!reduce){
      if (state !== "focus" && state !== "diving") orbiters.forEach(([p, s]) => p.rotation.y += s * .01);
      if (state === "overview"){
        bodies.luna.spin.rotation.y += .0018; bodies.marte.spin.rotation.y += .0025;
        bodies.jupiter.spin.rotation.y += .004; bodies.saturno.spin.rotation.y += .0035;
        bodies.sistema.spin.rotation.y += .0012;
        for (const k of KEYS){
          const b = bodies[k], target = b.layoutScale * b.base * (hovered === k ? 1.08 : 1);
          b.group.scale.setScalar(THREE.MathUtils.lerp(b.group.scale.x, target, .12));
        }
      }
    }
    if (tween) tween(now); else if (controls.enabled) controls.update();
    if (state === "overview") labels.forEach(l => { l.el.hidden = false; place(l.el, l.anchor.position, true, "translate(-50%,0)"); });
    pins.forEach(p => {
      if (p.el.hidden) return;
      const wp = p.anchor.getWorldPosition(V(0, 0, 0)), { center, worldR } = bodyMetrics(p.key);
      let facing;
      if (p.onSurface){
        const n = wp.clone().sub(center).normalize(), toCam = camera.position.clone().sub(wp).normalize();
        facing = n.dot(toCam) > .12;
      } else facing = p.key === "sistema" ? true : !occluded(wp, center, worldR);
      place(p.el, wp, facing, "pin");
    });
    renderer.render(scene, camera);
  }

  return { enter(){ if (!inited) init(); } };
})();

/* =========================================================
   PÁGINA INMERSIVA DE INGENUITY (plantilla de referencia)
   ========================================================= */
const PART_NODES = {
  rotores:["rotors_01", "rotors_02"], panel:["solar_panel"], fuselaje:["bus"],
  mastil:["parts_01", "parts_02"], patas:["leg_01", "leg_02", "leg_03", "leg_04"]
};
const inmersiva = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = () => $("#view-inmersiva");
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  let renderer, scene, camera, controls, inited = false, tween = null, mode = "options";
  let pivot = null, modelPos = V(0, 0, 0), modelGoal = V(0, 0, 0), rotors = [], parts = {}, mars, jezero, axisX = V(1, 0, 0), poses;

  function init(){
    inited = true;
    const box = stage();
    if (!window.THREE){ box.insertAdjacentHTML("beforeend", `<div class="ex-fallback"><p>No se pudo cargar la escena 3D. Revisa tu conexión y recarga la página.</p></div>`); return; }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, 1, .02, 500);
    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x0B1028);
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    box.prepend(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff3e6, 0x5a3220, .55));
    const sun = new THREE.DirectionalLight(0xfff1dc, 1.5); sun.position.set(-4, 5, 4); scene.add(sun);
    const rim = new THREE.DirectionalLight(0x9db8ff, .5); rim.position.set(3, 1, -4); scene.add(rim);

    // Estrellas
    const g = new THREE.BufferGeometry(), pts = [], r = rng(17);
    for (let i = 0; i < 1800; i++){ const v = V(r() - .5, Math.abs(r() - .3), r() - .5).normalize().multiplyScalar(120 + r() * 60); pts.push(v.x, v.y, v.z); }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color:0xF3EBDD, size:1.5, sizeAttenuation:false, transparent:true, opacity:.75 })));

    // Marte visto de cerca, con el cráter Jezero hacia arriba
    const loader = new THREE.TextureLoader();
    const mat = new THREE.MeshStandardMaterial({ color:0x8a4a2a, roughness:1, metalness:0, bumpScale:.03 });
    loader.load(TEX.mars, t => { if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); mat.map = t; mat.bumpMap = t; mat.color.set(0xffffff); mat.needsUpdate = true; });
    mars = new THREE.Mesh(new THREE.SphereGeometry(6, 160, 120), mat);
    const local = latLon(18.44, 77.45, 1).normalize();
    mars.quaternion.setFromUnitVectors(local, V(.12, .99, .06).normalize());
    scene.add(mars);
    jezero = new THREE.Object3D(); jezero.position.copy(latLon(18.44, 77.45, 6)); mars.add(jezero);
    const atm = new THREE.Mesh(new THREE.SphereGeometry(6 * 1.045, 96, 64), new THREE.ShaderMaterial({
      uniforms:{ c:{ value:new THREE.Color(0xE9A070) } },
      vertexShader:"varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:"uniform vec3 c; varying vec3 vN; void main(){ float i = pow(max(0.0, 0.72 - dot(vN, vec3(0.0,0.0,1.0))), 2.4); gl_FragColor = vec4(c, 1.0) * i; }",
      side:THREE.BackSide, blending:THREE.AdditiveBlending, transparent:true, depthWrite:false }));
    mars.add(atm);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.enablePan = false; controls.enabled = false;
    controls.minDistance = 1.1; controls.maxDistance = 4.5;

    loadModel();
    bindUI();
    layout();
    loop();
  }

  function loadModel(){
    new THREE.GLTFLoader().load(MODELOS.ingenuity, gltf => {
      const root = gltf.scene;
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root), size = box.getSize(V(0, 0, 0)), c = box.getCenter(V(0, 0, 0));
      const s = 1.55 / Math.max(size.x, size.y, size.z);
      root.scale.setScalar(s); root.position.set(-c.x * s, -box.min.y * s, -c.z * s);
      pivot = new THREE.Group(); pivot.add(root); scene.add(pivot);
      pivot.position.copy(modelPos);
      rotors = ["rotors_01", "rotors_02"].map(n => root.getObjectByName(n)).filter(Boolean);
      const names = new Set(Object.values(PART_NODES).flat());
      const collect = (obj, out) => obj.children.forEach(ch => { if (names.has(ch.name)) return; if (ch.isMesh) out.push(ch); collect(ch, out); });
      for (const [k, list] of Object.entries(PART_NODES)){
        parts[k] = [];
        list.forEach(n => { const o = root.getObjectByName(n); if (!o) return; if (o.isMesh) parts[k].push(o); collect(o, parts[k]); });
        parts[k].forEach(m => { m.material = m.material.clone(); });
      }
      $("#im-loading").hidden = true;
    }, undefined, () => { $("#im-loading").textContent = "No se pudo cargar el modelo 3D. Revisa que exista assets/modelos/ingenuity.glb."; });
  }

  function layout(){
    const box = stage(), w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const tall = camera.aspect < .9;
    poses = tall ? {
      options:{ cam:V(0, 1.0, 6.2), tgt:V(0, .7, 0), model:V(0, 1.3, 0) },
      inspect:{ cam:V(0, 1.25, 4.2), tgt:V(0, .95, 0), model:V(0, 1.0, 0) },
      enter:{ cam:V(0, 3.6, 11), tgt:V(0, .8, 0) }
    } : {
      options:{ cam:V(.95, .7, 4.3), tgt:V(.8, .45, 0), model:V(-.2, .15, 0) },
      inspect:{ cam:V(.6, .75, 2.6), tgt:V(.35, .45, 0), model:V(0, .15, 0) },
      enter:{ cam:V(.9, 3.4, 11), tgt:V(.75, .3, 0) }
    };
    mars.position.set(0, tall ? -6.3 : -6.75, -1.6);
    modelGoal.copy(poses[mode].model);
    if (!tween){ camera.position.copy(poses[mode].cam); controls.target.copy(poses[mode].tgt); camera.lookAt(controls.target); }
  }

  function tweenTo(pose, dur, done){
    if (reduce) dur = 1;
    const p0 = camera.position.clone(), t0 = controls.target.clone(), start = performance.now();
    tween = now => {
      const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3);
      camera.position.lerpVectors(p0, pose.cam, e); controls.target.lerpVectors(t0, pose.tgt, e); camera.lookAt(controls.target);
      if (k === 1){ tween = null; done && done(); }
    };
  }

  function setMode(next){
    mode = next;
    $("#im-options").hidden = next !== "options"; $("#im-inspect").hidden = next !== "inspect";
    stage().classList.toggle("inspecting", next === "inspect");
    $(".im-panel").scrollTop = 0;
    controls.enabled = false;
    modelGoal.copy(poses[next].model);
    tweenTo(poses[next], 1100, () => { if (next === "inspect"){ controls.target.copy(poses.inspect.tgt); controls.enabled = true; } });
    if (next === "options") highlight(null);
    (next === "inspect" ? $("#im-inspect h2") : $("#im-options h1")).focus({ preventScroll:true });
  }

  function highlight(key){
    const glow = new THREE.Color(0xE39A5E), none = new THREE.Color(0);
    for (const [k, list] of Object.entries(parts)) list.forEach(m => { if (!m.material.emissive) return; m.material.emissive.copy(k === key ? glow : none); m.material.emissiveIntensity = k === key ? .55 : 0; });
    document.querySelectorAll("[data-ipart]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ipart === key)));
    const info = $("#im-part-info");
    if (key){ const [t, d] = PART_INFO[key]; info.innerHTML = `<h3>${t}</h3><p>${d}</p>`; }
    else info.innerHTML = `<h3>Elige una pieza</h3><p>Se iluminará en el modelo. Arrastra para girar y usa la rueda o pellizca para acercarte.</p>`;
  }

  function openDialog(kind){
    const m = MISSIONS.find(x => x.id === "ingenuity"), d = $("#im-dialog"), md = m.media || {};
    if (kind === "historia"){
      d.innerHTML = `
        <div class="dlg-head"><h2>Historia: «${m.story.title}»</h2><button type="button" class="dlg-close" aria-label="Cerrar">✕</button></div>
        <div class="screen" id="dlg-video"><div class="screen-msg"><strong>En producción</strong><p>Aquí podrás ver el cortometraje completo, de unos cinco minutos.</p></div></div>
        <ol class="chapters">${m.chapters.map(([n, t]) => `<li><span class="num">${n}</span>${t ? `<span>${t}</span>` : `<span class="pending">Por confirmar</span>`}</li>`).join("")}</ol>
        <div class="dlg-cast">${m.cast.map(c => `<div><h3>${c.name}</h3><p class="role">${c.role}</p><p>${c.desc}</p><blockquote>${c.quote}</blockquote></div>`).join("")}</div>`;
      if (md.video) d.querySelector("#dlg-video").innerHTML = `<video controls preload="metadata" playsinline src="${md.video}"></video>`;
      else if (md.youtube) d.querySelector("#dlg-video").innerHTML = `<iframe src="${md.youtube}" title="Cortometraje" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      d.innerHTML = `
        <div class="dlg-head"><h2>Minijuego: pilota a Ingenuity</h2><button type="button" class="dlg-close" aria-label="Cerrar">✕</button></div>
        <p class="dlg-lede">Despega desde el cráter Jezero, cuida tu batería y aterriza en terreno seguro.</p>
        <div class="screen" id="dlg-game"><div class="screen-msg"><strong>En desarrollo</strong><p>Podrás jugarlo aquí mismo, sin instalar nada.</p>${md.game ? `<button type="button" class="btn" id="dlg-start">Iniciar juego</button>` : ""}</div></div>`;
      if (md.game) d.querySelector("#dlg-start").addEventListener("click", () => { d.querySelector("#dlg-game").innerHTML = `<iframe src="${md.game}" title="Minijuego de Ingenuity" allow="fullscreen; autoplay" allowfullscreen></iframe>`; });
    }
    d.querySelector(".dlg-close").addEventListener("click", () => d.close());
    d.showModal();
  }

  function bindUI(){
    $("#im-opt-historia").addEventListener("click", () => openDialog("historia"));
    $("#im-opt-juego").addEventListener("click", () => openDialog("juego"));
    $("#im-opt-3d").addEventListener("click", () => setMode("inspect"));
    $("#im-back-options").addEventListener("click", () => setMode("options"));
    document.querySelectorAll("[data-ipart]").forEach(b => b.addEventListener("click", () => highlight(b.getAttribute("aria-pressed") === "true" ? null : b.dataset.ipart)));
    const d = $("#im-dialog");
    d.addEventListener("click", e => { if (e.target === d) d.close(); });
    d.addEventListener("close", () => { d.innerHTML = ""; });
  }

  function loop(){
    requestAnimationFrame(loop);
    if (stage().hidden) return;
    const box = stage(), size = renderer.getSize(new THREE.Vector2());
    if (size.x !== box.clientWidth || size.y !== box.clientHeight) layout();
    const now = performance.now(), dt = Math.min(.1, (now - (loop.last || now)) / 1000); loop.last = now;
    if (tween) tween(now); else if (controls.enabled) controls.update();
    if (pivot){
      modelPos.lerp(modelGoal, 1 - Math.exp(-dt * 3.2));
      const bob = reduce || mode === "inspect" ? 0 : Math.sin(now / 900) * .05;
      pivot.position.set(modelPos.x, modelPos.y + bob, modelPos.z);
      if (!reduce && mode === "options"){
        pivot.rotation.y += .0035;
        rotors.forEach((r, i) => r.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axisX, i ? -.32 : .32)));
      }
    }
    // Etiqueta de Jezero
    const lbl = $("#im-jezero"), wp = jezero.getWorldPosition(V(0, 0, 0)), p = wp.clone().project(camera);
    const n = wp.clone().sub(mars.position).normalize(), facing = n.dot(camera.position.clone().sub(wp).normalize()) > .1;
    const vis = facing && p.z < 1 && Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && mode === "options";
    lbl.style.visibility = vis ? "visible" : "hidden";
    if (vis) lbl.style.transform = `translate(${(p.x * .5 + .5) * box.clientWidth}px,${(-p.y * .5 + .5) * box.clientHeight}px) translate(-13px,-50%)`;
    renderer.render(scene, camera);
  }

  return {
    enter(){
      const first = !inited;
      if (first) init();
      if (!renderer) return;
      if (mode !== "options") setMode("options");
      layout();
      // Descenso de entrada: desde la órbita hasta la vista del equipo
      camera.position.copy(poses.enter.cam); controls.target.copy(poses.enter.tgt); camera.lookAt(controls.target);
      modelPos.copy(poses.options.model).add(V(0, 1.6, 0));
      tweenTo(poses.options, reduce ? 1 : 2300);
      setTimeout(() => warp.off(), first ? 250 : 120);
    }
  };
})();

/* ---------- Navegación ---------- */
function route(){
  const h = location.hash.slice(1);
  const mission = MISSIONS.find(m => m.id === h);
  const immersive = mission && mission.id === "ingenuity";
  const name = immersive ? "inmersiva" : mission ? "mision" : (["misiones", "explorar", "creditos"].includes(h) ? h : "inicio");
  for (const v of ["inicio", "explorar", "misiones", "mision", "inmersiva", "creditos"]) $("#view-" + v).hidden = name !== v;
  $("#site-header").hidden = name === "inicio";
  $("#site-footer").hidden = ["inicio", "explorar", "inmersiva"].includes(name);
  document.body.classList.toggle("on-intro", name === "inicio");
  const d = $("#im-dialog"); if (d.open) d.close();
  if (name === "explorar") explore.enter();
  if (immersive){ inmersiva.enter(); document.title = "Ingenuity | Mission Relics"; }
  else if (mission){ renderMission(mission); document.title = `${mission.name} | Mission Relics`; }
  else document.title = { misiones:"Cronología | Mission Relics", explorar:"Explorar | Mission Relics", creditos:"Créditos | Mission Relics" }[name] || "Mission Relics";
  if (!immersive) setTimeout(() => warp.off(), 120);
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
route();
