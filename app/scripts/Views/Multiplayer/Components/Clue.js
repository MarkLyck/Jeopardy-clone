import React from 'react'

import store from '../../../store'

const Clue = React.createClass({
  getInitialState: function() {
    return {answered: false}
  },
  clueClicked: function() {
    console.log('madeTurn: ', store.multiplayerGame.model.get('madeTurn'));
    if (!store.multiplayerGame.model.get('madeTurn')) {
      if (store.multiplayerGame.model.get('playerCount') === 3 && store.multiplayerGame.model.get('turn') === store.session.get('username')) {
        console.log('VALID QUESTION CLICK');
        store.multiplayerGame.model.set('madeTurn', true)
        store.multiplayerGame.model.save()
        this.props.startQuestion(store.clues.get(this.props.clue));
      } else {
        if (store.multiplayerGame.model.get('playerCount') !== 3) {
          throw new Error('Not enough players')
        } else {
          throw new Error('It is not your turn')
        }
      }
    }

  },
  componentDidMount: function() {
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
