'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import { Button, Fa, ListGroup, ListGroupItem } from 'mdbreact'
import OData from 'react-odata'
import popout from '../../../../images/popout.png'
import popin from '../../../../images/popin.png'
import EventCard from './EventCard.jsx'
import { DEAGreen } from '../../../config/colours.cfg'
import { apiBaseURL } from '../../../config/serviceURLs.cfg'
import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import InputNumber from 'antd/lib/input-number'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import Drawer from 'antd/lib/drawer'
import TreeSelect from 'antd/lib/tree-select'
import Popover from 'antd/lib/popover'
const { Option } = Select
import 'antd/lib/modal/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/input-number/style/index.css'
import '../../../../css/antd.tree-select.css' // Overrides default antd.tree-select css
import '../../../../css/antd.select.css' // Overrides default antd.tree-select css
import '../../../../css/antd.date-picker.css' // Overrides default antd.tree-select css
import 'antd/lib/popover/style/index.css' //Overrides default antd.tree css
import 'antd/lib/drawer/style/index.css'
import 'antd/lib/list/style/index.css'

const _gf = require('../../../globalFunctions')

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter, regionFilter, dateFilter, impactFilter, favoritesFilter } } = state
  let { globalData: { addFormVisible, showListExpandCollapse, showFavoritesOption } } = state
  let { eventData: { events, listScrollPos } } = state
  return {
    hazardFilter, regionFilter, dateFilter, impactFilter, addFormVisible, events, favoritesFilter, listScrollPos,
    showListExpandCollapse, showFavoritesOption
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
    }
  }
}

/**
 * The EventList class for displaying events on the dashboard
 * @class
 */
class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _hazardFilter: 0,
      _regionFilter: 0,
      _impactFilter: 0,
      _dateFilter: {
        startDate: 0,
        endDate: 0
      },
      eventListSize: 25,
      eventsLoading: false,
      _favoritesFilter: false,
      ellipsisMenu: false,
      impactModalVisible: false,
      responseModalVisible: false,
      regionTreeValue: '',
      region: '',
      impacts: [],
      responses: [],
      hazard: '',
      startDate: '',
      endDate: '',
      declaredDate: '',
      impactTypeTemp: '',
      impactTypeNameTemp: '',
      impactAmountTemp: '',
      impactUnitMeasureTemp: '',
      responseTypeTemp: '',
      responseTypeNameTemp: '',
      responseValueTemp: '',
      responseDateTemp: '',
      measureTemp: '',
      showBackToTop: false
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
  }

  componentDidMount() {
    this.getEvents()
    window.addEventListener('scroll', this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentDidUpdate() {
    let { hazardFilter, regionFilter, dateFilter, impactFilter, favoritesFilter } = this.props
    let { _hazardFilter, _regionFilter, _dateFilter, _impactFilter, _favoritesFilter } = this.state
    if (hazardFilter !== _hazardFilter || regionFilter !== _regionFilter || impactFilter !== _impactFilter ||
      dateFilter.startDate !== _dateFilter.startDate || dateFilter.endDate !== _dateFilter.endDate ||
      favoritesFilter !== _favoritesFilter) {
      this.setState({
        _hazardFilter: hazardFilter,
        _regionFilter: regionFilter,
        _impactFilter: impactFilter,
        _dateFilter: dateFilter,
        _favoritesFilter: favoritesFilter
      }, async () => {
        await this.props.resetEvents()
        this.getEvents()
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

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
   * @param {object} events An object containing the array of events to render
   * @returns {Array} An array of cards containing events
   */
  buildList(events) {
    let ar = []
    events.map(i => {
      let startdate = i.StartDate > 0 ? new Date(i.StartDate * 1000) : 'N/A'
      let enddate = i.EndDate > 0 ? new Date(i.EndDate * 1000) : 'N/A'
      if (i.TypeEvent !== null && i.EventRegions[0] !== undefined) {
        ar.push(
          <EventCard
            key={i.EventId}
            eid={i.EventId}
            region={i.EventRegions[0].Region}
            startdate={startdate === 'N/A' ? 'N/A' : startdate.toDateString()}
            enddate={enddate === 'N/A' ? 'N/A' : enddate.toDateString()}
            hazardtype={i.TypeEvent.TypeEventName}
          />
        )
      }
    })
    return ar
  }

  /**
   * Query events from API with any filter's selected
   */
  getEvents() {
    //Set loading true
    this.setState({ eventsLoading: true }, async () => {
      //Get Events
      let { eventListSize, _hazardFilter, _regionFilter, _impactFilter, _dateFilter, _favoritesFilter } = this.state
      let { events } = this.props

      let skip = events.length
      skip = skip > 0 ? skip : 0

      let top = eventListSize - events.length
      top = top > 0 ? top : 0

      let fetchURL = `${apiBaseURL}Events/Extensions.Filter?$skip=${skip}&$top=${top}&$expand=eventRegions($expand=Region),TypeEvent`
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
      });
      const res_1 = await res.json();

      if (res_1 && res_1.value && res_1.value.length > 0) {
        events.push(...res_1.value); //add additional events
        this.props.loadEvents(events)
      }

      this.setState({
        eventsLoading: false //set loading false
      });
    })
  }

  /**
   * Handle closing the input form
   */
  onClose() {
    this.props.toggleAddForm(false)
    this.setState({
      region: '',
      regionTreeValue: '',
      impacts: [],
      responses: [],
      hazard: '',
      startDate: '',
      endDate: '',
      declaredDate: '',
      impactTypeTemp: '',
      impactTypeNameTemp: '',
      impactAmountTemp: '',
      impactUnitMeasureTemp: '',
      responseTypeTemp: '',
      responseTypeNameTemp: '',
      responseValueTemp: '',
      responseDateTemp: '',
      measureTemp: '',
    })
  }

   /**
   * Handle submitting a new event from the input form
   */
  async onSubmit() {
    this.props.toggleAddForm(false)
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
      }],
      DeclaredEvents: [{
        DeclaredEventId: 0,
        DeclaredDate: this.state.declaredDate
      }],
      Mitigations: formattedResponses
    }

    try {
      const res = await fetch(apiBaseURL + 'Events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // "Authorization": "Bearer " + (user === null ? "" : user.access_token)
        },
        body: JSON.stringify(fetchBody)
      })

      if (!res.ok) {
        res = await res.json()
        throw new Error(res.error.message)
      }
    }
    catch (ex) {
      console.error(ex)
    }

    this.setState({
      region: '',
      regionTreeValue: '',
      impacts: [],
      responses: [],
      hazard: '',
      startDate: '',
      endDate: '',
      declaredDate: '',
      impactTypeTemp: '',
      impactTypeNameTemp: '',
      impactAmountTemp: '',
      impactUnitMeasureTemp: '',
      responseTypeTemp: '',
      responseTypeNameTemp: '',
      responseValueTemp: '',
      responseDateTemp: '',
      measureTemp: '',
    })
  }

   /**
   * Handle scrolling to top of page
   */
  backToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Transform a flat array of regions from API into a tree for tree select inputs
   * @param {*} filteredRegions 
   */
  transformDataTree(filteredRegions) {
    let regions = filteredRegions.map(i => {
      return {
        ParentRegionId: i.ParentRegionId, RegionId: i.RegionId, children: [], title: i.RegionName, value: `${i.RegionId}`, key: i.RegionId
      }
    })
    regions.forEach(f => { f.children = regions.filter(g => g.ParentRegionId === f.RegionId) })
    var resultArray = regions.filter(f => f.ParentRegionId == null)
    return resultArray
  }

  /**
   * Handle selecting region in input form
   * @param {string} value The value of the region selected node
   * @param {object} node An object containing all data for selected region node
   */
  onRegionSelect(value, node) {
    this.setState({ region: value, regionTreeValue: node.props.title })
  }

  /**
   * Handle selecting hazard in input form
   * @param {string} value The value of the hazard selected node
   */
  onHazardSelect(value) {
    this.setState({ hazard: value })
  }

  /**
   * Handle selecting a declared date
   * @param {string} dateString The date string of the chosen declared date
   */
  onDeclaredDateSelect(dateString) {
    this.setState({ declaredDate: Date.parse(dateString) / 1000 })
  }

  /**
   * Handle selecting a hazard date range
   * @param {string} dateString The date string of the chosen date range
   */
  onDateRangeSelect( dateString) {
    this.setState({ startDate: Date.parse(dateString[0]) / 1000, endDate: Date.parse(dateString[1]) / 1000 })
  }

  /**
   * Handle opening the impact input dialog
   */
  onImpactOpen() {
    this.setState({ impactModalVisible: true })
  }

  /**
   * Handle closing the impact input dialog
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
   * @param {string} value The impact string of the selected impact node
   * @param {object} next The node object containing details of the selected node
   */
  onImpactSelect(value, next) {
    this.setState({ impactTypeTemp: value, impactTypeNameTemp: next.props.children })
  }

  /**
   * Handle impact amount/value input for a given impact
   * @param {string} value The string value of the amount inputted
   */
  onImpactAmount(value) {
    this.setState({ impactAmountTemp: value })
  }

  /**
   * Handle impact Unit of Measure selecting for a given impact
   * @param {string} value The string of the unit of measure selected
   */
  onImpactUnitMeasure(value) {
    this.setState({ impactUnitMeasureTemp: value })
  }

  /**
   * Handle removing the last impact added in input form
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
   */
  onResponseOpen() {
    this.setState({ responseModalVisible: true })
  }

  /**
   * Handle closing the response input dialog
   */
  onResponseClose() {
    this.setState({ responseModalVisible: false })
  }

  /**
   * Handle adding a new response to the array of responses for the event
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
   * @param {string} value The string value of the selected response
   * @param {object} next The object containing details of the selected node 
   */
  onResponseSelect(value, next) {
    this.setState({ responseTypeTemp: value, responseTypeNameTemp: next.props.children })
  }

  /**
   * Handle inputting value for a response
   * @param {string} value The string value of the inputted response value
   */
  onResponseValue(value) {
    this.setState({ responseValueTemp: value })
  }

  /**
   * Handle removing the last response added in input form
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
   * @param {string} value The string value of the amount inputted
   */
  onMeasureSelect(value) {
    this.setState({
      measureTemp: value
    })
  }

  /**
   * Handle date selection for a response
   * @param {string} dateString The string value of the selected date chosen for the response
   */
  onResponseDateSelect(dateString) {
    this.setState({
      responseDateTemp: Date.parse(dateString) / 1000
    })
  }

  render() {
    const { impacts, responses } = this.state
    let { _favoritesFilter, ellipsisMenu, showBackToTop } = this.state

    const regionQuery = {
      select: ['RegionId', 'RegionName', 'ParentRegionId', 'RegionTypeId'],
      filter: { RegionTypeId: { ne: 5 } }
    }
    const hazardQuery = {
      select: ['TypeEventId', 'TypeEventName']
    }
    const impactsQuery = {
      select: ['TypeImpactId', 'TypeImpactName']
    }
    const responseQuery = {
      select: ['TypeMitigationId', 'TypeMitigationName', 'UnitOfMeasure']
    }

    return (
      <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px", border: "1px solid gainsboro" }}>
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
                //location.hash = (location.hash.includes("events") ? "" : "/events")
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
                  <p style={{ display: "inline-block", margin: "10px 5px 10px 5px" }}>
                    Favorites:
                </p>
                  <Button
                    size="sm"
                    color=""
                    style={{
                      padding: "4px 10px 5px 10px",
                      marginTop: "1px",
                      marginRight: "-1px",
                      width: "40px",
                      backgroundColor: _favoritesFilter ? DEAGreen : "grey"
                    }}
                    onClick={() => {
                      this.props.toggleFavorites(!_favoritesFilter)
                      this.setState({ ellipsisMenu: false })
                    }}
                  >
                    On
                </Button>
                  <Button
                    size="sm"
                    color=""
                    style={{
                      padding: "4px 10px 5px 10px",
                      marginTop: "1px",
                      marginLeft: "-1px",
                      width: "40px",
                      backgroundColor: !_favoritesFilter ? DEAGreen : "grey"
                    }}
                    onClick={() => {
                      this.props.toggleFavorites(!_favoritesFilter)
                      this.setState({ ellipsisMenu: false })
                    }}
                  >
                    Off
                </Button>
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
          {this.buildList(this.props.events)}
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
            title="Create"
            width={720}
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
                <Col span={12}>
                  <Form.Item label="Select the region in which  the event ocurred">
                    <OData baseUrl={apiBaseURL + 'regions'} query={regionQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          let regionTree = this.transformDataTree(data.value)
                          return <TreeSelect
                            key={new Date().valueOf()}
                            style={{ width: "100%" }}
                            value={this.state.regionTreeValue}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={regionTree}
                            placeholder="Region"
                            onSelect={this.onRegionSelect}
                          >
                          </TreeSelect>
                        }
                      }}
                    </OData>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Select the type of event that ocurred">
                    <OData baseUrl={apiBaseURL + 'TypeEvents'} query={hazardQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          data.value.sort((prev, next) => prev.TypeEventName.localeCompare(next.TypeEventName))
                          return <Select
                            showSearch
                            style={{ width: 400 }}
                            placeholder="Hazard"
                            optionFilterProp="children"
                            onChange={this.onHazardSelect}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {data.value.map(item => {
                              return <Option key={item.TypeEventId} value={item.TypeEventId}>{item.TypeEventName}</Option>
                            })}
                          </Select>
                        }
                      }}
                    </OData>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
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
                <Col span={12}>
                  <Form.Item label="If the event has been declared, please provide date of declaration">
                    <DatePicker onChange={this.onDeclaredDateSelect} />
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
                            <div className="row" style={{paddingLeft: 15}}>
                              <div style={{ paddingTop: 1, className: 'col-sm-1', paddingRight: 10 }}>
                                <br></br>
                                <h6>Enter Amount as number </h6>
                                <InputNumber style={{ height: 35, width: 160 }} onChange={this.onImpactAmount}></InputNumber>
                              </div>
                              <div style={{ paddingTop: 1, className: 'col-sm-1', paddingLeft: 10 }}>
                                <br></br>
                                <h6>Enter Unit Of Measure for impact </h6>
                                <Select
                                showSearch
                                style={{width: 200}}
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
                              <Select
                                showSearch
                                style={{ width: 400 }}
                                placeholder="Select a Response"
                                optionFilterProp="children"
                                onChange={this.onResponseSelect}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              >
                                {data.value.map(item => {
                                  return <Option key={item.TypeMitigationId} value={item.TypeMitigationId}>{item.TypeMitigationName}</Option>
                                })}
                              </Select>
                            </div>
                            <div className='row'>
                              <div style={{ paddingTop: 10 }}>
                                <InputNumber style={{ height: 35, width: 120 }} onChange={this.onResponseValue}></InputNumber>
                              </div>
                              <DatePicker
                                style={{ width: 150, paddingTop: 10, paddingLeft: 10 }}
                                onChange={this.onResponseDateSelect} />
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
              <Button size="sm" onClick={this.onSubmit} color="warning" style={{ marginRight: 8 }}>
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