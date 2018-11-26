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
      addFormVisible: false,
      eventsFullView: false,
      forceNavRender: true
    },
    eventData: {
      events: [],
      listScrollPos: 0
    },
    filterData: {
      regionFilter: {id: 0, name: ''},
      hazardFilter: {id: 0, name: ''},
      impactFilter: {id: 0, name: ''},
      dateFilter: { startDate: 0, endDate: 0 },
      favoritesFilter: false
    },
    chartData:{
      chart1: [],
      chart2: [],
      chart3: [],
      chart4: []
  }

  }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default store