import View from "./View";

class searchView extends View {
    _parentElement = document.querySelector('.search')

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput()
        return query;
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = ''
    }

    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault()
            /**
             * Note: When we pass any function as an argument(without calling it), then it's this keyword will be changed.
             * But here, we have created out own function inside the event listener inside which we are directly calling the handler function so the handler function's this keyword will be window.
             */
            handler()
        })
    }
}

export default new searchView()