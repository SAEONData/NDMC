'use strict'

import * as ACTION_TYPES from '../constants/action-types'

export default function GlobalReducer(state = {}, action) {

  const { type, payload } = action

  switch (type) {
    default: {
      return state
    }
  }
}