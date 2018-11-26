'use strict'

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Fa } from 'mdbreact'
import RegionFilters from '../Events/Filters/RegionFilters.jsx'
import HazardFilters from '../Events/Filters/HazardFilters.jsx'
import DateFilters from '../Events/Filters/DateFilters.jsx'
import ImpactFilters from '../Events/Filters/ImpactFilters.jsx'
import EventFilters from '../Events/Filters/EventFilters.jsx'
import EventList from '../Events/List/EventList.jsx'
import DashMapPreview from "./DashMapPreview.jsx"
import DashGraph1Preview from "./DashGraph1Preview.jsx"
import DashGraph2Preview from "./DashGraph2Preview.jsx"
import DashGraph3Preview from "./DashGraph3Preview.jsx"
import DashGraph4Preview from "./DashGraph4Preview.jsx"


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

  render() {

    let { showBackToTop } = this.state

    return (
      <div style={{ padding: "15px 0px 15px 0px" }}>

        <Row style={{ marginTop: "15px", marginBottom: "15px", marginLeft: "-10px" }}>
          <Col md="2">
            <div style={{ marginTop: "2px" }}>
              <b style={{ color: "grey", fontSize: "14px" }}>
                DASHBOARD
            </b>
              <h3 style={{ marginLeft: "-2px", marginTop: "6px" }}>
                <b>Get Started</b>
              </h3>
            </div>
          </Col>

          {/* FILTERS */}
          <Col md="10">
            <Row>
              <Col md="2">
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

        <Row>

          <Col md={showBackToTop ? "12" : "7"}>
            <EventList />
          </Col>

          {
            !showBackToTop &&
            <Col md="5">

              <Row>
                <Col md="12">
                  <EventFilters />
                </Col>
              </Row>

              <br />

              <Row>
                {/* map */}
                <Col md="12">
                  <DashMapPreview />
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
          }


        </Row>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)