import React from 'react'

const Clue = React.createClass({
  getInitialState: function() {
    return {clicked: false}
  },
  clueClicked: function() {
    console.log('clue props:', this.props);
    this.props.clickHandler(this.props.clue.question, this.props.clue.answer, this.props.clue.value)
    this.setState({clicked: true})
  },
  render: function() {
    if (!this.state.clicked) {
      return (<li onClick={this.clueClicked} className="clue">${this.props.clue.value}</li>)
    } else {
      return (<li className="clue"></li>)
    }

  }
})

export default Clue
