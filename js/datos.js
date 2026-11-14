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

