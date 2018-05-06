'use strict'

import * as ACTION_TYPES from "../constants/action-types"

const _ = require('lodash')

function extractItemAndId(array, key, value) {
    //Get item and Id
    let item = array.find(x => x[key] === value)
    let id = _.findIndex(array, (x) => x[key] === value)
    return { item, id }
}

export default function EventsReducer(state = {}, action) {
    let { type, payload } = action
    let id = 0
    let modState = "original"

    //Check if additional data embedded in payload
    if (typeof payload !== 'undefined') {
        if (typeof payload.id !== 'undefined') {
            id = parseInt(payload.id)
        }
        if (typeof payload.state !== 'undefined') {
            modState = payload.state
        }
        if (typeof payload.value !== 'undefined') {
            payload = payload.value
        }
    }

    switch (type) {
        case ACTION_TYPES.RESET_EVENT_STATE: {
            return {
                ...state, projectDetails: { ...payload, state: "original" }
            }
        }
        case ACTION_TYPES.LOAD_EVENTS: {
            let { projects, end } = state

            if(end === 10){
                return { ...state, projects: payload }
            }
            else{
                return { ...state, projects: [...projects, ...payload] }
            }
        }
        case ACTION_TYPES.LOAD_MORE_EVENTS: {
            const { start, end  } = state
            let newend = end + 10
            let newstart = start
            return { ...state, start: newstart, end: newend }
        }
        case ACTION_TYPES.RESET_EVENT_COUNTS:{
            return { ...state, start: 0, end: 10 }
        }
        case ACTION_TYPES.SET_EVENT_SCROLL:{
            return { ...state, listScrollPos: payload }
        }
        default: {
            return state
        }
    }
}
