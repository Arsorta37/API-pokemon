const searchParams = new URLSearchParams(window.location.search);
const oscuro = searchParams.get("oscuro");
const paginasPosibles = {
  home: "index.html?",
  shop: "shop.html?",
  team: "team.html?",
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

// Navbar
fetch("components/navPkm.html")
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
        hamburguesa.style.maxHeight = "100px";
        hamburguesa.style.padding = "10px";
        deslizado = true;
      }
    }

    function slideDown() {
      navContainer.style.maxHeight = "200px";
      navContainer.style.border = "goldenrod 6px solid";
      hamburguesa.style.maxHeight = "0px";
      hamburguesa.style.padding = "0px";
      setTimeout(() => {deslizado = false;}, 300);
    }

    window.addEventListener("click", () => {slideUp();});
    hamburguesa.addEventListener("click", () => {slideDown();});
  })
  .catch(error => console.error(`Error al cargar "components/navPkm.html":`, error));

// Footer
fetch("components/footerPkm.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
    // Definición de evento en la tienda al llegar al fondo
    if (window.location.pathname == "/shop.html") {
      const encogerDiv = document.getElementById("equipo");
      const moverCrear = document.getElementById("crearEquipo");
      const moverPrecio = document.getElementById("total");
      const moverEliminar = document.getElementById("eliminarEquipo");

      const observerCallback = (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting && window.innerWidth >= 777) {
            encogerDiv.style.height = "calc(100vh - 352px)";
            moverCrear.style.top = "calc(100vh - 239px)";
            moverPrecio.style.top = "calc(100vh - 307px)";
            moverEliminar.style.top = "calc(100vh - 240px)";
          } else {
            encogerDiv.style.height = "revert-layer";
            moverCrear.style.top = "revert-layer";
            moverPrecio.style.top = "revert-layer";
            moverEliminar.style.top = "revert-layer";
          }
        });
      }
      // Creación del observador de cada carta para el (scroll-reveal)
      let observer = new IntersectionObserver(observerCallback, {root: null, rootMargin: "0px", threshold: 0.1});
      observer.observe(document.getElementById("footer"));
    }
  })
  .catch(error => console.error(`Error al cargar "components/footerPkm.html":`, error));