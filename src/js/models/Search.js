import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult(query) {
        //Credential to get data from the site
        const key = '20c6be800b23706947971cc77d9525e7'
        const proxy = "https://cors-anywhere.herokuapp.com/";

        // Test for errors
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`) // Get data from the site
            this.result = res.data.recipes; // Get the right object
            //console.log(this.result); // Display the awnser
        } catch (error) {
            // Catch the error
            alert(error)
        }

    }
}