'use strict'

export default function NavigationReducer(state = {}, action) {

  let { type, payload } = action

  switch (type) {

    case 'NAV': {
      return {
        ...state, locationHash: payload
      }
    }

    default: {
      return state
    }

  }
}
