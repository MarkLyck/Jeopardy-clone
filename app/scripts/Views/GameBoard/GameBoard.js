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
    let game = new GameModel()
    game.on('change', () => {
      this.setState({categories: game.get('categories')})
    })
    game.getGame()
  },
  startQuestion: function(quesion, answer, clueValue) {
    console.log('STARTING QUESTION!');
    this.setState({
      answering: true,
      question: quesion,
      answer: answer,
      clueValue: clueValue
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
      console.log('store money afteR: ', store.session.get('money'));
    } else {
      console.log('WRONG ANSWER');
    }
    this.setState({answering: false})
    console.log(isCorrect);
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
          <Modal removeModal={this.removeModal} sendAnswer={this.sendAnswer} clueValue={this.state.clueValue} question={this.state.question} answer={this.state.answer}/>
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
