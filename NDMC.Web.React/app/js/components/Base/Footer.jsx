'use strict'

// MDBReact
import React from 'react'
import { Col, Row, Container, Footer as MDBFooter, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

// Images
import nrf_seaon from '../../../images/nrf_saeon.png'

class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.toggleModal = this.toggleModal.bind(this)
    this.state = { showModal: false }
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal })
  }

  render() {
    return (
      <>
        <MDBFooter color="light" style={{ color: "black" }}>
          <hr />
          <Container>
            <Row className="align-items-center" style={{ marginBottom: "10px", marginTop: "10px" }}>
              <Col sm="9">
                <p>
                  <b>Created by SAEON using React, MDBootstrap, GraphQL and AntDesign</b>
                  <br />
                  &copy; {(new Date().getFullYear())} Copyright:
                  <a href="http://www.saeon.ac.za" style={{ color: "black" }}>
                    <b> <u>SAEON.ac.za</u> </b>
                  </a>
                </p>
              </Col>
              <Col md="3" className="d-none d-md-block">
                <img onClick={() => window.open("http://www.nrf.ac.za/")}src={nrf_seaon} style={{ width: "80%", marginTop: "-8px", cursor: "pointer" }} align="right" />
              </Col>
            </Row>
          </Container>
        </MDBFooter>
      </>
    )
  }
}
export default Footer