import React from 'react'
import store from '../../../store'

const User = React.createClass({
  getInitialState: function() {
    return {player: {}}
  },
  componentWillReceiveProps: function() {
    this.setState({player: this.props.player})
  },
  render: function() {

    let username;
    if (this.props.player.username === store.session.get('username')) {
      username = (<p className="my-player">{this.props.player.username}</p>)
    } else {
      username = (<p>{this.props.player.username}</p>)
    }

    if (this.props.player.username === store.multiplayerGame.model.get('turn')) {
      return (
        <li className="user player-turn">
          {username}
          <h3>${this.state.player.money}</h3>
        </li>
      )
    } else {
      return (
        <li className="user">
          {username}
          <h3>${this.state.player.money}</h3>
        </li>
      )
    }
  }
})

export default User
