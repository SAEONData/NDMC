'use strict'

import GlobalReducer from './GlobalReducer'
import EventsReducer from './EventsReducer'
import FilterReducer from './FilterReducer'
import LookupsReducer from './LookupsReducer'

export default {
    globalData: GlobalReducer,
    eventData: EventsReducer,
    filterData: FilterReducer,
    lookupData: LookupsReducer
}