'use strict'

import * as ACTION_TYPES from '../constants/action-types'

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

    default: {
      return state
    }
  }
}