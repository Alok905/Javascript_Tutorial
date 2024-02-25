import icons from 'url:../../img/icons.svg'
import View from "./View";
import previewView from './previewView';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list')
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)'
    _message = ''

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        /**
         * when we call previewView.render, it itself try to render something inside the View class which we don't want. 
         * We want that the bookmarkView will render all the bookmark results inside the DOM.
         * So, first we have to stop the rendering of the previewView. So, we have assigned another argument inside the View render class which is render = true(default) and for previewView, we passed false, so that it won't render anything itself.
         * Then we think that we could have directly called the 
         * 
         * 
         *  previewView._generateMarkup(bookmark)
         * It has 2 consequences. 
         *  1) we are not passing any parameter to _generateMarkup from the very begining.
         *  2) For the first reason, we definitely call the render method. But how the _generateMarkup method will get the id, title etc. We have to assign the _data property of the previewView as the current bookmark, so that the _generateMarkup method would access those and return the markup, so that the bookmarksView will render all those markups.
         */
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('')
    }

}
export default new BookmarksView()