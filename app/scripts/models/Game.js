import $ from 'jquery';
import Backbone from 'backbone';

import store from '../store'

const Game = Backbone.Model.extend({
  urlRoot: `http://jservice.io/api/`,
  defaults: {
    categories: [],
    gameNumber: 0
  },
  getGame: function() {
    // console.log('getting game');
    // console.log(store.session.categoriesSeen);
    this.set('categories', [])
    for(let i = 1; i <= 6; i++) {
      this.getCategory(store.session.get('categoriesSeen'))
      store.session.set('categoriesSeen', store.session.get('categoriesSeen') + 1)
    }
  },
  getCategory: function(id) {
    $.ajax(`http://jservice.io/api/category?id=${id}`)
      .then((category) => {

        let filterValue = 200
        let usefulClues = category.clues.filter((clue) => {
          if (clue.value === filterValue) {
            filterValue += 200
            return clue
          }
        })
        category.clues = usefulClues

        if (usefulClues.length === 5) {
          let newCategories = this.get('categories')
          newCategories.push(category)
          this.set('categories', newCategories)
        } else {
          store.session.set('categoriesSeen', store.session.get('categoriesSeen') + 1)
          this.getCategory(store.session.get('categoriesSeen'))
        }
        if (this.get('categories').length === 6) {
          this.trigger('change')
        }
      })
  }
})

export default Game
