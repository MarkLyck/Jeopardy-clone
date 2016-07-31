import React from 'react'

import store from '../../../store'

const Clue = React.createClass({
  getInitialState: function() {
    return {answered: false}
  },
  clueAlreadyClicked: false,
  clueClicked: function() {
    if (!this.clueAlreadyClicked) {
      if (store.multiplayerGame.model.get('playerCount') === 3 && store.multiplayerGame.model.get('turn') === store.session.get('username')) {
        console.log('VALID QUESTION CLICK');
        this.props.startQuestion(store.clues.get(this.props.clue));
        // this.setState({clicked: true})
      } else {
        if (store.multiplayerGame.model.get('playerCount') !== 3) {
          throw new Error('Not enough players')
        } else {
          throw new Error('It is not your turn')
        }
      }
    }
    this.clueAlreadyClicked = true
  },
  componentDidMount: function() {
    this.clueAlreadyClicked = false
    store.clues.on('gotAllClues', () => {
      this.setState({answered: store.clues.get(this.props.clue).get('answered')})
      let thisClue = store.clues.get(this.props.clue)
      thisClue.on('change', () => {
        this.setState({answered: store.clues.get(this.props.clue).get('answered')})
      })
    })
  },
  componentWillUnmount: function() {
    store.clues.off()
  },
  render: function() {
    if (!store.clues.get(this.props.clue)) {
      return null
    }
    if (!this.state.answered) {
      return (<li onClick={this.clueClicked} className="clue">${store.clues.get(this.props.clue).get('value')}</li>)
    } else {
      return (<li className="clue answered"></li>)
    }
  }
})

export default Clue
