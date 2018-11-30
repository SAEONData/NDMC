'use strict'

import * as ACTION_TYPES from '../constants/action-types'

export default function FilterReducer(state = {}, action) {

  const { type, payload } = action

  switch (type) {

    case 'LOAD_REGIONS': {
      return { ...state, regions: payload }
    }

    case 'LOAD_HAZARDS': {
      return { ...state, hazards: payload }
    }

    case 'LOAD_IMPACTS': {
      return { ...state, impacts: payload }
    }

    case ACTION_TYPES.LOAD_REGION_FILTER: {
      return { ...state, regionFilter: payload }
    }

    case ACTION_TYPES.LOAD_HAZARD_FILTER: {
      return { ...state, hazardFilter: payload }
    }

    case ACTION_TYPES.LOAD_IMPACT_FILTER: {
      return { ...state, impactFilter: payload }
    }

    case ACTION_TYPES.LOAD_DATE_FILTER: {
      return { ...state, dateFilter: payload }
    }

    case "LOAD_FAVS_FILTER": {
      return { ...state, favoritesFilter: payload }
    }

    case ACTION_TYPES.CLEAR_FILTERS: {
      return {
        ...state,
        regionFilter: 0,
        hazardFilter: 0,
        impactFilter: 0,
        dateFilter: { startDate: 0, endDate: 0 },
        favoritesFilter: false
      }
    }

    default: {
      return state
    }
  }
}