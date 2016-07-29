import $ from 'jquery';
import Backbone from 'backbone';

import store from '../store'
import ClueModel from './Clue'

const Game = Backbone.Model.extend({
  urlRoot: `https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards/`,
  defaults: {
    categories: [],
    gameNumber: 0
  },
  idAttribute: '_id',
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
        usefulClues = usefulClues.map((clue) => {
          let newClue = new ClueModel()
          newClue.set('question', clue.question)
          newClue.set('answer', clue.answer)
          newClue.set('value', clue.value)
          newClue.set('category', category.title)
          return newClue
        })

        category.clues = usefulClues

        if (usefulClues.length === 5) {
          let newCategories = this.get('categories')
          newCategories.push(category)
          this.set('categories', newCategories)
          this.trigger('change')
        } else {
          this.getCategory(Math.floor(Math.random()*18000))
        }
      })
  }
})

export default Game
