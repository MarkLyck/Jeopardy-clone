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
      console.log(store.clues.get(this.props.clue));
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
    } else if (this.state.answered === 'correct'){
      return (<li className="clue answered"><i className="fa fa-check"/></li>)
    } else if (this.state.answered === 'wrong'){
      return (<li className="clue answered"><i className="fa fa-times"/></li>)
    } else if (this.state.answered === 'passed'){
      return (<li className="clue answered">...</li>)
    }
  }
})

export default Clue
