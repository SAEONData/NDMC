'use strict'

//React
import React from 'react'
import { Button, Collapse, Chip, Fa } from 'mdbreact'
import { connect } from 'react-redux'
import { DEAGreen, DEAGreenDark } from '../../../config/colours.cfg'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'

const moment = require('moment');

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, dateFilter, impactFilter, favoritesFilter } } = state
  return { regionFilter, hazardFilter, dateFilter, impactFilter, favoritesFilter }
}

const mapDispatchToProps = dispatch => {
  return {
    clearFilters: payload => {
      dispatch({ type: ACTION_TYPES.CLEAR_FILTERS, payload })
    },
    clearImpactFilter: () => {
      dispatch({ type: ACTION_TYPES.LOAD_IMPACT_FILTER, payload: 0 })
    },
    clearRegionFilter: () => {
      dispatch({ type: ACTION_TYPES.LOAD_REGION_FILTER, payload: 0 })
    },
    clearHazardFilter: () => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload: 0 })
    },
    clearDateFilter: () => {
      dispatch({ type: ACTION_TYPES.LOAD_DATE_FILTER, payload: 0 })
    },
    clearFavsFilter: () => {
      dispatch({ type: "LOAD_FAVS_FILTER", payload: 0 })
    }
  }
}

class EventFilters extends React.Component {
  constructor(props) {
    super(props)

    this.clearFilters = this.clearFilters.bind(this)
    this.handleTags = this.handleTags.bind(this)
  }

  clearFilters() {
    let { clearFilters } = this.props
    clearFilters('')
  }

  handleTags() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter, favoritesFilter } = this.props
    let taglist = []

    if (hazardFilter.name || regionFilter.name || impactFilter.name || dateFilter.startDate || dateFilter.endDate ||
        favoritesFilter === true) {

      if (hazardFilter.name) {
        taglist.push(
          <Chip
            key="fcHazard"
            waves
            close
            handleClose={() => {
              this.props.clearHazardFilter()
            }}>
            {hazardFilter.name}
          </Chip>
        )
      }

      if (regionFilter.name) {
        taglist.push(
          <Chip
            key="fcRegion"
            waves
            close
            handleClose={() => {
              this.props.clearRegionFilter()
            }}>
            {regionFilter.name}
          </Chip>
        )
      }

      if (impactFilter.name) {
        taglist.push(
          <Chip
            key="fcImpact"
            waves
            close
            handleClose={() => {
              this.props.clearImpactFilter()
            }}>
            {impactFilter.name}
          </Chip>
        )
      }

      if (dateFilter.startDate) {
        
        let startdate = moment.unix(dateFilter.startDate).format("YYYY/MM/DD")
        let endDate = moment.unix(dateFilter.endDate).format("YYYY/MM/DD")

        taglist.push(
          <Chip
            key="fcDates"
            waves
            close
            handleClose={() => {
              this.props.clearDateFilter()
            }}>
            {`${startdate} - ${endDate}`}
          </Chip>
        )
      }

      if (favoritesFilter === true){
        taglist.push(
          <Chip
            key="fcFavs"
            waves
            close
            handleClose={() => {
              this.props.clearFavsFilter()
            }}>
            Favorites
          </Chip>
        )
      }
    }
    else {
      taglist.push(<p key="naf">No Filters Appied.</p>)
    }

    return taglist
  }

  render() {
    return (
      <>

        <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px", border: "1px solid gainsboro" }}>

          <h4 style={{ margin: "5px 5px 0px 19px", display: "inline-block" }}>
            <b>Current Filters</b>
          </h4>
          <Button
            size="sm"
            color="white"
            style={{
              border: "0px solid gainsboro",
              boxShadow: "none",
              borderRadius: "7px",
              float: "right",
              marginTop: "8px",
              marginRight: "15px",
              padding: "2px",
            }}
            onClick={this.clearFilters}
          >
            <Fa icon="trash-o" size="2x" style={{ color: DEAGreen }} />
          </Button>

          <hr />

          <div style={{ padding: "10px 20px 10px 20px" }}>
            {this.handleTags()}
          </div>

        </div >
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventFilters)
