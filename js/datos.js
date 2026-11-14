/* =========================================================
   MISSION RELICS: CONTENIDO Y RUTAS DE ARCHIVOS
   Aquí se edita el contenido sin tocar la lógica (js/app.js).
   ========================================================= */

/* Texturas de NASA (dominio público). Ver la sección Créditos.
   Para mayor resolución, reemplaza el archivo con el mismo nombre
   (por ejemplo, el mapa LROC de 4K del CGI Moon Kit en luna.jpg). */
const TEX = {
  moon:"assets/texturas/luna.jpg",
  mars:"assets/texturas/marte.jpg",
  marsSmall:"assets/texturas/marte-mini.jpg",
  earth:"assets/texturas/tierra.jpg",
  jupiter:"assets/texturas/jupiter.jpg",
  saturn:"assets/texturas/saturno.jpg"
};

/* Modelos 3D oficiales (NASA 3D Resources, NASA/JPL-Caltech). */
const MODELOS = {
  ingenuity:"assets/modelos/ingenuity.glb"
};

/* =========================================================
   DATOS DE LAS MISIONES
   Para agregar contenido a una misión, llena su bloque "media":
     youtube: "https://www.youtube-nocookie.com/embed/ID"  (recomendado para el corto)
     video:   "videos/ingenuity.mp4"  (solo si es ligero; el hosting admite 40 MB por subida)
     game:    "juegos/ingenuity/index.html"  (build WebGL de Unity)
     model:   "assets/modelos/archivo.glb"
   ========================================================= */
const MISSIONS = [
  { id:"lrv", name:"Rover lunar", full:"Lunar Roving Vehicle", dest:"La Luna", c:"luna",
    launch:"1971-07-26", launchLabel:"26 jul 1971", launchNote:"con el Apolo 15",
    end:"1972-12-14", endLabel:"14 dic 1972", endNote:"último recorrido, Apolo 17",
    story:null, status:"Historia por desarrollar",
    summary:"Un auto eléctrico plegable que viajó a la Luna en las misiones Apolo 15, 16 y 17. Permitió a los astronautas alejarse kilómetros del módulo lunar y recoger muestras de lugares que a pie eran inalcanzables.",
    facts:[["3","rovers usados en la Luna"],["≈90 km","recorridos entre los tres"],["210 kg","de peso en la Tierra"]],
    media:{} },
  { id:"voyager", name:"Voyager 1", full:"Voyager 1", dest:"Espacio interestelar", c:"espacio",
    launch:"1977-09-05", launchLabel:"5 sep 1977", launchNote:"",
    end:null, endLabel:"Sigue activa", endNote:"llega a un día luz de la Tierra el 18 nov 2026",
    story:null, status:"Historia por desarrollar",
    summary:"Lanzada para visitar Júpiter y Saturno, nunca dejó de alejarse. En 2012 cruzó la heliopausa y se convirtió en el primer objeto humano en el espacio interestelar. Hoy es la nave en funcionamiento más lejana de la Tierra.",
    facts:[["721.9 kg","masa al lanzamiento"],["5 mar 1979","máximo acercamiento a Júpiter"],["12 nov 1980","máximo acercamiento a Saturno"],["2012","cruza la heliopausa"]],
    media:{} },
  { id:"sojourner", name:"Sojourner", full:"Sojourner (Mars Pathfinder)", dest:"Marte", c:"marte",
    launch:"1996-12-04", launchLabel:"4 dic 1996", launchNote:"con Mars Pathfinder",
    end:"1997-09-27", endLabel:"27 sep 1997", endNote:"última comunicación",
    story:null, status:"Historia por desarrollar",
    summary:"Viajó con la misión Mars Pathfinder y fue el primer vehículo con ruedas en recorrer Marte. Pesaba poco más de 10 kg, analizó las rocas alrededor de su módulo y funcionó muchas veces más de lo previsto.",
    facts:[["10.6 kg","de peso"],["7 soles","de misión planeada"],["≈12×","su vida prevista"]],
    media:{} },
  { id:"cassini", name:"Cassini y Huygens", full:"Cassini-Huygens", dest:"Saturno y Titán", c:"saturno",
    launch:"1997-10-15", launchLabel:"15 oct 1997", launchNote:"",
    end:"2017-09-15", endLabel:"15 sep 2017", endNote:"Cassini se sumerge en Saturno",
    story:null, status:"Historia por desarrollar",
    summary:"Cassini orbitó Saturno durante 13 años y llevó consigo a la sonda europea Huygens, que descendió en Titán: el aterrizaje más lejano jamás logrado. Cassini terminó su misión lanzándose a la atmósfera del planeta.",
    facts:[["13 años","orbitando Saturno"],["294","órbitas completadas"],["2005","Huygens aterriza en Titán"]],
    media:{} },
  { id:"opportunity", name:"Opportunity", full:"Opportunity (MER-B)", dest:"Marte", c:"marte",
    launch:"2003-07-08", launchLabel:"8 jul 2003", launchNote:"",
    end:"2018-06-10", endLabel:"10 jun 2018", endNote:"última señal; fin declarado el 13 feb 2019",
    story:{ title:null, theme:"«Me dieron 90 días»" }, status:"Guion en preparación",
    summary:"Un rover diseñado para 90 soles que recorrió más de 45 km en Marte. Dejó de comunicarse en junio de 2018, en medio de una tormenta de polvo que cubrió todo el planeta.",
    facts:[["90 soles","de misión planeada"],["≈45 km","recorridos"],["+14 años","de operación"]],
    media:{} },
  { id:"ingenuity", name:"Ingenuity", full:"Ingenuity Mars Helicopter", dest:"Marte, cráter Jezero", c:"marte", pilot:true,
    launch:"2020-07-30", launchLabel:"30 jul 2020", launchNote:"a bordo de Perseverance",
    end:"2024-01-25", endLabel:"25 ene 2024", endNote:"fin anunciado; último vuelo el 18 ene 2024",
    story:{ title:"Mañana volveré a volar", sub:"INGENUITY — 72 VUELOS — 2021–2024" }, status:"Proyecto piloto, en producción", live:true,
    summary:"Viajó bajo el vientre de Perseverance y el 19 de abril de 2021 hizo el primer vuelo motorizado en otro planeta. Tenía planeados cinco vuelos de prueba; voló 72 veces, hasta que un aterrizaje dañó sus rotores en enero de 2024.",
    cast:[
      { name:"Ginny", role:"Ingenuity, helicóptero experimental", desc:"Curiosa, entusiasta y un poco ingenua al principio. Habla sin parar, se cae y vuelve a intentarlo.", quote:"«Mañana volveré a volar»." },
      { name:"Grandote", role:"Perseverance, rover científico", desc:"Serio, metódico y de pocas palabras. Responde como un manual técnico, pero nunca pierde de vista a Ginny.", quote:"«Negativo»." }
    ],
    chapters:[["I","El primer vuelo"],["II","Una misión más grande"],["III","Las dificultades"],["IV","Más allá de los límites"],["V",null],["Ep.",null]],
    facts:[["1.8 kg","masa"],["72","vuelos en casi 3 años"],["≈3,000 rpm","giro de los rotores"],["+2 h","tiempo total de vuelo"],["39.1 s","duró el primer vuelo, a 3 m de altura"]],
    procedural:"ingenuity",
    media:{ video:"", youtube:"", game:"", model:"" } },
  { id:"dart", name:"DART y LICIACube", full:"DART y LICIACube", dest:"Asteroide Dimorphos", c:"asteroide",
    launch:"2021-11-24", launchLabel:"24 nov 2021", launchNote:"",
    end:"2022-09-26", endLabel:"26 sep 2022", endNote:"impacto con Dimorphos",
    story:null, status:"Historia por desarrollar",
    summary:"La primera prueba de defensa planetaria: DART chocó a propósito contra el pequeño asteroide Dimorphos para cambiar su órbita. El cubesat italiano LICIACube se separó días antes para fotografiar el impacto.",
    facts:[["≈6 km/s","velocidad de impacto"],["32 min","más corta quedó la órbita de Dimorphos"],["2","naves: DART y LICIACube"]],
    media:{} }
];


/* =========================================================
   PÁGINAS INMERSIVAS DE CADA MISIÓN
   cuerpo: "marte" | "luna" | "saturno" | "espacio" | "asteroide"
   modelo.url: modelo oficial (.glb)  |  modelo.proc: modelo esquemático provisional
   modelo.partes: piezas del modelo que se iluminan (nombres de nodos)
   componentes: lo que se explica en "Modelo 3D interactivo"
   ========================================================= */
const INMERSIVA = {
  lrv: {
    cuerpo:"luna", sitio:{ lat:26.13, lon:3.63, label:"Hadley-Apenino, Apolo 15" }, lugar:"La Luna, Hadley-Apenino",
    modelo:{ proc:"lrv", fit:1.7 },
    credito:"Modelo esquemático provisional hecho para esta plataforma; NASA 3D Resources aún no publica el rover lunar.",
    src:"Fechas: NASA NSSDCA, Chronology of Lunar and Planetary Exploration.",
    juego:"Conduce el rover por el valle de Hadley sin volcar en los cráteres y vuelve al módulo lunar a tiempo.",
    componentes:[
      { id:"ruedas", t:"Ruedas de malla", d:"Cuatro ruedas de malla de alambre de acero, sin aire, cada una con su propio motor eléctrico." },
      { id:"antena", t:"Antena de alta ganancia", d:"Antena en forma de sombrilla que enviaba voz y televisión en vivo a la Tierra." },
      { id:"controles", t:"Asientos y control", d:"Dos asientos y un control en forma de T entre ellos: con una sola mano se aceleraba, frenaba y giraba." },
      { id:"chasis", t:"Chasis plegable", d:"Viajó doblado en un costado del módulo lunar; los astronautas lo desplegaban tirando de unas cintas." }
    ]
  },
  voyager: {
    cuerpo:"espacio", lugar:"Espacio interestelar",
    modelo:{ url:"assets/modelos/voyager.glb", fit:2.3, centrar:true, rot:[0, 0, -.9] },
    credito:"Modelo oficial: NASA/JPL-Caltech (NASA 3D Resources).",
    src:"Datos: NASA NSSDCA Master Catalog, Voyager 1 (COSPAR 1977-084A).",
    juego:"Orienta la antena hacia la Tierra y decide qué instrumentos apagar para que la energía alcance.",
    componentes:[
      { id:"antena", t:"Antena de alta ganancia", d:"Mide 3.66 m de diámetro; con ella Voyager 1 sigue enviando datos a la Tierra." },
      { id:"brazo", t:"Brazo científico", d:"Se extiende unos 2.5 m y termina en una plataforma orientable con cámaras y espectrómetros." },
      { id:"magnetometro", t:"Magnetómetros", d:"Van en un brazo de 13 m, lejos del ruido magnético de la propia nave." },
      { id:"rtg", t:"Generadores RTG", d:"Tres generadores de plutonio-238 que daban unos 470 W al lanzamiento; cada año producen menos." },
      { id:"disco", t:"Disco de Oro", d:"Sonidos e imágenes de la Tierra, con saludos en 55 idiomas, para quien algún día lo encuentre." }
    ]
  },
  sojourner: {
    cuerpo:"marte", sitio:{ lat:19.13, lon:-33.22, label:"Ares Vallis" }, lugar:"Marte, Ares Vallis",
    modelo:{ proc:"sojourner", fit:1.35 },
    credito:"Modelo esquemático provisional hecho para esta plataforma; NASA 3D Resources aún no publica a Sojourner.",
    src:"Fechas: NASA NSSDCA, Chronology of Mars Exploration.",
    juego:"Guía a Sojourner de roca en roca cerca del módulo Pathfinder, con órdenes que tardan minutos en llegar.",
    componentes:[
      { id:"panel", t:"Panel solar", d:"Cubre la parte superior y era su principal fuente de energía durante el día." },
      { id:"ruedas", t:"Ruedas rocker-bogie", d:"Seis ruedas con la suspensión que después usaron Spirit, Opportunity, Curiosity y Perseverance." },
      { id:"cuerpo", t:"Caja caliente", d:"Protegía la computadora y las baterías del frío de las noches marcianas." },
      { id:"apxs", t:"Espectrómetro APXS", d:"Se apoyaba sobre las rocas para medir de qué elementos estaban hechas." },
      { id:"antena", t:"Antena", d:"Se comunicaba con el módulo Pathfinder, que a su vez hablaba con la Tierra." }
    ]
  },
  cassini: {
    cuerpo:"saturno", lugar:"Órbita de Saturno",
    modelo:{ url:"assets/modelos/cassini.glb", fit:1.9, centrar:true, partes:{ antena:["dish"], huygens:["foil_gold_h", "tex_01_h"] } },
    credito:"Modelo oficial: NASA/JPL-Caltech (NASA 3D Resources).",
    src:"Lanzamiento: NASA NSSDCA, Chronology of Lunar and Planetary Exploration.",
    juego:"Atraviesa el hueco entre Saturno y sus anillos en el Gran Final sin perder el contacto con la Tierra.",
    componentes:[
      { id:"antena", t:"Antena de alta ganancia", d:"Comunicaba con la Tierra y también servía como radar para ver a través de las nubes de Titán." },
      { id:"huygens", t:"Sonda Huygens", d:"Construida por la Agencia Espacial Europea; viajó acoplada al costado y descendió en Titán el 14 ene 2005." },
      { id:"cuerpo", t:"Mantas térmicas", d:"Las capas doradas protegían los instrumentos del frío y la radiación." },
      { id:"rtg", t:"Generadores RTG", d:"Tan lejos del Sol, los paneles solares no habrían bastado; usaba tres generadores de radioisótopos." }
    ]
  },
  opportunity: {
    cuerpo:"marte", sitio:{ lat:-1.95, lon:-5.53, label:"Meridiani Planum" }, lugar:"Marte, Meridiani Planum",
    modelo:{ url:"assets/modelos/opportunity.glb", fit:1.5 },
    credito:"Modelo oficial: NASA/JPL-Caltech (NASA 3D Resources).",
    src:"Lanzamiento: NASA NSSDCA, Chronology of Mars Exploration (MER-B, 2003-032A).",
    juego:"Administra la energía de los paneles y busca un lugar seguro antes de que llegue la tormenta de polvo.",
    componentes:[
      { id:"paneles", t:"Paneles solares", d:"En forma de alas; a veces el viento marciano los limpiaba de polvo y le devolvía energía." },
      { id:"mastil", t:"Mástil Pancam", d:"Cámaras panorámicas a la altura de los ojos de una persona." },
      { id:"brazo", t:"Brazo robótico", d:"Llevaba un microscopio, espectrómetros y una herramienta para raspar rocas." },
      { id:"ruedas", t:"Ruedas rocker-bogie", d:"Seis ruedas con las que recorrió más de 45 km." }
    ]
  },
  ingenuity: {
    cuerpo:"marte", sitio:{ lat:18.44, lon:77.45, label:"Cráter Jezero" }, lugar:"Marte, cráter Jezero",
    modelo:{ url:"assets/modelos/ingenuity.glb", fit:1.55,
      partes:{ rotores:["rotors_01", "rotors_02"], panel:["solar_panel"], fuselaje:["bus"], mastil:["parts_01", "parts_02"], patas:["leg_01", "leg_02", "leg_03", "leg_04"] },
      giro:[["rotors_01", .32], ["rotors_02", -.32]] },
    credito:"Modelo oficial: NASA/JPL-Caltech (NASA 3D Resources).",
    src:"Datos: NASA NSSDCA Master Catalog, Mars 2020 (COSPAR 2020-052A).",
    juego:"Despega desde el cráter Jezero, cuida tu batería y aterriza en terreno seguro.",
    componentes:[
      { id:"rotores", t:"Rotores coaxiales", d:"Dos rotores que giran en sentidos opuestos a casi 3,000 rpm, necesarias en la atmósfera tenue de Marte." },
      { id:"panel", t:"Panel solar", d:"Montado sobre los rotores, carga las baterías de iones de litio del vuelo y la calefacción nocturna." },
      { id:"fuselaje", t:"Fuselaje", d:"Guarda las baterías, las computadoras y el sistema que lo calienta durante las noches marcianas." },
      { id:"mastil", t:"Mástil", d:"El eje central que une el fuselaje con los rotores y sostiene el panel solar." },
      { id:"patas", t:"Patas", d:"Cuatro patas de aterrizaje que lo sostienen sobre el suelo de Jezero." }
    ]
  },
  dart: {
    cuerpo:"asteroide", lugar:"Sistema Didymos y Dimorphos",
    modelo:{ proc:"dart", fit:2.6, centrar:true, rot:[.35, 1.2, .2] },
    credito:"Modelo esquemático provisional hecho para esta plataforma; NASA 3D Resources aún no publica a DART.",
    src:"Lanzamiento: NASA NSSDCA, Chronology of Lunar and Planetary Exploration (2021-110A).",
    juego:"Guía a DART de forma autónoma hasta Dimorphos y acierta el impacto mientras LICIACube toma las fotos.",
    componentes:[
      { id:"paneles", t:"Paneles solares ROSA", d:"Viajaron enrollados y se desplegaron en el espacio como dos alfombras." },
      { id:"camara", t:"Cámara DRACO", d:"Su única cámara: guió la nave por sí sola hasta el impacto." },
      { id:"cuerpo", t:"Cuerpo y propulsor", d:"Probó el propulsor iónico NEXT-C, que funciona con electricidad de los paneles." },
      { id:"antena", t:"Antena plana", d:"Antena de alta ganancia para comunicarse con la Tierra." },
      { id:"liciacube", t:"LICIACube", d:"Cubesat de la Agencia Espacial Italiana que se separó días antes para fotografiar el choque." }
    ]
  }
};
