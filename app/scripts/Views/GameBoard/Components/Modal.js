import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import _ from 'underscore'

const Modal = React.createClass({
  checkAnswer: function() {
    if (this.refs.questionInput.value === this.props.answer) {
      console.log('YOU ARE CORRECT!');
      this.props.sendAnswer(true)
    } else {
      console.log('YOU ARE WRONG!');
      this.props.sendAnswer(false)
    }
  },
  removeModal: function(e) {
    let targetClassList = _.toArray(e.target.classList)
    if (targetClassList.indexOf('modal-container') !== -1 || targetClassList.indexOf('pass-btn') !== -1) {
      this.props.removeModal()
    }
  },
  render: function() {
    return (
      <div onClick={this.removeModal} className="modal-container">
        <div className="modal">
          <h4>{this.props.clueValue}</h4>
          <h3>{this.props.question}</h3>
          <p>{this.props.answer}</p>
          <input id="questionInput" type="text" ref="questionInput"/>
          <button onClick={this.checkAnswer} className="submit-answer-btn">Submit Answer</button>
          <button onClick={this.removeModal} className="pass-btn">Pass</button>
        </div>
      </div>
    )
  }
})

export default Modal
