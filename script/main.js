window.addEventListener('DOMContentLoaded', (event) => {
  openTab();
  //check if key exist in the local storage
  if (localStorage.getItem("movies") !== null) {
    displayNominatedMovie();
    //display total  number of nominated move on page load
    const localStorageItems = JSON.parse(localStorage.getItem('movies'));
    displayTotalNumberOfMoviesNominated(localStorageItems);
  } 
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
    tabLinks.forEach(tabButton => {
      //accessibility
      tabButton.setAttribute('aria-selected', 'false');
      tabButton.classList.remove('selected-tab')
    });
    evt.target.classList.add('selected-tab');
    tabWrappers.forEach(tabButton => tabButton.classList.remove('selected-tab'));
    const closestTabWrapper = evt.target.closest('.tab-title__wrapper');
    closestTabWrapper.classList.add('selected-tab');
    // add selected-tabcontent class to the corresponding tabcontents 
    if (evt.target.classList.contains('movies-tab')){
      //accessibility
      evt.target.setAttribute('aria-selected', 'true');
      allTabContents.forEach(tabContent => tabContent.classList.remove('selected-tabcontent'));
      tabMoviesContent.classList.add('selected-tabcontent')
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
        //accessibility
        evt.target.setAttribute('aria-selected', 'true');
        allTabContents.forEach(tabContent => tabContent.classList.remove('selected-tabcontent'));
        tabNominationContent.classList.add('selected-tabcontent')
        //update nomination tab if local storage is not empty
        if (localStorage.getItem("movies") !== null) {
          updateNominationsUI(nominatedMovies);
          //displayNominatedMovie()
        } 
    }
  };
}

/* Global Variables */

//api settings object
const apiSettings ={
  apiUrl: 'https://www.omdbapi.com/',
  apiKey : 'dc6083ad',
  contentType : 'movie'

}
//array to hold search term
let searchTerm =[];
// array to hold state from searched movies
let movieItems = [];
// array to hold state for nominated movies
let nominatedMovies = [];

const maxNominee = 5;
const unavailableImage ='https://cdn.shopify.com/s/files/1/2506/6936/files/image-unavailable.svg?v=1609864912';
const searchButton = document.querySelector('.search-form__submit-button');
const searchForm = document.querySelector('.search-form');
const movieSection = document.querySelector('#movies .cards');
const nominationSection = document.querySelector('#nomination .cards');
const spinnerButtonIcon =`<span class="spinner  button-spinner">
      <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><path d="M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"></path></svg>
  </span>`;

//language
const unavailableButtonName ="unavailable";
const nominatedButtonName = "nominated ✓";
const removedButtonName ="removed";

searchForm.addEventListener('submit', handleSubmit);
 function handleSubmit(evt){
  evt.preventDefault();
  let searchKeyword = document.querySelector('[name="search"]').value;
  searchTerm.unshift(searchKeyword);
  //switch to the movies tab
  const moviesTab = document.querySelector('.movies-tab.tablink');
  moviesTab.click();
  window.location ='#empty-state__heading';
  //get api data
  getMovieDataByKeyword(searchKeyword);
 };
 
 async function getMovieDataByKeyword(searchKeyword) {
  try {
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
    //Skeleton loading   
    let skeletonCards ="";
    for (i = 0; i < 10; i++){
      skeletonCards += `
    <div class="card">
        <div class="movie-card__image-wrapper loading">
        </div>
        <div class="movie-card__content">
          <h4 class="movie-card__title small--text-center loading"></h4>
          <ul class="subtext-wrapper">
              <li class="subtext-item small--text-center loading"></li>
          </ul>
        </div>
        <div class="loading-skeleton__button loading"></div>
      </div>`;
    }

    //skeleton loading
    movieSection.innerHTML = skeletonCards;

    let movieDataURL = `${apiSettings.apiUrl}?s=${searchKeyword}&type=${apiSettings.contentType}&apikey=${apiSettings.apiKey}`;
    const response = await axios.get(movieDataURL);
    const invalidData = response.data.Response;
    const validData = response.data.Search;
    //validate input
    if (invalidData == 'False'){
      validateKeyword(invalidData);
    }
    //put data to object
    movieItems.unshift(validData);
    //timer delay for skeleton loading
    setTimeout(() => {
      //update UI with results
      updateResultUI(movieItems); 
      }, 500);
      
    //reset oor clear search form
    searchForm.reset();
  }catch (error) {
    displayError(error);
  }
}

function updateResultUI(movieItems){
  let movieCard ="";
  //get data from object
  movieItems[0].forEach(movieItem => {
    //if image is not available
    if (movieItem.Poster == 'N/A'){
      movieItem.Poster = unavailableImage;
    }
    movieCard += `
                <div class="card" data-description="${movieItem.Title}">
                  <img width="195" height="341" class="movie-card__image" src="${movieItem.Poster}" alt="${movieItem.Title}">
                  <div class="movie-card__content">
                    <h4 class="movie-card__title small--text-center"><a class="movie-card__title-link" data-movie-id="${movieItem.imdbID}" href="#">${movieItem.Title}</a></h4>
                    <ul class="subtext-wrapper">
                        <li class="subtext-item small--text-center">${movieItem.Year}</li>
                    </ul>
                  </div>
                  <button class="btn-secondary details" data-movie-id="${movieItem.imdbID}" type="button">More info</button>
                  <button class="btn nominate" data-movie-id="${movieItem.imdbID}" type="button">Nominate</button>
                </div>`;
  })
  
  movieSection.innerHTML = movieCard;
  const resultCounter = document.querySelector('.movie-card__heading-wrapper');
  const totalNumberOfMoviesFound = movieItems[0].length;
  resultCounter.innerHTML = `<h3 class="text-center movie-card__heading">${totalNumberOfMoviesFound} results found for <span class="search-keyword">"${searchTerm[0]}"</span></h3>`;
  const moviesTabContentCount = document.querySelector('.movies-tab .tab-content-count');
  //display total number of movies found
  moviesTabContentCount.innerHTML = totalNumberOfMoviesFound;
  //diable nominated movie button on search results
  disableNominatedMovieOnSearchResults();
  //open and close modal to display more movie details
  openModal();
  //nominate movie
  nominateMovie();
  //when the max number of movie is nominated, disable remaining unnominated movie
  disableMoviesOnMaxNominee();
}

// If movie not found or wrong search term
function validateKeyword(invalidData){
  const tabTopSection = document.querySelector('#banner-card');
  const searchKeyword = document.querySelector('[name="search"]').value;
  const systemErrorMessage = document.querySelector('.error-message_wrapper');
  const resultCounter = document.querySelector('.movie-card__heading');
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
      </div>
    </div>`;
    tabTopSection.innerHTML = warningBanner;
  }
  //hide system error coming from catch
  systemErrorMessage.classList.add('hide');
  //remove result count
  resultCounter.classList.add('hide');
}

//open modal
function openModal(){
  //get data attribute from more info button
  let moreInfoButtonsOnMoviesTab = document.querySelectorAll('#movies .cards .details');
  let moreInfoButtonsOnNominationTab = document.querySelectorAll('#nomination .cards .details');
  const modalContainer = document.querySelector('.modal-outer');
  let movieTitleLinksOnMoviesTab = document.querySelectorAll('#movies .cards .movie-card__title-link');
  let movieTitleLinksOnNominationTab = document.querySelectorAll('#nomination .cards .movie-card__title-link');
  //loop over movie info buttons and listen for a click
  moreInfoButtonsOnMoviesTab.forEach(moreInfoButton => moreInfoButton.addEventListener('click', handleModalClickForMoviesTab));
  //loop over movie title links and listen for a click
  movieTitleLinksOnMoviesTab.forEach(movieTitleLink => movieTitleLink.addEventListener('click', handleModalClickForMoviesTab));
  //loop over movie info buttons and listen for a click
  moreInfoButtonsOnNominationTab.forEach(moreInfoButton => moreInfoButton.addEventListener('click', handleModalClickForNominationTab));
  //loop over movie title links and listen for a click
  movieTitleLinksOnNominationTab.forEach(movieTitleLink => movieTitleLink.addEventListener('click', handleModalClickForNominationTab));

  function handleModalClickForMoviesTab(evt){
    evt.preventDefault();
    if (evt.target.hasAttribute('data-movie-id')){
      modalContainer.classList.remove('open');
      const movieId = evt.target.getAttribute('data-movie-id');
      //open modal
      modalContainer.classList.add('open');
      getMovieDataById(movieId);
    }
  }

  function handleModalClickForNominationTab(evt){
    evt.preventDefault();
    if (evt.target.hasAttribute('data-movie-id')){
      modalContainer.classList.remove('open');
      const movieId = evt.target.getAttribute('data-movie-id');
      //open modal
      modalContainer.classList.add('open');
      getMovieDataByIdForNomineeModal(movieId);
    }
  }
}

//close modal
function closeModal(){
  const closeModalIcon = document.querySelector('.modal-inner .close-icon');
  const modalOuter = document.querySelector('.modal-outer');

  closeModalIcon.addEventListener('click', handlecloseModalByIcon );
  function handlecloseModalByIcon(){
    modalOuter.classList.remove('open');
  }

  modalOuter.addEventListener('click', handlecloseModalByModalContainer );
  function handlecloseModalByModalContainer(evt){
    evt.target.classList.remove('open');
  }

  window.addEventListener('keydown', handlecloseModalByEsc );
  function handlecloseModalByEsc(evt){
    if (evt.key === 'Escape'){
      modalOuter.classList.remove('open');
    }
  }
}

async function getMovieDataById(movieId){
  try {
    let movieDataURL = `${apiSettings.apiUrl}?i=${movieId}&type=${apiSettings.contentType}&apikey=${apiSettings.apiKey}`;
    const response = await axios.get(movieDataURL);
    updateModalUI(response);  
  }catch (error) {
    displayError(error);
  }
}

async function getMovieDataByIdForNomineeModal(movieId){
  try {
    let movieDataURL = `${apiSettings.apiUrl}?i=${movieId}&type=${apiSettings.contentType}&apikey=${apiSettings.apiKey}`;
    const response = await axios.get(movieDataURL);
    updateModalForNomineeUI(response);  
  }catch (error) {
    displayError(error);
  }
}

function updateModalUI(response){
  let movie = response.data;
  //if image is not available
  if (movie.Poster == 'N/A'){
      movie.Poster = unavailableImage;
  }

  let movieCard = `
    <div tabindex="-1" class="modal-inner">
      <div class="close-icon">
        <svg viewBox="0 0 20 20" class="pass-icon__Svg" tabindex="0" focusable="false" aria-hidden="true">
          <path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
        </svg>
      </div>
      <div class="modal-movie__image-wrapper">
        <img width="300" height="444" class="modal-movie__image" src="${movie.Poster}" alt="${movie.Title}">
      </div>
      <div class="modal-movie__title-wrapper">
        <h2 class="modal-movie__title">${movie.Title}</h2>
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
    const modalInner = document.querySelector('.modal-inner');   
    modalInner.focus();
    //disable noominate button on modal if already nominated
    disableNominatedMovieOnModal(movie);
    //nominate movies on modal
    nominateMovieOnModal();
    //close modal
    closeModal();
    disableMoviesOnMaxNomineeforModal(movie);
}

function updateModalForNomineeUI(response){
  let movie = response.data;
  //if image is not available
  if (movie.Poster == 'N/A'){
      movie.Poster = unavailableImage;
  }

  let movieCard = `
    <div tabindex="-1" class="modal-inner">
      <div class="close-icon">
        <svg viewBox="0 0 20 20" class="pass-icon__Svg" tabindex="0" focusable="false" aria-hidden="true">
          <path d="M11.414 10l4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
        </svg>
      </div>
      <div class="modal-movie__image-wrapper">
        <img width="300" height="444" class="modal-movie__image" src="${movie.Poster}" alt="${movie.Title}">
      </div>
      <div class="modal-movie__title-wrapper">
        <h2 class="modal-movie__title">${movie.Title}</h2>
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

  //accessibility on modal
  const modalInner = document.querySelector('.modal-inner');   
  modalInner.focus();
  //remove movies on modal
  removeNomineeOnModal()
  //close modal
  closeModal();
}

function nominateMovie(){
  //get nimination buttons
  let nominateButtons = document.querySelectorAll('.nominate');
  // loop over buttons and then add object to local storage
  nominateButtons.forEach(nominateButton => nominateButton.addEventListener('click', addMovieItemsToLocalStorage))
  function addMovieItemsToLocalStorage(evt){
    const button = evt.target;
    if (button.hasAttribute('data-movie-id')){
      //add loading spinner
      button.innerHTML=`${spinnerButtonIcon}`;
      //timer for loading spinner
      setTimeout(() => {
        //disable button
        button.setAttribute('disabled', 'disabled');
        button.setAttribute('aria-disabled', 'true');
        //add nminated data attribute
        button.setAttribute('nominated', '');
        //change button label to nominated
        button.textContent = nominatedButtonName;
        }, 500);

      const movieId = button.getAttribute('data-movie-id');
      let findMovieById = movieItems[0].filter(movieItem => movieItem.imdbID === movieId);
      nominatedMovies.push(findMovieById);
      //store in local storage
      localStorage.setItem('movies', JSON.stringify(nominatedMovies));
      const localStorageItems = JSON.parse(localStorage.getItem('movies'));
      if (localStorageItems.length === maxNominee){
        const noticeBanner = document.querySelector('.banner-card-pass__wrapper');
        //disable  warning banner when the keyword is valid
        if (noticeBanner){
          noticeBanner.classList.remove('hide');
          //timer to allow loading spinner before disabling the remaining movies maximum number of nominee is reached
          setTimeout(() => {
            //disable unnominated movie when the maximum number of nominee is reached
            disableMoviesOnMaxNominee();
          }, 500);
        } 
      }
      //display total number o movies nominated when a movie is noominated
      displayTotalNumberOfMoviesNominated(localStorageItems);
    }
  }
}

//nominate movies on modal
function nominateMovieOnModal(){
  const nominateBtnOnModal = document.querySelector('.modal-nominate-btn');

  nominateBtnOnModal.addEventListener('click', handleNominateBtnOnModal);
  function handleNominateBtnOnModal(evt){
    const button = evt.target;
    //add loading spinner
    button.innerHTML=`${spinnerButtonIcon}`;
    setTimeout(() => {
      button.setAttribute('disabled', 'disabled');
      button.setAttribute('aria-disabled', 'true');
      button.textContent = nominatedButtonName;
    }, 500);
    const buttonMovieId = button.getAttribute('data-movie-id');
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
    const button = evt.target;
    //add loading spinner
    button.innerHTML=`${spinnerButtonIcon}`;
    setTimeout(() => {
      button.setAttribute('disabled', 'disabled');
      button.setAttribute('aria-disabled', 'true');
      button.textContent = removedButtonName;
        }, 500);
    const buttonMovieId = button.getAttribute('data-movie-id');
    for (nominatedMovie of nominatedMovies){
      if (nominatedMovie[0].imdbID === buttonMovieId){
        const removeMovie = document.querySelector(`#nomination [nominee][data-movie-id="${nominatedMovie[0].imdbID}"]`);
        //trigger a mouse click
        removeMovie.click();
      }
    }
  }
}

function displayNominatedMovie(){
  const localStorageItems = JSON.parse(localStorage.getItem('movies'));
  if (localStorageItems.length){
    nominatedMovies.push(...localStorageItems);
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
  }
}

//display or update movies on the nomination tab
function updateNominationsUI(nominatedMovies){
  const defaultState = document.querySelector('#nomination .empty-state__container');
  // remove the empty state if the array is not empty and return if empty
  if (defaultState && nominatedMovies.length !== 0){
    defaultState.classList.add('hide');
  }else{
    defaultState.classList.remove('hide');
    const nominateButtonOnEmptyState = document.querySelector('.btn.empty-state-nominate-btn');
    switchToMovieTab(nominateButtonOnEmptyState);
  }
  //get data from object
  let movieCard='';
  nominatedMovies.forEach(nominatedMovie => {
    //if image is not available
    if (nominatedMovie[0].Poster == 'N/A'){
      nominatedMovie[0].Poster = unavailableImage;
    }

    movieCard += `
                <div class="card" data-description="${nominatedMovie[0].Title}">
                  <img width="195" height="341" src="${nominatedMovie[0].Poster}" alt="${nominatedMovie[0].Title}">
                  <div class="movie-card__content">
                    <h4 class="movie-card__title small--text-center"><a class="movie-card__title-link" data-movie-id="${nominatedMovie[0].imdbID}" href="#">${nominatedMovie[0].Title}</a></h4>
                    <ul class="subtext-wrapper">
                        <li class="subtext-item small--text-center">${nominatedMovie[0].Year}</li>
                    </ul>
                  </div>
                  <button class="btn-secondary details" data-movie-id="${nominatedMovie[0].imdbID}" type="button">More info</button>
                  <button class="btn remove-btn" nominee data-movie-id="${nominatedMovie[0].imdbID}" type="button" >Remove</button>
                </div>`
  });
  nominationSection.innerHTML = movieCard;
  //open and close modal to display more movie details
  openModal();
  //delete nominated movie
  deleteNominatedMovie();
}

function deleteNominatedMovie(){
  nominationSection.addEventListener('click', function(evt){
    const button = evt.target;
    if (button.matches('button.remove-btn')){
      //add loading spinner
      button.innerHTML=`${spinnerButtonIcon}`;
    }
    //timer to allow loading spinners to kick in before removing nominee
    setTimeout(() => {
      if (button.matches('button.remove-btn')){
        const movieId = button.getAttribute('data-movie-id');
        //filter deleted movie by ID and then pass it to the nominatedMovies array  tp overwrite it
        nominatedMovies = nominatedMovies.filter(nominatedMovie => nominatedMovie[0].imdbID !== movieId);
        localStorage.setItem('movies', JSON.stringify(nominatedMovies))
        updateNominationsUI(nominatedMovies);
        //update total number of nominated movie
        const localStorageItems = JSON.parse(localStorage.getItem('movies'));
        displayTotalNumberOfMoviesNominated(localStorageItems);
        //update results UI after removing movie from the nomination list
        if (movieItems.length){
          updateResultUI(movieItems); 
        }
      }
    }, 500);
  })
}

//disable nominated movie button 
function disableNominatedMovieOnSearchResults(){
  for (movieItem of movieItems[0]){
    for (nominatedMovie of nominatedMovies){
      if (movieItem.imdbID === nominatedMovie[0].imdbID ){
        let nominatedMovieBtns = document.querySelectorAll(`button.nominate[data-movie-id="${movieItem.imdbID}"]`)
        //let disabledAttribute = document.createAttribute('disabled');
        for (nominatedMovieBtn of nominatedMovieBtns){
          nominatedMovieBtn.setAttribute('disabled', 'disabled');
          nominatedMovieBtn.setAttribute('aria-disabled', 'true');
          nominatedMovieBtn.setAttribute('nominated', '');
          nominatedMovieBtn.textContent = nominatedButtonName;
        }
      }
    }
  }
}

function disableNominatedMovieOnModal(movie){
 const nominatedMovieBtnOnModal = document.querySelector(`button.modal-nominate-btn[data-movie-id="${movie.imdbID}"]`);
    for (nominatedMovie of nominatedMovies){ 
      if (movie.imdbID === nominatedMovie[0].imdbID ){
        //let disabledAttribute = document.createAttribute('disabled');
        nominatedMovieBtnOnModal.setAttribute('nominated', 'nominated');
        nominatedMovieBtnOnModal.setAttribute('disabled', 'disabled');
        nominatedMovieBtnOnModal.setAttribute('aria-disabled', 'true');
        nominatedMovieBtnOnModal.textContent = nominatedButtonName;
      }
    }
}

//go to movies tab when the nominate button is clicked
function switchToMovieTab(triggerElement){
  triggerElement.addEventListener('click', function(){
  const moviesTab = document.querySelector('.movies-tab.tablink');
  moviesTab.click();
  });
}

 //when the max number of movie is nominated, disable remaining unnominated movie
 function disableMoviesOnMaxNominee(){
    const localStorageItems = JSON.parse(localStorage.getItem('movies'));
    if (localStorageItems){
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
                      unnominatedMovieBtn.setAttribute('aria-disabled', 'true');
                      unnominatedMovieBtn.textContent = unavailableButtonName;
                    }
                  }
                });
            }
          }
        }
      }
    }
}

function disableMoviesOnMaxNomineeforModal(movie){
  const localStorageItems = JSON.parse(localStorage.getItem('movies'));
  const nominatedMovieBtnOnModal = document.querySelector(`button.modal-nominate-btn[data-movie-id="${movie.imdbID}"]`)
  if (localStorageItems.length === maxNominee){
    for (nominatedMovie of nominatedMovies){ 
      if (movie.imdbID !== nominatedMovie[0].imdbID ){
        if (!nominatedMovieBtnOnModal.hasAttribute('nominated')){
          nominatedMovieBtnOnModal.setAttribute('disabled', 'disabled');
          nominatedMovieBtnOnModal.setAttribute('aria-disabled', 'true');
          nominatedMovieBtnOnModal.textContent = unavailableButtonName;
        }
      }
    }
  }
}
function displayTotalNumberOfMoviesNominated(localStorageItems){
  if (localStorageItems){
    //grab total number of movies nominated from local storage
    const totalNumberOfMoviesNominated = localStorageItems.length;
    const nominationTabContentCount = document.querySelector('.nomination-tab .tab-content-count');
    //display total number of movies nominated
    nominationTabContentCount.innerHTML = totalNumberOfMoviesNominated;
  }
}

function displayError(error){
  const erroeMessageContainer = document.querySelector('.error-message_wrapper');
  const errorMessage = `<p class="error-message"><strong>${error}</strong> : Sorry, something went wrong</p>`;
  erroeMessageContainer.innerHTML = errorMessage;
}