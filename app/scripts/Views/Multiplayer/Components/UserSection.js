import React from 'react'

import store from '../../../store'

const UserSection = React.createClass({
  getInitialState: function() {
    return {players: []}
  },
  componentDidMount: function() {
    store.multiplayerGame.model.on('updateGame', this.updateMoney)
  },
  updateMoney: function() {
    this.setState({players: store.multiplayerGame.model.get('players')})
  },
  componentWillUnmount: function() {
    store.multiplayerGame.model.off('updateGame', this.updateMoney)
  },
  render: function() {
    let players = this.state.players.map((player, i) => {
      return (
        <li className="user" key={i}>
          <p>{player.username}</p>
          <h3>${player.money}</h3>
        </li>
      )
    })
    return (
      <ul id="user-section">
        {players}
      </ul>
    )
  }
})

export default UserSection
