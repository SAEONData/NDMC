'use strict'

// MDBReact
import React from 'react'
import { Col, Row, Container } from 'mdbreact'

// Images
import environmental_affairs_logo from '../../../images/environmental_affairs_logo.png'
import sa_flag from '../../../images/sa_flag.jpg'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <>
        <Row className="align-items-center" style={{ marginBottom: "15px" }}>
          <Col md="3" className="d-none d-md-block">
            <img
              onClick={() => window.open("http://www.environment.gov.za/")}
              src={environmental_affairs_logo}
              style={{ width: "100%", marginTop: "2%", marginLeft: "0px", cursor: "pointer" }}
              align="left"
            />
          </Col>
          <Col md="6">
            <h1 style={{ textAlign: "center", marginTop: "4%", letterSpacing: "2px", color: "#2e7d32" }}>
              <b>NHE</b>

              {/* BETA tag */}
              <sub style={{ fontSize: "18px", backgroundColor: "#78e26c", borderRadius: "5px", padding: "2px" }}>
                <i>BETA</i>
              </sub>

            </h1>
            <p></p>
            <h5 style={{ textAlign: "center", letterSpacing: "2px", marginTop: "-8px", color: "grey" }}>
              <b>National Hazardous Events Database</b>
            </h5>
          </Col>
          <Col md="3" className="d-none d-md-block">
            <img src={sa_flag} style={{ width: "40%", marginTop: "4%", marginRight: "5px" }} align="right" />
          </Col>
        </Row>
      </>
    )
  }
}
export default Header