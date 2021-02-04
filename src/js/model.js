/////////////////////////////////////////
//    MVC architecture - model view controller
////////////////////////////////////////
//// MODEL - FETCHING DATA AND STORING

import { async } from "regenerator-runtime";
import { API_URL, RES_PER_page, API_KEY } from './config';
import { ajax } from './helpers.js';
import recipeview from "./views/recipeview";

export const state = {
    recipe: {},
    search: {
        query: '',
        page: 1,
        results: [],
        resultsperpage: RES_PER_page,
    },
    bookmarks: [],
};

const createrecipeobj = function(data) {
    // creating an obj from data
    // changing state
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        sourceUrl: recipe.source_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        //every recipe doesnot have keys ,so
        ...(recipe.key && { key: recipe.key })
    }
}

export const loadrecipe = async function(id) {
    try {
        const data = await ajax(`${API_URL}${id}?key=${API_KEY}`);
        // console.log(data);
        state.recipe = createrecipeobj(data);

        if (state.bookmarks.some((bookmark) => bookmark.id === id)) state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

        // console.log(state.recipe);
    } catch (err) {
        console.error(`${err}`);
        throw err;
    }
}

//load recipe
export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;

        const data = await ajax(`${API_URL}?search=${query}&key=${API_KEY}`);
        // console.log(data);

        state.search.results = (data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                //every recipe doesnot have keys ,so
                ...(recipe.key && { key: recipe.key })
            };
        }))

        //when we search, the pages no.s remain same but it has to start again from one based on search results,so
        state.search.page = 1;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getserachresultspage = function(page = state.search.page) {
    state.search.page = page;
    // console.log(page);
    const start = (page - 1) * state.search.resultsperpage //0;
    const end = (page) * state.search.resultsperpage //9;
    return state.search.results.slice(start, end);
}

export const updateservings = function(mem) {
    state.recipe.ingredients.forEach((ing) => {
        ing.quantity = (mem * ing.quantity) / state.recipe.servings;
    })
    state.recipe.servings = mem;
    console.log(state.recipe);
};

//local storage
const local = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export const addbookmark = function(recipe) {
    //pushing bookmrked recipe into arr
    state.bookmarks.push(recipe);

    //mark curr recipe as bokmark
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }
    // console.log(state.bookmarks);
    local();
}

export const deletebookmark = function(id) {
    const index = state.bookmarks.findIndex((el) => el.id === id);
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) {
        state.recipe.bookmarked = false;
    }
    local();
}
const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

const clearbookmarks = function() {
    localStorage.clear('bookmarks');
};
// clearbookmarks();//this clears the localstorage, but the upadte not seen in bookmarks ui, refresh it ,now it is empty

export const uploadrecipe = async function(newrecipe) {
    try {
        // console.log(newrecipe);
        //converts back to array
        // console.log(Object.entries(newrecipe));
        const ingredients = Object.entries(newrecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingarr = ing[1].replaceAll(' ', '').split(',');
                // const ingarr = ing[1].split(',').map(el => {
                //     el.trim()
                // });

                if (ingarr.length !== 3) throw new Error('Wrong Ingredient Format');
                const [quantity, unit, description] = ingarr;
                return { quantity: quantity ? +quantity : null, unit, description };
            })
            // console.log(ingredients);

        const recipe = {
            title: newrecipe.title,
            source_url: newrecipe.sourceUrl,
            image_url: newrecipe.image,
            publisher: newrecipe.publisher,
            cooking_time: +newrecipe.cookingTime,
            servings: +newrecipe.servings,
            ingredients,
        };
        console.log(recipe);

        const data = await ajax(`${API_URL}?key=${API_KEY}`, recipe);
        console.log(data);

        state.recipe = createrecipeobj(data);
        addbookmark(state.recipe)
    } catch (err) {
        // console.log(err);
        throw err;
    }
}