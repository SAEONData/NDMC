'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../config/action-types'
import DatePicker from 'antd/lib/date-picker'
const { RangePicker } = DatePicker
import moment from 'moment'
import '../../../../css/antd.date-picker.css'
import '../../../../css/antd.time-picker.css'
import '../../../../css/antd.input.css'

const mapStateToProps = (state, props) => {
  let { filterData: { dateFilter } } = state
  return { dateFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadDateFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_DATE_FILTER, payload })
    }
  }
}

/**
 * DateFilters Class for dealing with date filter selection and rendering
 * @class
 */
class DateFilters extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      startDate: 0,
      endDate: 0
    }
  }

  componentDidMount() {
    this.Init()
  }

  componentDidUpdate(){
    this.Init()
  }

  Init(){
    let { dateFilter } = this.props

    if(dateFilter === 0) dateFilter = { startDate: 0, endDate: 0 }

    if(dateFilter.startDate !== this.state.startDate || dateFilter.endDate !== this.state.endDate){
      this.setState({ startDate: dateFilter.startDate, endDate: dateFilter.endDate})
    }
  }

  /**
   * Handle selecting/changing the date filter for events
   * @param {Array} dates Array of dates for date range filter selection
   */
  onChange (dates) {

    let { loadDateFilter } = this.props
    let unixStartDate = moment(new Date(dates[0])).unix()
    let unixEndDate = moment(new Date(dates[1])).unix()

    //Set local state
    this.setState({ startDate: unixStartDate, endDate: unixEndDate }, () => {

      //Dispatch to store
      if (this.state.startDate !== null && this.state.endDate !== null && this.state.startDate < this.state.endDate) {
        loadDateFilter({ startDate: unixStartDate, endDate: unixEndDate })
      }
      else {
        console.log('incorrect date selection: start date' + this.state.startDate + 'end date' + this.state.endDate)
      }
    })

  }

  render () {
    let { startDate, endDate } = this.state

    //Parse StartDate
    if (startDate === 0) {
      startDate = null
    }
    else {
      startDate = moment.unix(startDate)
    }

    //Parse EndDate
    if (endDate === 0) {
      endDate = null
    }
    else {
      endDate = moment.unix(endDate)
    }

    return (
      <>
        <RangePicker
          value={[startDate, endDate]}
          style={{ width: "100%" }}
          onChange={this.onChange}
          allowClear={false}
        />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateFilters)

