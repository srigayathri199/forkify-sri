// ".." means parents

import 'core-js/stable'; //polyfilling - for old brow
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import * as model from './model.js';
import { MODAL_CLOSE } from './config.js';
import recipeview from './views/recipeview.js';
import searchview from './views/searchView.js';
import resultsview from './views/resultsview.js';
import bookmarkview from './views/bookmarkview.js';
import paginationview from './views/paginationview.js';
import previewview from './views/previewview.js';
import addrecipeview from './views/addrecipeview.js';


//controller can import from both model and view


//http://forkify-api.herokuapp.com/v2

///////////////////////////////////////////////
// if (module.hot) {
//     module.hot.accept();
// }





const controlRecipe = async function() {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;

        //1.a render spinner
        recipeview.renderSpinner();

        //0.update results view to mark selected search result
        resultsview.update(model.getserachresultspage());

        //.updating bookmarks view
        // debugger;
        bookmarkview.update(model.state.bookmarks);

        //.loading recipe - returns a promise
        await model.loadrecipe(id);

        //.rendering recipe
        //naming obj which is exported by recipeviw.js and calling a fn not in constru fn
        recipeview.render(model.state.recipe);


    } catch (err) {
        console.log(err);
        recipeview.renderError();
    }
};

//loading recipes
const controlSearchResults = async function() {
    try {
        resultsview.renderSpinner();



        //1.get search query
        const query = searchview.getQuery();
        // console.log(query);
        if (!query) return;

        //2.load search results
        await model.loadSearchResults(query);

        //3.render results
        console.log(model.state.search.results);
        // resultsview.render(model.state.search.results);
        resultsview.render(model.getserachresultspage());

        //4.render initial pagination
        paginationview.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
}

const gotopage = function(go) {
    resultsview.render(model.getserachresultspage(go));

    //4.render initial pagination
    paginationview.render(model.state.search);
}

//update servings
const controlservings = function(newServings) {
    //update the recipe servings(in state)
    model.updateservings(newServings);

    //update recipe view-ui->this renders whole recipe div every time we update servings,so update only ing and servings

    // recipeview.render(model.state.recipe);
    recipeview.update(model.state.recipe);

}

//bookmarkings
const bookmarksingsrecipe = function() {
    //add/remove boomark
    if (!model.state.recipe.bookmarked) {
        model.addbookmark(model.state.recipe);
    } else {
        model.deletebookmark(model.state.recipe.id);
    }
    // console.log(model.state.recipe);

    //update recipe view
    recipeview.render(model.state.recipe);
    // debugger;
    // recipeview.update(model.state.recipe);

    //render bookmark
    bookmarkview.render(model.state.bookmarks)


}

//bookmark-
//error- nodevalue of null
//here, we are updating before rendering,so render 
const controllerbookmarks = function() {
    bookmarkview.render(model.state.bookmarks);
}

const contropAddrecipe = async function(newrecipe) {
    try {
        // console.log(newrecipe);

        //show spinner
        addrecipeview.renderSpinner();

        //upload
        await model.uploadrecipe(newrecipe);
        console.log(model.state.recipe);

        //render recipe
        recipeview.render(model.state.recipe);

        //success message
        addrecipeview.rendersucces();

        //close form
        setTimeout(() => {
            addrecipeview.togglewindow();
        }, MODAL_CLOSE * 1000);


        //some adding recipes not in bkmakrs,so
        //1.render bookmark view
        bookmarkview.render(model.state.bookmarks);
        //hash id change
        //change id in url
        window.history.pushState(null, '', `#${model.state.recipe.id}`);


    } catch (err) {
        addrecipeview.renderError(err.message);
        console.log(err);

    }
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// const newfeature = function() {
//     console.log('welcome to the applaication');
// }

// subscriber fn for recipeview
const init = function() {
    bookmarkview.addhandlerrenderbook(controllerbookmarks);
    recipeview.addhandlerrender(controlRecipe);
    recipeview.addhandlerbookmark(bookmarksingsrecipe);
    recipeview.servingscontrol(controlservings);
    searchview.addhandlersearch(controlSearchResults);
    paginationview.addhandlerclick(gotopage);
    addrecipeview.addhandlerupload(contropAddrecipe);
    // newfeature();//removed code to see continuous deploy
};
init();