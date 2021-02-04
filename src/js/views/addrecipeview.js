import view from './view.js';
import icons from 'url:../../img/icons.svg'; //in parcel 2
import previewview from './previewview.js';


class addrecipeview extends previewview {
    parentElement = document.querySelector('.upload');

    message = 'Recipe was successfully uploaded :)'
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnopen = document.querySelector('.nav__btn--add-recipe');
    _btnclose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this.addhandlershowWindow();
        this.addhandlerhidewindow();
    }

    togglewindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
        // console.log(this);
    };

    addhandlershowWindow() {
        this._btnopen.addEventListener('click', this.togglewindow.bind(this))
    }

    addhandlerhidewindow() {
        this._btnclose.addEventListener('click', this.togglewindow.bind(this));
        this._overlay.addEventListener('click', this.togglewindow.bind(this));
    }

    addhandlerupload(handler) {
        this.parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            //browser api to select all form data
            const dataArr = [...new FormData(this)];
            // console.log(data);
            const data = Object.fromEntries(dataArr);
            //converts an arr of entries into an object
            handler(data)
                // console.log(this);//form
                //uploading to api is also an api call
                // console.log(this);//form


        })
    }
}
export default new addrecipeview();