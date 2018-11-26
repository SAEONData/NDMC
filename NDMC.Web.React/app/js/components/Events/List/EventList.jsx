'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'
import popout from '../../../../images/popout.png'
import popin from '../../../../images/popin.png'

//Local
import EventCard from './EventCard.jsx'
import { DEAGreen } from '../../../config/colours.cfg'

//Odata
import OData from 'react-odata'
const baseUrl = 'https://localhost:44334/odata/' //'http://app01.saeon.ac.za/ndmcapi/odata/'

//MDBReact
import { Button, Fa, ListGroup, ListGroupItem } from 'mdbreact'

//AntD
//Inputs
import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import InputNumber from 'antd/lib/input-number'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import Drawer from 'antd/lib/drawer'
import List from 'antd/lib/list'
import TreeSelect from 'antd/lib/tree-select'
import Popover from 'antd/lib/popover'
const { Option } = Select
//Styles
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
  let { globalData: { addFormVisible } } = state
  let { eventData: { events, listScrollPos } } = state
  return {
    hazardFilter, regionFilter, dateFilter, impactFilter, addFormVisible, events, favoritesFilter, listScrollPos
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

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _hazardFilter: { id: 0, name: '' },
      _regionFilter: { id: 0, name: '' },
      _impactFilter: { id: 0, name: '' },
      _dateFilter: {
        startDate: 0,
        endDate: 0
      },
      eventListSize: 25,
      eventsLoading: false,
      _favoritesFilter: false,
      ellipsisMenu: false,
      impactModalVisible: false,
      regionTreeValue: undefined,
      region: '',
      impacts: [],
      hazard: '',
      startDate: '',
      endDate: '',
      declaredDate: '',
      impactTypeTemp: '',
      impactTypeNameTemp: '',
      impactAmountTemp: '',
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
  }

  componentDidMount() {
    this.getEvents()
    window.addEventListener('scroll', this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentDidUpdate() {
    let { hazardFilter, regionFilter, dateFilter, impactFilter, favoritesFilter } = this.props
    let { _hazardFilter, _regionFilter, _dateFilter, _impactFilter, _favoritesFilter } = this.state
    if (hazardFilter.id !== _hazardFilter.id || regionFilter.id !== _regionFilter.id || impactFilter.id !== _impactFilter.id ||
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

  /*
  Create a list of event cards to be used to populate the events page and parse in the relevant information for each event
  */
  buildList(events) {
    let ar = []
    events.map(i => {
      let startdate = new Date(i.StartDate * 1000)
      let enddate = new Date(i.EndDate * 1000)
      if (i.TypeEvent !== null && i.EventRegions[0] !== undefined) {
        ar.push(
          <EventCard
            key={i.EventId}
            eid={i.EventId}
            region={i.EventRegions[0].Region}
            startdate={startdate.toDateString()}
            enddate={enddate.toDateString()}
            hazardtype={i.TypeEvent.TypeEventName}
          />
        )
      }
    })
    return ar
  }

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

      let fetchURL = `https://localhost:44334/odata/Events/Extensions.Filter?$skip=${skip}&$top=${top}&$expand=eventRegions($expand=Region),TypeEvent`
      let postBody = {
        region: _regionFilter.id,
        hazard: _hazardFilter.id,
        impact: _impactFilter.id,
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

  onClose() {
    this.props.toggleAddForm(false)
    this.setState({
      region: '',
      impacts: [],
      hazard: '',
      startDate: '',
      endDate: '',
      declaredDate: '',
      impactTypeTemp: '',
      impactTypeNameTemp: '',
      impactAmountTemp: '',
    })
  }

  onSubmit() {
    this.props.toggleAddForm(false)
  }

  backToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

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

  onRegionSelect(value, node) {
    this.setState({ region: value, regionTreeValue: node.props.title })
  }

  onHazardSelect(value) {
    this.setState({ hazard: value })
  }

  onDeclaredDateSelect(date, dateString) {
    this.setState({ declaredDate: Date.parse(dateString) / 1000 })
  }

  onDateRangeSelect(date, dateString) {
    this.setState({ startDate: Date.parse(dateString[0]) / 1000, endDate: Date.parse(dateString[1]) / 1000 })
  }

  onImpactOpen() {
    this.setState({ impactModalVisible: true })
  }

  onImpactClose() {
    if (!isNaN(this.state.impactAmountTemp && this.state.impactAmountTemp)) {
      console.log(this.state.impactAmountTemp)
      this.setState({ impactModalVisible: false })
      this.setState({
        impactTypeTemp: '',
        impactTypeNameTemp: '',
        impactAmountTemp: '',
      })
    }
  }

  onImpactAdd() {
    this.setState({
      impactModalVisible: false,
      impactTypeTemp: '',
      impactTypeNameTemp: '',
      impactAmountTemp: '',
    })
    let newimpact = {
      impactType: this.state.impactTypeTemp,
      impactTypeName: this.state.impactTypeNameTemp,
      impactAmount: this.state.impactAmountTemp
    }
    if(this.state.impacts.length > 0) {
      this.setState(prev => ({
        impacts: [...prev.impacts, newimpact]
      }))
    }
    else {
      this.setState({
        impacts: [newimpact]
      })
    }
  }

  onImpactSelect(value, next) {
    this.setState({ impactTypeTemp: value, impactTypeNameTemp: next.props.children })
  }

  onImpactAmount(value) {
    this.setState({ impactAmountTemp: value })
  }
  onImpactUndo() {
    console.log(this.state.impacts)
    let arr = this.state.impacts
    arr.pop()
    console.log(this.state.impacts)
      this.setState({
        impacts: arr
      })

  }

  render() {
    const { impacts } = this.state
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

    return (
      <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px", border: "1px solid gainsboro" }}>
        <h4 style={{ margin: "5px 5px 5px 19px", display: "inline-block" }}>
          <b>Events</b>
        </h4>
        <div style={{ float: "right" }}>
          <img
            src={location.hash.includes("events") ? popin : popout}
            style={{
              width: "25px",
              margin: "-4px 5px 0px 0px",
              cursor: "pointer"
            }}
            onClick={() => {
              this.props.setScrollPos(0)
              location.hash = (location.hash.includes("events") ? "" : "/events")
            }}
          />
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
            style={{
              height: 'calc(100% - 55px)',
              overflow: 'auto',
              paddingBottom: 53,
            }}
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Region">
                    <OData baseUrl={baseUrl + 'regions'} query={regionQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          let regionTree = this.transformDataTree(data.value)
                          //regionData = data.value
                          return <TreeSelect
                            style={{ width: "100%" }}
                            value={this.state.regionTreeValue}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={regionTree}
                            placeholder="Please select a region"
                            onSelect={this.onRegionSelect}
                          >
                          </TreeSelect>
                        }
                      }}
                    </OData>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Hazard">
                    <OData baseUrl={baseUrl + 'TypeEvents'} query={hazardQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          //hazardData = data.value
                          return <Select
                            showSearch
                            style={{ width: 400 }}
                            placeholder="Select a hazard"
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
                  <Form.Item label="Hazard Date Range">
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
                  <Form.Item label="Date Declared">
                    <DatePicker onChange={this.onDeclaredDateSelect} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Impacts">
                    <Button onClick={this.onImpactOpen} size="sm" color=""
                      style={{ marginLeft: "0px", marginTop: "0px", backgroundColor: DEAGreen }}>
                      Add Impact
                    </Button>
                    <Button onClick={this.onImpactUndo} size="sm" color=""
                      style={{ marginLeft: "0px", marginTop: "0px", backgroundColor: DEAGreen }}>
                      Undo last
                    </Button>
                    <OData baseUrl={baseUrl + 'TypeImpacts'} query={impactsQuery}>
                      {({ loading, error, data }) => {
                        if (loading) { return <div>Loading...</div> }
                        if (error) { return <div>Error Loading Data From Server</div> }
                        if (data) {
                          return <Modal
                            title="New Impact"
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
                            <InputNumber onChange={this.onImpactAmount}></InputNumber>
                          </Modal>
                        }
                      }}
                    </OData>
                    <ListGroup>
                      {this.state.impacts.length? impacts.map((impact) => {
                        return <ListGroupItem>{impact.impactTypeName}: {impact.impactAmount}</ListGroupItem>
                      }) : <ListGroupItem>No Impact selected</ListGroupItem>}
                      <ListGroupItem></ListGroupItem>
                    </ListGroup>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div
              style={{
                position: 'absolute',
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