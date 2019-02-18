'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import { ssoBaseURL, ccisSiteBaseURL, nccrdBaseURL } from '../../config/serviceURLs.js'
import { DEAGreen } from './../../config/colours'
import { 
  Dropdown, 
  DropdownItem, 
  DropdownToggle, 
  DropdownMenu,
  Navbar, 
  NavbarNav, 
  NavLink,
  NavbarToggler, 
  NavItem, 
  Collapse, 
  Button, 
  Fa 
} from 'mdbreact'

const mapStateToProps = (state, props) => {
  let user = state.oidc.user
  let { globalData: { forceNavRender, toggleSideNav, showSideNav, showSideNavButton, showNavbar } } = state
  let { navigation: { locationHash } } = state
  return { 
    forceNavRender, 
    toggleSideNav, 
    showSideNav, 
    showSideNavButton, 
    showNavbar,
    user, 
    locationHash 
  }
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
    let { user, toggleSideNav, showSideNav, showNavbar } = this.props
    return (
      <Navbar
        size="sm"
        color="white"
        light
        expand="md"
        style={{
          boxShadow: "0px 15px 10px -15px gainsboro",
          borderTop: "1px solid #E8E8E8",
          paddingTop: 2,
          paddingBottom: 2
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
                Submit Hazardous Event
              </Button>
            }

            {/* Adaptation */}
            <NavItem>
                <Dropdown>
                  <DropdownToggle nav caret style={{ color: "black" }}><b>Adaptation and Response</b></DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header style={{ marginLeft: "-16px", fontSize:"16px", color: "black" }}>
                      <b>
                        Climate Change Adaptation&nbsp;
                        <br className="d-block d-md-none" />
                        Monitoring and Evaluation
                      </b>
                    </DropdownItem>
                    <DropdownItem divider />
                    {/* <DropdownItem header style={{ marginLeft: "-16px", fontWeight: "400", fontSize: "16px", color: "black" }}>
                      Impacts:
                    </DropdownItem> */}
                    <DropdownItem href={ ccisSiteBaseURL } style={{ marginLeft: "7px" }}>
                      <b style={{ color: "grey" }}>View Information</b>
                    </DropdownItem>
                    <DropdownItem href={ ccisSiteBaseURL + '/#/ame/contribute' }  style={{ marginLeft: "7px" }}>
                      <b style={{ color: "grey" }}>Submit evaluation on Progress</b>
                    </DropdownItem>
                    <DropdownItem header style={{ marginLeft: "-16px", fontWeight: "400", fontSize: "16px", color: "black" }}>
                    National Climate Change Response Database
                    </DropdownItem>
                    <DropdownItem divider />

                    <DropdownItem href={ nccrdBaseURL + '/#/'} style={{ marginLeft: "7px" }}>
                      <b style={{ color: "grey" }}>View projects</b>
                    </DropdownItem>
                    <DropdownItem href={ nccrdBaseURL  + '/#/projects/add' }  style={{ marginLeft: "7px" }}>
                      <b style={{ color: "grey" }}>Submit Project</b>
                    </DropdownItem>
                   
                  </DropdownMenu>
                </Dropdown>
              </NavItem>

            {/* INVISIBLE HEIGHT SPACER */}
            <div style={{ height: "32px", margin: "6px" }} />
          </NavbarNav>
              {/* RIGHT */}
              {
            showNavbar !== "addOnly" &&
            <NavbarNav right>

              {/* Username */}
              {(user && !user.expired) &&
                <NavItem style={{ marginRight: "15px" }}>
                  <NavLink to ="" disabled>
                    <b style={{ color: DEAGreen }}>
                    { "Hello, " + user.profile.email }
                    </b>
                  </NavLink>
                </NavItem>

              //   <table>
              //     <tbody>
              //       <tr style={{ height: "40px" }}>
              //         <td valign="middle">
              //           <div style={{ marginRight: "7px", color: "grey" }} >
              //             <Fa size="2x" icon="user-circle-o" />
              //           </div>
              //         </td>
              //         <td valign="middle">
              //           <div style={{ fontSize: "17px" }} >
              //             <b>{`${user.profile.FirstName} ${user.profile.Surname}`}</b>
              //           </div>
              //         </td>
              //       </tr>
              //     </tbody>
              //   </table>
              }

              {/* Contact */}
              {/* <NavItem style={{ marginRight: "15px", borderBottom: (locationHash === "#/contact" ? "4px solid dimgrey" : "0px solid white") }}>
                <NavLink  to="contact"><b>Contact</b></NavLink>
              </NavItem> */}

              {/* Login / Logout */}
              <NavItem style={{ marginLeft: "15px" }}>
                {(!user || user.expired) &&
                  <a className="nav-link" onClick={this.LoginLogoutClicked} href="#/login">
                    <b style={{ color: "black" }}>
                      Login
                  </b>
                  </a>
                }
                {(user && !user.expired) &&
                  <a className="nav-link" onClick={this.LoginLogoutClicked} href="#/logout">
                    <b style={{ color: "black" }}>
                      Logout
                  </b>
                  </a>
                }
              </NavItem>


              {/* Register */}
              {(!user || user.expired) &&
                <NavItem style={{ marginLeft: "15px" }}>
                  <a key="lnkRegister" className="nav-link" href={ssoBaseURL + "Account/Register"} target="_blank">
                    <b style={{ color: "black" }}>
                      Register
                  </b>
                  </a>
                </NavItem>
              }

            </NavbarNav>
          }
        </Collapse>
      </Navbar>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomNavbar)
