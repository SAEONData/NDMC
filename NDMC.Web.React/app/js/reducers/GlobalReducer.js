'use strict'

import * as ACTION_TYPES from '../constants/action-types'

export default function GlobalReducer(state = {}, action) {

  const { type, payload } = action

  switch (type) {

    case "TOGGLE_ADD_FORM": {
      return { ...state, addFormVisible: payload }
    }

    default: {
      return state
    }
  }
}