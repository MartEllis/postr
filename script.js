const genresApiURL = 'https://api.themoviedb.org/3/genre/movie/list?api_key=9b615261fd4c5b4679c2c44fa799b084&language=en-US'

///////////////// DEFAULT PAGE POPULAR MOVIES ////////////
async function getPopularMovies(pagenum) {
    let popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=9b615261fd4c5b4679c2c44fa799b084&language=en-US&page=${pagenum}`
    let response = await fetch(popularMoviesURL);
    let data = await response.json();
    let movies = data.results
    movies.forEach(movie => {
        let postersDomEl = document.querySelector(".posters-main")
        let poster = document.createElement('div');
        poster.classList.add("poster")
        let img = document.createElement('img')
        img.src = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path
        img.addEventListener('click', displayModal)
        let h3 = document.createElement('h3')
        h3.classList.add('film-title')
        if (movie.title.length > 30) {
            h3.innerHTML = movie.title.substr(0,30) + '...'  
        } else {  
            h3.innerHTML = movie.title
        }
        let p = document.createElement('p')
        p.classList.add('film-year')
        p.innerHTML = movie.release_date.substr(0,4) 
        poster.appendChild(img)
        poster.appendChild(h3)
        poster.appendChild(p)
        postersDomEl.appendChild(poster)
        
    })
}
getPopularMovies(1);
getPopularMovies(2);
getPopularMovies(3);
/////////////////// END DEFAULT PAGE POPULAR MOVIES /////////////

/////////////////// GET LIST OF GENRES FOR SIDEBAR /////////////
async function getGenres() {
    let response = await fetch(genresApiURL);
    let data = await response.json();
    data.genres.forEach(genre => {
        let genresListDomEl = document.querySelector('.genre-list');
        let listItem = document.createElement('li');
        listItem.classList.add('genre');
        if (genre.name === 'Science Fiction') {
            listItem.innerHTML = 'Sci-Fi';    
        } else {
        listItem.innerHTML = genre.name;
        }
        listItem.setAttribute('data-genre-id', genre.id)
        listItem.addEventListener('click', getMovies)
        genresListDomEl.appendChild(listItem);
    });
}
getGenres();
/////////////////// END GET LIST OF GENRES FOR SIDEBAR /////////////

///////////// CHANGE GENRE ///////////////
async function getMovies() {
    let currentlySelected = document.querySelector('.selected-genre')
    if (!currentlySelected) {
    this.classList.add('selected-genre')
    } else {
        currentlySelected.classList.remove('selected-genre')
        this.classList.add('selected-genre')
    }
    let movies = [];
    for (i = 1; i < 3; i++) {
        let genreID = this.getAttribute('data-genre-id')
        let moviesURL = `https://api.themoviedb.org/3/discover/movie?api_key=9b615261fd4c5b4679c2c44fa799b084&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}&with_genres=${genreID}`
        let response = await fetch(moviesURL);
        let data = await response.json();
        movies.push(...data.results)
    }
    console.log(movies)
    clearPosterSection()
    movies.forEach(movie => {
        let postersDomEl = document.querySelector(".posters-main")
        let poster = document.createElement('div');
        poster.classList.add("poster")
        let img = document.createElement('img')
        img.src = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path
        img.addEventListener('click', displayModal)
        let h3 = document.createElement('h3')
        h3.classList.add('film-title')
        if (movie.title.length > 30) {
            h3.innerHTML = movie.title.substr(0,30) + '...'  
        } else {  
            h3.innerHTML = movie.title
        }
        let p = document.createElement('p')
        p.classList.add('film-year')
        p.innerHTML = movie.release_date.substr(0,4) 
        poster.appendChild(img)
        poster.appendChild(h3)
        poster.appendChild(p)
        postersDomEl.appendChild(poster)
    }
    )
}
///////////// END CHANGE GENRE ///////////////

///////////// SEARCH MOVIES ///////////////
let searchBar = document.getElementById('search')
searchBar.addEventListener('input', searchMovies)

async function searchMovies() {
    let query = this.value
    let searchURL = `https://api.themoviedb.org/3/search/movie?api_key=9b615261fd4c5b4679c2c44fa799b084&language=en-US&query=${query}&page=1&include_adult=false`
    let response = await fetch(searchURL);
    let data = await response.json();
    let movies = data.results;
    clearPosterSection();
    movies.forEach(movie => {
        let postersDomEl = document.querySelector(".posters-main")
        let poster = document.createElement('div');
        poster.classList.add("poster")
        let img = document.createElement('img')
        if (movie.poster_path === null) {
            img.src = "img/poster.jpg"
        } else {
        img.src = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path
        }
        img.addEventListener('click', displayModal)
        let h3 = document.createElement('h3')
        h3.classList.add('film-title')
        h3.innerHTML = movie.title
        let p = document.createElement('p')
        p.classList.add('film-year')
        p.innerHTML = movie.release_date.substr(0,4) 
        poster.appendChild(img)
        poster.appendChild(h3)
        poster.appendChild(p)
        postersDomEl.appendChild(poster)
    }
    )
}
///////////// END SEARCH MOVIES ///////////////



///////////// CLEAR POSTER SECTION ///////////////
function clearPosterSection() {
    let posterSection = document.querySelector('.posters-main')
    let child = posterSection.lastElementChild
    while (child) {
        child.remove()
        child = posterSection.lastElementChild
    }
}
///////////// END CLEAR POSTER SECTION ///////////////


//////////////// MODAL //////////////////////
let modal = document.querySelector(".poster-modal")
modal.addEventListener('click', () => {
    if (event.target.classList.contains('modal-image')) {
        return
    } else {
        modal.style.display = 'none'   
    }
})

// DISPLAY MODAL
function displayModal() {
    let posterImgSrc = this.src
    let modalImg = document.querySelector(".modal-image")
    modalImg.src = posterImgSrc
    modal.style.display = 'block'
    console.log(posterImgSrc);
}

// CLOSE MODAL 
const closeModal = document.querySelector('.close')
closeModal.addEventListener('click', () => modal.style.display = 'none')
//////////// END MODAL ///////////////////////

// // TO-DO
// add link to modal that opens max res version in new tab
// make mobile and make a logo