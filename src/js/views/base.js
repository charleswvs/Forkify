//this page is used to hold re-usable code

// elements from HTML
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
};

export const elementStrings = { //object which holds class names 
    loader: 'loader'
}

// Functions that creates a spinning object
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

// Deletes the spinning object
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader); // go to the parent and remove the child 
    }
}