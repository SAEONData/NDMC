'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'mdbreact'
import EventList from './EventList.jsx'
import EventFilters from '../Filters/EventFilters.jsx'
import RegionFilters from '../../Events/Filters/RegionFilters.jsx'
import HazardFilters from '../../Events/Filters/HazardFilters.jsx'
import DateFilters from '../../Events/Filters/DateFilters.jsx'
import ImpactFilters from '../../Events/Filters/ImpactFilters.jsx'

const mapStateToProps = (state, props) => {
  let { globalData: { showListFilterOptions } } = state
  return { showListFilterOptions }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEventsFullView: payload => {
      dispatch({ type: "SET_EVENTS_FULLVIEW", payload })
    }
  }
}

/**
 * Events class for rendering filters
 * @class
 */
class Events extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.setEventsFullView(true)
  }

  render () {
    return (
      <>
        {
          this.props.showListFilterOptions === true &&
          <div>
            <Row>
              {/* FILTERS */}
              <Col md="12">
                <Row>
                  <Col md="3">
                    <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Region:</b></label>
                    <RegionFilters />
                  </Col>
                  <Col md="2">
                    <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Hazard:</b></label>
                    <HazardFilters />
                  </Col>
                  <Col md="4">
                    <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Date Range:</b></label>
                    <DateFilters />
                  </Col>
                  <Col md="2">
                    <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Impact:</b></label>
                    <ImpactFilters />
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />
            <EventFilters />
            <br />
          </div>
        }
        <EventList />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events)
