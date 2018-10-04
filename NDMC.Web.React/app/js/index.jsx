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