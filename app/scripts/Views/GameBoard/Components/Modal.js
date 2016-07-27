import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

const Modal = React.createClass({
  unmount: function() {
    // var node = this.getDOMNode();
    var node = ReactDOM.findDOMNode(this)
    ReactDOM.unmountComponentAtNode(node);
    $(node).remove();
  },
  checkAnswer: function() {
    if (this.refs.questionInput.value === this.props.answer) {
      console.log('YOU ARE CORRECT!');
      // this.unmount()
      this.props.test(true)
    } else {
      console.log('YOU ARE WRONG!');
      // this.unmount()
      this.props.test(false)
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
