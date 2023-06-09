import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const load = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37137772-1a086c34cc6bb66f52c7a1fd6';

form.addEventListener('submit', onSubmit);
load.addEventListener('click', onLoad);

let html = '';
let count = 1;

async function onSubmit(e) {
  e.preventDefault();

  gallery.innerHTML = ``;

  count = 1;
  const query = input.value.trim();
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&page=${count}&per_page=4`;

  try {
    await onFetch(url);
  } catch (error) {
    handleError(error);
  }
}

async function onLoad(e) {
  e.preventDefault();
  count++;

  const query = input.value.trim();
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&page=${count}&per_page=4`;

  try {
    await onFetch(url);
  } catch (error) {
    handleError(error);
  }

}

async function onFetch(url) {
  try {
    const response = await axios.get(url);
    const data = await response.data;
    await handleResponse(data);
  } catch (error) {
    handleError(error);
  }
}

function handleResponse(data) {
  const { hits } = data;
  if (hits.length === 0) {
    Notiflix.Notify.failure('No results found.');
    load.style.display = 'none';
    gallery.innerHTML = ``;
  } else {
    addPhotoCards(hits);
    load.style.display = 'block';
  }
}

function addPhotoCards(hits) {
  html = '';
  for (let el of hits) {
    const { likes, views, comments, downloads, largeImageURL } = el;
    html += `<div class="photo-card">
                <a href="${largeImageURL}">
                  <img src="${largeImageURL}" alt="cat" loading="lazy" />
                </a>
                <div class="info">
                  <p class="info-item">
                    <b>Likes</b>: ${likes}
                  </p>
                  <p class="info-item">
                    <b>Views</b>: ${views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>: ${comments}
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>: ${downloads}
                  </p>
                </div>
              </div>`;
  }

  gallery.innerHTML += html;

  // Initialize SimpleLightbox
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function handleError(error) {
  console.log(error);
  Notiflix.Notify.failure('An error occurred. Please try again later.');
}