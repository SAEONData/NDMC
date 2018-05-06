'use strict'

/**
 * Dependencies
 * @ignore
 */
import React from 'react'
import { HashRouter as Router, Route, IndexRoute, Redirect, Switch } from 'react-router-dom'
import { createHashHistory } from 'history'
import { ConnectedRouter } from 'react-router-redux'

import store from './store'


const history = createHashHistory()

class SwitchRouter extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Router history={history}>
      <Switch>
        <Redirect exact from='/' to='/' />
      </Switch>
      </Router>
    )
  }
}

/**
 * Export
 * @ignore
 */
export default SwitchRouter