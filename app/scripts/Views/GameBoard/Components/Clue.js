import React from 'react'

const Clue = React.createClass({
  getInitialState: function() {
    return {answered: false}
  },
  clueClicked: function() {
    // let correctAnswer = this.props.clue.get('answer')
    // correctAnswer = correctAnswer.replace('(', '')
    // correctAnswer = correctAnswer.replace(')', '')
    // correctAnswer = correctAnswer.replace('.', '')
    // correctAnswer = correctAnswer.replace(',', '')
    // correctAnswer = correctAnswer.replace('<i>', '')
    // correctAnswer = correctAnswer.replace('</i>', '')
    // correctAnswer = correctAnswer.replace(/\\/g, '');

    this.props.startQuestion(this.props.clue);
    this.setState({clicked: true})
  },
  componentDidMount: function() {
    this.props.clue.on('change', () => {
      console.log('CLUE CHANGED STATE: ', this.props.clue);
      this.setState({answered: this.props.clue.get('answered')})
    })
  },
  render: function() {
    console.log('cluestate: ', this.state.answered);
    if (!this.state.answered) {
      return (<li onClick={this.clueClicked} className="clue">${this.props.clue.get('value')}</li>)
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
