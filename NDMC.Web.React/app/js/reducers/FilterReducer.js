'use strict'

import * as ACTION_TYPES from "../constants/action-types"

export default function FilterReducer(state = {}, action) {

    const { type, payload } = action

    switch (type) {
        case ACTION_TYPES.LOAD_TITLE_FILTER: {
            return { ...state, titleFilterInternal: payload, titleFilter: payload }
        }
        case ACTION_TYPES.LOAD_TITLE_FILTER_INTERNAL: {
            return { ...state, titleFilterInternal: payload }
        }
        case ACTION_TYPES.LOAD_REGION_FILTER: {
            return { ...state, regionFilter: payload }
        }
        case ACTION_TYPES.LOAD_HAZARD_FILTER: {
            return { ...state, hazardFilter: payload }
        }
        case ACTION_TYPES.CLEAR_FILTERS: {
            return {
                ...state,
                titleFilter: "",
                regionFilter: 0,
                hazardFilter: 0
            }
        }
        default: {
            return state
        }
    }
}