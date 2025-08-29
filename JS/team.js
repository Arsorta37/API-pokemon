const titulo = document.getElementById("tituloComprado");
const equipo = document.getElementById("comprado");
const sombra = `<img src="sources/Sombra_suelo.png" class="sombraSuelo">`;
let pokeArray = [];
let precios = [];

const capitalizar = (string) => string[0].toUpperCase() + string.slice(1);

// Leer IDs y convertirlas en URLs
const params = new URLSearchParams(window.location.search);
const leido = params.get("IDs");
let IDs = [];

if(leido === null) {
  console.log("No hay equipo para leer");
  equipo.innerText = "No se ha podido leer el equipo en el apartado 'IDs'";
  equipo.style.display = "flex";
} else {
  IDs = leido.split(',').slice(0, 6); // Solo se cogen los 6 primeros
  while(IDs.length < 6) { IDs.push(null); }
}

IDs.forEach((id) => {
  if(id === null) {
    const card = document.createElement('div');
    card.classList.add('cardComprado');
    card.id = 10000;
    card.draggable = "false";
    card.innerHTML = `<div class="contenidoCartaComprado vacia"><p>Slot vacío</p></div>`;
    pokeArray.push(card);
    pokeArray.sort((a, b) => a.id - b.id);
    if (pokeArray.length == IDs.length) {pokeArray.forEach((card) => equipo.appendChild(card));}
  } else {
    // Fetch de cada pokemon
    const Pokemon_URL = "https://pokeapi.co/api/v2/pokemon/" + id;
    fetch(Pokemon_URL)
    .then(response => response.json())
    .then(pokeData => {

      // Comprobamos los tipos
      let tiposHTML = '';
      if (pokeData.types.length === 2) {
      tiposHTML = `
        <p style="grid-area: 3 / 3 / 4 / 4; margin-left: 6px;">
          <strong>Tipos: </strong>
          <img src="sources/Tipo_${pokeData.types[0].type.name}.png"
            alt="${pokeData.types[0].type.name}" draggable="false">
          <img src="sources/Tipo_${pokeData.types[1].type.name}.png"
            alt="${pokeData.types[1].type.name}" draggable="false">
        </p>`;
      } else {
      tiposHTML = `
        <p style="grid-area: 3 / 3 / 4 / 4; margin-left: 16px;">
          <strong>Tipo: </strong>
          <img src="sources/Tipo_${pokeData.types[0].type.name}.png"
            alt="${pokeData.types[0].type.name}" draggable="false">
        </p>`;
      }

      // Comprobamos si tiene imagen de frente
      let innerGifFrente = '';
      if (pokeData.sprites.other.showdown.front_default === null) {
        innerGifFrente = `<img src="sources/Pokeball.png"
          alt="Imagen de una pokeball" draggable="false" class="gif frente">`;
      } else {
        innerGifFrente = `<img src="${pokeData.sprites.other.showdown.front_default}"
          draggable="false" alt="Imagen de ${capitalizar(pokeData.name)}" class="gif frente">`;
      }

      // Comprobamos si tiene imagen de espalda
      let innerGifEspalda = '';
      if (pokeData.sprites.other.showdown.back_default === null) {
        innerGifEspalda = `<img src="sources/Pokeball.png"
          alt="Imagen de una pokeball" draggable="false" class="gif espalda">`;
      } else {
        innerGifEspalda = `<img src="${pokeData.sprites.other.showdown.back_default}"
          alt="Imagen de ${capitalizar(pokeData.name)} de espalda" draggable="false" class="gif espalda">`;
      }

      // Calculamos el precio y lo metemos al array de los precios
      const precio = Math.ceil(Math.pow(
      pokeData.stats[0].base_stat +
      pokeData.stats[1].base_stat +
      pokeData.stats[2].base_stat +
      pokeData.stats[3].base_stat +
      pokeData.stats[4].base_stat +
      pokeData.stats[5].base_stat, 2)/10)/100;
      precios.push(precio);

      // Creamos la tarjeta del pokemon
      const card = document.createElement('div');
      card.classList.add('cardComprado');
      card.id = pokeData.id;
      card.draggable = "false";
      card.innerHTML = `
      <div class="contenidoCartaComprado" id="frente${pokeData.id}">
        <div class="contenedorGif">${innerGifFrente}${innerGifEspalda}</div>
        ${sombra}
        <p style="grid-area: 1 / 1 / 2 / 3; font-size: 30px"
          class="jersey-10">${capitalizar(pokeData.name)}</p>
        <p style="grid-area: 1 / 3 / 2 / 4;">
        <strong style="margin-left: 2px">ID: </strong>${pokeData.id}
        <strong style="margin-left: 10px">Precio: </strong>${precio}€
        </p>
        <div class="estadisticas">
          ${pokeData.stats.map((s,i) => { // Me gustaría hacer esto en lo de latienda, pero paso
            const nombres = ["Hp","Atq","Def","A.E","D.E","Vel"];
            const colores = ["green","crimson","blue","red","blueviolet","aqua"];
            const maximos = [255,181,230,173,230,200];
            return `
            <div class="estadistica">
              <p style="font-size: 27px" class="jersey-10">${nombres[i]}:</p>
              <div class="contenedorBarra">
                <p>${s.base_stat}</p>
                <div class="barra" style="width:${s.base_stat*100/maximos[i]}%;
                  background-color:${colores[i]};"></div>
              </div>
            </div>`;
          }).join('')}
          <div class="alturaYpeso">
            <p style="margin: 0;">Altura: ${pokeData.height/10}m</p>
            <p style="margin: 0;">Peso: ${pokeData.weight/10}kg</p>
          </div>
        </div>
        ${tiposHTML}
      </div>`;

      // Creación del div de las descripciones
      const descripciones = document.createElement("div");
      const entrada = document.createElement("p");
      descripciones.classList.add("infoExtra");
      entrada.innerText = "Entrada de la pokedex:";
      entrada.classList.add("jersey-10");
      entrada.style.fontSize = "23px";
      entrada.style.margin = "0";
      descripciones.appendChild(entrada);

      // Fetch de la descripción
      let descripcion = "No se ha encontrado la descripción de " + pokeData.name;
      const descripcionURL = "https://pokeapi.co/api/v2/pokemon-species/" + id;
      fetch(descripcionURL)
      .then(response => response.json())
      .then(infoSpecies => {
        const divDescripcionPkm = document.createElement("p");

        // Si se encuentra la descripción en español se sobrescribe el texto base
        const descripcionEspanol = infoSpecies.flavor_text_entries.find(entry => entry.language.name === 'es');
        if (descripcionEspanol.flavor_text) {descripcion = descripcionEspanol.flavor_text.replaceAll("\n", " ");}

        // Metemos la descripción a la pokedex
        divDescripcionPkm.innerText = descripcion;
        divDescripcionPkm.style.margin = "0 0 5px 0";
        descripciones.appendChild(divDescripcionPkm)

        // Fetch de la ABILIDAD
        const abilityURL = pokeData.abilities[0].ability.url;
        fetch(abilityURL)
        .then(response => response.json())
        .then(infoAbility => {
          const abilidadNombre = document.createElement("p");
          const abilidadDescripcion = document.createElement("p");
          const entry = infoAbility.flavor_text_entries.find(e => e.language.name === 'es'); // Buscamos el español

          // Cogemos los textos
          abilidadNombre.innerText = "Habilidad: " + infoAbility.names.find(n => n.language.name === 'es').name
          abilidadDescripcion.innerText = entry.flavor_text.replaceAll("\n", " ");

          // Metemos la abilidad en la pokedex
          abilidadNombre.style.margin = "0";
          abilidadNombre.style.fontSize = "23px";
          abilidadNombre.classList.add("jersey-10");
          abilidadDescripcion.style.margin = "0";
          descripciones.appendChild(abilidadNombre);
          descripciones.appendChild(abilidadDescripcion);
        });
      });

      card.appendChild(descripciones);

      // Evento click para voltear gif
      const voltearGif = card.firstElementChild.firstElementChild;
      voltearGif.addEventListener('click', () => {
        const delante = voltearGif.firstElementChild;
        const detras = voltearGif.lastElementChild;
        if (voltearGif.classList.contains("vuelta")) {
          voltearGif.classList.remove("vuelta");
          setTimeout(() => {
            detras.style.opacity = "0";
            delante.style.opacity = "1";
          }, 150);
        } else {
          voltearGif.classList.add("vuelta");
          setTimeout(() => {
            delante.style.opacity = "0";
            detras.style.opacity = "1";
          }, 150);
        }
      });

      pokeArray.push(card);
      pokeArray.sort((a, b) => a.id - b.id);
      if (pokeArray.length == IDs.length) {
        pokeArray.forEach((card) => equipo.appendChild(card));

        // Calculo del precio
        let precioTotal = 0;
        precios.forEach((p) => precioTotal += p);
        titulo.innerText = "Equipo comprado: (" + Math.ceil(precioTotal) + "€)";
      }
    })
    .catch(error => console.error("❌ Error al conectar con la API:", error));
  }
});