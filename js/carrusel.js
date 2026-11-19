// ===== CARRUSEL DE TAPAS =====
const carrusel = document.querySelector(".carrusel");
const pista    = document.querySelector(".pista");
const slides   = document.querySelectorAll(".slide");

let actual = Math.floor(slides.length / 2);   // empieza en la del centro

function mostrar(indice) {
  // Evita salirse de la lista
  actual = Math.max(0, Math.min(slides.length - 1, indice));

  // Asigna una clase según la distancia a la tapa activa
  slides.forEach((slide, n) => {
    const distancia = Math.abs(n - actual);
    slide.classList.toggle("activa",  distancia === 0);
    slide.classList.toggle("cercana", distancia === 1);
    slide.classList.toggle("lejana",  distancia >= 2);
  });

  // Mueve la pista para dejar la tapa activa en el centro de la pantalla
  const slide  = slides[actual];
  const centro = slide.offsetLeft + slide.offsetWidth / 2;
  pista.style.transform = `translateX(${carrusel.clientWidth / 2 - centro}px)`;
}

// Clic en una tapa: pasa al centro
slides.forEach((slide, n) => {
  slide.addEventListener("click", () => mostrar(n));
});

// Flechas del teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") mostrar(actual + 1);
  if (e.key === "ArrowLeft")  mostrar(actual - 1);
});

// Deslizar con el dedo (celular): izquierda = siguiente, derecha = anterior
let inicioX = null;

carrusel.addEventListener("touchstart", (e) => {
  inicioX = e.touches[0].clientX;
}, { passive: true });

carrusel.addEventListener("touchend", (e) => {
  if (inicioX === null) return;
  const diferencia = e.changedTouches[0].clientX - inicioX;
  if (Math.abs(diferencia) > 40) {            // ignora toques cortos
    mostrar(actual + (diferencia < 0 ? 1 : -1));
  }
  inicioX = null;
});

// Recalcula si cambia el tamaño de la ventana
window.addEventListener("resize", () => mostrar(actual));


// ===== CALIFICACIÓN CON ESTRELLAS (se guarda en el navegador) =====
// Una clave distinta por página (según <body data-pagina="...">),
// para que las calificaciones de Tapas, Cafés y Cocteles no se mezclen
const CLAVE = "aura-calificaciones-" + (document.body.dataset.pagina || "tapas");

// Lee lo guardado: un objeto como { "tapa-1": 4, "tapa-3": 5 }
function leerCalificaciones() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || {};
  } catch {
    return {};
  }
}

function guardarCalificaciones(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // Si el navegador bloquea el almacenamiento, la página sigue funcionando
  }
}

// Rellena las primeras "cantidad" estrellas
function pintar(estrellas, cantidad) {
  estrellas.forEach((x, j) => x.classList.toggle("llena", j < cantidad));
}

const calificaciones = leerCalificaciones();

slides.forEach((slide) => {
  const grupo = slide.querySelector(".estrellas");
  const id = slide.dataset.id;               // ej. "tapa-3"

  // Crea 5 botones-estrella dentro de cada grupo
  for (let i = 1; i <= 5; i++) {
    const estrella = document.createElement("button");
    estrella.type = "button";
    estrella.setAttribute("aria-label", `${i} estrella${i > 1 ? "s" : ""}`);
    grupo.appendChild(estrella);
  }

  const estrellas = grupo.querySelectorAll("button");

  // Al cargar la página, muestra la calificación guardada (si existe)
  pintar(estrellas, calificaciones[id] || 0);

  estrellas.forEach((estrella, i) => {
    estrella.addEventListener("click", (e) => {
      e.stopPropagation();                   // no mover el carrusel
      calificaciones[id] = i + 1;
      pintar(estrellas, i + 1);
      guardarCalificaciones(calificaciones);
    });
  });
});

mostrar(actual);
