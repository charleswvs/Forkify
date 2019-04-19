import Search from './Models/Search';
import Recipe from './Models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import {
    basename
} from 'path';
import { isRegExp } from 'util';


/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Like recipes
 */
const state = {};
window.state = state;

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            console.log(err);
            alert('Error processing recipe!');
        }

    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// This event listener shows the information either if the page is loaded or the hash changed
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */

const controlList = () =>{
    // Create a new list if there is none yet
    if(!state.list) state.list = new List();

    // add each ingredient to the list and user interface
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);

        //delte from UI
        listView.deleteItem(id);

    // handle count update
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

/**
 * LIKES CONTROLLER
 */
state.likes = new Likes();
const controlLike = () =>{
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        //add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )

        //toggle the like button
        likesView.toggleLikesBtn(true);
        //add like to UI list
        likesView.renderLike(newLike);
        console.log(state.likes);

    // user HAS liked current recipe
    }else{
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikesBtn(false);
        // Remove like from UI list
        likesView.deleteLike(currentID); 
        console.log(state.likes);
    };

    likesView.toggleLikeMenu(state.likes.likes.length);
}

// Restoring local storage (liked recipes)
window.addEventListener('load',()=>{
    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();

    // toggle like menu btn
    likesView.toggleLikeMenu(state.likes.likes.length)

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
});

// handling recipe btn clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clicked
        if  (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches(`.recipe__btn--add, .recipe__btn--add *`)){
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        // Like controlller
        controlLike();
    }
    
});

window.l = new List();
