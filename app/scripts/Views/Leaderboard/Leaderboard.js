import React from 'react'
import _ from 'underscore'

import store from '../../store'

const LeaderBoard = React.createClass({
  getInitialState: function() {
    return {users: store.users}
  },
  componentDidMount: function() {
    console.log(store.users);
    store.users.on('update', this.updateUsers)
    store.users.fetch()
  },
  updateUsers: function() {
    this.setState({users: store.users})
  },
  componentWillUnmount: function() {
    store.users.off('update', this.updateUsers)
  },
  render: function() {
    let sortedUsers = _.sortBy(store.users.models, function(user) {
      return user.get('highScore')
    })
    let users = sortedUsers.map((user, i) => {
      console.log('user: ', user);
      return (
        <li className="user" key={i}>
          <h3 className="username">{user.get('username')}</h3>
          <h3 className="highScore">${user.get('highScore')}</h3>
        </li>
      )
    })
    return (
      <div>
        <div id="highscore-tabs"><h3>Username</h3><h3>Highscore</h3></div>
        <ul id="highscore-list">
          {users}
        </ul>
      </div>
    )
  }
})

export default LeaderBoard
