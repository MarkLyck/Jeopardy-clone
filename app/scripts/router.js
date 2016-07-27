import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'

import App from './views/App'
import GameBoard from './views/GameBoard/GameBoard'

const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/play" component={GameBoard} />
    </Route>
  </Router>
)

export default router
