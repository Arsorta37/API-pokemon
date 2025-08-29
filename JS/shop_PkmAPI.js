const crear = document.getElementById("crearEquipo");
const modal = document.getElementById("modal");
const equipo = document.getElementById("equipo");
const openBtn = document.getElementById("openModal");
const pokeball = document.getElementById("pokeball");
const closeBtn = document.querySelectorAll(".close");
const pokemonsDiv = document.getElementById("pokemons");
const totalPrecio = document.getElementById("total");
const numPokemons = document.getElementById("numPkmsEquipo");
const eliminarEquipo = document.getElementById("eliminarEquipo");
const eliminarDelTodo = document.getElementById("eliminarDelTodo");

// Leemos los parámetros
const params = new URLSearchParams(window.location.search);
const precio = params.get("precio");
const leido = params.get("IDs");

let llevando = [null, null];
let carritoPkm = [];

// Asociamos un color de fondo a cada tipo
const coloresTipo = {
  bug: "rgba(159, 220, 97)",
  dark: "rgba(20, 0, 53)",
  dragon: "rgba(17, 0, 147)",
  electric: "rgba(255, 225, 102)",
  fairy: "rgba(255, 192, 203)",
  fighting: "rgba(192, 48, 40)",
  fire: "rgba(220, 68, 34)",
  flying: "rgba(135, 206, 235)",
  ghost: "rgba(96, 96, 176)",
  grass: "rgba(120, 180, 80)",
  ground: "rgba(222, 184, 135)",
  ice: "rgba(173, 216, 230)",
  normal: "rgba(200, 200, 180)",
  poison: "rgba(160, 64, 160)",
  psychic: "rgba(255, 105, 180)",
  rock: "rgba(184, 160, 56)",
  steel: "rgba(192, 192, 208)",
  water: "rgba(51, 153, 225)"
};

const capitalizar = (string) => {return string[0].toUpperCase() + string.substr(1);};

// Elimina la tarjeta con el ID (idCompra) del carrito de la compra
function eliminarPkm(idCompra) {
  carritoPkm.splice(carritoPkm.indexOf(idCompra), 1);
  document.getElementById("pkmEquipo" + idCompra).remove();
  actualizarTextos();
}

// Suma el precio de cada pkm en el carrito
function sumarPreciosEquipo() {
  let suma = 0;
  const precios = document.querySelectorAll("[id^='precioPkmEquipo']");
  precios.forEach(p => {
    const texto = p.textContent.trim();
    const limpio = texto.replace("€", "").replace(",", ".");
    const numero = parseFloat(limpio);
    if (!isNaN(numero)) suma += numero;
  });
  return Math.round(suma * 100)/100;
}

// Actualiza el texto de nº de pkm y el precio total
function actualizarTextos() {
  const sumaPrecios = sumarPreciosEquipo();
  totalPrecio.style.color = (sumaPrecios > 1500) ? "red" : "unset";
  totalPrecio.textContent = "Total: " + sumaPrecios + "€";
  numPokemons.textContent = carritoPkm.length + " / 6";
}

// Animación del texto de nº de pkm al estar lleno
function equipoLleno() {
  numPokemons.classList.add("error");
  setTimeout(() => {numPokemons.classList.remove("error");}, 400);
}

// Crear tarjeta en la cesta
function crearCartaCesta(pokemonID, precio) {
  // Si el carrito está lleno no procedemos
  if(carritoPkm.length >= 6) {
    equipoLleno();
    return;
  }

  // Asignamos el ID del producto
  let idCompra = pokemonID;
  while (carritoPkm.includes(idCompra)) {idCompra += "A"; } // Evitar IDs duplicados

  // Creamos la carta de la compra
  const imgPokemon = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/" + pokemonID + ".png";
  const pkmEquipo = document.createElement('div');
  pkmEquipo.classList.add("pkmEquipo");
  pkmEquipo.id = "pkmEquipo" + idCompra;
  pkmEquipo.innerHTML = `
    <img src="${imgPokemon}" alt="Imagen de (id: ${pokemonID})" class="imgPokemon" draggable="false" style="margin-bottom: 10px;">
    <p id="precioPkmEquipo${idCompra}">${precio}€</p>
    <button id="eliminar" onclick="eliminarPkm('${idCompra}')"><img src="sources/trash.png"></button>`;
  equipo.appendChild(pkmEquipo);
  carritoPkm.push(idCompra);
  actualizarTextos();
}

// _-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_ INICIO DE FUNCIONAMIENTO _-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

// Vemos si hay un equipo ya creado
if(leido != null) {
  let IDs = leido.split(',').slice(0, 6) // Solo se cogen los 6 primeros

  // Ponemos el equipo en la cesta
  IDs.forEach((id) => {
  const IP_URL = 'https://pokeapi.co/api/v2/pokemon/' + id;
  fetch(IP_URL)
  .then(response => response.json())
  .then(pokeData => {
  const precio = Math.ceil(Math.pow(
    pokeData.stats[0].base_stat +
    pokeData.stats[1].base_stat +
    pokeData.stats[2].base_stat +
    pokeData.stats[3].base_stat +
    pokeData.stats[4].base_stat +
    pokeData.stats[5].base_stat, 2)/10)/100;
  crearCartaCesta(id, precio);
  })
  .catch(error => {console.error("❌ Error al conectar con la API:", error);});
});
}

// Paso 1: URL de la API
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=898';
let pokeArray = []; // Array para organizar los pokemons de la página

// Paso 2: Hacemos la petición con fetch
fetch(API_URL)
.then(response => response.json())
.then(data => {
  // Por cada pokemon hacemos lo siguiente
  data.results.forEach(pokemon => {
  // Entramos a la información del pokemon
  fetch(pokemon.url)
  .then(response => response.json())
  .then(pokeData => {
    // Calculamos su precio
    const precio = Math.ceil(Math.pow(
      pokeData.stats[0].base_stat +
      pokeData.stats[1].base_stat +
      pokeData.stats[2].base_stat +
      pokeData.stats[3].base_stat +
      pokeData.stats[4].base_stat +
      pokeData.stats[5].base_stat, 2)/10)/100;

    // Creamos el botón de compra
    const botonMeterEnCesta = `
    <button id="botonCompra${pokeData.id}" class="botonMeterEnCesta" onclick="crearCartaCesta(${pokeData.id}, ${precio})">
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
      <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
      <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2
      2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2
      1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
    </svg></button>`;

    // Comprobamos los tipos:
    let tiposHTML = '';
    if (pokeData.types.length === 2) {
      tiposHTML = `
        <p class="tipos jersey-10">Tipos:
          <img src="sources/Tipo_${pokeData.types[0].type.name}.png"
          alt="${pokeData.types[0].type.name}" draggable="false">
          <img src="sources/Tipo_${pokeData.types[1].type.name}.png"
          alt="${pokeData.types[1].type.name}" draggable="false">
        </p>`;
    } else {
      tiposHTML = `
        <p class="tipos jersey-10">Tipo:
          <img src="sources/Tipo_${pokeData.types[0].type.name}.png"
          alt="${pokeData.types[0].type.name}" draggable="false"></p>`;
    }

    // Comprobamos si tiene imagen de frente:
    let imgFrenteHTML = '';
    if (pokeData.sprites.front_default === null) {
      imgFrenteHTML = `
      <img src="sources/Pokeball.png" alt="Imagen de una pokeball" draggable="false" class="imgPokemon"
        style="right: 13px; position: absolute;" id="img${pokeData.id}">`;
    } else {
      imgFrenteHTML = `
      <img src="${pokeData.sprites.front_default}"
        draggable="false" alt="Imagen de ${capitalizar(pokemon.name)}"
        class="imgPokemon" id="img${pokeData.id}">`;
    }

    // Comprobamos si tiene imagen de espalda:
    let imgEspaldaHTML = '';
    if (pokeData.sprites.back_default === null) {
      imgEspaldaHTML = `<img src="sources/Pokeball.png" alt="Imagen de una pokeball"
        draggable="false" class="imgPokemon">`;
    } else {
      imgEspaldaHTML = `
      <img src="${pokeData.sprites.back_default}" alt="Imagen de ${capitalizar(pokemon.name)} de espalda"
        draggable="false" class="imgPokemon">`;
    }

    // Creamos la tarjeta del pokemon
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = pokeData.id;
    card.draggable = "true";
    card.innerHTML = `
    <div class="frente" id="frente${pokeData.id}">
        ${botonMeterEnCesta}
        <p class="jersey-10" style="font-size: 29px;">${capitalizar(pokemon.name)}</p>
        <div class="contImgPokemon">${imgFrenteHTML}</div>
        <div class="contTxtFrente">
        ${tiposHTML}
        <p><strong style="margin-left: 2px">ID: </strong>${pokeData.id}
            <strong style="margin-left: 10px">Precio: </strong>${precio}€</p>
        </div>
    </div>
    <div class="espalda" id="espalda${pokeData.id}">
        ${botonMeterEnCesta}
        <p class="jersey-10" style="font-size: 29px;">${capitalizar(pokemon.name)}</p>
        <div class="contImgPokemon">${imgEspaldaHTML}</div>
        <div class="cajaEstadisticas">
        <div class="estadistica">
            <p class="jersey-10">Hp:</p>
            <div class="contenedorBarra">
                <p>${pokeData.stats[0].base_stat}</p>
                <div class="barra" style="width: ${pokeData.stats[0].base_stat * 100 / 255}%;
                background-color: green;"></div>
            </div>
        </div>
        <div class="estadistica">
            <p class="jersey-10">Vel:</p>
            <div class="contenedorBarra">
            <p>${pokeData.stats[5].base_stat}</p>
            <div class="barra" style="width: ${pokeData.stats[5].base_stat * 100 / 200}%;
                background-color: aqua;"></div>
            </div>
        </div>
        <div class="estadistica">
            <p class="jersey-10">Def:</p>
            <div class="contenedorBarra">
                <p>${pokeData.stats[2].base_stat}</p>
                <div class="barra" style="width: ${pokeData.stats[2].base_stat * 100 / 230}%;
                background-color: blue;"></div>
            </div>
        </div>
        <div class="estadistica">
            <p class="jersey-10">Atq:</p>
            <div class="contenedorBarra">
                <p>${pokeData.stats[1].base_stat}</p>
                <div class="barra" style="width: ${pokeData.stats[1].base_stat * 100 / 181}%;
                background-color: crimson;"></div>
            </div>
        </div>
        <div class="estadistica">
            <p class="jersey-10">D.E:</p>
            <div class="contenedorBarra">
                <p>${pokeData.stats[4].base_stat}</p>
                <div class="barra" style="width: ${pokeData.stats[4].base_stat * 100 / 230}%;
                background-color: blueviolet;"></div>
            </div>
        </div>
        <div class="estadistica">
            <p class="jersey-10">A.E:</p>
            <div class="contenedorBarra">
                <p>${pokeData.stats[3].base_stat}</p>
                <div class="barra" style="width: ${pokeData.stats[3].base_stat * 100 / 173}%;
                background-color: red;"></div>
            </div>
        </div>
        </div>
        <div class="contTxtEspalda">
        <p style="grid-column: 1 / 2;"><strong>Altura: </strong>${pokeData.height / 10}m</p>
        <p style="grid-column: 2 / 3;"><strong>Peso: </strong>${pokeData.weight / 10}kg</p>
        </div>
    </div>`;

    // Esto cambia el fondo al color del primer tipo
    const primerTipo = pokeData.types[0].type.name;
    card.style.backgroundColor = coloresTipo[primerTipo] || "";
    if(primerTipo == "dragon" || primerTipo == "dark") {card.style.color = "#FFF";}

    // Click: voltear la tarjeta
    card.addEventListener('click', () => {
      const detras = document.getElementById("espalda" + card.id);
      const delante = document.getElementById("frente" + card.id);
      if (card.classList.contains("vuelta")) {
        card.classList.remove("vuelta");
        delante.style.opacity = "1";
        setTimeout(() => {
        detras.style.opacity = "0";
        delante.style.opacity = "1";
        }, 300);
      } else {
        card.classList.add("vuelta");
        detras.style.opacity = "1";
        setTimeout(() => {
        delante.style.opacity = "0";
        detras.style.opacity = "1";
        }, 300);
      }
    });

    // Drag: iniciar arrastre
    card.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.effectAllowed = "move";
      llevando[0] = card.id;
      llevando[1] = precio;
    });

    // Guardar y ordenar tarjetas
    pokeArray.push(card);
    pokeArray.sort((a, b) => a.id - b.id);

    // Cuando están todas las cartas cargadas
    if (pokeArray.length === data.results.length) {
      pokemonsDiv.classList.add("paddingCartas");
      pokeArray.forEach(card => pokemonsDiv.appendChild(card)); // Mostramos las cartas
      document.getElementById("pokeball").style.display = "none"; // Ocultamos la pokeball
      document.getElementById("finTienda").style.display = "flex"; // Mostramos el fin de la tienda

      // Ahora que está todo creado, podemos meter los eventos genéricos (botones y scroll)

      // Eventos al hacer click en los botones de añadir al carrito
      const botonesCesta = Array.from(document.getElementsByClassName("botonMeterEnCesta"));
      botonesCesta.forEach(boton => boton.addEventListener('click', (event) => {
          event.stopPropagation();
          boton.style.transform = "scale(1.1)";
          setTimeout(() => {boton.style.transform = "scale(1)";}, 200);
      }));

      // Definición de evento scroll-reveal
      const observerCallback = (entries, observer) => {
      entries.forEach((c) => {
          if (c.isIntersecting) {c.target.style.opacity = "1";
          } else {c.target.style.opacity = "0";}
      });
      }
      // Creación del observador de cada carta para el (scroll-reveal)
      let observer = new IntersectionObserver(observerCallback, {root: null, rootMargin: "0px", threshold: 0.1});
      document.querySelectorAll(".card").forEach((c) => {observer.observe(c);});
    }
  })
  .catch(error => {console.error("❌ Error al conectar con la API:", error);});
  });
})
.catch(error => {console.error("❌ Error al conectar con la API:", error);});

// Drag & Drop en el panel del equipo
equipo.addEventListener("dragleave", () => {
  equipo.style.backgroundColor = "revert-layer";
});

equipo.addEventListener("dragover", (ev) => {
  // Cambia el fondo del carrito dependiendo de si está lleno
  equipo.style.backgroundColor = (carritoPkm.length < 6)
  ? "rgba(0, 200, 0, 0.5)"
  : "rgba(200, 0, 0, 0.5)";
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
});

equipo.addEventListener("drop", (ev) => {
  ev.preventDefault();
  equipo.style.backgroundColor = "revert-layer";
  // llevando[0] = ID, llevando[1] = Precio
  if (llevando[0] != null && llevando[1] != null) {
    if (carritoPkm.length < 6) {crearCartaCesta(llevando[0], llevando[1]);
    } else {equipoLleno();}
  }
  // Reiniciamos lo que se está arrastrando
  llevando[0] = null; llevando[1] = null;
});

// Botón: crear equipo
crear.addEventListener("click", () => {
  const sumPrecio = sumarPreciosEquipo();
  if (sumPrecio > 1500) {
    totalPrecio.classList.add("error");
    setTimeout(() => {totalPrecio.classList.remove("error");}, 400);
  } else if (carritoPkm.length < 1) {
    numPokemons.classList.add("error");
    setTimeout(() => {numPokemons.classList.remove("error");}, 400);
  } else {
  let oscuro = "";
  if(document.body.classList.contains("oscuro")){oscuro = "&oscuro=true"}
  if(leido != null) {alert("Se sobrescribirá el equipo anterior");}
  window.location.href = "team.html?IDs="
      + carritoPkm.join().replaceAll("A", "") // Quitamos las "A"
      + "&precio=" + sumPrecio + oscuro;
  }
});

// Botón: abrir modal eliminar equipo
eliminarEquipo.addEventListener("click", () => {
  modal.style.display = "block";
});

// Cerrar modal (X o Cancelar)
closeBtn.forEach((btn) => {
  btn.addEventListener("click", () => {modal.style.display = "none";});
});

// Cerrar modal al hacer clic fuera
window.addEventListener("click", (e) => {
  if (e.target === modal) {modal.style.display = "none";}
});

// Eliminar todo el equipo
eliminarDelTodo.addEventListener("click", () => {
  carritoPkm = [];
  equipo.innerHTML = "";
  modal.style.display = "none";
  actualizarTextos();
});