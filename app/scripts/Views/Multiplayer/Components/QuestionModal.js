import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import _ from 'underscore'
import stringSimilarity from 'string-similarity'

import store from '../../../store'

const QuestionModal = React.createClass({
  getInitialState: function() {
    return {timeLeft: 30, music:true, listening: false}
  },
  thinkingMusic: new Audio('assets/sounds/thinking_music.mp3'),
  checkAnswer: function() {
    this.thinkingMusic.pause();
    this.thinkingMusic.currentTime = 0;
    let answer = this.refs.questionInput.value.toLowerCase()
    answer = answer.replace('what is', '')
    answer = answer.replace('who is', '')
    answer = answer.replace(',', '')
    answer = answer.replace('.', '')
    answer = answer.trim()

    let correctAnswer = this.props.clue.get('answer')
    correctAnswer = correctAnswer.toLowerCase()
    correctAnswer = correctAnswer.replace('(', '')
    correctAnswer = correctAnswer.replace(')', '')
    correctAnswer = correctAnswer.replace('.', '')
    correctAnswer = correctAnswer.replace(',', '')
    correctAnswer = correctAnswer.replace('<i>', '')
    correctAnswer = correctAnswer.replace('</i>', '')
    correctAnswer = correctAnswer.replace(/\\/g, '');
    correctAnswer = correctAnswer.trim();

    console.log('CHECKING: ' + answer + ' AGAINST: ', correctAnswer);

    if (stringSimilarity.compareTwoStrings(answer, correctAnswer) >= 0.75) {
      console.log('YOU ARE CORRECT!');
      this.props.sendAnswer(true, answer)
      clearInterval(this.state.interval);
      this.props.clue.set('answered', 'correct')
      console.log('store clue after correct:', store.clues.get(this.props.clue.get('id')));
    } else {
      console.log('YOU ARE WRONG!');
      this.props.sendAnswer(false, answer)
      clearInterval(this.state.interval);
      this.props.clue.set('answered', 'wrong')
      console.log('store clue after wrong:', store.clues.get(this.props.clue.get('id')));
    }
  },
  removeModal: function(e) {
    let targetClassList = _.toArray(e.target.classList)
    if (targetClassList.indexOf('modal-container') !== -1 || targetClassList.indexOf('pass-btn') !== -1 ||  targetClassList.indexOf('pass-span') !== -1) {
      this.thinkingMusic.pause();
      this.thinkingMusic.currentTime = 0;
      this.props.sendAnswer(false)
      clearInterval(this.state.interval);
      this.props.clue.set('answered', 'passed')
    }
  },
  componentDidMount: function() {
    let countdownTimer = setInterval(() => {
      if (this.state.timeLeft !== 0) {
        this.setState({timeLeft: this.state.timeLeft -1})
      } else {
        clearInterval(countdownTimer);
        this.props.sendAnswer(false)
      }
    }, 1000);
    this.setState({interval: countdownTimer})
  },
  speakAnswer: function() {
    this.setState({music:false, listening: true})
    this.thinkingMusic.pause();
    this.thinkingMusic.currentTime = 0;

    let ignore_onend = false

    var recognition = new webkitSpeechRecognition();

    recognition.onresult = (event) => {
      console.log('recognition success: ', event.results[0][0].transcript);
      this.refs.questionInput.value = event.results[0][0].transcript
      this.checkAnswer()
    }
    recognition.onerror = (event) => {
      this.setState({music: true, listening: false})
      if (event.error == 'no-speech') {
        console.log('### NO SPEECH ###');
        ignore_onend = true;
      } else if (event.error == 'audio-capture') {
        console.log('### NO AUDIO DEVICE ###');
        throw new Error('### NO AUDIO DEVICE ###');
        ignore_onend = true;
      } else if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          console.log('### SPEECH BLOCKED ###');
          throw new Error('### SPEECH BLOCKED ###');
        } else {
          console.log('### SPEECH DENIED ###');
          throw new Error('### SPEECH DENIED ###');
        }
        ignore_onend = true;
      } else {
        console.log('### UNKNOWN RECORDING ERROR ###');
        throw new Error('### UNKNOWN MIC ERROR ###');
      }
    };
    recognition.onend = (event) => {
      if (ignore_onend) {
        return
      }
      this.setState({music: true, listening: false})
    }
    recognition.start();

  },
  render: function() {
    if (this.state.music) {
      this.thinkingMusic.play();
    }

    let microphone;
    if (this.state.listening) {
      microphone = (
        <i onClick={this.speakAnswer} className="fa fa-microphone mic-button listening"></i>
      )
    } else {
      microphone = (
        <i onClick={this.speakAnswer} className="fa fa-microphone mic-button"></i>
      )
    }

    console.log('ANSWER: ', this.props.clue.get('answer'));
    return (
      <div onClick={this.removeModal} className="modal-container">
        <div className="modal">
          <h2 id="time-left">{this.state.timeLeft}</h2>

          <h4 className="modal-category">{this.props.clue.get('category')} for ${this.props.clue.get('value')}</h4>

          <h3 className="modal-question">{this.props.clue.get('question')}</h3>

          {microphone}

          <div className="wrapper">
            <input id="questionInput" type="text" ref="questionInput" placeholder="Your Answer"/>
            <button onClick={this.checkAnswer} className="submit-answer-btn">Answer</button>
          </div>
          <button onClick={this.removeModal} className="pass-btn">or <span className="pass-span">Pass</span></button>
        </div>
      </div>
    )
  }
})

export default QuestionModal
