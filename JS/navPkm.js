const searchParams = new URLSearchParams(window.location.search);
const oscuro = searchParams.get("oscuro");
const paginasPosibles = {
  home: "index.html?",
  shop: "shop_PkmAPI.html?",
  team: "equipo_Pkm.html?",
  form: "form.html?"
};

function cambioPagina(pagina) {
  let searchIDs = "";
  if(searchParams.get("IDs") != null){searchIDs = "IDs=" + searchParams.get("IDs");}

  let searchPrecio = "";
  if(searchParams.get("precio") != null){searchPrecio = "&precio=" + searchParams.get("precio");}

  let searchOscuro = "";
  if(document.body.classList.contains("oscuro")){searchOscuro = "&oscuro=true";}

  let searchPagina = paginasPosibles[pagina];
  window.location.href = searchPagina + searchIDs + searchPrecio + searchOscuro;
}

if(oscuro != null && oscuro != "no" && oscuro != "false" && oscuro != 0) {
  document.body.classList.add("oscuro");
  document.body.style.transition = "background-color 0s";
  setTimeout(() => {document.body.style.transition = "background-color 1s ease";}, 100);
}

fetch("navs/navPkm.html")
.then(response => response.text())
.then(data => {
  document.getElementById("navbar").innerHTML = data;

  // Código de la navbar
  const navContainer = document.getElementById("container");
  const hamburguesa = document.getElementById("hamburguesa");
  const decoracion = document.getElementById("decoracion");
  const home = document.getElementById("home");
  const shop = document.getElementById("shop");
  const team = document.getElementById("team");
  const form = document.getElementById("form");


  // Creamos los links
  home.addEventListener("click", () => {cambioPagina("home")});
  shop.addEventListener("click", () => {cambioPagina("shop")});
  form.addEventListener("click", () => {cambioPagina("form")});

  // Comprobamos si hay un equipo creado
  let comprobacionEquipo = new URLSearchParams(window.location.search).get("IDs");
  if(comprobacionEquipo != null) {
    team.addEventListener("click", () => {cambioPagina("team")});
  } else {
    team.addEventListener("click", () => {alert("No tienes un equipo creado!!");});
  }

  // Botón modo oscuro
  decoracion.addEventListener("click", () => {document.body.classList.toggle("oscuro");});

  // Botón hamburguesa
  let deslizado = true;
  function slideUp() {
    if(!deslizado) {
      navContainer.style.maxHeight = "0px";
      setTimeout(() => {navContainer.style.border = "0";}, 550);
      deslizado = true;
    }
  }

  function slideDown() {
    navContainer.style.maxHeight = "200px";
    navContainer.style.border = "goldenrod 6px solid";
    setTimeout(() => {deslizado = false;}, 300);
  }

  window.addEventListener("click", () => {slideUp();});
  hamburguesa.addEventListener("click", () => {slideDown();});
})
.catch(error => console.error(`Error al cargar "navs/navPkm.html":`, error));