const formulario = document.getElementById("formulario");
const boton = document.getElementById("btnEnviar");
const politicas = document.getElementById("politicas");
const pokemonFav = document.getElementById("pokemonFavorito");
const precioEquipo = document.getElementById("PrecioEquipo");

const params = new URLSearchParams(window.location.search);
const precio = params.get("precio");

if(precio != null) {precioEquipo.value = precio;}

// Habilitamos el botón segun se acepten las políticas de privacidad
politicas.addEventListener("change", () => {boton.disabled = !politicas.checked;});

formulario.addEventListener("submit", function (e) {
  console.log("enviar");
  let mandar = true;
  
// 🔸 Validar que nombre, email y pokemon no estén vacíos
  const inputs = Array.from(document.querySelectorAll("input[name='texto']"));
  inputs.forEach(element => {
  const label = document.getElementById("label"+element.id);
  if(element.value.trim() === '') {
    label.classList.add("error");
    mandar = false;
  } else {label.classList.remove("error");}
  });

// 🔸 Validar el precio del equipo
  const labelPE = document.getElementById("labelPrecioEquipo");
  if(precioEquipo.value.trim() === '' || precioEquipo.value.trim() < 0 || precioEquipo.value.trim() > 1500) {
    labelPE.classList.add("error");
    mandar = false;
  } else {labelPE.classList.remove("error");}

// 🔸 Si todo está correcto, mostrar alerta de éxito y reiniciar formulario
  if(mandar) {
  e.preventDefault();
  alert("Formulario enviado correctamente ✅\n" +
    "(en verdad no existe ningún servidor que recoja esta información)");
  } else {e.preventDefault();}
});