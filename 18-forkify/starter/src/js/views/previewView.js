import icons from 'url:../../img/icons.svg'
import View from "./View";

class PreviewView extends View {
    _parentElement = ''

    _generateMarkup() {
        const { id, image, publisher, title } = this._data
        const currentId = window.location.hash.slice(1)

        return `
            <li class="preview">
                <a class="preview__link ${currentId === id ? 'preview__link--active' : ''}" href="#${id}">
                    <figure class="preview__fig">
                        <img src="${image}" alt="${title}" />
                    </figure>
                    <div class="preview__data">
                        <h4 class="preview__title">${title}</h4>
                        <p class="preview__publisher">${publisher}</p>
                    </div>
                </a>
            </li>
        `
    }

}
export default new PreviewView()