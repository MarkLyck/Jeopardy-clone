import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'

import store from '../../store'

import GameModel from '../../models/Game'

import Category from './components/Category'
import Modal from './components/Modal'
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
    } else {
      console.log('WRONG ANSWER');
    }
    this.setState({answering: false})
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
      if (this.state.answering) {
        console.log('SHOW QUESTION MODAL');
        questionModal = (
          <Modal removeModal={this.removeModal} sendAnswer={this.sendAnswer} clueValue={this.state.clueValue} category={this.state.category} question={this.state.question} answer={this.state.answer}/>
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
