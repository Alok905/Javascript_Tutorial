import icons from 'url:../../img/icons.svg'
import View from "./View";

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination')

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline')
            if (!btn) return;

            // handler(clicked.querySelector('span').textContent.slice(-1))
            const goToPage = +btn.dataset.goto
            handler(goToPage)
        })
    }

    _generateMarkup() {
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        const currPage = Number(this._data.page)
        // Page 1, and there are other pages
        if (currPage === 1 && numPages > 1) {
            return this._generateNextMarkupBtn(2)
        }

        // Last page
        if (currPage === numPages && currPage > 1) {
            return this._generatePrevMarkupBtn(currPage - 1)
        }

        // Other page 
        if (currPage < numPages) {
            return `${this._generatePrevMarkupBtn(currPage - 1)}${this._generateNextMarkupBtn(currPage + 1)}`
        }


        // Page 1, and there are NO other pages
        return ''

    }

    _generatePrevMarkupBtn(page) {
        return `
            <button class="btn--inline pagination__btn--prev" data-goto="${page}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page}</span>
            </button>
        `
    }
    _generateNextMarkupBtn(page) {
        return `
            <button class="btn--inline pagination__btn--next" data-goto="${page}">
                <span>Page ${page}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `
    }
}
export default new PaginationView()