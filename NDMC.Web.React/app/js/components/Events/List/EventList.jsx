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
import { Button, Fa } from 'mdbreact'

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
import 'antd/lib/drawer/style/index.css'
import 'antd/lib/list/style/index.css'
import 'antd/lib/popover/style/index.css' //Overrides default antd.tree css

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter, regionFilter, dateFilter, impactFilter } } = state
  let { globalData: { addFormVisible } } = state
  return {
    hazardFilter, regionFilter, dateFilter, impactFilter, addFormVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddForm: payload => {
      dispatch({ type: "TOGGLE_ADD_FORM", payload })
    }
  }
}

let regionData, hazardData

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hazardFilter: { id: 0, name: '' },
      regionFilter: { id: 0, name: '' },
      impactFilter: { id: 0, name: '' },
      dateFilter: {
        startDate: 0,
        endDate: 0
      },
      data: {},
      done: false,
      eventListSize: 10,
      bottomReached: false,
      loadedEvents: 0,
      eventsLoading: false,
      favoritesFilter: false,
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
      impactAmountTemp: ''
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
  }

  /*
  Checks for if the user scrolls to the bottom of the page and if they do change state
  to reflect this and increase the amount of events that can be displayed on the page
  */
  handleScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    if (Math.ceil(windowBottom) >= docHeight && !this.state.eventsLoading) {
      if (this.state.loadedEvents > 9) {
        this.setState({
          bottomReached: true,
          eventListSize: this.state.eventListSize < 50 ? this.state.eventListSize + 10 : this.state.eventListSize
        })
      }
    }
  }
  componentWillMount() {
    //this.getEvents()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  /*
  Create a list of event cards to be used to populate the events page and parse in the relevant information for each event
  */
  buildList(events) {
    if (events === undefined) return "No data"
    let ar = []
    events.forEach(i => {
      let startdate = new Date(i.StartDate * 1000)
      let enddate = new Date(i.EndDate * 1000)
      if (i.TypeEvent !== null && /*i.StartDate &&*/ i.EventRegions[0] !== undefined) {
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
    this.state.loadedEvents = ar.length
    this.state.done = false
    return ar
  }

  getEvents() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter } = this.props
    return fetch(`https://localhost:44334/odata/Events/Extensions.Filter?$top=${this.state.eventListSize}&$expand=eventRegions($expand=Region),TypeEvent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // 'Authorization': 'Bearer' + (user === null ? '': '')
        },
        body: JSON.stringify({
          region: regionFilter.id,
          hazard: hazardFilter.id,
          impact: impactFilter.id,
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate
        })
      }).then((res) => res.json()).then((res) => { this.state.data = res.value; this.setState({ done: true }) })
  }

  onClose() {
    this.props.toggleAddForm(false)
  }

  onSubmit() {
    this.props.toggleAddForm(false)
    console.log(this.state)
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
    this.setState({ impactModalVisible: false })
  }

  onImpactAdd() {
    this.setState({ impactModalVisible: false })
    let newimpact = {
      impactType: this.state.impactTypeTemp,
      impactTypeName: this.state.impactTypeNameTemp,
      impactAmount: this.state.impactAmountTemp
    }
    this.setState(prev => ({
      impacts: [...prev.impacts, newimpact]
    }))
  }

  onImpactSelect(value, next) {
    console.log(next.props.children)
    this.setState({ impactTypeTemp: value, impactTypeNameTemp: next.props.children })
  }

  onImpactAmount(value) {
    console.log(value)
    this.setState({ impactAmountTemp: value })
  }

  render() {

    let { favoritesFilter, ellipsisMenu } = this.state
    this.state.done ? '' : this.getEvents()

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
              //this.props.setScrollPos(0)
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
                    backgroundColor: favoritesFilter ? DEAGreen : "grey"
                  }}
                // onClick={() => {
                //   this.props.toggleFavorites(!favoritesFilter)
                //   this.setState({ ellipsisMenu: false })
                // }}
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
                    backgroundColor: !favoritesFilter ? DEAGreen : "grey"
                  }}
                // onClick={() => {
                //   this.props.toggleFavorites(!favoritesFilter)
                //   this.setState({ ellipsisMenu: false })
                // }}
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
          {this.state.done ? this.buildList(this.state.data) : <div>{"Loading"}</div>}
        </div>


        {/* ### ADD FORM ### */}

        <div style={{ position: 'fixed', right: '14%', bottom: '10px', zIndex: '99' }}>
          <Button color='secondary' className='btn-sm' onClick={this.showDrawer} >
            <i className='fa fa-plus' aria-hidden='true' />
            &nbsp;&nbsp;
            Add Event
          </Button>
          <Button color='secondary' className='btn-sm' onClick={this.backToTop} >
            <i className='fa fa-arrow-circle-up' aria-hidden='true' />
            &nbsp;&nbsp;
            Back to top
          </Button>
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
                            regionData = data.value
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
                            hazardData = data.value
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
                      <Button onClick={this.onImpactOpen} size="sm">Add Impact</Button>
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
                      <List
                        header={<div>Impacts Recorded</div>}
                        bordered
                        dataSource={this.state.impacts.map((impact) => {
                          return `${impact.impactTypeName}: ${impact.impactAmount}`
                        })}
                        renderItem={item => (<List.Item>{item}</List.Item>)} >
                      </List>
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
                <Button
                  style={{
                    marginRight: 8,
                  }}
                  onClick={this.onClose}
                >
                  Cancel
                </Button>
                <Button onClick={this.onSubmit} type="primary">Submit</Button>
              </div>
            </Drawer>
          </div>
        </div>



      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)