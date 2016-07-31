import React from 'react'
import _ from 'underscore'
import Backbone from 'backbone'

import store from '../../store'

import GameModel from '../../models/Game'

import Category from './components/Category'
import QuestionModal from './components/QuestionModal'
import Modal from '../gComponents/Modal'
import UserSection from './components/UserSection'

// MULTIPLAYER GAMEBOARD

const MGameBoard = React.createClass({
  getInitialState: function() {
    return {game: {}, categories: [], answering: false, question: '', answer: '', isWaiting: true, players: []}
  },
  componentDidMount: function() {
    store.session.set('gameType', 'Multiplayer')
    store.session.trigger('change')
    console.log('MOUNTED MGAMEBOARD');
    store.multiplayerGame.model.on('updateGame', this.updateGameState)
    store.multiplayerGame.model.getGame()
    store.session.on('change', this.updateUser)
  },
  updateGameState: function() {
    let clue = store.clues.get(store.multiplayerGame.model.get('clueId'))
    this.setState({
      game: store.multiplayerGame.model.toJSON(),
      clue: clue
    })
  },
  updateUser: function() {
    if (store.session.get('money') > store.session.get('highScore')) {
      store.session.set('highScore', store.session.get('money'))
      store.session.updateUser()
    }
  },
  startQuestion: function(clue) {
    let correctAnswer = clue.get('answer')
    correctAnswer = correctAnswer.replace('(', '')
    correctAnswer = correctAnswer.replace(')', '')
    correctAnswer = correctAnswer.replace('.', '')
    correctAnswer = correctAnswer.replace(',', '')
    correctAnswer = correctAnswer.replace('<i>', '')
    correctAnswer = correctAnswer.replace('</i>', '')
    correctAnswer = correctAnswer.replace(/\\/g, '');
    correctAnswer = correctAnswer.trim();

    this.setState({
      clue: clue,
      answering: true,
      question: clue.get('question'),
      answer: correctAnswer,
      clueValue: clue.get('value'),
      category: clue.get('category')
    })
    store.multiplayerGame.model.set('question', clue.get('question'))
    store.multiplayerGame.model.set('clueId', clue.get('id'))
    store.multiplayerGame.model.set('answer', correctAnswer)
    store.multiplayerGame.model.set('answered', false)
    store.multiplayerGame.model.set('answering', true)
    store.multiplayerGame.model.save()
  },
  removeModal: function() {
    this.setState({answering: false})
  },
  sendAnswer: function(isCorrect, answer) {
    if (isCorrect) {
      let newMoney = store.session.get('money')
      newMoney += this.state.clueValue
      store.session.set('money', newMoney)
      this.setState({answering: 'correct'})

      store.multiplayerGame.model.set('answered', true)
      store.multiplayerGame.model.set('answering', false)

      let playersArr = store.multiplayerGame.model.get('players')
      let playerIndex = _.findIndex(playersArr, function(playerItem) { return playerItem.username == store.session.get('username') })
      let myPlayer = playersArr[playerIndex]

      let currClue = store.clues.get(store.multiplayerGame.model.get('clueId'))
      myPlayer.money += currClue.get('value')
      playersArr.splice(playerIndex, 1, myPlayer)
      store.multiplayerGame.model.set('players', playersArr)
      store.multiplayerGame.model.nextTurn()
    } else {
      // store.multiplayerGame.model.set('answering', false)
      // store.multiplayerGame.save()
      this.setState({answering: 'wrong', userAnswer: answer})
    }
    // store.multiplayerGame.model.set('answered', true)

  },
  componentWillUnmount: function() {
    store.session.off('change', this.updateUser)
    store.clues.off()
    store.multiplayerGame.model.off()
  },
  render: function() {
    if (!this.state.game.categories) {
      return null
    }

    let gameContent = this.state.game.categories.map((category, i) => {
      return (
        <Category startQuestion={this.startQuestion} category={category} key={i}/>
      )
    })

    let questionModal;
    if (this.state.game.answering === true) {
      questionModal = (
        <QuestionModal removeModal={this.removeModal} sendAnswer={this.sendAnswer} clue={this.state.clue}/>
      )
    } else if (this.state.answering === 'correct') {
      questionModal = (
        <Modal removeModal={this.removeModal}>
          <i className="fa fa-check"/>
          <h2>Correct!</h2>
        </Modal>
      )
    } else if (this.state.answering === 'wrong') {
      questionModal = (
        <Modal removeModal={this.removeModal}>
          <i className="fa fa-times"/>
          <h2>Wrong!</h2>
          <h3>The correct answer was: <span className="correct-answer">{this.state.answer}</span></h3>
          <h3>Your answer was: <span className="correct-answer">{this.state.userAnswer}</span></h3>
        </Modal>
      )
    }
    return (
      <div id="game-container">
        <div>{gameContent}</div>
        {questionModal}
        <UserSection players={this.state.game.players}/>
      </div>
    )
  }
})

export default MGameBoard
