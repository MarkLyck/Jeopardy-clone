import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'

import store from '../../store'

import GameModel from '../../models/Game'

import Category from './components/Category'
import QuestionModal from './components/QuestionModal'
import Modal from '../gComponents/Modal'
import UserSection from './components/UserSection'

const GameBoard = React.createClass({
  getInitialState: function() {
    return {categories: [], answering: false, question: '', answer: ''}
  },
  componentDidMount: function() {
    store.game.model.on('change', () => {
      this.setState({categories: store.game.model.get('categories')})
    })
    store.game.model.getGame()
    store.session.on('change', () => {
      if (store.session.get('money') > store.session.get('highScore')) {
        console.log('NEW HIGHSCORE!');
        store.session.set('highScore', store.session.get('money'))
        store.session.updateUser()
      }
    })
  },
  startQuestion: function(clue) {
    console.log('STARTING QUESTION!');

    let correctAnswer = clue.get('answer')
    correctAnswer = correctAnswer.replace('(', '')
    correctAnswer = correctAnswer.replace(')', '')
    correctAnswer = correctAnswer.replace('.', '')
    correctAnswer = correctAnswer.replace(',', '')
    correctAnswer = correctAnswer.replace('<i>', '')
    correctAnswer = correctAnswer.replace('</i>', '')
    correctAnswer = correctAnswer.replace(/\\/g, '');

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
      console.log('CORRECT ANSWER');
      let newMoney = store.session.get('money')
      newMoney += this.state.clueValue
      store.session.set('money', newMoney)
      this.setState({answering: 'correct'})
    } else {
      console.log('WRONG ANSWER');
      this.setState({answering: 'wrong', userAnswer: answer})
    }
  },
  render: function() {
    if (this.state.categories[0]) {
      let gameContent = this.state.categories.map((category, i) => {
        let clues = this.state.categories[i].clues
        clues = _.sortBy(clues, function(clue) {
          return clue.get('value')
        })
        return (
          <Category startQuestion={this.startQuestion} categoryName={this.state.categories[i].title} key={i} clues={clues}/>
        )
      })

      let questionModal;
      if (this.state.answering === true) {
        console.log('SHOW QUESTION MODAL');
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
          <UserSection/>
        </div>
      )
    } else {
      return null
    }
  }
})

export default GameBoard
