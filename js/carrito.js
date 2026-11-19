// ===== E-COMMERCE BÁSICO (de prueba: no se piden datos) =====
const CLAVE_CARRITO = "aura-carrito";

const botonAbrir  = document.querySelector(".pedido-abrir");
const carrito     = document.getElementById("carrito");
const modalCompra = document.getElementById("compra");

if (botonAbrir && carrito && modalCompra) {
  const botonAgregar = document.getElementById("btn-agregar");
  const botonPagar   = document.getElementById("btn-pagar");
  const contador     = document.getElementById("contador");

  let cantidad = leerCantidad();   // productos en el carrito
  let temporizador;                // para cerrar solo "Compra exitosa"

  // --- Guardar y leer la cantidad en el navegador ---
  function leerCantidad() {
    try {
      return parseInt(localStorage.getItem(CLAVE_CARRITO), 10) || 0;
    } catch {
      return 0;
    }
  }

  function guardarCantidad() {
    try {
      localStorage.setItem(CLAVE_CARRITO, String(cantidad));
    } catch {
      // Si el navegador bloquea el almacenamiento, el carrito sigue funcionando
    }
  }

  // --- Actualiza el número "+ 0" y el botón PAGAR ---
  function actualizar() {
    contador.textContent = cantidad;
    botonPagar.disabled = cantidad === 0;   // sin productos no se puede pagar
  }

  // Bloquea el scroll de la página mientras haya una ventana abierta
  function actualizarScroll() {
    const hayVentana =
      carrito.classList.contains("abierto") ||
      modalCompra.classList.contains("visible");
    document.body.style.overflow = hayVentana ? "hidden" : "";
  }

  // --- Panel del carrito ---
  function abrirCarrito() {
    carrito.classList.add("abierto");
    actualizarScroll();
  }

  function cerrarCarrito() {
    carrito.classList.remove("abierto");
    actualizarScroll();
  }

  // --- Ventana "Compra exitosa" ---
  function mostrarCompra() {
    modalCompra.classList.add("visible");
    actualizarScroll();
    clearTimeout(temporizador);
    temporizador = setTimeout(cerrarCompra, 3000);   // se cierra sola a los 3 s
  }

  function cerrarCompra() {
    clearTimeout(temporizador);
    modalCompra.classList.remove("visible");
    actualizarScroll();
  }

  // --- Eventos ---
  botonAbrir.addEventListener("click", abrirCarrito);

  // Todo lo que tenga data-cerrar (la ✕ y la mitad izquierda) cierra el panel
  carrito.querySelectorAll("[data-cerrar]").forEach((el) => {
    el.addEventListener("click", cerrarCarrito);
  });

  // "Agregar al Carrito": suma 1 al contador
  botonAgregar.addEventListener("click", () => {
    cantidad++;
    guardarCantidad();
    actualizar();
  });

  // "PAGAR": vacía el carrito, cierra el panel y muestra "Compra exitosa"
  botonPagar.addEventListener("click", () => {
    if (cantidad === 0) return;
    cantidad = 0;
    guardarCantidad();
    actualizar();
    cerrarCarrito();
    mostrarCompra();
  });

  // Clic en "Compra exitosa" o tecla Esc: cierra
  modalCompra.addEventListener("click", cerrarCompra);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarCompra();
      cerrarCarrito();
    }
  });

  actualizar();
}
