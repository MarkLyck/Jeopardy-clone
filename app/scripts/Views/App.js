import React from 'react'
import {Link} from 'react-router'

const App = React.createClass({
  logout: function() {

  },
  render: function() {
    return (
      <div>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li onClick={this.logout}>Logout</li>
          </ul>
        </nav>
        {this.props.children}
      </div>
    )
  }
})

export default App
