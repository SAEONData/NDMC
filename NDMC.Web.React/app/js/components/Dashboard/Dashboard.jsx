'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Fa } from 'mdbreact'
import RegionFilters from '../Events/Filters/RegionFilters.jsx'
import HazardFilters from '../Events/Filters/HazardFilters.jsx'
import DateFilters from '../Events/Filters/DateFilters.jsx'
import ImpactFilters from '../Events/Filters/ImpactFilters.jsx'
import EventFilters from '../Events/Filters/EventFilters.jsx'
import EventList from '../Events/List/EventList.jsx'
import DashGraph1Preview from "./DashGraph1Preview.jsx"
import DashGraph2Preview from "./DashGraph2Preview.jsx"
import DashGraph3Preview from "./DashGraph3Preview.jsx"
import DashGraph4Preview from "./DashGraph4Preview.jsx"
import MapViewCore from '../Map/MapViewCore.jsx'
import DualTip from '../Shared/DualTip.jsx'
import { UILookup } from '../../config/ui_config.js'

const mapStateToProps = (state, props) => {
  let { eventData: { listScrollPos } } = state
  return { listScrollPos }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEventsFullView: payload => {
      dispatch({ type: "SET_EVENTS_FULLVIEW", payload })
    }
  }
}

/**
 * The Dashboard class for the root level dashboard view
 * @class
 */
class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
    this.state = {
      showBackToTop: false
    }
  }

  componentDidMount() {
    this.props.setEventsFullView(false)
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  /**
   * Handle user page scrolling
   */
  handleScroll() {
    let { showBackToTop } = this.state
    //Toggle BackToTop button
    if (window.pageYOffset > 1450 && showBackToTop === false) {
      this.setState({ showBackToTop: true })
    }
    else if (window.pageYOffset <= 1450 && showBackToTop === true) {
      this.setState({ showBackToTop: false })
    }
  }

  getDashText(small) {
    return (
      <div style={{ color: "grey" }}>
        {
          !small &&
          <table>
            <tbody>
              <tr>
                <td>
                  <div style={{ paddingLeft: 115 }}>Filters</div>
                </td>
                <td>
                  <Fa icon="angle-double-right" style={{ marginLeft: 2 }} />
                </td>
              </tr>
            </tbody>
          </table>
        }

        <table>
          <tbody>
            <tr>
              <td>
                <h2 style={{ letterSpacing: -2 }}>
                  <b>Dashboard</b>
                </h2>
              </td>
              <td>
                <h2>
                  <Fa icon="arrow-circle-down" style={{ marginLeft: 2 }} />
                </h2>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  render() {

    let { showBackToTop } = this.state

    let uiconf_region = UILookup("lblRegionFilter", "Region:")
    let uiconf_hazard = UILookup("lblHazardFilter", "Hazard:")
    let uiconf_date = UILookup("lblDateFilter", "Date Range:")
    let uiconf_impact = UILookup("lblImpactFilter", "Impact:")

    return (
      <>

        <Row className="d-lg-none">
          <Col>
            {this.getDashText(true)}
          </Col>
        </Row>

        <Row style={{ marginBottom: "15px" }}>
          <Col className="d-none d-lg-block" md="2">
            {this.getDashText()}
          </Col>

          <Col md="10">
            <Row>
              <Col md="2">
                {/* <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Region:</b></label> */}
                <DualTip label={uiconf_region.label} primaryTip={uiconf_region.tooltip} secondaryTip={uiconf_region.tooltip2} required={uiconf_region.required} />
                <RegionFilters />
              </Col>
              <Col md="2">
                {/* <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Hazard:</b></label> */}
                <DualTip label={uiconf_hazard.label} primaryTip={uiconf_hazard.tooltip} secondaryTip={uiconf_hazard.tooltip2} required={uiconf_hazard.required} />
                <HazardFilters />
              </Col>
              <Col md="4">
                {/* <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Date Range:</b></label> */}
                <DualTip label={uiconf_date.label} primaryTip={uiconf_date.tooltip} secondaryTip={uiconf_date.tooltip2} required={uiconf_date.required} />
                <DateFilters />
              </Col>
              <Col md="2">
                {/* <label style={{ color: "grey", fontSize: "14px", marginLeft: "1px" }}><b>Impact:</b></label> */}
                <DualTip label={uiconf_impact.label} primaryTip={uiconf_impact.tooltip} secondaryTip={uiconf_impact.tooltip2} required={uiconf_impact.required} />
                <ImpactFilters />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col md={showBackToTop ? "12" : "7"}>
            <EventList />
          </Col>

          <Col md="5" style={{ position: (showBackToTop ? "absolute" : "relative"), top: (showBackToTop ? 285 : 0), right: 0 }}>
            <Row>
              <Col md="12">
                <EventFilters />
              </Col>
            </Row>

            <br />

            <Row>
              {/* map */}
              <Col md="12">
                <MapViewCore />
              </Col>
            </Row>
            <br />
            <Row>
              {/* graphs */}
              <Col md="12">
                <Row>
                  <Col md="6">
                    <DashGraph1Preview />
                  </Col>
                  <Col md="6">
                    <DashGraph2Preview />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md="6">
                    <DashGraph3Preview />
                  </Col>
                  <Col md="6">
                    <DashGraph4Preview />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

        </Row>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
