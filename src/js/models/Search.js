import axios from 'axios';
import {
    key,
    proxy
} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    };

    async getResult() {

        // Test for errors
        try {
            const res = await axios(`${proxy}https://food2fork.com/api/search?key=${key}&q=${this.query}`); // Get data from the site
            this.result = res.data.recipes; // Get the right object
            console.log(this.result); // Display the awnser
        } catch (error) {
            // Catch the error
            alert(error)
        };

    };
};