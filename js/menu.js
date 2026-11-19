// ===== MENÚ HAMBURGUESA (solo se ve en celular) =====
const encabezado = document.querySelector(".header");
const botonMenu  = document.querySelector(".hamburguesa");

if (encabezado && botonMenu) {

  // alternarMenu() abre o cierra; alternarMenu(false) fuerza el cierre
  function alternarMenu(abrir) {
    const abierto = abrir === undefined
      ? !encabezado.classList.contains("menu-abierto")
      : abrir;

    encabezado.classList.toggle("menu-abierto", abierto);
    botonMenu.setAttribute("aria-expanded", String(abierto));
    botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  }

  botonMenu.addEventListener("click", () => alternarMenu());

  // Se cierra con Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") alternarMenu(false);
  });

  // Se cierra al tocar fuera del encabezado
  document.addEventListener("click", (e) => {
    if (!encabezado.contains(e.target)) alternarMenu(false);
  });

  // Si la ventana pasa a tamaño de computador, el menú se reinicia
  window.matchMedia("(min-width: 769px)").addEventListener("change", () => alternarMenu(false));
}
