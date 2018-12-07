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
      forceNavRender: true,
      showSideNavButton: true,
      showSideNav: false,
      showHeader: true,
      showNavbar: true,
      showFooter: true,
      showListFilterOptions: true,
      showBackToList: true,
      showListExpandCollapse: true,
      showListViewOption: true,
      showFavoritesOption: true,
      showListFilterOptions: true,
      showDetailsInParent: false
    },
    eventData: {
      events: [],
      listScrollPos: 0
    },
    filterData: {
      regions: [],
      hazards: [],
      impacts: [],
      regionFilter: 0,
      hazardFilter: 0,
      impactFilter: 0,
      dateFilter: { startDate: 0, endDate: 0 },
      favoritesFilter: false
    },
    chartData: {
      chart1: [],
      chart2: [],
      chart3: [],
      chart4: []
    }

  }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default store