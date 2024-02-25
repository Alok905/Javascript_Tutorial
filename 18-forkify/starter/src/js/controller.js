import * as model from './model'
import addRecipeView from './views/addRecipeView'
import bookmarksView from './views/bookmarksView'
import paginationView from './views/paginationView'
import recipeView from './views/recipeView'
import resultsView from './views/resultsView'
import searchView from './views/searchView'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// if (module.hot) {
//   module.hot.accept()
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSpinner()

    // 0) Update results view to mark selected search result 
    resultsView.update(model.getSearchResultsPage())

    // 3) Updating bookmarks view 
    bookmarksView.update(model.state.bookmarks)

    // 1) Loading recipe
    await model.loadRecipe(id)

    // 2) Rendering recipe 
    recipeView.render(model.state.recipe)


  } catch (error) {
    console.log(error)
    recipeView.renderError()
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()

    // 1) Get search query
    const query = searchView.getQuery()
    if (!query) return;

    // 2) Load search results 
    await model.loadSearchResult(query)

    // 3) Render results 
    resultsView.render(model.getSearchResultsPage())

    // 4) Render initial pagination buttons 
    paginationView.render(model.state.search)

  } catch (error) {
    console.log(error)
  }
}

const controlPagination = async function (page) {
  // 1) Render spinner 
  resultsView.renderSpinner()

  // 2) Render new results 
  resultsView.render(model.getSearchResultsPage(page))

  // 3) Render new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe serving (in state)
  model.updateServings(newServings)

  // Update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // 1) Add or Remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // 2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks 
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)

}

init()