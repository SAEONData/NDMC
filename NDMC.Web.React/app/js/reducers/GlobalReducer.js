'use strict'

import * as ACTION_TYPES from '../config/action-types'

export default function GlobalReducer(state = {}, action) {

  const { type, payload } = action

  switch (type) {

    case "TOGGLE_ADD_FORM": {
      return { ...state, addFormVisible: payload }
    }

    case "SET_EVENTS_FULLVIEW": {
      return { ...state, eventsFullView: payload }
    }

    case "FORCE_NAV_RENDER": {
      return { ...state, forceNavRender: payload }
    }

    case "TOGGLE_SIDENAV": {
      return { ...state, showSideNav: payload }
    }

    case "TOGGLE_HEADER": {
      return { ...state, showHeader: payload }
    }

    case "TOGGLE_NAVBAR": {
      return { ...state, showNavbar: payload }
    }

    case "TOGGLE_SIDENAV_BUTTON": {
      return { ...state, showSideNavButton: payload }
    }

    case "TOGGLE_FOOTER": {
      return { ...state, showFooter: payload }
    }

    case "TOGGLE_LIST_FILTER_OPTIONS": {
      return { ...state, showListFilterOptions: payload }
    }

    case "TOGGLE_BACK_TO_LIST": {
      return { ...state, showBackToList: payload }
    }

    case "TOGGLE_LIST_EXPAND_COLLAPSE": {
      return { ...state, showListExpandCollapse: payload }
    }

    case "TOGGLE_LIST_VIEW": {
      return { ...state, showListViewOption: payload }
    }

    case "TOGGLE_LIST_FAVORITES": {
      return { ...state, showFavoritesOption: payload }
    }

    case "TOGGLE_SHOW_DETAILS_IN_PARENT": {
      return { ...state, showDetailsInParent: payload }
    }

    default: {
      return state
    }
  }
}