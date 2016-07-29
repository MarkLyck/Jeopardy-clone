import $ from 'jquery';
import _ from 'underscore'
import Backbone from 'backbone';

import store from '../store'
import ClueModel from './Clue'

const Game = Backbone.Model.extend({
  urlRoot: `https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards/`,
  defaults: {
    categories: [],
    players: [],
    playerCount: 1,
    turn: ''
  },
  idAttribute: '_id',
  getGame: function() {
    store.clues.reset()
    $.ajax('https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards?query={"playerCount":{"$lt": 3}}').then((response) => {
      if (response.length === 0) {
        console.log('create new game');
        this.set('players', [{username: store.session.get('username'), money: 0}])
        this.set('turn', store.session.get('username'))
        for(let i = 1; i <= 6; i++) {
          this.getCategory(Math.floor(Math.random()*18000))
        }
      } else {
        if (store.multiplayerGame.model.get('categories').length === 0) {
          this.set('_id', response[0]._id)
          this.fetch({
            success: () => {
            this.getGame()
          }, error: function() {
            console.log('ERROR FETCHING');
          }})
        } else {
          let fixedCategories = response[0].categories.map(function(category) {
            let sortedClues = _.sortBy(category.clues, function(clue) {
              return clue.value
            })

            let clueIds = []

            sortedClues.forEach(function(clue) {
              store.clues.add({
                id: clue.id,
                question: clue.question,
                answer: clue.answer,
                value: clue.value,
                answered: clue.answered,
                category: clue.category
              })
              clueIds.push(clue.id)
              if (store.clues.length === 30) {
                store.clues.trigger('gotAllClues')
              }
            })
            category.clueIds = clueIds
            return category
          })
          this.set('categories', fixedCategories)

          let players = this.get('players')
          players.push({username: store.session.get('username'), money: 0})
          this.set('players', players)
          let playerCount = this.get('playerCount')
          playerCount += 1
          this.set('playerCount', playerCount)
          this.save()
        }
      }
    })
  },
  getCategory: function(id) {
    console.log('FETCHING CATEGORY');
    $.ajax(`http://jservice.io/api/category?id=${id}`)
      .then((response) => {
        let category = response
        let filterValue = 200
        let usefulClues = category.clues.filter((clue) => {
          if (clue.value === filterValue) {
            filterValue += 200
            return clue
          }
        })
        let clueIds = []
        usefulClues.forEach((clue) => {
          store.clues.add({
            id: clue.id,
            question: clue.question,
            answer: clue.answer,
            value: clue.value,
            answered: clue.answered,
            category: clue.category
          })
          clueIds.push(clue.id)
        })

        category.clues = usefulClues
        category.clueIds = clueIds
        console.log('CATEGORY CLUES AFTER FIX: ', category.clues);

        if (usefulClues.length === 5) {
          let newCategories = this.get('categories')
          newCategories.push(category)
          this.set('categories', newCategories)
          this.trigger('change')
        } else {
          console.log('FAILED: ', clueIds);
          clueIds.forEach((clueId) => {
            store.clues.remove(clueId)
          })
          console.log(' store clues after faiL: ', store.clues);
          this.getCategory(Math.floor(Math.random()*18000))
        }
        if (this.get('categories').length === 6) {
          console.log('FETCHED ALL CATEGORIES');
          this.save()
          if (store.clues.length === 30) {
            store.clues.trigger('gotAllClues')
          }
        }
      })
  }
})

export default Game
