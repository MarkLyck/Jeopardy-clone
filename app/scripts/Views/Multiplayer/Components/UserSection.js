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
    return (
      <div id="user-section">
        <div className="user">
          <p>{store.session.get('username')}</p>
          <h3>${this.state.money}</h3>
        </div>
      </div>
    )
  }
})

export default UserSection
