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
  },
  startQuestion: function(quesion, answer, clueValue, categoryName) {
    console.log('STARTING QUESTION!');
    this.setState({
      answering: true,
      question: quesion,
      answer: answer,
      clueValue: clueValue,
      category: categoryName
    })
  },
  removeModal: function() {
    this.setState({answering: false})
  },
  sendAnswer: function(isCorrect) {
    if (isCorrect) {
      console.log('CORRECT ANSWER');
      let newMoney = store.session.get('money')
      newMoney += this.state.clueValue
      store.session.set('money', newMoney)
      this.setState({answering: 'correct'})
    } else {
      console.log('WRONG ANSWER');
      this.setState({answering: 'wrong'})
    }
  },
  render: function() {
    if (this.state.categories[0]) {
      let gameContent = this.state.categories.map((category, i) => {
        let clues = this.state.categories[i].clues
        clues = _.sortBy(clues, function(clue) {
          return clue.value
        })

        return (
          <Category clickHandler={this.startQuestion} categoryName={this.state.categories[i].title} key={i} clues={clues}/>
        )
      })

      let questionModal;
      if (this.state.answering === true) {
        console.log('SHOW QUESTION MODAL');
        questionModal = (
          <QuestionModal removeModal={this.removeModal} sendAnswer={this.sendAnswer} clueValue={this.state.clueValue} category={this.state.category} question={this.state.question} answer={this.state.answer}/>
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
            <h3>The correct answer was: {this.state.answer}</h3>
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
