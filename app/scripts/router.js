import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'

import App from './views/App'
import GameBoard from './views/GameBoard/GameBoard'


//<Route path="/leaderboards" component={leaderboards} />
const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/play" component={GameBoard} />


      <Route path="/*" component={GameBoard} />
    </Route>
  </Router>
)

export default router
