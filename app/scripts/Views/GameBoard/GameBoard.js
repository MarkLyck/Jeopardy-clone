import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Backbone from 'backbone'

import store from '../../store'

import GameModel from '../../models/Game'

import Category from './components/Category'

const GameBoard = React.createClass({
  getInitialState: function() {
    return {categories: []}
  },
  componentDidMount: function() {
    let game = new GameModel()
    game.on('change', () => {
      this.setState({categories: game.get('categories')})
    })
    game.getGame()
    //
    // $.ajax(`http://jservice.io/api/categories?count=6&offset=${store.session.get('categoriesSeen')}`)
    //   .then((categories) => {
    //     let currCategoriesSeen = store.session.get('categoriesSeen')
    //     store.session.set('categoriesSeen', currCategoriesSeen+6)
    //     let fixedCategories = categories
    //
    //     let fetchedCategories = []
    //
    //     let gotClue = (category, clue) => {
    //       category.clues.push(clue)
    //
    //       if (category.clues.length === 5) {
    //         fetchedCategories.push(category)
    //       }
    //       if (fetchedCategories.length === 6) {
    //         this.setState({categories: fetchedCategories})
    //         console.log(this.state);
    //       }
    //     }
    //
    //     categories.forEach((category, i) => {
    //       category.clues = [];
    //       let finishedCount = 0
    //       $.ajax(`http://jservice.io/api/clues?category=${category.id}&value=200`).then((clue) => {
    //         // console.log(clue[0]);
    //         gotClue(category, clue[0])
    //       })
    //       $.ajax(`http://jservice.io/api/clues?category=${category.id}&value=400`).then((clue) => {
    //         // console.log(clue[0]);
    //         gotClue(category, clue[0])
    //       })
    //       $.ajax(`http://jservice.io/api/clues?category=${category.id}&value=600`).then((clue) => {
    //         // console.log(clue[0]);
    //         gotClue(category, clue[0])
    //       })
    //       $.ajax(`http://jservice.io/api/clues?category=${category.id}&value=800`).then((clue) => {
    //         // console.log(clue[0]);
    //         gotClue(category, clue[0])
    //       })
    //       $.ajax(`http://jservice.io/api/clues?category=${category.id}&value=1000`).then((clue) => {
    //         // console.log(clue[0]);
    //         gotClue(category, clue[0])
    //       })
    //     })
    //   })
  },
  startQuestion: function(quesion, answer) {
    console.log('STARTING QUESTION');
    console.log(quesion);
    console.log(answer);
    // this.setState({
    //   answering: {
    //     question: quesion,
    //     answer: answer
    //   }
    // })
  },
  render: function() {
    if (this.state.categories[0]) {
      console.log('STATE: ', this.state.categories);

      let gameContent = this.state.categories.map((category, i) => {
        let clues = this.state.categories[i].clues

        clues = _.sortBy(clues, function(clue) {
          return clue.value
        })

        return (
          <Category categoryName={this.state.categories[i].title} key={i}>
            <li onClick={this.startQuestion.bind(null, clues[0].question, clues[0].answer)} value={clues[0].value}> ${clues[0].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[1].question, clues[1].answer)} value={clues[1].value}> ${clues[1].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[2].question, clues[2].answer)} value={clues[2].value}> ${clues[2].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[3].question, clues[3].answer)} value={clues[3].value}> ${clues[3].value} </li>
            <li onClick={this.startQuestion.bind(null, clues[4].question, clues[4].answer)} value={clues[4].value}> ${clues[4].value} </li>
          </Category>
        )
      })

      return (
        <div id="game-container">
          {gameContent}
        </div>
      )
    } else {
      return null
    }
    // console.log(game.);




  }
})

export default GameBoard
