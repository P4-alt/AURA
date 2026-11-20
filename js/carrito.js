// ===== E-COMMERCE BÁSICO (de prueba: no se piden datos) =====
const CLAVE_CARRITO = "aura-carrito";

const botonAbrir  = document.querySelector(".pedido-abrir");
const carrito     = document.getElementById("carrito");
const modalCompra = document.getElementById("compra");

if (botonAbrir && carrito && modalCompra) {
  const productos    = [...document.querySelectorAll(".producto")];
  const botonAgregar = document.getElementById("btn-agregar");
  const botonPagar   = document.getElementById("btn-pagar");
  const contador     = document.getElementById("contador");
  const total        = document.getElementById("total");

  // Precio de cada producto, tomado del HTML (data-precio)
  const precios = {};
  productos.forEach((p) => { precios[p.dataset.id] = Number(p.dataset.precio); });

  let elegido = null;              // producto seleccionado (todavía no agregado)
  let items = leerCarrito();       // lo que hay en el carrito: { id: cantidad }
  let temporizador;                // para cerrar solo "Compra exitosa"

  // --- Guardar y leer el carrito en el navegador ---
  function leerCarrito() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
      const esObjeto = datos && typeof datos === "object" && !Array.isArray(datos);
      return esObjeto ? datos : {};
    } catch {
      return {};
    }
  }

  function guardarCarrito() {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    } catch {
      // Si el navegador bloquea el almacenamiento, el carrito sigue funcionando
    }
  }

  // --- Cuentas ---
  function cantidadTotal() {
    return Object.keys(precios).reduce((suma, id) => suma + (items[id] || 0), 0);
  }

  function precioTotal() {
    return Object.keys(precios).reduce((suma, id) => suma + (items[id] || 0) * precios[id], 0);
  }

  // --- Actualiza el "+ N", el Total y el estado de los botones ---
  function actualizar() {
    const cantidad = cantidadTotal();
    contador.textContent = cantidad;
    total.textContent = precioTotal();
    botonAgregar.disabled = elegido === null;   // primero hay que elegir un producto
    botonPagar.disabled = cantidad === 0;       // sin productos no se puede pagar
  }

  // Marca un producto como elegido (o ninguno si se pasa null)
  function elegir(id) {
    elegido = id;
    productos.forEach((p) => {
      const activo = p.dataset.id === id;
      p.classList.toggle("seleccionado", activo);
      p.setAttribute("aria-pressed", String(activo));
    });
    actualizar();
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

  // Clic en un producto: queda elegido
  productos.forEach((p) => {
    p.addEventListener("click", () => elegir(p.dataset.id));
  });

  // "Agregar al Carrito": suma 1 unidad del producto elegido
  botonAgregar.addEventListener("click", () => {
    if (elegido === null) return;
    items[elegido] = (items[elegido] || 0) + 1;
    guardarCarrito();
    actualizar();
  });

  // "PAGAR": vacía el carrito, cierra el panel y muestra "Compra exitosa"
  botonPagar.addEventListener("click", () => {
    if (cantidadTotal() === 0) return;
    items = {};
    guardarCarrito();
    elegir(null);                  // quita la selección y actualiza
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
