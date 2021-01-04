window.addEventListener('DOMContentLoaded', (event) => {
    openTab();
    //check if key exist in the local storage
    
    if (localStorage.getItem("movies") !== null) {
      displayNominatedMovie();
    } 
    //displayNominatedMovie();
});


function openTab(){
    let allTabContents = document.querySelectorAll('.tabcontent');
    let tabMoviesContent = document.querySelector('#movies');
    let tabNominationContent = document.querySelector('#nomination');
    let tabLinks = document.querySelectorAll('.tablink');
    let tabWrappers = document.querySelectorAll('.tab-title__wrapper');

    // add eventlistener to button when clicked
    tabLinks.forEach(tabButton => tabButton.addEventListener('click', handleTabClick));

    //callback function 
    function handleTabClick(evt){
        tabLinks.forEach(tabButton => tabButton.classList.remove('selected-tab'));
        evt.target.classList.add('selected-tab');
       
        tabWrappers.forEach(tabButton => tabButton.classList.remove('selected-tab'));
        const closestTabWrapper = evt.target.closest('.tab-title__wrapper');
        closestTabWrapper.classList.add('selected-tab');

        // add selected-tabcontent class to the corresponding tabcontents 
        if (evt.target.classList.contains('movies-tab')){
            allTabContents.forEach(tabContent => tabContent.classList.remove('selected-tabcontent'));
            tabMoviesContent.classList.add('selected-tabcontent')

            // render and display movies if the nominatedMovies array is empty
            /*
            if (nominatedMovies.length === 0){
              updateResultUI(movieItems);
             
            }
            */
           /*
             //display empty state if the movieItems array is empty
             const localStorageItems = JSON.parse(localStorage.getItem('movies'));
              if (!movieItems.length && localStorageItems < 5 ){
                const defaultState = document.querySelector('#movies .empty-state__container');
                defaultState.classList.remove('hide');

              }
              */
            const localStorageItems = JSON.parse(localStorage.getItem('movies'));
            if (localStorageItems){
              if (localStorageItems.length < maxNominee){
                const noticeBanner = document.querySelector('.banner-card-pass__wrapper');
                //disable  warning banner when the keyword is valid
                if (noticeBanner){
                  noticeBanner.classList.add('hide');
                  //disable unnominated movie whrn the max of 5 is reached
                  disableMoviesOnMaxNominee();
                }
  
              }
            }
        }
        // add selected-tabcontent class to the corresponding tabcontents 
        if (evt.target.classList.contains('nomination-tab')){
            allTabContents.forEach(tabContent => tabContent.classList.remove('selected-tabcontent'));
            tabNominationContent.classList.add('selected-tabcontent')
            /*
            const nominatedMovies =[];
            nominatedMovies.forEach(nominatedMovie =>  {
              console.log(nominatedMovie, "the array we've been looking for")
              
              displayNominatedMovie()

            })
            */
           /*
           if (localStorage.getItem("movies") !== null) {
            displayNominatedMovie();
          } 
          */
         /*
          const localStorageItems = JSON.parse(localStorage.getItem('movies'));
          if (localStorageItems.length){
            
            //push local storage items to array
            //localStorageItems.forEach(item => nominatedMovies.push(item));
        
            console.log(nominatedMovies, 'from displaynominatedmovie')
            nominatedMovies[0][0].push(localStorageItems);
          }
          */
          //displayNominatedMovie();
            console.log(nominatedMovies, "display array on tab")
            //nominatedMovies.forEach(nominatedMovie => console.log(nominatedMovie[0].Title))
            //updateNominationsUI(nominatedMovies)

            //update nomination tab if local storage is not empty
            if (localStorage.getItem("movies") !== null) {
              updateNominationsUI(nominatedMovies);
              //displayNominatedMovie()
            } 
 
        }
        
    };
    
    //tabContents.forEach(tabButton => tabButton.addEventListener('click', handleTabClick));

    //tabContent.forEach(tab => tab.style.display = "none");

    
    //tabLinks.forEach(tabButton => tabButton.style.border-bottom = "none");

}


/* Global Variables */
const apiURL = 'https://www.omdbapi.com/';
const apiKey = 'dc6083ad';
const contentType = 'movie'

//array to hold search term
let searchTerm =[];
// array to hold state from searched movies
let movieItems = [];

// array to hold state for nominated movies
let nominatedMovies = [];

const maxNominee = 5;



//const searchKeyword = document.querySelector('[name="searchInput"]').value;
const searchButton = document.querySelector('.submit-button');
const searchForm = document.querySelector('.search-form');

const movieSection = document.querySelector('#movies .cards');
const nominationSection = document.querySelector('#nomination .cards');


 searchForm.addEventListener('submit', handleSubmit);


 function handleSubmit(evt){
    evt.preventDefault();
    let searchKeyword = document.querySelector('[name="search"]').value;
    searchTerm.unshift(searchKeyword);
    console.log(searchTerm);
    
    //console.log(movieDataURL);
/*
    getMovieData(movieDataURL)

    .then(function(data){
        updateUI();
    })
    // add line to rest search field
*/  

    //switch too the movies tab
    const moviesTab = document.querySelector('.movies-tab.tablink');
    moviesTab.click();
    window.location ='#empty-state__heading';
    //get api data
    getMovieDataByKeyword(searchKeyword);

    //updateUI(response);
/*
    fetch(movieDataURL)
    .then(response => response.json())
    .then(data => {
        data.forEach(function (data) {
            let movieCard = `
            <div class="grid movie-card__container">
            <div class="movie-card grid__item medium-up--one-half medium--one-quarter large-up--one-quarter">
              <div class="movie-card__inner-wrapper">
                <div class="movie-card__image-wrapper">
                  <a href="2020/blog-post.html" class="movie-card__link">
                    <img class="movie-card__image" src="${data.Search.Poster}" alt="${data.Search.Title}">
                  </a>
                </div>
                <div class="movie-card__content-wrapper">
                  <h2 class="movie-card__title">
                      <a href="#">${data.Search.Title}</a>
                  </h2>
                  <ul class="subtext-wrapper">
                      <li class="subtext-item">${data.Search.Genre}</li>
                      <li class="subtext-item">${data.Search.Year}</li>
                  </ul>
                  <button class="btn more-btn" type="button">More</button>
                  <button class="btn vote-btn" type="button">Nominate</button>
                </div>
              </div>
            </div>
          </div>`;

          section.insertAdjacentHTML("beforeend" , movieCard);
        })

    })

    .catch(err => alert("error"));
  
*/



 };
 
 async function getMovieDataByKeyword(searchKeyword) {
    try {
      let movieDataURL = `${apiURL}?s=${searchKeyword}&type=${contentType}&apikey=${apiKey}`;
      const response = await axios.get(movieDataURL);
      console.log(response, "yello");
     
      const invalidData = response.data.Response;
      const validData = response.data.Search;

      //validate input
      if (invalidData == 'False'){
        validateKeyword(invalidData);
      }
     
      //post data to object
      movieItems.unshift(validData);
      console.log(movieItems[0])
      console.log(movieItems[0].length)
      
        updateResultUI(movieItems); 
      
      
      
      //reset oor clear search form
      searchForm.reset();
    }catch (error) {
      displayError(error);
    }
  }

function updateResultUI(movieItems){
  
 
  const warningBanner = document.querySelector('.banner-card-warning__wrapper');
  const errorMessage = document.querySelector('.error-message_wrapper')
  const defaultState = document.querySelector('#movies .empty-state__container');
  
   //disable empty state for the movie tab
  if (defaultState){
    defaultState.classList.add('hide');
  }
  
   //disable  warning banner when the keyword is valid
  if (warningBanner){
    warningBanner.style.display = 'none';
  }
   //disable error message when keyword is valid
  if (errorMessage){
    errorMessage.style.display = 'none';
  }

let movieCard ="";
  //get data from object
  movieItems[0].forEach(movieItem => {
    //if image is not available
    if (movieItem.Poster == 'N/A'){
      movieItem.Poster = 'https://m.media-amazon.com/images/M/MV5BNmViZjY5OWQtYTMyZS00NTFjLWI3MjgtMjcyYjJiZjJiNDNkXkEyXkFqcGdeQXVyMzA1NjAzODI@._V1_SX300.jpg'
    }
    const resultCounter = document.querySelector('.movie-card__heading');
    const searchKeyword = document.querySelector('[name="search"]').value;
    resultCounter.innerHTML = `${movieItems[0].length} results found for <span class="search-keyword">"${searchTerm[0]}"</span>`;

    movieCard += `
                <div class="card" data-description="${movieItem.Title}">
                  <img class="movie-card__image" src="${movieItem.Poster}" alt="${movieItem.Title}">
                  <div class="movie-card__content">
                    <h2 class="movie-card__title small--text-center"><a class="movie-card__title-link" data-movie-id="${movieItem.imdbID}" href="#">${movieItem.Title}</a></h2>
                    <ul class="subtext-wrapper">
                        <li class="subtext-item small--text-center">${movieItem.Year}</li>
                    </ul>
                  </div>
                  <button class="btn-secondary details" data-movie-id="${movieItem.imdbID}" type="button">More info</button>
                  <button class="btn nominate" data-movie-id="${movieItem.imdbID}" type="button">Nominate</button>
                </div>`;
      
          //movieSection.insertAdjacentHTML("afterbegin" , movieCard);

  })
  
  movieSection.innerHTML = movieCard;

  //diable nominated movie button on search results
  disableNominatedMovieOnSearchResults();
  

  //open and close modal to display more movie details
  openModal();
  //closeModal();
  
  //nominate movie
  nominateMovie();

  //when the max number of movie is nominated, disable remaining unnominated movie
  disableMoviesOnMaxNominee();

  //display nominated movie
  //displayNominatedMovie();

  

}

// If movie not found or wrong search term
function validateKeyword(invalidData){
  //let validKeyword = response.data.Response;
  const tabTopSection = document.querySelector('#banner-card');
  const searchKeyword = document.querySelector('[name="search"]').value;
  const systemErrorMessage = document.querySelector('.error-message_wrapper');
  
  if (invalidData){
      const warningBanner = 
      `<div class="banner-card-warning__wrapper">
        <div class="warning-icon">
          <svg viewBox="0 0 20 20" class="pass-icon__Svg" focusable="false" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
          </svg>
        </div>
        <div class="banner-card__message">
          <p class="banner-card__heading">
            Sorry we couldn't find any results matching "${searchKeyword}".
          </p>
          <ul class="banner-card-list">
            <li class="banner-card-list__item">Check your spelling and try again.</li>
          
          </ul>
          <button class="btn-secondary" type="button" tabindex="0">Search</button>
        </div>
        <div class="close-icon">
          <svg viewBox="0 0 20 20" class="pass-icon__Svg" tabindex="0" focusable="false" aria-hidden="true">
            <path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
          </svg>
        </div>
      </div>`;


    tabTopSection.innerHTML = warningBanner;
    //hide system error coming from catch
    

   

  }

  systemErrorMessage.classList.add('hide');

}

//open modal
function openModal(){
    //get data attribute form more info button
  let moreInfoButtonsOnMoviesTab = document.querySelectorAll('#movies .cards .details');
  let moreInfoButtonsOnNominationTab = document.querySelectorAll('#nomination .cards .details');
  const modalContainer = document.querySelector('.modal-outer');
  let movieTitleLinksOnMoviesTab = document.querySelectorAll('#movies .cards .movie-card__title-link');
  let movieTitleLinksOnNominationTab = document.querySelectorAll('#nomination .cards .movie-card__title-link');
  //let movieImages = document.querySelectorAll('.cards img.movie-card__image');


  //loop over movie info buttons and listen for a click
  moreInfoButtonsOnMoviesTab.forEach(moreInfoButton => moreInfoButton.addEventListener('click', handleModalClickForMoviesTab));
  //loop over movie title links and listen for a click
  movieTitleLinksOnMoviesTab.forEach(movieTitleLink => movieTitleLink.addEventListener('click', handleModalClickForMoviesTab));

  //loop over movie info buttons and listen for a click
  moreInfoButtonsOnNominationTab.forEach(moreInfoButton => moreInfoButton.addEventListener('click', handleModalClickForNominationTab));
  //loop over movie title links and listen for a click
  movieTitleLinksOnNominationTab.forEach(movieTitleLink => movieTitleLink.addEventListener('click', handleModalClickForNominationTab));

  //movieImages.forEach(movieImage => movieImage.addEventListener('click', handleModalClick));

  function handleModalClickForMoviesTab(evt){
    //evt.stopPropagation();
    evt.preventDefault();
    //evt.stopPropagation();
    console.log('grabbed the button')
    
    if (evt.target.hasAttribute('data-movie-id')){
      modalContainer.classList.remove('open');
      const movieId = evt.target.getAttribute('data-movie-id');
      //const modalContainer = document.querySelector('.modal-outer');

      //open modal
      modalContainer.classList.add('open');
      
      getMovieDataById(movieId);
      
    }

  }

  function handleModalClickForNominationTab(evt){
    //evt.stopPropagation();
    evt.preventDefault();
    //evt.stopPropagation();
    console.log('grabbed the button')
    
    if (evt.target.hasAttribute('data-movie-id')){
      modalContainer.classList.remove('open');
      const movieId = evt.target.getAttribute('data-movie-id');
      //const modalContainer = document.querySelector('.modal-outer');

      //open modal
      modalContainer.classList.add('open');
      
      getMovieDataByIdForNomineeModal(movieId);
      
    }

  }



}

//close modal
function closeModal(){
  const closeModalIcon = document.querySelector('.modal-inner .close-icon');
  const modalContainer = document.querySelector('.modal-outer');
  closeModalIcon.addEventListener('click', handlecloseModalByIcon );
  
  function handlecloseModalByIcon(evt){
    
    modalContainer.classList.remove('open');
  }

  modalContainer.addEventListener('click', handlecloseModalByModalContainer );
  function handlecloseModalByModalContainer(evt){
    evt.target.classList.remove('open');
  }

}



async function getMovieDataById(movieId){
  try {
    let movieDataURL = `${apiURL}?i=${movieId}&type=${contentType}&apikey=${apiKey}`;
    const response = await axios.get(movieDataURL);
    console.log(response, "getMovieDataById");
    updateModalUI(response);  
  }catch (error) {
    displayError(error);
  }
}

async function getMovieDataByIdForNomineeModal(movieId){
  try {
    let movieDataURL = `${apiURL}?i=${movieId}&type=${contentType}&apikey=${apiKey}`;
    const response = await axios.get(movieDataURL);
    console.log(response, "getMovieDataById");
    updateModalForNomineeUI(response);  
  }catch (error) {
    displayError(error);
  }
}


function updateModalUI(response){
  console.log(response , 'updateModalUI');
  let movie = response.data;
    //if image is not available
    if (movie.Poster == 'N/A'){
        movie.Poster = 'https://m.media-amazon.com/images/M/MV5BNmViZjY5OWQtYTMyZS00NTFjLWI3MjgtMjcyYjJiZjJiNDNkXkEyXkFqcGdeQXVyMzA1NjAzODI@._V1_SX300.jpg'
    }

    let movieCard = `
      <div class="modal-inner">
        <div class="close-icon">
          <svg viewBox="0 0 20 20" class="pass-icon__Svg" tabindex="0" focusable="false" aria-hidden="true">
            <path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
          </svg>
        </div>
        <div class="modal-movie__image-wrapper">
          <img class="modal-movie__image" src="${movie.Poster}" alt="${movie.Title}">
        </div>
        <div class="modal-movie__title-wrapper">
          <h2 tabindex="-1" class="modal-movie__title">${movie.Title}</h2>
          <ul class="modal-movie__detail-list">
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Genre</div>
              <div class="modal-movie__detail-list-item-value">${movie.Genre}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Released</div>
              <div class="modal-movie__detail-list-item-value">${movie.Released}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Rated</div>
              <div class="modal-movie__detail-list-item-value">${movie.Rated}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Director</div>
              <div class="modal-movie__detail-list-item-value">${movie.Director}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Awards</div>
              <div class="modal-movie__detail-list-item-value">${movie.Awards}</div>
            </li>
          </ul>
        </div>
        <div class="modal-movie__plot-wrapper">
          <hr>
          <h3 class="modal-movie__plot-heading">Plot</h3>
          <p class="modal-movie__plot-content">${movie.Plot}</p>
          <button class="btn modal-nominate-btn" data-movie-id="${movie.imdbID}" type="button">Nominate</button>
        </div>
      </div>`;

      const modalContainer = document.querySelector('.modal-outer');
      modalContainer.innerHTML = movieCard;

      //accessibility on modal
      const movieTitle = document.querySelector('.modal-movie__title');   
      movieTitle.focus();

      //disable noominate button on modal if already nominated
      disableNominatedMovieOnModal(movie);

      //nominate movies on modal
      nominateMovieOnModal();
      
     
      //close modal
      closeModal();

      disableMoviesOnMaxNomineeforModal(movie);
  

}


function updateModalForNomineeUI(response){
  console.log(response , 'updateModalForNomineeUI');
  let movie = response.data;
    //if image is not available
    if (movie.Poster == 'N/A'){
        movie.Poster = 'https://m.media-amazon.com/images/M/MV5BNmViZjY5OWQtYTMyZS00NTFjLWI3MjgtMjcyYjJiZjJiNDNkXkEyXkFqcGdeQXVyMzA1NjAzODI@._V1_SX300.jpg'
    }

    let movieCard = `
      <div class="modal-inner">
        <div class="close-icon">
          <svg viewBox="0 0 20 20" class="pass-icon__Svg" tabindex="0" focusable="false" aria-hidden="true">
            <path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
          </svg>
        </div>
        <div class="modal-movie__image-wrapper">
          <img class="modal-movie__image" src="${movie.Poster}" alt="${movie.Title}">
        </div>
        <div class="modal-movie__title-wrapper">
          <h2 tabindex="-1" class="modal-movie__title">${movie.Title}</h2>
          <ul class="modal-movie__detail-list">
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Genre</div>
              <div class="modal-movie__detail-list-item-value">${movie.Genre}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Released</div>
              <div class="modal-movie__detail-list-item-value">${movie.Released}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Rated</div>
              <div class="modal-movie__detail-list-item-value">${movie.Rated}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Director</div>
              <div class="modal-movie__detail-list-item-value">${movie.Director}</div>
            </li>
            <li class="modal-movie__detail-list-item">
              <div class="modal-movie__detail-list-item-title">Awards</div>
              <div class="modal-movie__detail-list-item-value">${movie.Awards}</div>
            </li>
          </ul>
        </div>
        <div class="modal-movie__plot-wrapper">
          <hr>
          <h3 class="modal-movie__plot-heading">Plot</h3>
          <p class="modal-movie__plot-content">${movie.Plot}</p>
          <button class="btn modal-nominate-btn" aria-label="remove ${movie.Title}" nominee data-movie-id="${movie.imdbID}" type="button">Remove</button>
        </div>
      </div>`;

      const modalContainer = document.querySelector('.modal-outer');
      modalContainer.innerHTML = movieCard;

      //disable noominate button on modal if already nominated
      //disableNominatedMovieOnModal(movie);

      //nominate movies on modal
      //nominateMovieOnModal();

      //accessibility on modal
      const movieTitle = document.querySelector('.modal-movie__title');   
      movieTitle.focus();

      //remove movies on modal
      removeNomineeOnModal()

      //close modal
      closeModal();

      //disableMoviesOnMaxNomineeforModal(movie);
  

}

function  nominateMovie(){
    //get nimination buttons
  let nominateButtons = document.querySelectorAll('.nominate');

  // loop over buttons and then add object to local storage
  nominateButtons.forEach(nominateButton => nominateButton.addEventListener('click', addMovieItemsToLocalStorage))

  function addMovieItemsToLocalStorage(evt){
    if (evt.target.hasAttribute('data-movie-id')){
      
      //setAttribute('disabled', 'disabled')
      //evt.target.disabled = 'true'

      //disable button
      evt.target.setAttribute('disabled', 'disabled');
      //add nminated data attribute
      evt.target.setAttribute('nominated', '');
      //change button label to nominated
      evt.target.textContent = 'nominated ✓';
      const movieId = evt.target.getAttribute('data-movie-id');
      
      //let bigCities = cities.filter(city => city.population > 3000000);
      //console.log(movieItems, "movieItems before filter")
      let findMovieById = movieItems[0].filter(movieItem => movieItem.imdbID === movieId);
     // const cala = []
      //cala.push(movieId)
      //movieItems[0].push(bigCities);
      nominatedMovies.push(findMovieById);
      console.log(nominatedMovies, "testing testing big cities")
      //movieItems.push(bigCities)
      //console.log(bigCities, "big cities")
      //console.log(movieItems[0], "movieItems -big cities - new")
      //nominatedMovies.forEach(nominatedMovie => localStorage.setItem('movies', nominatedMovie) )
      //nominatedMovies.push(movie);
    localStorage.setItem('movies', JSON.stringify(nominatedMovies));

    const localStorageItems = JSON.parse(localStorage.getItem('movies'));
    if (localStorageItems.length === maxNominee){
      console.log('you have nominated 5 movies');
      const noticeBanner = document.querySelector('.banner-card-pass__wrapper');
    
  
      //diable  warning banner when the keyword is valid
      if (noticeBanner){
        noticeBanner.classList.remove('hide');
        
        /*
        const reviewBtn = document.querySelector('#banner-card-list__item-link')
        reviewBtn.addEventListener('click', reviewBtns => reviewBtns.style.color = '#fff')
        // navigate to the nomination tab too review nominations
        const reviewBtn = document.querySelector('#banner-card-list__item-link')
        reviewBtn.addEventListener('click', function(evt){
          evt.preventDefault();

          alert('amen')
          const nominationTab = document.querySelector('.nomination-tab.tablink');
          nominationTab.click();

        });

        */
        
        //disable unnominated movie when the maximum number of nominee is reached
        disableMoviesOnMaxNominee();
        
      }
      
    }
   
    
      //getMovieDataByIdforNomination(movieId)

      //nominatedMovies.push(movie)
      //localStorage.setItem('movie', movieItems);
      
    }
    
  }
 
}

//nominate movies on modal
function nominateMovieOnModal(){
  const nominateBtnOnModal = document.querySelector('.modal-nominate-btn');
  
  nominateBtnOnModal.addEventListener('click', handleNominateBtnOnModal);

  function handleNominateBtnOnModal(evt){
    evt.target.setAttribute('disabled', 'disabled');
    evt.target.textContent = "nominated ✓";
    const buttonMovieId = evt.target.getAttribute('data-movie-id');
    for (movieItem of movieItems[0]){
      if (movieItem.imdbID === buttonMovieId){
        const nominateMovie = document.querySelector(`#movies .nominate[data-movie-id="${movieItem.imdbID}"]`);
        //trigger a mouse click
        nominateMovie.click();

      }

    }
    
  }

}

//remove nominee on modal
function removeNomineeOnModal(){
  const nominateBtnOnModal = document.querySelector('.modal-nominate-btn[nominee]');
  
  nominateBtnOnModal.addEventListener('click', handleNominateBtnOnModal);

  function handleNominateBtnOnModal(evt){
    evt.target.setAttribute('disabled', 'disabled');
    evt.target.textContent = "removed";
    const buttonMovieId = evt.target.getAttribute('data-movie-id');
    for (nominatedMovie of nominatedMovies){
      if (nominatedMovie[0].imdbID === buttonMovieId){
        const removeMovie = document.querySelector(`#nomination [nominee][data-movie-id="${nominatedMovie[0].imdbID}"]`);
        //trigger a mouse click
        console.log('jet liiiii')
        removeMovie.click();

      }

    }
    
  }

}

/*
async function getMovieDataByIdforNomination(movieId){
  try {
    let movieDataURL = `${apiURL}?i=${movieId}&type=${contentType}&apikey=${apiKey}`;
    const response = await axios.get(movieDataURL);
    console.log(response, "getMovieDataByIdforNomination");
    const movie = response.data;
    //const nominatedMovies =[];

    nominatedMovies.push(movie);
    localStorage.setItem('movies', JSON.stringify(nominatedMovies));
    //updateModalUI(response);  
    
  }catch (error) {
    displayError(error);
  }
}
*/

function displayNominatedMovie(){
  const localStorageItems = JSON.parse(localStorage.getItem('movies'));
  if (localStorageItems.length){
    
    //push local storage items to array
    //localStorageItems.forEach(item => nominatedMovies.push(item));

    console.log(nominatedMovies, 'from displaynominatedmovie')
    nominatedMovies.push(...localStorageItems);
    //nominatedMovies.push(localStorageItems);
    //console.log(item, 'localStorageItems - displayNominatedMovie')
   
    updateNominationsUI(nominatedMovies);
    
    // delete nominated movie
    deleteNominatedMovie();

    if (localStorageItems.length === maxNominee){
      const noticeBanner = document.querySelector('.banner-card-pass__wrapper');
      //disable  warning banner when the keyword is valid
      if (noticeBanner){
        noticeBanner.classList.remove('hide');
        //disable unnominated movie whrn the max of 5 is reached
        disableMoviesOnMaxNominee();
      }

    }else{
      const noticeBanner = document.querySelector('.banner-card-pass__wrapper');
      if (noticeBanner){
        
        noticeBanner.classList.add('hide');
        //disable unnominated movie whrn the max of 5 is reached
        disableMoviesOnMaxNominee();
      }
    }
    /*
    //display empty state if the movieItems array is empty
    if (!movieItems.length && localStorageItems < 5 ){
      const defaultState = document.querySelector('#movies .empty-state__container');
      defaultState.classList.remove('hide');

    }
    */

  }
/*
  if (localStorageItems.length === 5){

    console.log('you have nominated 5 movies');

  }
  */
}

//display or update movies on the nomination tab
function updateNominationsUI(nominatedMovies){
  
  const defaultState = document.querySelector('#nomination .empty-state__container');
  
  //const errorMessage = document.querySelector('.error-message_wrapper')
  //const testing = document.querySelector('.testing');
   //diable nomication tab default state
 /* if (defaultState){
    defaultState.classList.add('hide');
  }
  */

  // remove the empty state if the array is not empty and return if empty
  if (defaultState && nominatedMovies.length !== 0){
    defaultState.classList.add('hide');
  }else{
    defaultState.classList.remove('hide');
    const nominateButtonOnEmptyState = document.querySelector('.btn.empty-state-nominate-btn');
    switchToMovieTab(nominateButtonOnEmptyState);
    
  }

  
   //diable error message when keyword is valid
   /*
  if (errorMessage){
    errorMessage.style.display = 'none';
  }
  */
 //const nextCard = document.querySelector('#nomination .card');
console.log(nominatedMovies, 'updateNominationsUI- na so we dey');
  //get data from object
  let movieCard='';
  nominatedMovies.forEach(nominatedMovie => {
    //nominatedMovie[0].Title
    //if image is not available
    if (nominatedMovie[0].Poster == 'N/A'){
      nominatedMovie[0].Poster = 'https://m.media-amazon.com/images/M/MV5BNmViZjY5OWQtYTMyZS00NTFjLWI3MjgtMjcyYjJiZjJiNDNkXkEyXkFqcGdeQXVyMzA1NjAzODI@._V1_SX300.jpg'
    }
    //const pageHeading = document.querySelector('.movie-card__heading');
    //const searchKeyword = document.querySelector('[name="search"]').value;
    //pageHeading.innerHTML = `${movieItems[0].length} results found for "${searchKeyword}"`;

    movieCard += `
                <div class="card" data-description="${nominatedMovie[0].Title}">
                  <img src="${nominatedMovie[0].Poster}" alt="${nominatedMovie[0].Title}">
                  <div class="movie-card__content">
                    <h2 class="movie-card__title small--text-center"><a class="movie-card__title-link" data-movie-id="${nominatedMovie[0].imdbID}" href="#">${nominatedMovie[0].Title}</a></h2>
                    <ul class="subtext-wrapper">
                        <li class="subtext-item small--text-center">${nominatedMovie[0].Year}</li>
                    </ul>
                  </div>
                  <button class="btn-secondary details" data-movie-id="${nominatedMovie[0].imdbID}" type="button">More info</button>
                  <button class="btn remove-btn" nominee data-movie-id="${nominatedMovie[0].imdbID}" type="button" >Remove</button>
                </div>`

      //nominationSection.insertAdjacentHTML("afterbegin" , movieCard);
     //nominationSection.innerHTML = movieCard;
     //nominationSection.innerHTML = movieCard;
     //movieSection.insertAdjacentHTML("afterbegin" , movieCard);
      //testing.insertAdjacentHTML("afterbegin" , movieCard);
      
      //nominationSection.insertAdjacentHTML("afterbegin" , movieCard);
      //nominationSection.innerHTML += movieCard;
      //nominationSection.innerHTML ="";
  })
  nominationSection.innerHTML = movieCard;

  //open and close modal to display more movie details
  openModal();

  //delete nominated movie
  deleteNominatedMovie();
  //displayNominatedMovie();

}


function deleteNominatedMovie(){
  nominationSection.addEventListener('click', function(evt){
    if (evt.target.matches('button.remove-btn')){
      console.log('deleting nominated movie');
     
     const movieId = evt.target.getAttribute('data-movie-id');
      
     //filter deleted movie by ID and then pass it to the nominatedMovies array  tp overwrite it
     nominatedMovies = nominatedMovies.filter(nominatedMovie => nominatedMovie[0].imdbID !== movieId);
     //console.log(findMovieById,"findMovieById")
     //updateNominationsUI(findMovieById);
     localStorage.setItem('movies', JSON.stringify(nominatedMovies))
     updateNominationsUI(nominatedMovies);

     //update results UI in oreer to return movie back to the nomination tab and enable the nominate button
     //updateResultUI(movieItems);

      //update results UI after removing movie from the nomination list
      if (movieItems.length){
        updateResultUI(movieItems); 
      }


     //localStorage.setItem('movies', JSON.stringify(nominatedMovies))
     //nominatedMovies.pop(findMovieById);
     /*
     const indexOfItem = nominatedMovies.findIndex(findMovieById);
     console.log(indexOfItem)
     nominatedMovies.splice(indexOfItem, 1);
     console.log(nominatedMovies);
      if (localStorage.getItem("movies") !== null) {
        updateNominationsUI(nominatedMovies);
        
      }
      */

     
    }
  })
}


//disable nominated movie button 
function disableNominatedMovieOnSearchResults(){
 
  for (movieItem of movieItems[0]){
    for (nominatedMovie of nominatedMovies){

      if (movieItem.imdbID === nominatedMovie[0].imdbID ){
        console.log(movieItem.imdbID, "we found the ID")
        let nominatedMovieBtns = document.querySelectorAll(`button.nominate[data-movie-id="${movieItem.imdbID}"]`)
        //let disabledAttribute = document.createAttribute('disabled');
        for (nominatedMovieBtn of nominatedMovieBtns){
          nominatedMovieBtn.setAttribute('disabled', 'disabled');
          nominatedMovieBtn.setAttribute('nominated', '');
          nominatedMovieBtn.textContent ="nominated ✓";
        }
        
        
      }

    }

  }
}

function disableNominatedMovieOnModal(movie){
 const nominatedMovieBtnOnModal = document.querySelector(`button.modal-nominate-btn[data-movie-id="${movie.imdbID}"]`)
 
    for (nominatedMovie of nominatedMovies){ 
      if (movie.imdbID === nominatedMovie[0].imdbID ){
        console.log(movie.imdbID, "we found the ID on modal")
        //let disabledAttribute = document.createAttribute('disabled');
        nominatedMovieBtnOnModal.setAttribute('nominated', 'nominated');
        nominatedMovieBtnOnModal.setAttribute('disabled', 'disabled');
        //nominatedMovieBtnOnModal.setAttribute('nominated', 'nominated');
        nominatedMovieBtnOnModal.textContent ="nominated ✓";
        
        //nominatedMovieBtnOnModal.setAttribute('nominated', 'disabled');

        
        
      }

    }
 
  
}


//go to movies tab when the nominate button is clciked
function switchToMovieTab(triggerElement){
  //const triggerElementAction = document.querySelector(`${triggerElement}`);
  //const nominateButtonOnEmptyState = document.querySelector('.btn.empty-state-nominate-btn');

  triggerElement.addEventListener('click', function(){
  const moviesTab = document.querySelector('.movies-tab.tablink');
  moviesTab.click();


  });
}



 //when the max number of movie is nominated, disable remaining unnominated movie
 function disableMoviesOnMaxNominee(){
  //setAttribute('disabled', 'disabled');

  
/*
    const localStorageItems = JSON.parse(localStorage.getItem('movies'));
    if (localStorageItems.length === 5){
      nominatedMovies = nominatedMovies.filter(nominatedMovie => nominatedMovie[0].imdbID !== movieId);
      
    }
*/
/*
const unnominatedBtns = movieItem.querySelectorAll('.nominate[data-movie-id]');
            unnominatedBtns.forEach(unnominatedBtn => unnominatedBtn.getAttribute('data-movie-id'));
            if (=== unnominatedBtn){
            unnominatedBtn.setAttribute('disabled','diasbled');
            unnominatedBtn.textContent = 'unavailable';
            }
*/

//.getAttribute('data-movie-id');
    const localStorageItems = JSON.parse(localStorage.getItem('movies'));
    if (localStorageItems.length === maxNominee && movieItems.length){
      for (movieItem of movieItems[0]){
        for (nominatedMovie of nominatedMovies){
          if (movieItem !== nominatedMovie[0] ){
                const unnominatedMovieId = movieItem.imdbID
              const unnominatedMovieBtns = document.querySelectorAll('.nominate[data-movie-id]');
              unnominatedMovieBtns.forEach(unnominatedMovieBtn => {
                unnominatedMovieBtn.setAttribute('data-movie-unnominated-id',`${movieItem.imdbID}`)
                if(unnominatedMovieId === unnominatedMovieBtn.getAttribute('data-movie-unnominated-id') ){
                  if(!unnominatedMovieBtn.hasAttribute('nominated')){
                    unnominatedMovieBtn.setAttribute('disabled','disabled');
                    unnominatedMovieBtn.textContent = 'unavailable';
  
                  }
                  
                
                }
                
                

              });
              
              
            
          }
    
        }
    
      }
    }


}

function disableMoviesOnMaxNomineeforModal(movie){
  //let movie = response.data.imdbID;
  const localStorageItems = JSON.parse(localStorage.getItem('movies'));
  const nominatedMovieBtnOnModal = document.querySelector(`button.modal-nominate-btn[data-movie-id="${movie.imdbID}"]`)
  if (localStorageItems.length === maxNominee){
    for (nominatedMovie of nominatedMovies){ 
      if (movie.imdbID !== nominatedMovie[0].imdbID ){
        console.log(movie.imdbID, "we found the ID on modal")
        //let disabledAttribute = document.createAttribute('disabled');
        if (!nominatedMovieBtnOnModal.hasAttribute('nominated')){
            //nominatedMovieBtnOnModal.setAttribute('nominated', 'disabled');
          nominatedMovieBtnOnModal.setAttribute('disabled', 'disabled');
          nominatedMovieBtnOnModal.textContent ="unavailable";
          //nominatedMovieBtnOnModal.setAttribute('nominated', 'disabled');

        }
        

  
        
        
      }
  
    }
  }
  

}

/*
function disableNominatedMovieOnModal(movie){
  const nominatedMovieBtnOnModal = document.querySelector(`button.modal-nominate-btn[data-movie-id="${movie.imdbID}"]`)
  
     for (nominatedMovie of nominatedMovies){ 
       if (movie.imdbID === nominatedMovie[0].imdbID ){
         console.log(movie.imdbID, "we found the ID on modal")
         //let disabledAttribute = document.createAttribute('disabled');
         nominatedMovieBtnOnModal.setAttribute('disabled', 'disabled');
         nominatedMovieBtnOnModal.textContent ="nominated ✓";
         //nominatedMovieBtnOnModal.setAttribute('nominated', 'disabled');
 
         
         
       }
 
     }
  
   
 }
*/

function displayError(error){
  const erroeMessageContainer = document.querySelector('.error-message_wrapper');
  const errorMessage = `<p class="error-message"><strong>${error}</strong> : Sorry, something went wrong</p>`;
  erroeMessageContainer.innerHTML = errorMessage;
}

/*
 function getMovieData(searchKeyword){
    let movieDataURL = `${apiURL}?s=${searchKeyword}&apikey=${apiKey}`;
    
    axios.get(movieDataURL)
    .then(response => response.json())
    console.log(response)
 }
*/

/*
// function to get movie api data
const getMovieData = async(url)=> {

    const res = await fetch(url)
        try {
          const data = await res.json()
          console.log(data)
          return data
  
        }catch(error) {
            console.log("error", error);
            }
  
  };

// display error UI
function handleError(error){
    displayError = ` Error ${err} : Sorry, something went wrong`;

    return displayError;
}


const updateUI = async (url='') => {
    const request = await fetch(url);
    try{

      const allData = await request.json();

          allData.forEach(data => {
              let movieCard = `
              <div class="grid movie-card__container">
              <div class="movie-card grid__item medium-up--one-half medium--one-quarter large-up--one-quarter">
                <div class="movie-card__inner-wrapper">
                  <div class="movie-card__image-wrapper">
                    <a href="2020/blog-post.html" class="movie-card__link">
                      <img class="movie-card__image" src="${data.Poster}" alt="${data.Title}">
                    </a>
                  </div>
                  <div class="movie-card__content-wrapper">
                    <h2 class="movie-card__title">
                        <a href="#">${data.Title}</a>
                    </h2>
                    <ul class="subtext-wrapper">
                        <li class="subtext-item">${data.Genre}</li>
                        <li class="subtext-item">${data.Year}</li>
                    </ul>
                    <button class="btn more-btn" type="button">More</button>
                    <button class="btn vote-btn" type="button">Nominate</button>
                  </div>
                </div>
              </div>
            </div>`;
          })

          section.insertAdjacentHTML("beforeend" , movieCard);
     
    }catch(error) {
        console.log("error", error);
        }
  }

  */