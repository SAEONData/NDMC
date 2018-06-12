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
      loading: true,
    },
    eventData: {
      events: [],
      eventDetails: {},
      start: 0,
      end: 10,
      listScrollPos: 0
    },
    filterData: {
      regionFilter: 0,
      hazardFilter: 0,
      impactFilter: 0,
      dateFilter: { startDate: 0, endDate: 0 }
    },
    lookupData: {
      region: [],
      regionTree: [],
      hazard: [],
      hazardTree: [],
      impact: [],
      impacts: []
    }

  }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default store