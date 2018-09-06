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

//Local
import store from './store'
import App from './App.jsx'

const resolvers = {
  Query: {
    SingleEvent: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: 'Event', id: variables.eventId })
      console.log(`This thing: ${getCacheKey({ __typename: 'Event', id: variables.eventId })}`)
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

const render = Component => {
  ReactDOM.render(
      <Provider store={store}>
        <Component />
      </Provider>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => { render(App) })
}