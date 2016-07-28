import React from 'react'

const Clue = React.createClass({
  getInitialState: function() {
    return {answered: false}
  },
  clueClicked: function() {
    this.props.startQuestion(this.props.clue);
    this.setState({clicked: true})
  },
  componentDidMount: function() {
    this.props.clue.on('change', () => {
      this.setState({answered: this.props.clue.get('answered')})
    })
  },
  render: function() {
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
