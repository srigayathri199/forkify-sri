//for now , the private fields are not possible in parcel and bable, so use protected '_' for all private ones
class SearchView {
    //#parentel
    parentEl = document.querySelector('.search');

    getQuery() {
        const query = this.parentEl.querySelector('.search__field').value;
        this.clearinput();
        return query;
    }

    //private one
    clearinput() {
        this.parentEl.querySelector('.search__field').value = '';
    }

    //publisher fn
    addhandlersearch(handler) {
        this.parentEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        });
    }
}
export default new SearchView();