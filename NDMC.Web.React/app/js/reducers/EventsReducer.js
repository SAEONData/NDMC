'use strict'

import * as ACTION_TYPES from '../config/action-types'


export default function EventsReducer(state = {}, action) {
  let { type, payload } = action
  
  switch (type) {

    case "RESET_EVENTS": {
      return {
        ...state, events: []
      }
    }

    case 'LOAD_EVENTS': {
      return {
        ...state, events: payload
      }
    }

    case "SET_EVENTS_SCROLL": {
      return { ...state, listScrollPos: payload }
    }

    default: {
      return state
    }
  }
}
