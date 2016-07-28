import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'

import App from './views/App'
import GameBoard from './views/GameBoard/GameBoard'
import Leaderboard from './views/Leaderboard/Leaderboard'

const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/play" component={GameBoard} />
      <Route path="/leaderboards" component={Leaderboard} />
      <Route path="/*" component={GameBoard} />
    </Route>
  </Router>
)

export default router
