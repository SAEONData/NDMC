'use strict'

import React from 'react'
import { Button, Input, FormInline } from 'mdbreact'
import { apiBaseURL } from '../../../constants/apiBaseURL'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../constants/action-types'
import ReactTooltip from 'react-tooltip'
import { UILookup } from '../../../constants/ui_config'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'


const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  let { filterData: { dateFilter } } = state
  return { dateFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadDate: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_DATE_FILTER, payload })
    }
  }
}

class DateFilters extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    //Load data
    let { loadStartDate, loadEndDate } = this.props
  }

  onChange() {

  }

  onTouchTap() {

  }

  render() {
    let { dateFilter } = this.props

    return (
      <FormInline>
        <div className="md-form form-sm row">
          <div className="col-md-5">
            <Input className="form-control" label="Start Date"/>
          </div>
          <div className="col-md-5">
            <Input className="form-control" label="End Date"/>
          </div>
          <div className="col-md-2" style={{ alignItems: "left" }}>
            <Button
              color="primary"
              size="md"
              style={{ height: "35px", float: "left" }}
              onTouchTap={() => {}} >
              Apply
             </Button>
          </div>
        </div>
      </FormInline>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateFilters)

