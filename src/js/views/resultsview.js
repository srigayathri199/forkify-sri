import view from './view.js';
import icons from 'url:../../img/icons.svg'; //in parcel 2
import previewview from './previewview.js';



class resultsview extends previewview {
    parentElement = document.querySelector('.results');
    errmessage = 'No recipe found for your query.Please try another one!';
    message = '';
}
export default new resultsview();