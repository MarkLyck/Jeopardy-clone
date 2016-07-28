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
    this.set('categories', [])
    for(let i = 1; i <= 6; i++) {
      this.getCategory(Math.floor(Math.random()*18000))
    }
  },
  getCategory: function(id) {
    console.log('FETCHING CATEGORY');
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
          this.getCategory(Math.floor(Math.random()*18000))
        }
        if (this.get('categories').length === 6) {
          this.trigger('change')
        }
      })
  }
})

export default Game
