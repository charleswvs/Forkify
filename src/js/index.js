import Search from './Models/Search';
import Recipe from './Models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import {
    basename
} from 'path';
import { isRegExp } from 'util';
import List from './models/List';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Like recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object add to state
        state.search = new Search(query);

        // 3) Prepare UI from results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Serach for recipes
            await state.search.getResult();

            // 5) Render Results on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    };
};

//listen for clicks at submit
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // Prevents the page from reloading
    controlSearch();
});

//listen for clicks at pages
elements.searchResPages.addEventListener('click', e => {
    //console.log(e.target);   This is how you find out where the click happened
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if (id) {
        // Prepare UI from changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if(state.search) {
            searchView.selected(id)
        };

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            alert('Error processing recipe!');
        }

    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// This event listener shows the information either if the page is loaded or the hash changed
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// handling recipe btn clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clicked
        if  (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    if(e.target.matches('.btn-increase, .btn-increase *')){
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    
});

window.l = new List();
