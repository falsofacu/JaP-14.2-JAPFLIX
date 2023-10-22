//*1- Cargar JSON
let fetchData = {};
document.addEventListener("DOMContentLoaded", () => {
  const url = "https://japceibal.github.io/japflix_api/movies-data.json";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      fetchData = data;
      console.log(data); //!Borrar
    })
    .catch((err) => {
      console.log(err);
    });
});

//*2- Botón de busqueda
document.addEventListener("DOMContentLoaded", () => {
  const btnBuscar = document.getElementById("btnBuscar");
  const inputBuscar = document.getElementById("inputBuscar");
  const lista = document.getElementById("lista");

  //Mostrar peliculas al hacer click en el botón
  btnBuscar.addEventListener("click", () => {
    //Resetear contenido de lista
    lista.innerHTML = "";

    let inputBusqueda = inputBuscar.value.toLowerCase();
    fetchData.forEach((pelicula) => {
      if (
        pelicula.title.toLowerCase().includes(inputBusqueda) ||
        busquedaCoincideConTag(pelicula, inputBusqueda) ||
        busquedaCoincideConOverview(pelicula, inputBusqueda) ||
        busquedaCoincideConGenero(pelicula, inputBusqueda)
      ) {
        agregarALista(lista, pelicula);
      }
    });
  });
});

const busquedaCoincideConTag = (pelicula, busqueda) => {
  const arrABuscar = pelicula.tagline.split(" ");
  arrABuscar.forEach((palabra) => {
    if (palabra.toLowerCase() === busqueda) {
      return true;
    }
  });
  return false;
};

const busquedaCoincideConOverview = (pelicula, busqueda) => {
  const arrBusqueda = pelicula.overview.split(" ");
  arrBusqueda.forEach((palabra) => {
    if (palabra.toLowerCase() === busqueda) {
      return true;
    }
  });
  return false;
};

const busquedaCoincideConGenero = (pelicula, busqueda) => {
  let resultado = false;
  pelicula.genres.forEach((genero) => {
    if (genero.name.toLowerCase().includes(busqueda)) resultado = true;
  });
  return resultado;
};

//*3 y 4 - Contenedor superior y botón desplegable
const agregarALista = (lista, pelicula) => {
  let votos = pelicula.vote_average;
  let rating = Math.round(votos / 2);
  let releaseYear = pelicula.release_date.split("-")[0];
  let genres = generarGeneros(pelicula);
  let peliInner = `
      <div class="card-content" data-bs-toggle = "offcanvas" data-bs-target = "#offcanvasTop" aria-controls = "offcanvasTop">
      
          <div>
              <h4 class="text-white">${pelicula.title}</h4>
              <p class="text-white">${pelicula.tagline}</p>
          </div>
      <div class="ml-auto">
          <span id="${pelicula.title}_star_0" class="fa fa-star"></span>
          <span id="${pelicula.title}_star_1" class="fa fa-star"></span>
          <span id="${pelicula.title}_star_2" class="fa fa-star"></span>
          <span id="${pelicula.title}_star_3" class="fa fa-star"></span>
          <span id="${pelicula.title}_star_4" class="fa fa-star"></span>
      </div>
      </div>

      <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop">
      <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasTopLabel">${pelicula.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body overflow-visible">
          <p id="offcanvasTopOverview">${pelicula.overview}</p>
          <hr>
          <p id="offcanvasGenres">${genres.join(" - ")}</p>
          <div class="dropdown text-end">
              <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownBtn" data-bs-toggle="dropdown" aria-expanded="false">
                  More
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownBtn">
                  <div class="dropdown-item">Year: ${releaseYear}</div>
                  <div class="dropdown-item">Runtime: ${pelicula.runtime}m</div>
                  <div class="dropdown-item">Budget: $${pelicula.budget}</div>
                  <div class="dropdown-item">Revenue: $${pelicula.revenue}</div>
              </div>
          </div>

      </div>
  </div>

  `;

  let peliHtml = document.createElement("li");

  peliHtml.innerHTML += peliInner; // Set innerHTML of peliHtml with peliInner content

  lista.appendChild(peliHtml);

  //Rating
  for (let i = 0; i < rating; i++) {
    let star = document.getElementById(`${pelicula.title}_star_${i}`);
    star.classList.add("checked");
  }

  console.log(pelicula);
};

const generarGeneros = (pelicula) => {
  let resultado = [];
    pelicula.genres.forEach((genero) => {
      resultado.push(genero.name);
    });
    console.log(resultado)
  return resultado;
}