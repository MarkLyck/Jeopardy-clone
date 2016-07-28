import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import _ from 'underscore'

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
    answer = answer.trim()

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
      this.props.sendAnswer(false)
    }
  },
  componentDidMount: function() {
    console.log('COMPONENT MOUNTED');
    let secondsLeft = this.state.timeLeft

    let countdownTimer = setInterval(() => {
      // console.log(this.state.timeLeft);
      if (this.state.timeLeft !== 0) {
        // console.log('interval');
        secondsLeft -= 1;
        this.setState({timeLeft: secondsLeft})
      } else {
        clearInterval(countdownTimer);
        this.props.sendAnswer(false)
      }

    }, 1000);
  },
  speakAnswer: function() {
    this.setState({music:false, listening: true})
    this.thinkingMusic.pause();
    this.thinkingMusic.currentTime = 0;

    var recognition = new webkitSpeechRecognition();

    recognition.onresult = (event) => {
      console.log('recognition success: ', event.results[0][0].transcript);
      this.refs.questionInput.value = event.results[0][0].transcript
      this.checkAnswer()
    }
    recognition.onerror = function(event) {
      this.setState({music: true, listening: false})
      if (event.error == 'no-speech') {
        console.log('### NO SPEECH ###');
        start_img.src = 'mic.gif';
        showInfo('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        console.log('### NO AUDIO DEVICE ###');
        throw new Error('### NO AUDIO DEVICE ###');
        start_img.src = 'mic.gif';
        showInfo('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo('info_blocked');
          console.log('### SPEECH BLOCKED ###');
          throw new Error('### SPEECH BLOCKED ###');
        } else {
          showInfo('info_denied');
          console.log('### SPEECH DENIED ###');
          throw new Error('### SPEECH DENIED ###');
        }
        ignore_onend = true;
      }
    };
    recognition.start();

  },
  render: function() {
    if (this.state.music) {
      this.thinkingMusic.play();
    }

    let microphone;
    if (this.state.listening) {
      microphone = (
        <span onClick={this.speakAnswer} className="fa-stack fa-lg mic-button listening">
          <i className="fa fa-circle-thin fa-stack-2x"></i>
          <i className="fa fa-microphone fa-stack-1x"></i>
        </span>
      )
    } else {
      microphone = (
        <span onClick={this.speakAnswer} className="fa-stack fa-lg mic-button">
          <i className="fa fa-circle-thin fa-stack-2x"></i>
          <i className="fa fa-microphone fa-stack-1x"></i>
        </span>
      )
    }

    console.log('ANSWER: ', this.props.answer);
    return (
      <div onClick={this.removeModal} className="modal-container">
        <div className="modal">
          <h4>{this.props.category} for ${this.props.clueValue}</h4>
          <h3>{this.props.question}</h3>

          <h2>{this.state.timeLeft}</h2>

          {microphone}

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
