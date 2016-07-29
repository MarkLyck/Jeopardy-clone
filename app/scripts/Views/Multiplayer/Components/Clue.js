import React from 'react'

import store from '../../../store'

const Clue = React.createClass({
  getInitialState: function() {
    return {answered: false}
  },
  clueClicked: function() {
    this.props.startQuestion(store.clues.get(this.props.clue));
    this.setState({clicked: true})
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
