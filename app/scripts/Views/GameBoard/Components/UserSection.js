import React from 'react'

import store from '../../../store'

const UserSection = React.createClass({
  getInitialState: function() {
    return {clicked: false}
  },
  componentDidMount: function() {
    store.session.on('change', () => {
      console.log('SESSION CHANGED');
      this.forceUpdate()
    })
  },
  render: function() {
    return (
      <div id="user-section">
        ${store.session.get('money')}
      </div>
    )

  }
})

export default UserSection
