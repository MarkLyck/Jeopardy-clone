import React from 'react'

import store from '../../../store'

const Clue = React.createClass({
  getInitialState: function() {
    return {answered: false, clue: store.clues.get(this.props.clue)}
  },
  clueClicked: function() {
    this.props.startQuestion(this.state.clue);
    this.setState({clicked: true})
  },
  componentDidMount: function() {
    this.state.clue.on('change', () => {
      this.setState({answered: this.state.clue.get('answered')})
    })
  },
  render: function() {
    if (!this.state.answered) {
      return (<li onClick={this.clueClicked} className="clue">${this.state.clue.get('value')}</li>)
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
