'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux';
import {
  SideNav as MSBSideNav, Fa, SideNavItem, SideNavCat, SideNavNav, Modal, ModalBody, ModalHeader
} from 'mdbreact'
import '../../../css/mdbreact-sidenav.css'

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSideNav: payload => {
      dispatch({ type: "TOGGLE_SIDENAV", payload })
    }
  }
}

/**
 * The SideNav class for displaying a side navigation bar
 * @class
 */
class SideNav extends React.Component {
  constructor(props) {
    super(props)
    this.renderLinks = this.renderLinks.bind(this)
    this.toggleNav = this.toggleNav.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.showContent = this.showContent.bind(this);
    this.state = {
      navOpen: [],
      width: 0,
      height: 0,
      showContent: false,
      contentLink: "",
      contentTitle: ""
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  /**
   * Handle the updating of window dimensions based of window size
   */
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  /**
   * Handle toggling the side navigation bar
   * @param {string} key String key used to update state of sidebar 
   */
  toggleNav(key) {
    let { navOpen } = this.state
    if (navOpen.includes(key)) {
      navOpen = navOpen.filter(x => x !== key)
    }
    else {
      navOpen.push(key)
    }
    this.setState({ navOpen })
  }

  /**
   * Handle what links to render on sidebar
   * @param {array} data The array of objects to render
   * @param {number} level The number level of links to render
   */
  renderLinks(data, level = 0) {
    let links = []
    //let indent = (level > 1 ? 26 * (level - 1) : 0) + "px"
    data.forEach(x => {
      if (typeof x.children !== 'undefined') {
        links.push(
          <SideNavCat
            id={"cat_" + x.id}
            key={"cat_" + x.id}
            name={x.text + " "}
            icon="chevron-right"
            style={{ fontSize: "15px" }}
          >
            {this.renderLinks(x.children, level + 1)}
          </SideNavCat>
        )
      }
      else {
        if (typeof x.link !== 'undefined') {
          links.push(
            <SideNavItem
              key={"lnk_" + x.id}
              onClick={() => {
                this.showContent(x.link, x.text, x.window)
              }}
            >
              <Fa style={{ marginRight: "10px" }} icon="link" />
              <span style={{ fontSize: "15px" }}>{x.text}</span>
            </SideNavItem>
          )
        }
        else {
          links.push(
            <SideNavItem
              key={"lnk_" + x.id}
              style={{ fontSize: "16px" }}
            >
              <Fa style={{ marginRight: "10px" }} icon="unlink" />
              <span style={{ fontSize: "15px" }}>{x.text}</span>
            </SideNavItem>
          )
        }
      }
    })
    return links
  }

  /**
   * Handle closing the sidenav model
   */
  closeModal() {
    this.setState({ showContent: false })
    //this.props.toggleSideNav(false)
  }

  /**
   * Handle content shown in navbar
   * @param {string} link The content link string
   * @param {string} title The string title of conent
   * @param {string} window The window name on which conent should be displayed
   */
  showContent(link, title, window) {
    if (window === 'blank') {
      var win = open(link, '_blank');
      win.focus();
    }
    else {
      this.setState({ showContent: true, contentLink: link, contentTitle: title })
    }
  }

  render() {
    let { isOpen, data } = this.props
    let { width, height, showContent, contentLink, contentTitle } = this.state
    //const sideNavWidth = 325
    return (
      <>
        <MSBSideNav hidden triggerOpening={isOpen} className="white side-nav-light">
          <div className="text-center" style={{ color: "black", marginBottom: "-5px" }}>
            {data.logoTop &&
              <img src={data.logoTop.src} style={{ width: data.logoTop.width, marginTop: "15px" }} />
            }
            <hr />
            <h4>{data.title}</h4>
            <hr />
          </div>
          <SideNavNav>
            {this.renderLinks(data.nav)}
          </SideNavNav>
          <hr />
          <div className="text-center">
            {data.logoBottom &&
              <img src={data.logoBottom.src} style={{ width: data.logoBottom.width }} />
            }
          </div>
        </MSBSideNav>
        <Modal
          isOpen={showContent}
          toggle={() => this.closeModal()}
          //style={{ width: (width - sideNavWidth - 20) + "px" }}
          //size="fluid"
          //fullHeight
          frame
          position="right"
        >
          <ModalHeader toggle={() => this.closeModal()}>
            {contentTitle}
          </ModalHeader>
          <ModalBody>
            <iframe
              style={{
                marginLeft: "-15px",
                marginRight: "-20px",
                marginTop: "-15px",
                marginBottom: "-20px",
                width: width,
                height: (height - 75) + "px",
                border: "0px solid black",
                // backgroundImage: `url(${loader})`,
                // backgroundRepeat: "no-repeat",
                // backgroundPosition: "50% 50%"
              }}
              src={contentLink}
            />
          </ModalBody>
        </Modal>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SideNav)