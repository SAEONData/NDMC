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
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

//Local
import Home from './components/Base/Home.jsx'
import Events from './components/Events/List/Events.jsx'
import EventDetails from './components/Events/Details/EventDetails.jsx'
import Graphs from './components/Events/Graphs/EventGraph.jsx'
import CustomNavbar from './components/Base/CustomNavbar.jsx'
import { stripURLParam } from './globalFunctions.js'
import Header from './components/Base/Header.jsx'
import Footer from './components/Base/Footer.jsx'
import store from './store'

//Graphql
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import gql from 'graphql-tag'

const resolvers = {
  Query: {
    SingleEvent: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: 'Event', id: variables.eventId })
      console.log(`This thing: ${ getCacheKey({ __typename: 'Event', id: variables.eventId })}`)
      const fragment = gql`
        fragment endOfEvent on Event {
          endDate
        }
      `;
      const endOfEvent = cache.readFragment({ fragment, id })
      console.log(endOfEvent)
      return endOfEvent
    },
  }
}

const client = new ApolloClient({
  uri: "http://app01.saeon.ac.za/ndmcapi/api/GraphQL/Request",
  clientState: {
    resolvers
  }
})

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
      <div className='container'>
        <Router>
          <div>
            {navbar && <Header/>}
            {navbar && <CustomNavbar />}
            <Switch>
              {/* <Redirect from='/' to='/projects' exact /> */}
              <Route path='/' component={Home} exact />
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

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('app')
)
