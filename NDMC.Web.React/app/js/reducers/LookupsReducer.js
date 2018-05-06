'use strict'

import * as ACTION_TYPES from "../constants/action-types"

export default function LookupsReducer(state = {}, action) {

    const { type, payload } = action

    switch (type) {
        case ACTION_TYPES.LOAD_REGION: {
            return { ...state, region: payload }
        }
        default: {
            return state
        }
    }
}