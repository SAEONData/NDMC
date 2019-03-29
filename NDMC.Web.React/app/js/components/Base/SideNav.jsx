'use strict'

import React from 'react'
import { connect } from 'react-redux';
import { Fa, Row, Col, Button } from 'mdbreact'
import { Drawer, Collapse } from 'antd'
import { DEAGreen } from '../../config/colours.js'

import './SideNav.css'

const Panel = Collapse.Panel

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

class SideNav extends React.Component {

  constructor(props) {
    super(props)

    this.renderLinks = this.renderLinks.bind(this)
    this.toggleNav = this.toggleNav.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.showContent = this.showContent.bind(this);

    this.state = { navOpen: [], width: 0, height: 0, showContent: false, contentLink: "", contentTitle: "" }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

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

  renderLinks(data, level = 0) {
    let links = []

    data.forEach(x => {

      if (typeof x.children !== 'undefined') {
        links.push(
          <Panel
            key={"cat_" + x.id}
            header={
              <div className="nav-cat-head">
                {x.text}
              </div>
            }
            style={{
              border: 0
            }}
          >
            {this.renderLinks(x.children, level + 1)}
          </Panel>
        )
      }
      else {
        if (typeof x.link !== 'undefined') {
          links.push(
            <div key={"lnk_" + x.id} style={{ marginLeft: 20 }}>
              <a
                onClick={() => {
                  this.showContent(x.link, x.text, x.window)
                }}
              >
                <Fa style={{ marginRight: "10px" }} icon="link" />
                <span style={{ fontSize: "15px" }}>{x.text}</span>
              </a>
            </div>
          )
        }
        else {
          links.push(
            <div key={"lnk_" + x.id} style={{ marginLeft: 20 }}>
              <a
                onClick={() => {
                  this.showContent(x.link, x.text, x.window)
                }}
              >
                <Fa style={{ marginRight: "10px" }} icon="unlink" />
                <span style={{ fontSize: "15px" }}>{x.text}</span>
              </a>
            </div>
          )
        }
      }
    })

    return links
  }

  closeModal() {
    this.setState({ showContent: false, contentLink: "" })
  }

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
    let { width, showContent, contentLink, contentTitle } = this.state

    const sideNavWidth = width < 325 ? "100%" : 325

    return (
      <>
        <Drawer
          placement="left"
          closable={true}
          onClose={() => this.props.toggleSideNav(false)}
          visible={isOpen}
          width={sideNavWidth}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0, overflowX: 'hidden' }}
        >
          <Row>
            <Col>
              {/* Header image */}
              <div className="text-center" style={{ color: "black", marginBottom: "-5px" }}>
                {data.logoTop &&
                  <img src={data.logoTop.src} style={{ width: data.logoTop.width, marginTop: "15px" }} />
                }
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              {/* Header text */}
              <h4 style={{ color: "black", marginBottom: "-5px", textAlign: "center" }}>
                {data.title}
              </h4>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <table>
                <tbody>
                  <tr>
                    <td width="100%">
                      {/* Links */}
                      <Collapse accordion bordered={false} defaultActiveKey={['cat_1']}>
                        {this.renderLinks(data.nav)}
                      </Collapse>
                    </td>
                    <td>
                      <Button
                        className="nav-close-handle"
                        onClick={() => this.props.toggleSideNav(false)}
                        color=""
                        style={{ backgroundColor: DEAGreen }}
                      >
                        <Fa
                          size="2x"
                          icon="caret-left"
                        />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              {/* Footer image */}
              <div className="text-center">
                {data.logoBottom &&
                  <img src={data.logoBottom.src} style={{ width: data.logoBottom.width }} />
                }
              </div>
            </Col>
          </Row>
          <Drawer
            title={
              <a style={{ fontSize: 24, fontWeight: 500, color: DEAGreen }} onClick={() => this.closeModal()}>
                <Fa icon="chevron-circle-left" style={{ marginRight: 10 }} />
                {contentTitle}
              </a>
            }
            placement="left"
            width={width < 1250 ? "100vw" : "80vw"}
            closable={true}
            onClose={() => this.closeModal()}
            visible={showContent}
            bodyStyle={{ padding: 1, overflowX: 'hidden' }}
          >
            <iframe
              id="sidenav-content"
              style={{
                padding: 0,
                width: "100%",
                height: "90vh",
                border: "none",
              }}
              src={contentLink}
            />
          </Drawer>
        </Drawer>
      </>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav)