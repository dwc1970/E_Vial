document.addEventListener("DOMContentLoaded", () => {
  const imagenInicio = document.getElementById("imagen-inicio");
  const botonComenzar = document.getElementById("boton-comenzar");
  const inicioContainer = document.getElementById("inicio-container");
  const juegosContainer = document.getElementById("juegos-container");

  // Al hacer clic en el botón, ocultar la pantalla de inicio y mostrar la de juegos
  botonComenzar.addEventListener("click", () => {
    inicioContainer.style.display = "none";
    juegosContainer.style.display = "flex";
  });
});
