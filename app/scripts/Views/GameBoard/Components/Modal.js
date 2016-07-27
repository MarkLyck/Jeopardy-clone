import React from 'react'

const Modal = React.createClass({
  checkAnswer: function() {
    if (this.refs.questionInput.value === this.props.answer) {
      console.log('YOU ARE CORRECT!');
    } else {
      console.log('YOU ARE WRONG!');
    }
  },
  render: function() {
    return (
      <div className="modal-container">
        <div className="modal">
          <h4>{this.props.category}</h4>
          <h3>{this.props.question}</h3>
          <p>{this.props.answer}</p>
          <input id="questionInput" type="text" ref="questionInput"/>
          <button onClick={this.checkAnswer} id="submit-answer-btn">Submit Answer</button>
        </div>
      </div>
    )
  }
})

export default Modal
