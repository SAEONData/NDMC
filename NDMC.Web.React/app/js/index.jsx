'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Favicon from 'react-favicon'
import favicon_image from '../images/favicon.png'
import store from './store'
import App from './App.jsx'

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <Favicon url={favicon_image} />
        <Component />
      </div>
    </Provider>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => { render(App) })
}
