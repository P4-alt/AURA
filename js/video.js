const cajaVideo = document.querySelector(".video-reserva");

if (cajaVideo) {
  const video = cajaVideo.querySelector("video");
  const boton = cajaVideo.querySelector(".btn-play");

  boton.addEventListener("click", () => video.play());

  video.addEventListener("play", () => {
    cajaVideo.classList.add("reproduciendo");
    video.controls = true;
  });

  video.addEventListener("pause", () => {
    cajaVideo.classList.remove("reproduciendo");
  });
}