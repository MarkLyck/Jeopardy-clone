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
        ${this.state.money}
      </div>
    )

  }
})

export default UserSection
