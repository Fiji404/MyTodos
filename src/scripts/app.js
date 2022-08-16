const navbar = document.getElementById('navbar');
const searchBtn = document.getElementById('search-btn');
const searchInputEl = document.getElementById('search-input');

navbar.addEventListener('click', ({ target }) => {
    const closestParentElement = target.closest('#search-btn') || target.closest('#button-app-options');
    if (!closestParentElement) return;
    if (closestParentElement.matches('#search-btn')) {
        searchInputEl.value || searchInputEl.focus();
    }
    if (closestParentElement.matches('#button-app-options')) {
        closestParentElement.classList.toggle('button-hamburger--active-state');
        closestParentElement.previousElementSibling.classList.toggle('app-option--hidden');
    }
});

searchInputEl.addEventListener('input', ({ target: { value } }) => {
    searchBtn.classList.toggle('bg-green-400', !!value);
});
