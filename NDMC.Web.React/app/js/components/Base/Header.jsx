import React from 'react'
import { Col, Row } from 'mdbreact';

//Images
import environmental_affairs_logo from '../../../images/environmental_affairs_logo.png'
import sa_flag from '../../../images/sa_flag.jpg'

class Header extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {

    return (
      <div style={{ backgroundColor: "white" }}>
        <Row className="align-items-center" style={{ /*marginBottom: "15px",*/ height: 100 }}>
          <Col md="2" className="d-none d-md-block">
            <img
              onClick={() => window.open("http://www.environment.gov.za/")}
              src={environmental_affairs_logo}
              style={{
                height: 80,
                marginLeft: 5,
                cursor: "pointer"
              }}
              align="left"
            />
          </Col>
          <Col md="1"/>
          <Col md="6">
            <div>
              <h1 style={{ textAlign: "center", letterSpacing: "2px", color: "#2e7d32" }}>
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
            </div>
          </Col>
          <Col md="1"/>
          <Col md="2" className="d-none d-md-block">
            <img
              src={sa_flag}
              style={{
                height: 80,
                marginRight: 5
              }}
              align="right"
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Header