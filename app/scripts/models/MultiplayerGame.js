import $ from 'jquery';
import _ from 'underscore'
import Backbone from 'backbone';

import store from '../store'
import ClueModel from './Clue'

const Game = Backbone.Model.extend({
  urlRoot: `https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards/`,
  defaults: {
    categories: [],
    clues: [],
    players: [],
    playerCount: 1,
    turn: '',
    answered: false,
    answering: false,
    clueId: 0
  },
  idAttribute: '_id',
  nextTurn: function() {
    let playersArr = this.get('players')
    let playerIndex = _.findIndex(playersArr, (playerItem) => { return playerItem.username === this.get('turn') })
    let nextPlayerIndex = 0
    if (playerIndex < 2) {
      nextPlayerIndex = (playerIndex + 1)
    }
    this.set('turn', playersArr[nextPlayerIndex].username)
    this.set('answering', false)
    this.set('answered', false)
    this.save()
    this.trigger('updateGame')
  },
  answerWrong: function() {
    let playersArr = this.get('players')
    let playerIndex = _.findIndex(playersArr, (playerItem) => {
      return playerItem.username === store.session.get('username')
    })
    playersArr[playerIndex].answered = 'wrong'
    this.set('players', playersArr)
    this.save()
  },
  timesUp: function() {
    let playersArr = this.get('players')
    let playerIndex = _.findIndex(playersArr, (playerItem) => {
      return playerItem.username === store.session.get('username')
    })
    playersArr = playersArr.map(player => {
      player.answered = 'wrong'
      return player
    })
    this.set('players', playersArr)
    this.save()
  },
  testAnswers: function() {
    let playersArr = this.get('players')
    let wrongAnswers = 0
    playersArr.forEach(player => {
      if (player.answered === 'wrong') {
        wrongAnswers++
      }
    })
    if (wrongAnswers >= 3) {
      this.resetAnswers()
    }
  },
  resetAnswers: function() {
    console.log('RESETTING ANSWERS');
    let playersArr = this.get('players')
    playersArr = playersArr.map(player => {
      player.answered = false
      return player
    })
    this.set('players', playersArr)
    this.nextTurn()
  },
  startFetching: function() {
    let fetchingInterval = window.setInterval(() => {
      this.fetch({
        success: (response) => {
          if (sessionStorage.lastUpdate !== JSON.stringify(this.toJSON())) {
            if (store.clues.get(this.get('clueId'))) {
              let updatedClues = this.get('clues').map((filterClue) => {
                if (filterClue.id === this.get('clueId')) {
                  store.clues.remove(this.get('clueId'))
                  store.clues.add(filterClue)
                  store.clues.trigger('gotAllClues')
                  filterClue.answered = true
                  return filterClue
                } else {
                  return filterClue
                }
              })
              this.set('clues', updatedClues)
              let chosenClue = store.clues.get(this.get('clueId'))
              chosenClue.set('answered', true)
            }
            console.log('UPDATING GAME');
            this.trigger('updateGame')
            sessionStorage.lastUpdate = JSON.stringify(this.toJSON())
          }
          this.testAnswers()
        }
      })
    }, 2000);
  },
  getGame: function() {
    store.clues.reset()
    $.ajax('https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards?query={"playerCount":{"$lt": 3}}').then((response) => {
      if (response.length === 0) {
        this.set('players', [{username: store.session.get('username'), money: 0, answered: false}])
        this.set('turn', store.session.get('username'))
        this.trigger('updateGame')
        for(let i = 1; i <= 6; i++) {
          this.getCategory(Math.floor(Math.random()*18000))
        }
      } else {
        if (store.multiplayerGame.model.get('categories').length === 0) {
          this.set('_id', response[0]._id)
          this.fetch({
            success: () => {
            this.getGame()
          }, error: () => {
            console.log('ERROR FETCHING GAME');
            this.getGame()
          }})
        } else {
          let fixedCategories = response[0].categories.map((category) => {
            let sortedClues = _.sortBy(category.clues, (clue) => {
              return clue.value
            })

            let clueIds = []
            let cluesArr = this.get('clues')

            sortedClues.forEach(function(clue) {
              store.clues.add({
                id: clue.id,
                question: clue.question,
                answer: clue.answer,
                value: clue.value,
                answered: clue.answered,
                category: clue.category_id
              })
              clueIds.push(clue.id)
              cluesArr.push(store.clues.get(clue.id))
              if (store.clues.length === 30) {
                store.clues.trigger('gotAllClues')
              }
            })
            category.clueIds = clueIds
            this.set('clues', cluesArr)

            return category
          })
          this.set('categories', fixedCategories)

          let players = this.get('players')

          let playerAlreadyInGame = false
          players.forEach(player => {
            if (player.username === store.session.get('username')) {
              playerAlreadyInGame = true
            }
          })
          if (!playerAlreadyInGame) {
            players.push({username: store.session.get('username'), money: 0, answered: false})
            this.set('players', players)

            let playerCount = this.get('playerCount')
            playerCount += 1
            this.set('playerCount', playerCount)
            this.save()
          }
          this.trigger('updateGame')
          this.startFetching()
        }
      }
    })
  },
  getCategory: function(id) {
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
        let cluesArr = this.get('clues')
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
          cluesArr.push(store.clues.get(clue.id))
        })
        this.set('clues', cluesArr)

        category.clues = usefulClues
        category.clueIds = clueIds

        if (usefulClues.length === 5) {
          let newCategories = this.get('categories')
          newCategories.push(category)
          this.set('categories', newCategories)
          this.trigger('updateGame')
        } else {
          clueIds.forEach((clueId) => {
            store.clues.remove(clueId)
          })
          this.getCategory(Math.floor(Math.random()*18000))
        }
        if (this.get('categories').length === 6) {
          this.save()
          this.startFetching()
          if (store.clues.length === 30) {
            store.clues.trigger('gotAllClues')
          }
        }
      })
  }
})

export default Game
