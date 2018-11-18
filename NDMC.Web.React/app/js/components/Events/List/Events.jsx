//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import EventList from './EventList.jsx'
import EventFilters from '../Filters/EventFilters.jsx'

//AntD
import { Button } from 'mdbreact'
import Modal from 'antd/es/Modal'
import Form from 'antd/es/form'
import Col from 'antd/es/Col'
import Row from 'antd/es/Row'
import Input from 'antd/es/Input'
import Select from 'antd/es/Select'
import DatePicker from 'antd/es/date-picker'
import Drawer from 'antd/es/Drawer'
import 'antd/es/modal/style'
import 'antd/es/Form/style'
import 'antd/es/Col/style'
import 'antd/es/Row/style'
import 'antd/es/Input/style'
import 'antd/es/Select/style'
import 'antd/es/date-picker/style'
import 'antd/es/Drawer/style'
const { Option } = Select

//AntD Tree
import TreeSelect from 'antd/lib/tree-select'
import '../../../../css/antd.tree-select.css' //Overrides default antd.tree-select css
import '../../../../css/antd.select.css' //Overrides default antd.select css

//Odata
import OData from 'react-odata'
const baseUrl = 'https://localhost:44334/odata/'

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

let regionData, hazardData

class Events extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      regionTreeValue: undefined,
      region: '',
      impacts: [],
      hazard: '',
      startDate: '',
      endDate: '',
      declaredDate: ''
    }
    this.backToTop = this.backToTop.bind(this)
    this.showDrawer = this.showDrawer.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.onRegionSelect = this.onRegionSelect.bind(this)
    this.onHazardSelect = this.onHazardSelect.bind(this)
    this.onDeclaredDateSelect = this.onDeclaredDateSelect.bind(this)
    this.onDateRangeSelect = this.onDateRangeSelect.bind(this)
  }

  showDrawer() {
    this.setState({
      visible: true
    })
  }

  onClose() {
    this.setState({
      visible: false
    })
  }
  
  onSubmit() {
    this.setState({
      visible: false
    })
    console.log(this.state)
  }

  backToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  handleCreate() {
    this.setState({
      modalVisible: false,
    });
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
    console.log(dateString[0])
    console.log(Date.parse(dateString[0]) + ' to ' + Date.parse(dateString[1]))
    this.setState({ startDate: Date.parse(dateString[0]) / 1000, endDate: Date.parse(dateString[1])/1000 })
  }

  render() {
    const regionQuery = {
      select: ['RegionId', 'RegionName', 'ParentRegionId', 'RegionTypeId'],
      filter: { RegionTypeId: { ne: 5 } }
    }
    const hazardQuery = {
      select: ['TypeEventId', 'TypeEventName']
    }
    return (
      <>
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
              visible={this.state.visible}
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
                    <Form.Item label="DateTime">
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
                      <Input.TextArea rows={4} placeholder="please enter url description" />
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
        <EventFilters />
        <EventList />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events)