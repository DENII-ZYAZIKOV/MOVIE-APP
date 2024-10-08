const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_KEY = "dcdbb621-dd6f-4894-ab17-c3f5907e7b75";
const API_URL =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=%D0%BC%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D0%B8&page=1";
const API_FILMiD = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  document.querySelector(".movies").innerHTML = "";

  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
        <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movie.nameRu}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
          (genre) => ` ${genre.genre}`
        )}</div>
        ${
          movie.rating &&
          `
        <div class="movie__average movie__average--${getClassByRate(
          movie.rating
        )}">${movie.rating}</div>
        `
        }
      </div>
        `;
    movieEl.addEventListener("click", () => OpenModal(movie.filmId));
    moviesEl.appendChild(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
});

//modal

const modalEl = document.querySelector(".modal");

async function OpenModal(id) {
  const resp = await fetch(API_FILMiD + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  modalEl.classList.add("modal--show");
  modalEl.innerHTML = `
    <div class="modal__card">
      <img
          class="modal__movie-backdrop"
          src=${respData.posterUrl}
          alt=""
        />
      <h2>
          <span class="modal__movie-title">${respData.nameRu}</span>
          <span class="modal__movie-release-year">${respData.year}</span>
      </h2>
      <ul class="modal__movie-info">
          <li class="modal__movie-genre">Жанр - ${respData.genres.map((e) => `${e.genre }`)}</li>
          ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
          <li>
              Сайт: <a class="modal__movie-site" href=""${respData.webUrl}">"${respData.webUrl}</a>
          </li>
          <li class="modal__movie-overview">Описание - ${respData.description}</li>
          </ul>
          <button type="button" class="modal__button-close">Закрыть</button>
        </div>  
  `;
  document.body.classList.add ('stop-scrolling')
  const btn = document.querySelector(".modal__button-close");
  btn.addEventListener("click", () => CloseModal());
}

function CloseModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove('stop-scrolling')
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    CloseModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    CloseModal();
  }
});
