import React from 'react'

const Clue = React.createClass({
  getInitialState: function() {
    return {clicked: false}
  },
  clueClicked: function() {
    let correctAnswer = this.props.clue.get('answer')
    correctAnswer = correctAnswer.replace('(', '')
    correctAnswer = correctAnswer.replace(')', '')
    correctAnswer = correctAnswer.replace('.', '')
    correctAnswer = correctAnswer.replace(',', '')
    correctAnswer = correctAnswer.replace('<i>', '')
    correctAnswer = correctAnswer.replace('</i>', '')
    correctAnswer = correctAnswer.replace(/\\/g, '');

    this.props.startQuestion(this.props.clue.get('question'), correctAnswer, this.props.clue.get('value'), this.props.categoryName)
    this.setState({clicked: true})
  },
  render: function() {
    if (!this.state.clicked) {
      return (<li onClick={this.clueClicked} className="clue">${this.props.clue.get('value')}</li>)
    } else {
      return (<li className="clue answered"></li>)
    }

  }
})

export default Clue
