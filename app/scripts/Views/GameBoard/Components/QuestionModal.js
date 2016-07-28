import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import _ from 'underscore'

const QuestionModal = React.createClass({
  thinkingMusic: new Audio('assets/sounds/thinking_music.mp3'),
  checkAnswer: function() {
    this.thinkingMusic.pause();
    this.thinkingMusic.currentTime = 0;
    let answer = this.refs.questionInput.value.toLowerCase()
    answer = answer.replace('what is', '')
    answer = answer.replace('who is', '')
    answer = answer.trim()

    let correctAnswer = this.props.answer.toLowerCase()
    correctAnswer.replace('(', '')
    correctAnswer.replace(')', '')
    correctAnswer.replace('.', '')
    correctAnswer.replace(',', '')
    correctAnswer.replace('<i>', '')
    correctAnswer.replace('</i>', '')
    
    if (answer === this.props.answer.toLowerCase()) {
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
      this.thinkingMusic.pause();
      this.thinkingMusic.currentTime = 0;
      this.props.removeModal()
    }
  },
  render: function() {
    console.log('RENDERING QUESTION MODAL');
    var recognition = new webkitSpeechRecognition();
    // console.log(recognition);

    recognition.onresult = (event) => {
      console.log('GOT RESULT');
      console.log(event.results[0][0].transcript);
      this.refs.questionInput.value = event.results[0][0].transcript
      this.checkAnswer()
    }
    recognition.start();

    // var thinkingMusic = new Audio('assets/sounds/thinking_music.mp3');
    this.thinkingMusic.play();

    console.log('ANSWER: ', this.props.answer);
    return (
      <div onClick={this.removeModal} className="modal-container">
        <div className="modal">
          <h4>{this.props.category} for ${this.props.clueValue}</h4>
          <h3>{this.props.question}</h3>

          <div className="wrapper">
            <input id="questionInput" type="text" ref="questionInput" placeholder="Your Answer"/>
            <button onClick={this.checkAnswer} className="submit-answer-btn">Submit Answer</button>
          </div>
          <button onClick={this.removeModal} className="pass-btn">Pass</button>
        </div>
      </div>
    )
  }
})

export default QuestionModal
