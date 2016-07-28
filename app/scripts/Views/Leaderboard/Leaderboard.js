import React from 'react'
import _ from 'underscore'

import store from '../../store'

const LeaderBoard = React.createClass({
  getInitialState: function() {
    return {users: store.users}
  },
  componentDidMount: function() {
    console.log(store.users);
    store.users.on('update', () => {
      console.log(store.users);
      this.setState({users: store.users})
    })
    store.users.fetch()
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
          <h3 className="highScore">{user.get('highScore')}</h3>
        </li>
      )
    })
    return (
      <ul id="highscore-list">
        {users}
      </ul>
    )
  }
})

export default LeaderBoard
