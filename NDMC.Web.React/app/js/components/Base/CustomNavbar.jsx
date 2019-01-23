'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import { Navbar, NavbarNav, NavbarToggler, Collapse, Button, Fa } from 'mdbreact'

const mapStateToProps = (state, props) => {
  let { globalData: { forceNavRender, toggleSideNav, showSideNav, showSideNavButton } } = state
  return { forceNavRender, toggleSideNav, showSideNav, showSideNavButton }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddForm: payload => {
      dispatch({ type: "TOGGLE_ADD_FORM", payload })
    },
    setForceNavRender: payload => {
      dispatch({ type: "FORCE_NAV_RENDER", payload })
    },
    toggleSideNav: payload => {
      dispatch({ type: "TOGGLE_SIDENAV", payload })
    }
  }
}

/**
 * The CustomNavbar class for displaying a top navigation bar
 * @class
 */
class CustomNavbar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapse: false,
      isWideEnough: false,
      dropdownOpen: false
    }
    this.onClick = this.onClick.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  componentDidMount () {
    this.checkForceNavRender()
  }

  componentDidUpdate () {
    this.checkForceNavRender()
  }

  /**
   * Handle navigation bar rendering on component updates
   */
  checkForceNavRender () {
    if (this.props.forceNavRender === true) {
      this.props.setForceNavRender(false)
      // Force a render without state change...
      this.forceUpdate()
    }
  }

  /**
   * Handle navbar click collapse
   */
  onClick () {
    this.setState({
      collapse: !this.state.collapse,
    })
  }

  /**
   * Handle navbar dropdown toggle
   */
  toggle () {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render () {
    let { toggleSideNav, showSideNav } = this.props
    return (
      <Navbar
        size="sm"
        color="white"
        light
        expand="md"
        style={{
          boxShadow: "0px 15px 10px -15px gainsboro",
          borderTop: "1px solid #E8E8E8",
        }}
      >
        {!this.state.isWideEnough && <NavbarToggler style={{ backgroundColor: "#2BBBAD" }} onClick={this.onClick} />}
        <Collapse isOpen={this.state.collapse} navbar>
          <NavbarNav left>
            {
              (this.props.showSideNavButton === true && this.props.showNavbar !== "addOnly") &&
              <Button size="sm" color="grey" onClick={() => { toggleSideNav(!showSideNav) }}
                style={{ width: "45px", marginLeft: "0px", marginRight: "15px", paddingLeft: "18px" }}>
                <Fa icon="bars" />
              </Button>
            }
            {
              (!location.hash.includes("events/") /*&& (user && !user.expired)*/) &&
              <Button
                color="warning"
                size="sm"
                style={{ marginLeft: "0px" }}
                onClick={() => { this.props.toggleAddForm(true) }}
              >
                Add New Event
              </Button>
            }
            {/* INVISIBLE HEIGHT SPACER */}
            <div style={{ height: "32px", margin: "6px" }} />
          </NavbarNav>
        </Collapse>
      </Navbar>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomNavbar)
