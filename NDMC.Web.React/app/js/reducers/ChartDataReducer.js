'use strict'

export default function GlobalReducer(state = {}, action) {

    const { type, payload } = action

    switch (type) {

        case "SET_CHART_1": {
            return { ...state, chart1: payload }
        }
        
        case "SET_CHART_2": {
            return { ...state, chart2: payload }
        }
        
        case "SET_CHART_3": {
            return { ...state, chart3: payload }
        }
        
        case "SET_CHART_4": {
            return { ...state, chart4: payload }
        }

        default: {
            return state
        }

    }
}