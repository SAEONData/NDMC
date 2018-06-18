'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'

//MDBReact
import { DatePicker } from 'material-ui'
import { Button, Input, FormInline } from 'mdbreact'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const queryString = require('query-string')

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

class DateFilters extends React.Component {
  constructor(props) {
    super(props)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.applyClick = this.applyClick.bind(this)
    this.state = {
      startDate: 0,
      endDate: 0
    }
  }

  componentDidMount() {
    let { loadStartDate, loadEndDate } = this.props
  }

  handleStartChange(event, date) {
    let unixDate = new Date(date).getTime() / 1000
    this.setState({ startDate: unixDate })
  }

  handleEndChange(event, date) {
    let unixDate = new Date(date).getTime() / 1000
    this.setState({ endDate: unixDate })
  }

  applyClick() {
    let { loadDateFilter } = this.props
    if (this.state.startDate !== 0 && this.state.endDate !== 0 && this.state.startDate < this.state.endDate) {
      loadDateFilter({ startDate: this.state.startDate, endDate: this.state.endDate })
    }
    else {
      console.log('incorrect date selection: start date' + this.state.startDate + 'end date' + this.state.endDate)
    }
  }

  render() {
    let { dateFilter } = this.props

    return (
      <div className="row">
        <div className='col-md-3'>
          <MuiThemeProvider>
            <DatePicker
              hintText="Select Start Date"
              container="inline"
              mode="landscape"
              onChange={this.handleStartChange}
            />
          </MuiThemeProvider>
        </div>
        <div className='col-md-3'>
          <MuiThemeProvider>
            <DatePicker
              hintText="Select End Date"
              container="inline"
              mode="landscape"
              onChange={this.handleEndChange}
            />
          </MuiThemeProvider>
        </div>
        <div className="col-md-2" style={{ alignItems: "left" }}>
          <Button
            color="primary"
            size="md"
            style={{ height: "35px", float: "left" }}
            onTouchTap={this.applyClick} >
            Apply
             </Button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateFilters)

