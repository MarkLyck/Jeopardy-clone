import React from 'react'

import store from '../../../store'

const UserSection = React.createClass({
  getInitialState: function() {
    return {money: 0}
  },
  componentDidMount: function() {
    store.session.on('change', this.updateMoney)
  },
  updateMoney: function() {
    this.setState({money: store.session.get('money')})
  },
  componentWillUnmount: function() {
    store.session.off('change', this.updateMoney)
  },
  render: function() {
    let players;
    if (this.props.players[0]) {
      players = this.props.players.map((player, i) => {
        return (
          <li className="user" key={i}>
            <p>{player.username}</p>
            <h3>${player.money}</h3>
          </li>
        )
      })
    }
    return (
      <ul id="user-section">
        {players}
      </ul>
    )
  }
})

export default UserSection
