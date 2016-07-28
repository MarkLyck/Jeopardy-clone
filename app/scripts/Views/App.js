import React from 'react'
import {Link} from 'react-router'

const App = React.createClass({
  logout: function() {
    console.log('logout');
  },
  render: function() {
    return (
      <div>
        <header>
          <nav>
            <img id="logo" src="assets/images/logo.png"/>
            <ul>
              <li><Link to="/leaderboards">Leaderboards</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
              <li onClick={this.logout}>Logout</li>
            </ul>
          </nav>
        </header>
        {this.props.children}
      </div>
    )
  }
})

export default App
