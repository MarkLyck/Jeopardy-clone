import React from 'react'
import {hashHistory} from 'react-router'

import store from '../store'

import Modal from './gComponents/Modal'

const App = React.createClass({
  getInitialState: function() {
    return {showModal: false}
  },
  logout: function() {
    console.log('logout');
    localStorage.removeItem('authtoken')
    store.session.clear()
  },
  showLogin: function() {
    this.setState({showModal:'login'})
  },
  login: function() {
    let username = this.refs.username.value
    let password = this.refs.password.value
    store.session.login(username, password)
  },
  showSignup: function() {
    this.setState({showModal:'signup'})
  },
  signup: function() {
    let username = this.refs.username.value
    let password = this.refs.password.value
    store.session.signup(username, password)
  },
  gotoLeaderboards: function() {
    hashHistory.push('/leaderboards')
  },
  removeModal: function() {
    this.setState({showModal: false})
  },
  componentDidMount: function() {
    // This will update if we log in / out
    store.session.on('change', () => {
      this.setState({showModal: false})
    })
  },
  render: function() {
    let navButtons
    if (store.session.get('authtoken')) {
      navButtons = (
        <ul>
          <li onClick={this.gotoLeaderboards}>Leaderboards</li>
          <li onClick={this.logout}>Logout</li>
        </ul>
      )
    } else {
      navButtons = (
        <ul>
          <li onClick={this.gotoLeaderboards}>Leaderboards</li>
          <li onClick={this.showLogin}>Login</li>
          <li onClick={this.showSignup}>Signup</li>
        </ul>
      )
    }

    let modal;
    if (this.state.showModal === 'login') {
      modal = (
        <Modal removeModal={this.removeModal}>
          <h3>Login</h3>
          <input type="text" ref="username" placeholder="Username"/>
          <input type="password" ref="password" placeholder="Password"/>
          <button onClick={this.login}>Login</button>
        </Modal>
      )
    } else if (this.state.showModal === 'signup') {
      modal = (
        <Modal removeModal={this.removeModal}>
          <h3>Signup</h3>
          <input type="text" ref="username" placeholder="Username"/>
          <input type="password" ref="password" placeholder="Password"/>
          <button onClick={this.signup}>Signup</button>
        </Modal>
      )
    }
    return (
      <div>
        <header>
          <nav>
            <img id="logo" src="assets/images/logo.png"/>
            {navButtons}
          </nav>
        </header>
        {this.props.children}
        {modal}
      </div>
    )
  }
})

export default App
