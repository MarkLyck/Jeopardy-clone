import React from 'react'

import store from '../../../store'

import User from './User'

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
      return <User player={player} key={i}/>
    })
    return (
      <ul id="user-section">
        {players}
      </ul>
    )
  }
})

export default UserSection
