'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { Row, Col, Button } from 'mdbreact'
import { connect } from 'react-redux'
import popout from '../../../images/popout.png'
import popin from '../../../images/popin.png'
import { MapConfig } from '../../../data/mapConfig'
import loader from '../../../images/loader.gif'
import { vmsBaseURL, mapServerBaseURL } from '../../config/serviceURLs.cfg'
import moment from 'moment';

const mapStateToProps = (state, props) => {
  let { filterData: { regionFilter, hazardFilter, dateFilter, impactFilter, regions } } = state
  return {
    regionFilter, hazardFilter, dateFilter, impactFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScrollPos: payload => {
      dispatch({ type: "SET_PROJECT_SCROLL", payload })
    }
  }
}

/**
 * MapViewCore Class for core map view render options and filters
 * @class
 */
class MapViewCore extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      activeFilters: {
        region: 0,
        hazard: 0,
        impact: 0,
        startDate: 0,
        endDate: 0
      }
    }
  }

  // componentDidMount() {
  //   window.addEventListener("message", this.onMessage.bind(this));
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("message", this.onMessage)
  // }

  componentDidUpdate () {

    let { regionFilter, hazardFilter, dateFilter, impactFilter } = this.props
    let { activeFilters } = this.state

    if (regionFilter !== activeFilters.region || hazardFilter !== activeFilters.hazard ||
      dateFilter.startDate !== activeFilters.startDate || dateFilter.endDate !== activeFilters.endDate ||
      impactFilter !== activeFilters.impact) {
      this.setState({
        activeFilters: {
          region: regionFilter,
          hazard: hazardFilter,
          impact: impactFilter,
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate
        }
      }, () => { this.forceUpdate() })
    }

  }

  // onMessage(event) {

  //   if (event.origin === mapServerBaseURL) {
  //     try {
  //       var message = JSON.parse(event.data)
  //       if (message.cmd == 'featureClick' && !location.hash.includes("projects")) {
  //         let navTo = ""
  //         if (location.hash.includes("map")) {
  //           navTo = location.hash.replace("#/map", "#/projects/" + message.id)
  //         }
  //         else {
  //           navTo = location.hash.replace("#/", "#/projects/" + message.id)
  //         }
  //         location.hash = navTo
  //       }
  //     }
  //     catch (ex) {
  //       console.error(ex)
  //     }
  //   }
  // }

  buildMapConfig () {

    let { regionFilter, hazardFilter, dateFilter, impactFilter, regions } = this.props
    let mapConfig = MapConfig

    //Add filters
    if (parseInt(regionFilter) > 0 || parseInt(hazardFilter) > 0 || parseInt(impactFilter) > 0 ||
      parseInt(dateFilter.startDate) > 0 || parseInt(dateFilter.endDate) > 0) {

      let filters = []

      if (parseInt(regionFilter) > 0) {
        filters.push(
          {
            field: "properties.regions",
            value: parseInt(regionFilter)
          }
        )
      }

      if (parseInt(hazardFilter) > 0) {
        filters.push(
          {
            field: "properties.hazard",
            value: parseInt(hazardFilter)
          }
        )
      }

      if (parseInt(impactFilter) > 0) {
        filters.push(
          {
            field: "properties.impacts",
            value: parseInt(impactFilter)
          }
        )
      }

      if (parseInt(dateFilter.startDate) > 0) {
        filters.push(
          {
            field: "properties.startDate",
            value: moment.unix(dateFilter.startDate).format('YYYY-MM-DD'),
            operator: ">="
          }
        )
      }

      if (parseInt(dateFilter.endDate) > 0) {
        filters.push(
          {
            field: "properties.endDate",
            value: moment.unix(dateFilter.endDate).format('YYYY-MM-DD'),
            operator: "<="
          }
        )
      }

      mapConfig.filters = filters
    }
    else {
      delete mapConfig.filters
    }

    //Set viewport
    // if (parseInt(regionFilter) > 0) {

    //   let regionName = "unknown"
    //   let searchRegions = regions.filter(r => r.RegionId == regionFilter)
    //   if(searchRegions.length > 0){
    //     regionName = searchRegions[0].RegionName
    //   }

    //   mapConfig.viewport = {
    //     service: {
    //       url: `${vmsBaseURL}regions/find/${regionName}`, // <<-- returns array of regions as { items: [...] }
    //       field: "items[0].additionalData[0].simpleWKT",
    //       display: true
    //     }
    //   }
    // }
    // else {
    //   delete mapConfig.viewport
    // }


    return encodeURIComponent(JSON.stringify(mapConfig))
  }

  render () {

    let { height, width, fullView } = this.props
    let mapConfig = this.buildMapConfig()
    let mapSrc = `http://app01.saeon.ac.za/components/map?conf=${ mapConfig }`


    if (!height) {
      height = "300px"
    }

    if (!width) {
      width = "100%"
    }

    return (
      <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px", border: "1px solid gainsboro" }}>

        <h4 style={{ margin: "5px 5px 0px 19px", display: "inline-block" }}>
          <b>Map</b>
        </h4>

        <img
          src={fullView ? popin : popout}
          style={{
            width: "25px",
            float: "right",
            margin: "5px 5px 0px 0px",
            cursor: "pointer"
          }}
          onClick={() => {
            if (!fullView) this.props.setScrollPos(window.pageYOffset)

            let navTo = ""
            if (fullView) {
              navTo = location.hash.replace("#/map", "")
            }
            else {
              navTo = location.hash.replace("#/", "#/map")
            }
            location.hash = navTo
          }}
        />

        <hr />

        <iframe
          style={{
            width,
            height,
            margin: "0px",
            border: "none",
            // backgroundImage: `url(${loader})`,
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "50% 50%"
          }}
          src={mapSrc}
        />

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapViewCore)
