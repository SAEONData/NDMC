'use strict'

import React from 'react'
import { Button } from 'mdbreact'
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
      <div className="col-md-4">
        <div className="md-form form-sm">
          <Button
            color="primary"
            size="sm"
            style={{ height: "35px", marginLeft: "3px", marginTop: "2px", float: "right" }}
            onTouchTap={this.onTouchTap.bind(this, dateFilter)} >
            Apply
           </Button>
          <div style={{ overflow: "hidden", paddingRight: "5px" }}>
            <input type="text" style={{ marginTop: "-4px", fontSize: "14px", fontWeight: "300", width: "100%" }}
              value="test" onChange={this.onChange.bind(this)} />
          </div>
          </div>
        </div>
        )
      }
    }
export default connect(mapStateToProps, mapDispatchToProps)(DateFilters)