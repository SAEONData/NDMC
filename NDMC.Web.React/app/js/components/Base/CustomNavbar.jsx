'use strict'

import React from 'react'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { Button, Input } from 'mdbreact'
import * as ACTION_TYPES from "../../constants/action-types"
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact'

const mapStateToProps = (state, props) => {
  let { globalData: { } } = state
  return {  }
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
      <Navbar size="sm" color="indigo" expand="md" dark >
        {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
        <Collapse isOpen={this.state.collapse} navbar>
          <NavbarBrand tag="span">
            NDMC
            </NavbarBrand>
          <NavbarNav left>
            <NavItem>
              <a className="nav-link" href="#">Home</a>
            </NavItem>
            <NavItem>
              <a className="nav-link" href="#/events">Events</a>
            </NavItem>
            <NavItem>
              <a className="nav-link" href="#/graphs">Graphs</a>
            </NavItem>
          </NavbarNav>
        </Collapse>
      </Navbar>
    )
  }
}

export default connect(mapStateToProps)(CustomNavbar)