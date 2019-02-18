'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { OidcProvider } from  'redux-oidc'
import userManager from './components/Authentication/userManager'
import Favicon from 'react-favicon'
import favicon_image from '../images/favicon.png'
import store from './store'
import App from './App.jsx'

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <div>
          <Favicon url={favicon_image} />
          <Component />
        </div>
      </OidcProvider>
    </Provider>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => { render(App) })
}
