'use strict'

import React from 'react'
import { Row, Col, Button, Fa } from 'mdbreact'
import RegionFilters from '../Events/Filters/RegionFilters.jsx'
import HazardFilters from '../Events/Filters/HazardFilters.jsx'
import DateFilters from '../Events/Filters/DateFilters.jsx'
import ImpactFilters from '../Events/Filters/ImpactFilters.jsx'
import EventFilters from '../Events/Filters/EventFilters.jsx'
import EventList from '../Events/List/EventList.jsx'
import DashMapPreview from "./DashMapPreview.jsx"

class Dashboard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showBackToTop: false
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
                <label><b>Region:</b></label>
                <RegionFilters />
              </Col>

              <Col md="2">
                <label><b>Hazard:</b></label>
                <HazardFilters />
              </Col>

              <Col md="4">
                <label><b>Date Range:</b></label>
                <DateFilters />
              </Col>

              <Col md="2">
                <label><b>Impact:</b></label>
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
                      <div style={{
                        height: "180px",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        border: "1px solid gainsboro",
                      }} />
                    </Col>

                    <Col md="6">
                      <div style={{
                        height: "180px",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        border: "1px solid gainsboro",
                      }} />
                    </Col>

                  </Row>

                  <br />

                  <Row>

                    <Col md="6">
                      <div style={{
                        height: "180px",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        border: "1px solid gainsboro",
                      }} />
                    </Col>

                    <Col md="6">
                      <div style={{
                        height: "180px",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        border: "1px solid gainsboro",
                      }} />
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

export default Dashboard