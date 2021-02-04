import icons from 'url:../../img/icons.svg'; //in parcel 2


export default class view {

    //#data;
    data;

    //data is the recipe obj whcih is stored in state obj, which is updated by fetching data from loadrecipe() and through controller recipeview gets data

    /**
     * 
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @todo Finish implementation
     */
    render(data) {
        if (!data || Array.isArray(data) && data.length === 0) return this.renderError();

        this.data = data;
        console.log(this.data);
        let markup = this.generatemarkup();
        // console.log(markup);

        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        // if (!data || Array.isArray(data) && data.length === 0) return this.renderError();

        //here,we are comparing the old dom with new dom
        this.data = data;
        const newmarkup = this.generatemarkup();
        //below one creates a DOM(or obj) contains html markup
        const newDOM = document.createRange().createContextualFragment(newmarkup); //dom
        // console.log(newDOM);
        const newElements = Array.from(newDOM.querySelectorAll('*')); // new nodelist
        const curElements = Array.from(this.parentElement.querySelectorAll('*')); //nodelist
        // console.log(newElements);
        // console.log(curElements);
        newElements.forEach((newel, i) => {
            //comparing curel with newel
            const curel = curElements[i];
            // console.log(curel, newel.isEqualNode(curel));

            // console.log('💥', newel.firstChild.nodeValue.trim());
            //updates changed text
            if (!newel.isEqualNode(curel) && newel.firstChild.nodeValue.trim() !== '') {
                // curel.textContent = newel.textContent;//this will override textcnt,so change only nodevalues without the 2 nd condition
                curel.textContent = newel.textContent;
            }


            //updates changed attributes
            if (!newel.isEqualNode(curel)) {
                // console.log(newel.attributes);//returns attributes of falsed ones(map)->so convert to array and loop and upadte

                Array.from(newel.attributes).forEach((attr) => {
                    curel.setAttribute(attr.name, attr.value);
                })

            }
        })

    }

    //#clear
    clear() {
        this.parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
        <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
        </div>`;
        this.clear(); //removes smiley line
        this.parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    renderError(message = this.errmessage) {
        const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
       </div>
       <p>${message}</p>
      </div> `;
        this.clear(); //removes smiley line
        this.parentElement.insertAdjacentHTML('afterbegin', markup)

    }

    rendersucces(message = this.message) {
        const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
     </div>
     <p>${message}</p>
    </div> `;
        this.clear(); //removes smiley line
        this.parentElement.insertAdjacentHTML('afterbegin', markup)

    }

    //publisher
    addhandlerrender(handler) {
        ['hashchange', 'load'].forEach((ev) => window.addEventListener(ev, handler));

        //when we copy and paste the url , the pizza container doesnot load, so we should also do load event
    }

}