import $ from 'jquery';
import Backbone from 'backbone';

import store from '../store'
import ClueModel from './Clue'

const Game = Backbone.Model.extend({
  urlRoot: `https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards/`,
  defaults: {
    categories: [],
    gameNumber: 0,
    players: [],
    playerCount: 1,
    turn: ''
  },
  getGame: function() {
    $.ajax('https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards?query={"playerCount":{"$lt": 3}}').then((response) => {
      console.log(response);
      if (response.length === 0) {
        console.log('create new game');
        this.set('categories', [])
        this.set('players', [store.session.get('username')])
        for(let i = 1; i <= 6; i++) {
          this.getCategory(Math.floor(Math.random()*18000))
        }
      } else {
        console.log('FOUND GAME ON SERVER');

        let fixedCategories = response[0].categories.map(function(category) {
          let cluesModelArr = category.clues.map(function(clue) {
            let newClue = new ClueModel({
              question: clue.question,
              answer: clue.answer,
              value: clue.value,
              answered: clue.answered
            })
            return newClue
          })
          category.clues = cluesModelArr
          return category
        })

        this.set('categories', fixedCategories)
        this.set('gameNumber', response[0].gameNumber)
        this.set('players', response[0].players)
        this.set('playerCount', response[0].playerCount)
        this.set('turn', response[0].turn)

        let players = this.get('players')
        players.push(store.session.get('username'))
        this.set('players', players)
        this.save()
      }
    })
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
        if (this.get('categories').length === 6) {
          console.log('GOT ALL CATEGORIES');
          this.save()
        }
      })
  }
})

export default Game
