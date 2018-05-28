'use strict'

import * as ACTION_TYPES from '../constants/action-types'

export default function LookupsReducer(state = {}, action) {

  const { type, payload } = action

  switch (type) {
    case ACTION_TYPES.LOAD_REGION: {
      return { ...state, region: payload }
    }
    case ACTION_TYPES.LOAD_REGION_TREE: {
      return { ...state, regionTree: payload }
    }
    case ACTION_TYPES.LOAD_HAZARD_TYPE: {
      return { ...state, hazard: payload }
    }
    case ACTION_TYPES.LOAD_HAZARD_TREE: {
      return { ...state, hazardTree: payload }
    }
    case ACTION_TYPES.LOAD_IMPACT: {
      return { ...state, impact: payload }
    }
    case ACTION_TYPES.LOAD_IMPACTS: {
      return { ...state, impacts: payload }
    }
    default: {
      return state
    }
  }
}