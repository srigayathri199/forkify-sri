import view from './view.js';
import icons from 'url:../../img/icons.svg'; //in parcel 2



class paginationview extends view {
    parentElement = document.querySelector('.pagination');


    //handler
    addhandlerclick(handler) {
        //using event delegation - using parent class,here, 2 page marks are in pagination parent
        this.parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            console.log(btn);
            const gotopa = +btn.dataset.goto;
            handler(gotopa);
            console.log(gotopa);
        })
    }

    generatemarkup() {
        const curpage = this.data.page;
        // console.log(this.data.results);
        const numpage = (Math.ceil((this.data.results).length / this.data.resultsperpage));
        console.log((numpage));
        //page 1, and there are other pages
        if (curpage === 1 && numpage > 1) {
            return `
            <button data-goto="${curpage+1}" class="btn--inline pagination__btn--next">
            <span>Page${curpage+1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
        }
        //last page
        if (curpage === numpage && numpage > 1) {
            return `
            <button data-goto="${curpage-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${curpage-1}</span>
          </button>`;
        }
        //other page
        if (curpage < numpage) {
            return `<button data-goto="${curpage+1}" class="btn--inline pagination__btn--next">
            <span>Page${curpage+1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          <button data-goto="${curpage-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${curpage-1}</span>
          </button>
            `;
        }
        //page 1 and there are no pages

        return '';

    }
}
export default new paginationview();