import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'

import store from '../../store'

import GameModel from '../../models/Game'

import Category from './components/Category'
import Modal from './components/Modal'

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
  startQuestion: function(quesion, answer, category) {
    console.log(quesion);
    console.log(answer);
    this.setState({
      answering: true,
      question: quesion,
      answer: answer,
      category: category
    })
  },
  removeModal: function(isCorrect) {
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
          <Category categoryName={this.state.categories[i].title} key={i}>
            <li onClick={this.startQuestion.bind(null, clues[0].question, clues[0].answer, category.title)} value={clues[0].value}> ${clues[0].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[1].question, clues[1].answer, category.title)} value={clues[1].value}> ${clues[1].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[2].question, clues[2].answer, category.title)} value={clues[2].value}> ${clues[2].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[3].question, clues[3].answer, category.title)} value={clues[3].value}> ${clues[3].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[4].question, clues[4].answer, category.title)} value={clues[4].value}> ${clues[4].value} </li>
          </Category>
        )
      })

      let questionModal;
      if (this.state.answering) {
        console.log('SHOW QUESTION MODAL');
        questionModal = (
          <Modal test={this.removeModal} category={this.state.category} question={this.state.question} answer={this.state.answer}/>
        )
      }

      return (
        <div id="game-container">
          {gameContent}
          {questionModal}
        </div>
      )
    } else {
      return null
    }
  }
})

export default GameBoard
