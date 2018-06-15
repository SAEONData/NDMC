'use strict'

//React
import React from 'react'
import { Button, Collapse } from 'mdbreact'
import { connect } from 'react-redux'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'
import RegionFilters from './RegionFilters.jsx'
import HazardFilters from './HazardFilters.jsx'
import DateFilters from './DateFilters.jsx'
import ImpactFilters from './ImpactFilters.jsx'

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, dateFilter, impactFilter } } = state
  return { regionFilter, hazardFilter, dateFilter, impactFilter}
}

const mapDispatchToProps = dispatch => {
  return {
    clearFilters: payload => {
      dispatch({ type: ACTION_TYPES.CLEAR_FILTERS, payload })
    },
    clearRegionFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_REGION_FILTER, payload: 0 })
    },
    clearHazardFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload: 0 })
    },
    clearDateFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_DATE_FILTER, payload: 0 })
    },
  }
}

class EventFilters extends React.Component {
  constructor(props) {
    super(props)
    this.toggleRegion = this.toggleRegion.bind(this)
    this.toggleHazard = this.toggleHazard.bind(this)
    this.toggleDate = this.toggleDate.bind(this)
    this.toggleImpact = this.toggleImpact.bind(this)
    this.clearFilters = this.clearFilters.bind(this)

    this.state = {
      collapseRegion: false,
      collapseHazzard: false,
      collapseDate: false,
      collapseImpact: false
    }
  }

  toggleRegion() {
    this.setState({ collapseRegion: !this.state.collapseRegion })
  }

  toggleHazard() {
    this.setState({ collapseHazard: !this.state.collapseHazard })
  }

  toggleDate() {
    this.setState({ collapseDate: !this.state.collapseDate })
  }

  toggleImpact() {
    this.setState({ collapseImpact: !this.state.collapseImpact })
  }

  getBottonColor(state) {
    if (state === true) {
      return 'warning'
    } else {
      return 'primary'
    }
  }

  clearFilters() {
    let { clearFilters } = this.props
    clearFilters('')
    location.hash = '/events'
  }

  render() {
    return (
      <>
        <hr />
        <div className='row'>
          <div className='col-md-2'>
            <Button block color={this.getBottonColor(this.state.collapseRegion)} className='btn-sm' onTouchTap={this.toggleRegion}>
              Region filters
            </Button>
          </div>
          <div className='col-md-2'>
            <Button block color={this.getBottonColor(this.state.collapseHazard)} className='btn-sm' onTouchTap={this.toggleHazard}>
              Hazard filters
            </Button>
          </div>
          <div className='col-md-2'>
            <Button block color={this.getBottonColor(this.state.collapseDate)} className='btn-sm' onTouchTap={this.toggleDate}>
              Date filters
            </Button>
          </div>
          <div className='col-md-2'>
            <Button block color={this.getBottonColor(this.state.collapseImpact)} className='btn-sm' onTouchTap={this.toggleImpact}>
              Impact filters
            </Button>
          </div>
          <div className='col-md-3'>
            <Button block color='secondary' className='btn-sm' onTouchTap={this.clearFilters}>
              <i className='fa fa-eraser' aria-hidden='true' />&nbsp;&nbsp;Clear filters
            </Button>
          </div>
        </div>
        <hr />
        <Collapse isOpen={this.state.collapseRegion}>
          <RegionFilters />
          <hr />
        </Collapse>
        <Collapse isOpen={this.state.collapseHazard}>
          <HazardFilters />
          <hr />
        </Collapse>
        <Collapse isOpen={this.state.collapseDate}>
          <DateFilters />
          <hr />
        </Collapse>
        <Collapse isOpen={this.state.collapseImpact}>
          <ImpactFilters />
          <hr />
        </Collapse>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventFilters)
