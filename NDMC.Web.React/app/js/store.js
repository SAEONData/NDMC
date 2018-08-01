'use strict'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createHashHistory } from 'history'
import reducers from './reducers'

const history = createHashHistory()
const middleware = routerMiddleware(history)

const store = createStore(
  combineReducers({ ...reducers, router: routerReducer }), {
    ...applyMiddleware(middleware),

    globalData: {
    },
    eventData: {
    },
    filterData: {
      regionFilter: {id: 0, name: ''},
      hazardFilter: {id: 0, name: ''},
      impactFilter: {id: 0, name: ''},
      dateFilter: { startDate: 0, endDate: 0 }
    }

  }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default store