'use strict'

/**
 * Depecdencies
 * @ignore
 */
import 'antd/lib/style/index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'

//React
import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

//Local
import Dashboard from './components/Base/Dashboard.jsx'
import Events from './components/Events/List/Events.jsx'
import EventDetails from './components/Events/Details/EventDetails.jsx'
import Graphs from './components/Events/Graphs/EventGraph.jsx'
import CustomNavbar from './components/Base/CustomNavbar.jsx'
import { stripURLParam } from './globalFunctions.js'
import Header from './components/Base/Header.jsx'
import Footer from './components/Base/Footer.jsx'

/**
 * App
 */
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { navbar: true }
    if (location.toString().includes('navbar=hidden')) {
      this.state = { navbar: false }
      stripURLParam('navbar=hidden')
    }
  }

  render() {
    let { navbar } = this.state

    return (
      <div style={{ margin: "0px 25px 0px 25px", backgroundColor: "white" }}>
        <Router>
          <div>
            {navbar && <Header/>}
            {navbar && <CustomNavbar />}
            <Switch>
              <Route path='/' component={Dashboard} exact />
              <Route path='/events' component={Events} exact />
              <Route path='/events/:id' component={EventDetails} exact />
              <Route path='/graphs' component={Graphs} exact />
            </Switch>
            {navbar && <Footer />}
          </div>
        </Router>
      </div>
    )
  }
}

export default App