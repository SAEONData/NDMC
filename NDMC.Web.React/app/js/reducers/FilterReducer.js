'use strict'

import * as ACTION_TYPES from '../constants/action-types'

export default function FilterReducer(state = {}, action) {

  const { type, payload } = action

  switch (type) {
    case ACTION_TYPES.LOAD_REGION_FILTER: {
      return { ...state, regionFilter: payload }
    }
    case ACTION_TYPES.LOAD_HAZARD_FILTER: {
      return { ...state, hazardFilter: payload }
    }
    case ACTION_TYPES.LOAD_IMPACT_FILTER: {
      return { ...state, impactTypeFilter: payload }
    }
    case ACTION_TYPES.LOAD_STARTDATE_FILTER: {
      return { ...state, startDateFilter: payload }
    }
    case ACTION_TYPES.LOAD_ENDDATE_FILTER: {
      return { ...state, endDateFilter: payload }
    }
    case ACTION_TYPES.CLEAR_FILTERS: {
      return {
        ...state,
        regionFilter: 0,
        hazardFilter: 0,
        impactTypeFilter: 0,
        startDateFilter: 0,
        endDateFilter: 0,
      }
    }
    default: {
      return state
    }
  }
}