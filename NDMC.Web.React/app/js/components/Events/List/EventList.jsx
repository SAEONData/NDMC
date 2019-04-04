'use strict'

import React from 'react'
import { apiBaseURL, vmsBaseURL } from '../../../config/serviceURLs.js'
import { connect } from 'react-redux'
import { Button, Fa, ListGroup, ListGroupItem } from 'mdbreact'
import OData from 'react-odata'
import popout from '../../../../images/popout.png'
import popin from '../../../../images/popin.png'
import EventCard from './EventCard.jsx'
import { DEAGreen } from '../../../config/colours.js'
import { Button as ABtn, Modal, Form, Col, Row, InputNumber, Select, DatePicker, Drawer, TreeSelect, Popover } from 'antd'
import '../../../../css/antd.tree-select.css'

const { Option } = Select
const _gf = require('../../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter, regionFilter, dateFilter, impactFilter, favoritesFilter, regions, hazards } } = state
  let { globalData: { addFormVisible, showListExpandCollapse, showFavoritesOption } } = state
  let { eventData: { events, listScrollPos } } = state
  return {
    hazardFilter, regionFilter, dateFilter, impactFilter, addFormVisible, events, favoritesFilter, listScrollPos,
    showListExpandCollapse, showFavoritesOption, regions, hazards
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddForm: payload => {
      dispatch({ type: "TOGGLE_ADD_FORM", payload })
    },
    resetEvents: () => {
      dispatch({ type: "RESET_EVENTS", payload: [] })
    },
    loadEvents: payload => {
      dispatch({ type: "LOAD_EVENTS", payload })
    },
    toggleFavorites: async payload => {
      dispatch({ type: "LOAD_FAVS_FILTER", payload })
    },
    setScrollPos: payload => {
      dispatch({ type: "SET_EVENTS_SCROLL", payload })
    },
    setForceNavRender: payload => {
      dispatch({ type: "FORCE_NAV_RENDER", payload })
    },
    loadRegions: payload => {
      dispatch({ type: "LOAD_REGIONS", payload })
    },
    loadHazards: payload => {
      dispatch({ type: "LOAD_HAZARDS", payload })
    }
  }
}

const defaultState = {
  region: 0,
  regionTreeValue: '',
  impacts: [],
  responses: [],
  hazard: 0,
  hazardTreeValue: '',
  startDate: null,
  endDate: null,
  declaredDate: null,
  impactTypeTemp: '',
  impactTypeNameTemp: '',
  impactAmountTemp: '',
  impactUnitMeasureTemp: '',
  responseTypeTemp: '',
  responseTypeNameTemp: '',
  responseValueTemp: '',
  responseDateTemp: '',
  measureTemp: '',
}

/**
 * The EventList class for displaying events on the dashboard
 * @class
 */
class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _hazardFilter: null,
      _regionFilter: null,
      _impactFilter: null,
      _dateFilter: {
        startDate: null,
        endDate: null
      },
      eventListSize: 25,
      eventsLoading: false,
      _favoritesFilter: false,
      ellipsisMenu: false,
      impactModalVisible: false,
      responseModalVisible: false,
      regionTreeValue: '',
      ...defaultState,
      showBackToTop: false,
      excludeDatelessEvents: true,
      excludeDatelessEventsChanged: true
    }

    this.handleScroll = this.handleScroll.bind(this)
    this.backToTop = this.backToTop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onRegionSelect = this.onRegionSelect.bind(this)
    this.onHazardSelect = this.onHazardSelect.bind(this)
    this.onDeclaredDateSelect = this.onDeclaredDateSelect.bind(this)
    this.onDateRangeSelect = this.onDateRangeSelect.bind(this)
    this.onImpactOpen = this.onImpactOpen.bind(this)
    this.onImpactAdd = this.onImpactAdd.bind(this)
    this.onImpactClose = this.onImpactClose.bind(this)
    this.onImpactSelect = this.onImpactSelect.bind(this)
    this.onImpactAmount = this.onImpactAmount.bind(this)
    this.onImpactUndo = this.onImpactUndo.bind(this)
    this.onResponseAdd = this.onResponseAdd.bind(this)
    this.onResponseClose = this.onResponseClose.bind(this)
    this.onResponseOpen = this.onResponseOpen.bind(this)
    this.onResponseSelect = this.onResponseSelect.bind(this)
    this.onResponseUndo = this.onResponseUndo.bind(this)
    this.onResponseValue = this.onResponseValue.bind(this)
    this.onMeasureSelect = this.onMeasureSelect.bind(this)
    this.onResponseDateSelect = this.onResponseDateSelect.bind(this)
    this.onImpactUnitMeasure = this.onImpactUnitMeasure.bind(this)
    this.transformDataTree = this.transformDataTree.bind(this)
    this.transformTreeDataHazards = this.transformTreeDataHazards.bind(this)
  }

  componentDidMount() {
    this.Init()
    window.addEventListener('scroll', this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentDidUpdate() {
    this.Init()
  }

  /**
   * Initialize EventList class with default values
   *
   * @function
   */
  Init() {
    let { hazardFilter, regionFilter, dateFilter, impactFilter, favoritesFilter } = this.props
    let {
      _hazardFilter, _regionFilter, _dateFilter, _impactFilter, _favoritesFilter,
      excludeDatelessEventsChanged
    } = this.state

    if (hazardFilter !== _hazardFilter || regionFilter !== _regionFilter || impactFilter !== _impactFilter ||
      dateFilter.startDate !== _dateFilter.startDate || dateFilter.endDate !== _dateFilter.endDate ||
      favoritesFilter !== _favoritesFilter || excludeDatelessEventsChanged === true) {

      this.setState({
        _hazardFilter: hazardFilter,
        _regionFilter: regionFilter,
        _impactFilter: impactFilter,
        _dateFilter: dateFilter,
        _favoritesFilter: favoritesFilter,
        excludeDatelessEventsChanged: false
      }, async () => {
        await this.props.resetEvents()
        this.getEvents()
      })

    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  /**
   * Handle user page scroll
   *
   * @function
   */
  handleScroll() {
    let { showBackToTop } = this.state
    //Toggle BackToTop button
    if (window.pageYOffset > 1450 && showBackToTop === false) {
      this.setState({ showBackToTop: true })
    }
    else if (window.pageYOffset <= 1450 && showBackToTop === true) {
      this.setState({ showBackToTop: false })
    }
  }

  /**
   * Build A list of event cards to be rendered
   *
   * @function
   * @param {object} events An object containing the array of events to render
   * @returns {Array} An array of cards containing events
   */
  buildList(events) {

    let { regions, hazards } = this.props

    let ar = []
    events.map(i => {
      let startdate = i.StartDate > 0 ? new Date(i.StartDate * 1000) : 'N/A'
      let enddate = i.EndDate > 0 ? new Date(i.EndDate * 1000) : 'N/A'
      if (i.TypeEventId !== null && i.EventRegions[0] !== undefined) {

        //Get RegionId if any
        let regionId = 0
        if (i.EventRegions && i.EventRegions.length > 0) {
          regionId = i.EventRegions[0].RegionId
        }

        //Get Region
        let region = null
        if (regions && regions.length > 0) {
          let filteredRegions = regions.filter(r => r.id == regionId)
          if (filteredRegions.length > 0) {
            region = filteredRegions[0]
          }
        }

        //Get HazardType
        let hazardType = {}
        if (hazards && hazards.length > 0) {
          let filteredHazards = hazards.filter(hazard => hazard.id == i.TypeEventId)
          if (filteredHazards.length > 0) {
            hazardType = filteredHazards[0]
          }
        }

        ar.push(
          <EventCard
            key={i.EventId}
            eid={i.EventId}
            region={region}
            startdate={startdate === 'N/A' ? 'N/A' : startdate.toDateString()}
            enddate={enddate === 'N/A' ? 'N/A' : enddate.toDateString()}
            hazardtype={hazardType.value}
          />
        )
      }
    })
    return ar
  }

  /**
   * Query events from API with any filter's selected
   *
   * @function
   */
  getEvents() {
    //Set loading true
    this.setState({ eventsLoading: true }, async () => {
      //Get Events
      let { eventListSize, _hazardFilter, _regionFilter, _impactFilter, _dateFilter, _favoritesFilter, excludeDatelessEvents } = this.state
      let { events } = this.props

      let skip = events.length
      skip = skip > 0 ? skip : 0

      let top = eventListSize - events.length
      top = top > 0 ? top : 0

      let fetchURL = `${apiBaseURL}Events/Extensions.Filter?$skip=${skip}&$top=${top}&$expand=eventRegions`

      fetchURL += excludeDatelessEvents === true ? "&$filter=StartDate ne null" : ""

      let postBody = {
        region: _regionFilter,
        hazard: _hazardFilter,
        impact: _impactFilter,
        startDate: _dateFilter.startDate,
        endDate: _dateFilter.endDate,
        favorites: _favoritesFilter === true ? _gf.ReadCookie("NDMC_Event_Favorites") : ""
      }

      const res = await fetch(fetchURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // 'Authorization': 'Bearer' + (user === null ? '': '')
        },
        body: JSON.stringify(postBody)
      })

      const res_1 = await res.json()

      if (res_1 && res_1.value && res_1.value.length > 0) {

        // console.log("events", res_1.value.map(e => e.EventRegions.map(er => er.RegionId)))

        events.push(...res_1.value) //add additional events
        this.props.loadEvents(events)
      }

      this.setState({
        eventsLoading: false //set loading false
      })
    })
  }

  /**
   * Handle closing the input form
   *
   * @function
   */
  onClose() {
    this.props.toggleAddForm(false)
    this.setState({
      ...defaultState
    })
  }

  /**
   * Validate input for input form
   *
   * @function
   * @returns {boolean} Whether the user input is valid
   */
  ValidateInput() {

    let { startDate, endDate, region, hazard } = this.state
    let validationMessage = ''

    if (region === 0) {
      validationMessage = "Region is required. Please select a region."
    }
    else if (hazard === 0) {
      validationMessage = "Hazard is required. Please select a hazard."
    }
    else if (startDate === null) {
      validationMessage = "Start-date is required. Please select a start-date."
    }
    else if (endDate === null) {
      validationMessage = "End-date is required. Please select a end-date."
    }

    if (validationMessage !== '') {
      console.error(validationMessage)
      alert(validationMessage)
      return false
    }

    return true
  }

  // this.props.toggleAddForm(false)
  /**
  * Handle submitting a new event from the input form
  *
  * @async
  * @function
  */
  async onSubmit() {
    //this.props.toggleAddForm(false)
    const formattedImpacts = this.state.impacts.map(impact => {
      return { EventImpactId: 0, Measure: impact.impactAmount, TypeImpactId: impact.impactType, UnitOfMeasure: impact.impactUnitMeasure }
    })
    const formattedResponses = this.state.responses.map(response => {
      return {
        MitigationId: 0,
        Date: response.responseDate,
        Value: response.responseValue,
        TypeMitigationId: response.responseType
      }
    })
    let fetchBody = {
      EventId: 0,
      StartDate: this.state.startDate,
      EndDate: this.state.endDate,
      TypeEventId: this.state.hazard,
      TypeSourceId: 1,
      EventRegions: [{
        RegionId: parseInt(this.state.region),
        EventImpacts: formattedImpacts
      }]
    }

    //Add declared date if available
    if (this.state.declaredDate !== null) {
      fetchBody.DeclaredEvents = [{
        DeclaredEventId: 0,
        DeclaredDate: this.state.declaredDate
      }]
    }

    if (formattedResponses && formattedResponses.length > 0) {
      fetchBody.Mitigations = formattedResponses
    }

    if (this.ValidateInput()) {
      try {
        let res = await fetch(apiBaseURL + 'Events/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + (user === null ? "" : user.access_token)
          },
          body: JSON.stringify(fetchBody)
        })

        if (!res.ok) {
          res = await res.json()
          throw new Error(res.error.message)
        }

        //Reset on success
        this.setState({
          ...defaultState
        })

        this.props.toggleAddForm(false)
      }
      catch (ex) {
        console.error(ex)
        alert(ex)
      }
    }
  }

  /**
  * Handle scrolling to top of page
  *
  * @function
  */
  backToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Handle selecting region in input form
   *
   * @function
   * @param {string} value The value of the region selected node
   * @param {object} node An object containing all data for selected region node
   */
  onRegionSelect(value, node) {
    this.setState({ region: node.props.id, regionTreeValue: node.props.title })
  }

  /**
   * Handle selecting hazard in input form
   *
   * @function
   * @param {string} value The value of the hazard selected node
   * @param {object} node An object containing all data for selected hazard node
   */
  onHazardSelect(value, node) {
    this.setState({ hazard: node.props.id, hazardTreeValue: node.props.title })
  }

  /**
   * Handle selecting a declared date
   *
   * @function
   * @param {string} dateString The date string of the chosen declared date
   */
  onDeclaredDateSelect(dateString) {
    this.setState({ declaredDate: Date.parse(dateString) / 1000 })
  }

  /**
   * Handle selecting a hazard date range
   *
   * @function
   * @param {string} dateString The date string of the chosen date range
   */
  onDateRangeSelect(dateString) {
    this.setState({ startDate: Date.parse(dateString[0]) / 1000, endDate: Date.parse(dateString[1]) / 1000 })
  }

  /**
   * Handle opening the impact input dialog
   *
   * @function
   */
  onImpactOpen() {
    this.setState({ impactModalVisible: true })
  }

  /**
   * Handle closing the impact input dialog
   *
   * @function
   */
  onImpactClose() {
    if (!isNaN(this.state.impactAmountTemp && this.state.impactAmountTemp)) {
      this.setState({ impactModalVisible: false })
      this.setState({
        impactTypeTemp: '',
        impactTypeNameTemp: '',
        impactAmountTemp: '',
        impactUnitMeasureTemp: '',
      })
    }
  }

  /**
   * Handle adding a new impact to the impact array for the event
   *
   * @function
   */
  onImpactAdd() {
    let newimpact = {
      impactType: this.state.impactTypeTemp,
      impactTypeName: this.state.impactTypeNameTemp,
      impactAmount: this.state.impactAmountTemp,
      impactUnitMeasure: this.state.impactUnitMeasureTemp
    }

    if (this.state.impacts.length > 0) {
      this.setState(prev => ({
        impacts: [...prev.impacts, newimpact]
      }))
    }

    else {
      this.setState({
        impacts: [newimpact]
      })
    }

    this.setState({
      impactModalVisible: false,
      impactTypeTemp: '',
      impactTypeNameTemp: '',
      impactAmountTemp: '',
      impactUnitMeasure: '',
    })
  }

  /**
   * Handle impact select in impact dialog
   *
   * @function
   * @param {string} value The impact string of the selected impact node
   * @param {object} next The node object containing details of the selected node
   */
  onImpactSelect(value, next) {
    this.setState({ impactTypeTemp: value, impactTypeNameTemp: next.props.children })
  }

  /**
   * Handle impact amount/value input for a given impact
   *
   * @function
   * @param {string} value The string value of the amount inputted
   */
  onImpactAmount(value) {
    this.setState({ impactAmountTemp: value })
  }

  /**
   * Handle impact Unit of Measure selecting for a given impact
   *
   * @function
   * @param {string} value The string of the unit of measure selected
   */
  onImpactUnitMeasure(value) {
    this.setState({ impactUnitMeasureTemp: value })
  }

  /**
   * Handle removing the last impact added in input form
   *
   * @function
   */
  onImpactUndo() {
    let arr = this.state.impacts
    arr.pop()
    this.setState({
      impacts: arr
    })
  }

  /**
   * Handle opening the response input dialog
   *
   * @function
   */
  onResponseOpen() {
    this.setState({ responseModalVisible: true })
  }

  /**
   * Handle closing the response input dialog
   *
   * @function
   */
  onResponseClose() {
    this.setState({ responseModalVisible: false })
  }

  /**
   * Handle adding a new response to the array of responses for the event
   *
   * @function
   */
  onResponseAdd() {
    let newResponse = {
      responseType: this.state.responseTypeTemp,
      responseTypeName: this.state.responseTypeNameTemp,
      responseValue: this.state.responseValueTemp,
      responseMeasuretype: this.state.measureTemp,
      responseDate: this.state.responseDateTemp
    }

    if (this.state.responses.length > 0) {
      this.setState(prev => ({
        responses: [...prev.responses, newResponse]
      }))
    }

    else {
      this.setState({
        responses: [newResponse]
      })
    }

    this.setState({
      responseModalVisible: false,
      responseTypeTemp: '',
      responseTypeNameTemp: '',
      responseValueTemp: '',
      measureTemp: ''
    })
  }

  /**
   * Handle selecting a response in response dialog
   *
   * @function
   * @param {string} value The string value of the selected response
   * @param {object} next The object containing details of the selected node
   */
  onResponseSelect(value, next) {
    this.setState({ responseTypeTemp: value, responseTypeNameTemp: next.props.title })
  }

  /**
   * Handle inputting value for a response
   *
   * @function
   * @param {string} value The string value of the inputted response value
   */
  onResponseValue(value) {
    this.setState({ responseValueTemp: value })
  }

  /**
   * Handle removing the last response added in input form
   *
   * @function
   */
  onResponseUndo() {
    let arr = this.state.responses
    arr.pop()
    this.setState({
      responses: arr
    })
  }

  /**
   * Handle measure input for a response
   *
   * @function
   * @param {string} value The string value of the amount inputted
   */
  onMeasureSelect(value) {
    this.setState({
      measureTemp: value
    })
  }

  /**
   * Handle date selection for a response
   *
   * @function
   * @param {string} dateString The string value of the selected date chosen for the response
   */
  onResponseDateSelect(dateString) {
    this.setState({
      responseDateTemp: Date.parse(dateString) / 1000
    })
  }

  /**
   * Transform data from a flat array to a parent-child relation tree
   *
   * @function
   * @param {object} responseData Object array of data to transform
   * @returns {object} The new transformed tree data
   */
  transformDataTree(responseData) {
    let responses = responseData.map(i => {
      return {
        ParentTypeMitigationId: i.ParentTypeMitigationId, TypeMitigationId: i.TypeMitigationId, children: [], title: i.TypeMitigationName, value: `${i.TypeMitigationId}`, key: i.TypeMitigationId
      }
    })
    responses.forEach(f => { f.children = responses.filter(g => g.ParentTypeMitigationId === f.TypeMitigationId) })
    var resultArray = responses.filter(f => f.ParentTypeMitigationId == null)
    return resultArray
  }

  /**
   * Recursive function that takes a hazard array object and maps each key to a new value for ant.d's treeselect.
   *
   * @function
   * @param {object} hazards
   * @returns The final object keymapped to new values
   */
  transformTreeDataHazards(hazards) {
    if (typeof hazards === 'object') {
      return hazards.map(item => {
        return { ...item, title: item.value, children: this.transformTreeDataHazards(item.children) }
      })
    }
  }

  render() {
    const { impacts, responses } = this.state
    let { _favoritesFilter, ellipsisMenu, showBackToTop, excludeDatelessEvents } = this.state

    const regionQuery = {
      select: ['RegionId', 'RegionName', 'ParentRegionId', 'RegionTypeId']
    }
    const hazardQuery = {
      select: ['TypeEventId', 'TypeEventName']
    }
    const impactsQuery = {
      select: ['TypeImpactId', 'TypeImpactName']
    }
    const responseQuery = {
      select: ['TypeMitigationId', 'TypeMitigationName', 'UnitOfMeasure', 'ParentTypeMitigationId']
    }
    const hazardsQuery = {
      select: ['TypeEventId', 'TypeEventName']
    }

    return (
      <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px", border: "1px solid gainsboro" }}>

        {/* Load Hazards from VMS */}
        <OData baseUrl={vmsBaseURL + 'hazards/flat'} query={hazardsQuery}>
          {({ loading, error, data }) => {
            if (loading) { return <div></div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            if (data) {
              //Dispatch data to store
              setTimeout(() => {
                if (!_.isEqual(data.items, this.props.hazards)) {
                  this.props.loadHazards(data.items)
                }
              }, 100)
            }
          }
          }
        </OData>

        {/* Load Regions from VMS */}
        <OData baseUrl={vmsBaseURL + 'regions/flat'} query={regionQuery}>
          {({ loading, error, data }) => {
            if (loading) { return <div></div> }
            if (error) { return <div>Error Loading Data From Server</div> }
            if (data) {
              //Dispatch data to store
              setTimeout(() => {
                if (!_.isEqual(data.items, this.props.regions)) {
                  this.props.loadRegions(data.items)
                }
              }, 100)
            }
          }
          }
        </OData>

        <h4 style={{ margin: "5px 5px 5px 19px", display: "inline-block" }}>
          <b>Events</b>
        </h4>
        <div style={{ float: "right" }}>
          {
            this.props.showListExpandCollapse &&
            <img
              src={location.hash.includes("events") ? popin : popout}
              style={{
                width: "25px",
                margin: "-4px 5px 0px 0px",
                cursor: "pointer"
              }}
              onClick={() => {
                this.props.setScrollPos(0)
                let navTo = ""
                if (location.hash.includes("events")) {
                  navTo = location.hash.replace("#/events", "")
                }
                else {
                  navTo = location.hash.replace("#/", "#/events")
                }
                location.hash = navTo
              }}
            />
          }
          {
            this.props.showFavoritesOption === true &&
            <Popover
              content={
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p style={{ margin: "10px 5px 10px 5px" }}>
                            Favorites:
                          </p>
                        </td>
                        <td>
                          <ABtn
                            size="small"
                            type="primary"
                            style={{
                              marginLeft: 0,
                              width: "40px",
                              backgroundColor: _favoritesFilter === true ? DEAGreen : "grey",
                              border: "none",
                              borderRadius: 0,
                              color: "black",
                              fontWeight: 300
                            }}
                            onClick={() => {
                              this.props.toggleFavorites(!_favoritesFilter)
                              this.setState({ ellipsisMenu: false })
                            }}
                          >
                            On
                          </ABtn>
                          <ABtn
                            size="small"
                            type="primary"
                            style={{
                              marginLeft: -1,
                              width: "40px",
                              backgroundColor: _favoritesFilter === false ? DEAGreen : "grey",
                              border: "none",
                              borderRadius: 0,
                              color: "black",
                              fontWeight: 300
                            }}
                            onClick={() => {
                              this.props.toggleFavorites(!_favoritesFilter)
                              this.setState({ ellipsisMenu: false })
                            }}
                          >
                            Off
                          </ABtn>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style={{ margin: "10px 15px 10px 5px" }}>
                            Exclude events<br />without dates:
                          </p>
                        </td>
                        <td>
                          <ABtn
                            size="small"
                            type="primary"
                            style={{
                              marginLeft: 0,
                              width: "40px",
                              backgroundColor: excludeDatelessEvents === true ? DEAGreen : "grey",
                              border: "none",
                              borderRadius: 0,
                              color: "black",
                              fontWeight: 300
                            }}
                            onClick={() => {
                              this.setState({
                                excludeDatelessEvents: true,
                                excludeDatelessEventsChanged: true,
                                ellipsisMenu: false
                              })
                            }}
                          >
                            On
                          </ABtn>
                          <ABtn
                            size="small"
                            type="primary"
                            style={{
                              marginLeft: -1,
                              width: "40px",
                              backgroundColor: excludeDatelessEvents === false ? DEAGreen : "grey",
                              border: "none",
                              borderRadius: 0,
                              color: "black",
                              fontWeight: 300
                            }}
                            onClick={() => {
                              this.setState({
                                excludeDatelessEvents: false,
                                excludeDatelessEventsChanged: true,
                                ellipsisMenu: false
                              })
                            }}
                          >
                            Off
                          </ABtn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              }
              placement="leftTop"
              trigger="click"
              visible={ellipsisMenu}
              onVisibleChange={(visible) => { this.setState({ ellipsisMenu: visible }) }}
            >
              <Fa
                icon="ellipsis-v"
                size="lg"
                style={{
                  color: "black",
                  margin: "11px 15px 5px 15px",
                  padding: "5px 10px 5px 10px",
                  cursor: "pointer"
                }}
              />
            </Popover>
          }
        </div>
        <hr />
        <div>

          {
            this.state.eventsLoading === true &&
            <div>
              <br />
              <h5 style={{ marginLeft: 20 }}>Loading events...</h5>
              <br />
            </div>
          }

          {
            this.state.eventsLoading === false &&
            this.buildList(this.props.events)
          }

          <br />
          <Button
            size="sm"
            color=""
            style={{ marginTop: "-25px", marginLeft: "20px", backgroundColor: DEAGreen }}
            onClick={() => {
              if (!this.state.eventsLoading) {
                this.setState({
                  eventListSize: this.state.eventListSize + 25
                }, () => this.getEvents())
              }
            }}
          >
            Load More Events
            </Button>
        </div>
        <div style={{ position: "fixed", right: "30px", bottom: "15px", zIndex: "99" }}>
          {
            showBackToTop &&
            <Button
              // data-tip="Back to top"
              size="sm"
              floating
              color=""
              onClick={this.backToTop}
              style={{ backgroundColor: DEAGreen }}
            >
              <Fa icon="arrow-up" />
            </Button>
          }
        </div>

        {/* ### ADD FORM ### */}
        <div>
          <Drawer
            title="New Hazardous Event"
            width={600}
            placement="right"
            onClose={this.onClose}
            maskClosable={false}
            visible={this.props.addFormVisible}
            destroyOnClose={true}
            style={{
              height: 'calc(100% - 55px)',
              overflow: 'auto',
              paddingBottom: 53,
            }}
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Select the region in which  the event ocurred">
                    <OData baseUrl={vmsBaseURL + 'regions'} query={regionQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          let regionsFormatted = data.items.map(region => {
                            return {
                              ...region, title: region.value, children: region.children.map(subRegion => {
                                return {
                                  ...subRegion, title: subRegion.value, children: subRegion.children.map(subSubRegion => {
                                    return { ...subSubRegion, title: subSubRegion.value }
                                  })
                                }
                              })
                            }
                          })
                          return <TreeSelect
                            key={new Date().valueOf()}
                            style={{ width: "100%" }}
                            value={this.state.regionTreeValue}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={regionsFormatted}
                            placeholder="Region"
                            onSelect={this.onRegionSelect}
                          >
                          </TreeSelect>
                        }
                      }}
                    </OData>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Select the type of event that ocurred">
                    <OData baseUrl={vmsBaseURL + 'hazards'} query={hazardQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          let hazards = data.items
                          //data.items.sort((a, b) => a.value.localeCompare(b.value))

                          let hazardsFormatted = this.transformTreeDataHazards(hazards)

                          return <TreeSelect
                            style={{ width: "100%" }}
                            value={this.state.hazardTreeValue}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            dropdownMatchSelectWidth={false}
                            treeData={hazardsFormatted}
                            placeholder="Select..."
                            onSelect={this.onHazardSelect}
                          >
                          </TreeSelect>
                        }
                      }}
                    </OData>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Select the date range in which the event ocurred">
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      getPopupContainer={trigger => trigger.parentNode}
                      onChange={this.onDateRangeSelect}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="If the event has been declared, please provide date of declaration">
                    <DatePicker style={{ width: '100%' }} onChange={this.onDeclaredDateSelect} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="All impacts that occured">
                    <Button onClick={this.onImpactOpen} size="sm" color=""
                      style={{ marginLeft: "0px", marginTop: "0px", backgroundColor: DEAGreen }}>
                      Add Impact
                    </Button>
                    <Button onClick={this.onImpactUndo} size="sm" color=""
                      style={{ marginLeft: "0px", marginTop: "0px", backgroundColor: DEAGreen }}>
                      Undo last
                    </Button>
                    <OData baseUrl={apiBaseURL + 'TypeImpacts'} query={impactsQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          data.value.sort((prev, next) => prev.TypeImpactName.localeCompare(next.TypeImpactName))
                          return <Modal
                            title="New Impact Creation"
                            visible={this.state.impactModalVisible}
                            onOk={this.onImpactAdd}
                            onCancel={this.onImpactClose}
                            destroyOnClose={true}
                          >
                            <Select
                              showSearch
                              style={{ width: 400 }}
                              placeholder="Select an impact"
                              optionFilterProp="children"
                              onChange={this.onImpactSelect}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                              {data.value.map(item => {
                                return <Option key={item.TypeImpactId} value={item.TypeImpactId}>{item.TypeImpactName}</Option>
                              })}
                            </Select>
                            <div className="row" style={{ paddingLeft: 15 }}>
                              <div style={{ paddingTop: 1, className: 'col-sm-1', paddingRight: 10 }}>
                                <br></br>
                                <h6>Enter Amount as number </h6>
                                <InputNumber style={{ height: 35, width: 160 }} onChange={this.onImpactAmount}></InputNumber>
                              </div>
                              <div style={{ paddingTop: 1, className: 'col-sm-1', paddingLeft: 10 }}>
                                <br></br>
                                <h6>Select Unit Of Measure for impact </h6>
                                <Select
                                  showSearch
                                  style={{ width: 200 }}
                                  placeholder="Select a Unit Of Measure"
                                  optionFilterProp="children"
                                  onChange={this.onImpactUnitMeasure}
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                  <Option key={1} value={'Rands'}>Rands</Option>
                                  <Option key={2} value={'Metres'}>Metres</Option>
                                  <Option key={3} value={'Kilometres'}>Kilometres</Option>
                                  <Option key={4} value={'Hectares'}>Hectares</Option>
                                  <Option key={5} value={'Acres'}>Acres</Option>
                                  <Option key={6} value={'Count'}>Count</Option>
                                </Select>
                              </div>
                            </div>
                          </Modal>
                        }
                      }}
                    </OData>
                    <ListGroup>
                      {impacts.length ? impacts.map((impact) => {
                        return <ListGroupItem key={impact.impactTypeName} >{impact.impactTypeName}: {impact.impactAmount}({impact.impactUnitMeasure})</ListGroupItem>
                      }) : <ListGroupItem>No Impact added</ListGroupItem>}
                      <ListGroupItem></ListGroupItem>
                    </ListGroup>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="All responses implemented">
                    <Button onClick={this.onResponseOpen} size="sm" color=""
                      style={{ marginLeft: "0px", marginTop: "0px", backgroundColor: DEAGreen }}>
                      Add Response
                    </Button>
                    <Button onClick={this.onResponseUndo} size="sm" color=""
                      style={{ marginLeft: "0px", marginTop: "0px", backgroundColor: DEAGreen }}>
                      Undo last
                    </Button>
                    <OData baseUrl={apiBaseURL + 'TypeMitigations'} query={responseQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          let responses = this.transformDataTree(data.value)
                          const responseUnique = [...new Set(data.value.map(response => response.UnitOfMeasure))]
                          const responseMeasures = responseUnique.filter(item => {
                            if (item !== '' || item !== null) {
                              return item
                            }
                          })
                          data.value.sort((prev, next) => prev.TypeMitigationName.localeCompare(next.TypeMitigationName))
                          return <Modal
                            title="New Response"
                            visible={this.state.responseModalVisible}
                            onOk={this.onResponseAdd}
                            onCancel={this.onResponseClose}
                            destroyOnClose={true}
                          >
                            <div className='row'>
                              <TreeSelect
                                key={new Date().valueOf()}
                                style={{ width: "100%" }}
                                value={this.state.responseTypeNameTemp}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={responses}
                                placeholder="Select Response"
                                onSelect={this.onResponseSelect}
                              >
                              </TreeSelect>
                            </div>
                            <div className="row">
                              <div style={{ paddingTop: 1, className: 'col-sm-1', paddingRight: 10 }}>
                                <br></br>
                                <h6>Enter Amount as number </h6>
                                <InputNumber style={{ height: 35, width: 170 }} onChange={this.onResponseValue}></InputNumber>
                              </div>
                              <div style={{ paddingTop: 1, className: 'col-sm-1', paddingRight: 10, paddingLeft: 10 }}>
                                <br></br>
                                <h6>Select date of response</h6>
                                <DatePicker
                                  style={{ width: 150 }}
                                  onChange={this.onResponseDateSelect} />
                              </div>
                            </div>
                          </Modal>
                        }
                      }}
                    </OData>
                    <ListGroup>
                      {responses.length ? responses.map((response) => {
                        return <ListGroupItem key={response.responseTypeName}>{response.responseTypeName}: {response.responseValue}</ListGroupItem>
                      }) : <ListGroupItem>No Response added</ListGroupItem>}
                      <ListGroupItem></ListGroupItem>
                    </ListGroup>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div
              style={{
                position: 'relative',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }}
            >
              <Button size="sm" onClick={this.onSubmit} color="" style={{ marginRight: 8, backgroundColor: DEAGreen }}>
                Submit
              </Button>
              <Button size="sm" onClick={this.onClose} color="grey" >
                Cancel
              </Button>
            </div>
          </Drawer>
        </div>

      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)
