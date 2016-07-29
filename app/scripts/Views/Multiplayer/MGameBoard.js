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

const GameBoard = React.createClass({
  getInitialState: function() {
    return {categories: [], answering: false, question: '', answer: '', isWaiting: true, players: []}
  },
  componentDidMount: function() {
    store.multiplayerGame.model.on('change', this.updateGameState)
    store.multiplayerGame.model.getGame()
    store.session.on('change', this.updateUser)
  },
  updateGameState: function() {
    this.setState({categories: store.multiplayerGame.model.get('categories'), players: store.multiplayerGame.model.get('players')})
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
    } else {
      this.setState({answering: 'wrong', userAnswer: answer})
    }
  },
  componentWillUnmount: function() {
    store.session.off('change', this.updateUser)
    store.game.model.off('change', this.updateGameState)
  },
  render: function() {
    if (!this.state.categories[0]) {
      return null
    }
    if (this.state.categories[0]) {
      let gameContent = this.state.categories.map((category, i) => {
        return (
          <Category startQuestion={this.startQuestion} category={this.state.categories[i]} key={i}/>
        )
      })

      let questionModal;
      if (this.state.answering === true) {
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
          <UserSection players={this.state.players}/>
        </div>
      )
    } else {
      return null
    }
  }
})

export default GameBoard
