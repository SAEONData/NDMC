'use strict'

import React from 'react'
import EventFilters from '../Filters/EventFilters.jsx'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { Button, Footer, Container } from 'mdbreact'
import * as ACTION_TYPES from "../../../constants/action-types"

const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  let { globalData: { loading } } = state
  return { loading }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLoading: payload => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload })
    }
  }
}

class EventGraph extends React.Component {
  render() {
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div
              hidden={!this.props.loading}
              className="card"
              style={{ position: "fixed", right: "40%", bottom: "42%", zIndex: "99" }}>
            </div>
          </div>
        </div>
        <div style={{ position: "fixed", right: "14%", bottom: "10px", zIndex: "99" }}>
        </div>
        <EventFilters />
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventGraph)