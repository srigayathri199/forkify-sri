import view from './view.js';
import icons from 'url:../../img/icons.svg'; //in parcel 2
import previewview from './previewview.js';


class bookmarkview extends previewview {
    parentElement = document.querySelector('.bookmarks__list');
    errmessage = 'No bookmarks yet.Find a nice recipe to bookmark';
    message = '';
    addhandlerrenderbook(handler) {
        window.addEventListener('load', handler);
    }
}
export default new bookmarkview();