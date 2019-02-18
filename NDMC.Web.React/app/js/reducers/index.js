'use strict'

import GlobalReducer from './GlobalReducer'
import EventsReducer from './EventsReducer'
import FilterReducer from './FilterReducer'
import ChartDataReducer from './ChartDataReducer'
import NavigationReducer from './NavigationReducer'

export default {
  globalData: GlobalReducer,
  eventData: EventsReducer,
  filterData: FilterReducer,
  chartData: ChartDataReducer,
  navigation: NavigationReducer
}