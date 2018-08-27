'use strict'

import React from 'react'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { Button, Input } from 'mdbreact'
import * as ACTION_TYPES from "../../constants/action-types"
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact'

const mapStateToProps = (state, props) => {
  let { globalData: { } } = state
  return {}
}

class CustomNavbar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      collapse: false,
      isWideEnough: false,
      dropdownOpen: false
    }

    this.onClick = this.onClick.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    })
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render() {

    return (
      <Navbar size="sm" color="indigo" expand="md" dark expand="md" style={{ boxShadow: "none", borderTop: "1px solid gainsboro" }}>
        {!this.state.isWideEnough && <NavbarToggler style={{ backgroundColor: "#2BBBAD" }} onClick={this.onClick} />}
        <Collapse isOpen={this.state.collapse} navbar>
          <NavbarNav left>
            <NavItem style={{ marginRight: "15px" }}>
              <a className="nav-link" href="#">Home</a>
            </NavItem>
            <NavItem style={{ marginRight: "15px" }}>
              <a className="nav-link" href="#/events">Events</a>
            </NavItem>
            <NavItem style={{ marginRight: "15px" }}>
              <a className="nav-link" href="#/graphs">Graphs</a>
            </NavItem>
          </NavbarNav>
          <NavbarNav right>
            <NavItem style={{ marginRight: "15px" }}>
              <a className="nav-link" href="#">Login</a>
            </NavItem>
            <NavItem style={{ marginRight: "15px" }}>
              <a className="nav-link" href="#/events">Register</a>
            </NavItem>
          </NavbarNav>
        </Collapse>
      </Navbar>
    )
  }
}

export default connect(mapStateToProps)(CustomNavbar)