import {
    elements //get the html elements from BASE
} from './base';
import {
    elementStrings
} from './base';
export const getInput = () => elements.searchInput.value; // remember that arrow functions return what is after the arrow

export const clearInput = () => {
    elements.searchInput.value = '' //input value becomes empty
};

export const clearResults = () => {
    elements.searchResList.innerHTML = ''; // sets inner HTML to empty
    elements.searchResPages.innerHTML = '';
};

export const selected = id => {
    // adds the class below
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return the result
        return `${newTitle.join(' ')} ...`;
    };
    return title;
};

const renderRecipe = recipe => {
    // creates an element with the item below, with the title, image, and author
    const markup = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup); // inserts the element before the tag end
};

// type: 'prev' or 'next'
// creates a button with given the parameters
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    
`;

// shows the buttons
const renderButons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        //Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

// shows the result
export const renderResult = (recipe, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = (page * resPerPage);

    recipe.slice(start, end).forEach(renderRecipe); // No need to put parameters, the for loop will know it needs to get the current element

    // render pagination buttons
    renderButons(page, recipe.length, resPerPage);
};