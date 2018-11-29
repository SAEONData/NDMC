'use strict'

import React from 'react'
import { connect } from 'react-redux'
import { Navbar, NavbarNav, NavbarToggler, Collapse, NavItem, Button } from 'mdbreact'

const mapStateToProps = (state, props) => {
  let { globalData: { forceNavRender } } = state
  return { forceNavRender }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddForm: payload => {
      dispatch({ type: "TOGGLE_ADD_FORM", payload })
    },
    setForceNavRender: payload => {
      dispatch({ type: "FORCE_NAV_RENDER", payload })
    }
  }
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

  componentDidMount(){
    this.checkForceNavRender()    
  }

  componentDidUpdate(){
    this.checkForceNavRender()
  }

  checkForceNavRender(){

    if(this.props.forceNavRender === true){

      this.props.setForceNavRender(false)

      // Force a render without state change...
      this.forceUpdate()
    }
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

          {/* <NavbarNav right>
            <NavItem style={{ marginRight: "15px" }}>
              <a className="nav-link" href="#">Login</a>
            </NavItem>
            <NavItem style={{ marginRight: "15px" }}>
              <a className="nav-link" href="#/events">Register</a>
            </NavItem>
          </NavbarNav> */}
          
        </Collapse>
      </Navbar>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomNavbar)