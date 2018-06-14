'use strict'

import GlobalReducer from './GlobalReducer'
import EventsReducer from './EventsReducer'
import FilterReducer from './FilterReducer'

export default {
  globalData: GlobalReducer,
  eventData: EventsReducer,
  filterData: FilterReducer,
}