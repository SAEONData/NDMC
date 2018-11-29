import React from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'mdbreact';
import { DEAGreen, DEAGreenDark } from '../../config/colours.cfg'

import { footerContent } from '../../../data/footerConfig'
import loader from '../../../images/loader.gif'

class Footer extends React.Component {

  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this)
    this.renderLinks = this.renderLinks.bind(this)
    this.handleResize = this.handleResize.bind(this)

    this.state = {
      showModal: false,
      modalHeader: "",
      modalSrc: "",
      isNarrowDisplay: false
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize() {
    this.setState({
      isNarrowDisplay: (window.innerWidth < 900)
    })
  }

  toggleModal(state, header = "", src = "") {
    this.setState({
      showModal: state,
      modalHeader: header,
      modalSrc: src
    })
  }

  renderSections(data) {

    let sections = []

    for (let i = 0; i < 4; i++) {
      let section = data.sections[i]
      sections.push(
        <Col key={`section_${i + 1}`} md="3">
          <h4 style={{ marginBottom: "15px" }}><b>{section.text}</b></h4>
          {this.renderLinks(section)}
        </Col>
      )
    }

    return sections
  }


  renderLinks(section) {

    let links = []

    for (let i = 0; i < section.links.length; i++) {

      let link = section.links[i]
      if (link.text) {
        links.push(
          <div
            key={`link_${i + 1}`}
            style={{
              cursor: link.link ? "pointer" : "default",
              fontWeight: link.link ? "400" : "regular"
            }}
            onClick={() => {
              if (link.link) {
                this.toggleModal(true, link.text, link.link)
              }
            }}>
            {link.text}
          </div>
        )
      }
      else if (link.src) {
        links.push(
          <img
            key={`link_${i + 1}`}
            src={link.src}
            style={{
              width: link.width,
              cursor: link.link ? "pointer" : "default"
            }} />
        )
      }
    }

    return links
  }

  render() {

    let { showModal, modalHeader, modalSrc, isNarrowDisplay } = this.state

    return (
      <>
        <div style={{
          padding: "5px 45px 5px 45px",
          borderTop: "1px solid gainsboro",
          borderLeft: "1px solid gainsboro",
          borderRight: "1px solid gainsboro",
          backgroundColor: "white",
          color: "black"
        }}>
          <br />
          <Row>
            {this.renderSections(footerContent)}
          </Row>
          <br />
        </div>

        <div style={{
          padding: "10px 45px 10px 45px",
          backgroundColor: DEAGreen,
          color: "white"
        }}>
          <Row>
            <Col md="12">
              <b>
                Created by
                <span> <a style={{ color: "white" }} href="http://www.saeon.ac.za" target="saeon"><strong>SAEON</strong></a> </span>
                using
                <span> <a style={{ color: "white" }} href="https://reactjs.org/" target="react"><strong>React</strong></a>, </span>
                <span> <a style={{ color: "white" }} href="https://mdbootstrap.com/react" target="mdb"><strong> MDBootstrap</strong></a>, </span>
                <span> <a style={{ color: "white" }} href="https://ant.design/" target="antdesign"><strong> Ant Design </strong></a> </span>
                and SAEON Open Data Platform APIs.
              </b>
              <br />
              Copyright &copy; {(new Date().getFullYear())}
            </Col>
          </Row>
        </div>

        <Modal isOpen={showModal} toggle={() => this.toggleModal(false)} size="fluid" style={{ width: "95%" }} >
          <ModalHeader toggle={() => this.toggleModal(false)}>{modalHeader}</ModalHeader>
          <ModalBody>
            <iframe
              style={{
                width: "100%",
                height: "500px",
                margin: "0px",
                border: "1px solid gainsboro",
                backgroundImage: `url(${loader})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50% 50%"
              }}
              src={modalSrc}
            />
          </ModalBody>
        </Modal>
      </>
    )
  }
}

export default Footer