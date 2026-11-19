// ===== RESPALDO DE IMÁGENES DE CELULAR =====
// Si una imagen de celular (-cel) no existe, se usa la de computador
function usarImagenOriginal(img) {
  const picture = img.closest("picture");
  if (!picture) return;

  const fuentes = picture.querySelectorAll("source");
  if (fuentes.length === 0) return;      // ya está usando la original

  fuentes.forEach((fuente) => fuente.remove());
  img.src = img.getAttribute("src");     // vuelve a cargar la original
}

document.querySelectorAll("picture img").forEach((img) => {
  img.addEventListener("error", () => usarImagenOriginal(img));

  // Por si el error ocurrió antes de que este script se ejecutara
  if (img.complete && img.naturalWidth === 0) usarImagenOriginal(img);
});
