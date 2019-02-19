'use strict'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createHashHistory } from 'history'
import userManager from './components/Authentication/userManager'
import reducers from './reducers'
import { loadUser } from 'redux-oidc'
import { reducer as oidcReducer } from 'redux-oidc';


const history = createHashHistory()
const middleware = routerMiddleware(history)

const store = createStore(
  combineReducers({ oidc: oidcReducer, ...reducers, router: routerReducer }), {
    ...applyMiddleware(middleware),

    globalData: {
      loading: false,
      editMode: false, 
      readOnly: false,
      daoid: true,
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

    navigation: {
      locationHash: "#/"
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
loadUser(store, userManager)


export default store