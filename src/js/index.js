import Search from './Models/Search';
/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Like recipes
 */
const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = 'pizza' //TODO

    if (query) {
        // 2) New search object add add to state
        state.search = new Search(query);

        // 3) Prepare UI from results

        // 4) Serach for recipes
        await state.search.getResult();

        // 5) Render Results on UI
        console.log(state.search.rmeuesult);

    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault(); // Prevents the page from reloading
    controlSearch();
});


// https://www.food2fork.com/api/search
//https://api.codetabs.com/v1/proxy?quest=