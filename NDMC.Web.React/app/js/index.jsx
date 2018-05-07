'use strict'

/**
 * Depecdencies
 * @ignore
 */
import 'antd/lib/style/index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/docs/css/mdb.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import store from './store'
import queryString from 'query-string'
import { Button } from 'mdbreact/'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Home from './components/Base/Home.jsx'
import Events from './components/Events/List/Events.jsx'
//import Graphs from './components/Events/Graphs/EventGraph.jsx'
import CustomNavbar from './components/Base/CustomNavbar.jsx'
import { stripURLParam } from "./globalFunctions.js"

/**
 * Tap Event
 * @ignore
 */
injectTapEventPlugin()

/**
 * App
 */
class App extends React.Component {

  constructor(props) {
    super(props);
    this.getNavbar = this.getNavbar.bind(this)
    this.state = { navbar: true}
    if(location.toString().includes("navbar=hidden")){
      this.state = { navbar: false}
      stripURLParam("navbar=hidden")
    }
  }

  getNavbar(){
    if(this.state.navbar){
      return <CustomNavbar />
    }
  }

  render() {
    return (
      <div className="container">
        <Router>
          <div>
            {this.getNavbar()}
            <Switch>
              {/* <Redirect from="/" to="/projects" exact /> */}
              <Route path="/" component={Home} exact />
              <Route path="/events" component={Events} exact />
              {/* <Route path="/graphs" component={Graphs} exact /> */}
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
