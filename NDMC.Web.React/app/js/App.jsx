'use strict'
/**
 * @ignore
 * Imports
 */
import 'antd/lib/style/index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Events from './components/Events/List/Events.jsx'
import EventDetails from './components/Events/Details/EventDetails.jsx'
import CallbackPage from '../js/components/Authentication/callback.jsx'
import CustomNavbar from './components/Base/CustomNavbar.jsx'
import { stripURLParam } from './globalFunctions.js'
import Header from './components/Base/Header.jsx'
import Login from './components/Authentication/Login.jsx'
import Logout from './components/Authentication/Logout.jsx'
import Footer from './components/Base/Footer.jsx'
import SideNav from './components/Base/SideNav.jsx'
import MapView from './components/Map/MapView.jsx'
import DashGraph1FullView from './components/Dashboard/DashGraph1FullView.jsx'
import DashGraph2FullView from './components/Dashboard/DashGraph2FullView.jsx'
import DashGraph3FullView from './components/Dashboard/DashGraph3FullView.jsx'
import DashGraph4FullView from './components/Dashboard/DashGraph4FullView.jsx'
import moment from 'moment';
import { data as NavData } from '../data/sideNavConfig'
const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  let { globalData: { forceNavRender, showSideNav, showSideNavButton, showHeader, showNavbar, showFooter } } = state
  return { forceNavRender, showSideNav, showSideNavButton, showHeader, showNavbar, showFooter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleHeader: payload => {
      dispatch({ type: "TOGGLE_HEADER", payload })
    },
    toggleNavbar: payload => {
      dispatch({ type: "TOGGLE_NAVBAR", payload })
    },
    toggleFooter: payload => {
      dispatch({ type: "TOGGLE_FOOTER", payload })
    },
    toggleListExpandCollapse: payload => {
      dispatch({ type: "TOGGLE_LIST_EXPAND_COLLAPSE", payload })
    },
    toggleListView: payload => {
      dispatch({ type: "TOGGLE_LIST_VIEW", payload })
    },
    toggleListFavorites: payload => {
      dispatch({ type: "TOGGLE_LIST_FAVORITES", payload })
    },
    toggleSideNavButton: payload => {
      dispatch({ type: "TOGGLE_SIDENAV_BUTTON", payload })
    },
    toggleListFilterOptions: payload => {
      dispatch({ type: "TOGGLE_LIST_FILTER_OPTIONS", payload })
    },
    toggleBackToList: payload => {
      dispatch({ type: "TOGGLE_BACK_TO_LIST", payload })
    },
    toggleDetailsInParent: payload => {
      dispatch({ type: "TOGGLE_SHOW_DETAILS_IN_PARENT", payload })
    },
    loadRegionFilter: payload => {
      dispatch({ type: "LOAD_REGION_FILTER", payload })
    },
    loadHazardFilter: payload => {
      dispatch({ type: "LOAD_HAZARD_FILTER", payload })
    },
    loadDateFilter: payload => {
      dispatch({ type: "LOAD_DATE_FILTER", payload })
    },
    loadImpactFilter: payload => {
      dispatch({ type: "LOAD_IMPACT_FILTER", payload })
    },
  }
}

/**
 * Root level App class
 * @class
 */
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { navbar: true }
    if (location.toString().includes('navbar=hidden')) {
      this.state = { navbar: false }
      stripURLParam('navbar=hidden')
    }
  }

  componentWillMount() {
    //this.genTestConfig()
    this.processURLConfig()
  }

  genTestConfig() {
    // TEST //
    let config = {
      header: true, // true/false  >>>  toggle header on/off
      navbar: true, // true/false/'addOnly'  >>>  toggle navbar on/off
      sidenav: true, // true/false  >>>  toggle sidenav on/off
      footer: true, // true/false  >>>  toggle footer on/off
      backToList: true, //true/false  >>>  toggle "Back To List" button in details view on/off
      filters: {
        region: 0, //number  >>>  region filter
        hazard: 0, //number  >>>  hazard filter
        startDate: "", //number  >>>  start date filter
        endDate: "", //number  >>>  end date filter
        impact: 0, //number  >>>  impact filter
        //polygon: "" //string  >>>  polygon filter - WKT/POLYGON
      },
      listOptions: {
        expandCollapse: true, //true/false  >>>  allow minimize/maximize project list
        view: true, //true/false  >>>  toggle view button in project cards
        favorites: true, //true/false  >>>  toggle favorites functionality in project cards/list
        filters: true, //true/false  >>>  toggle filtering UI functionality
        detailsInParent: false //true/false  >>>  togle to show details in parent/child
      }
    }

    config = encodeURI(JSON.stringify(config))
    console.log("config", config)
    // TEST //
  }

  processURLConfig() {
    try {
      const parsedHash = queryString.parse(location.hash.substring(location.hash.indexOf("?")))
      if (parsedHash.config) {

        let config = JSON.parse(parsedHash.config)

        //header
        if (typeof config.header === 'boolean') {
          this.props.toggleHeader(config.header)
        }

        //sidenav
        if (typeof config.sidenav === 'boolean') {
          this.props.toggleSideNavButton(config.sidenav)
        }

        //navbar
        if (typeof config.navbar === 'boolean' || typeof config.navbar === 'string') {
          this.props.toggleNavbar(config.navbar)
        }

        //footer
        if (typeof config.footer === 'boolean') {
          this.props.toggleFooter(config.footer)
        }

        //backToList
        if (typeof config.backToList === 'boolean') {
          this.props.toggleBackToList(config.backToList)
        }

        //filters
        if (typeof config.filters !== 'undefined') {
          let filters = config.filters

          //region
          if (typeof filters.region === 'number' && filters.region > 0) {
            this.props.loadRegionFilter(filters.region)
          }

          //hazard
          if (typeof filters.hazard === 'number' && filters.hazard > 0) {
            this.props.loadHazardFilter(filters.hazard)
          }

          //date
          if ((typeof filters.startDate === 'string' && filters.startDate !== "") ||
            (typeof filters.endDate === 'strinf' && filters.endDate !== "")) {

            let startDate = filters.startDate
            let endDate = filters.endDate

            this.props.loadDateFilter({
              startDate: startDate !== "" ? moment(new Date(startDate)).unix() : moment().unix(),
              endDate: endDate !== "" ? moment(new Date(endDate)).unix() : moment().unix()
            })
          }

          //impact
          if (typeof filters.impact === 'number' && filters.impact > 0) {
            this.props.loadImpactFilter(filters.impact)
          }

          //polygon
          // if (typeof filters.polygon === 'string' && filters.polygon !== "") {
          //   this.props.loadPolygonFilter(filters.polygon)
          // }
        }

        //listOptions
        if (typeof config.listOptions !== 'undefined') {
          let listOptions = config.listOptions

          //expandCollapse
          if (typeof listOptions.expandCollapse === 'boolean') {
            this.props.toggleListExpandCollapse(listOptions.expandCollapse)
          }

          //view
          if (typeof listOptions.view === 'boolean') {
            this.props.toggleListView(listOptions.view)
          }

          //favorites
          if (typeof listOptions.favorites === 'boolean') {
            this.props.toggleListFavorites(listOptions.favorites)
          }

          //filters
          if (typeof listOptions.filters === 'boolean') {
            this.props.toggleListFilterOptions(listOptions.filters)
          }

          //detailsInParent
          if (typeof listOptions.detailsInParent === 'boolean') {
            this.props.toggleDetailsInParent(listOptions.detailsInParent)
          }
        }
      }
    }
    catch (ex) {
      console.warn(ex)
    }
  }

  render() {
    let { showSideNav, showHeader, showNavbar, showFooter } = this.props

    return (
      <div style={{ margin: "0px 15px 0px 15px", backgroundColor: "white" }}>
        <Router>
          <div>

            <div style={{ marginLeft: -15, marginRight: -15 }}>
              {(showHeader === true) && <Header />}
              {(showNavbar !== false) && <CustomNavbar />}
            </div>

            {
              this.props.showSideNavButton === true &&
              <SideNav data={NavData} isOpen={showSideNav} />
            }
            {
              (this.props.showHeader === true || this.props.showNavbar !== false) &&
              <div style={{ height: "15px", backgroundColor: "whitesmoke" }} />
            }
            <div style={{ backgroundColor: "whitesmoke" }}>
              <div style={{ margin: "0px" }}>
                <Switch>
                  <Route path='/' component={Dashboard} exact />
                  <Route path='/events' component={Events} exact />
                  <Route path='/events/:id' component={EventDetails} exact />
                  <Route path="/map" component={MapView} exact />
                  <Route path="/login" component={Login} exact />
                  <Route path="/logout" component={Logout} exact />
                  <Route path="/callback" component={CallbackPage} />
                  <Route path="/chart1" component={DashGraph1FullView} exact />
                  <Route path="/chart2" component={DashGraph2FullView} exact />
                  <Route path="/chart3" component={DashGraph3FullView} exact />
                  <Route path="/chart4" component={DashGraph4FullView} exact />
                </Switch>
              </div>
            </div>

            {
              (showFooter === true) &&
              <div style={{ marginLeft: -15, marginRight: -15 }}>
                <div style={{ height: "15px", backgroundColor: "whitesmoke" }} />
                <Footer />
              </div>
            }

          </div>
        </Router>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
