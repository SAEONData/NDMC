'use strict'

//React
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

//Local
import store from './store'
import App from './App.jsx'

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