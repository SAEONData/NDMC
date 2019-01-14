'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../constants/action-types'
import OData from 'react-odata'
import { apiBaseURL } from '../../../config/serviceURLs.cfg'
import Select from 'antd/lib/select'
import '../../../../css/antd.select.css' //Overrides default antd.select css
const Option = Select.Option;

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter, hazards } } = state
  return { hazardFilter, hazards }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadHazardFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload })
    },
    loadHazards: payload => {
      dispatch({ type: "LOAD_HAZARDS", payload })
    }
  }
}

/**
 * EventResponseTab Class for dealing with hazard filter selection and renderings
 * @class
 */
class HazardFilters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "Select..."
    }
    this.optionClick = this.optionClick.bind(this)
  }

  componentDidUpdate() {
    let { hazardFilter, hazards } = this.props
    let searchHazards = hazards.filter(h => h.TypeEventId == hazardFilter)
    let hazardName = "Select..."
    if (searchHazards.length > 0) {
      hazardName = searchHazards[0].TypeEventName
    }
    if (hazardName !== this.state.value) {
      this.setState({ value: hazardName })
    }
  }

  /**
   * Handle selecting a hazard from list
   * @param {string} value The string value of the selected node
   */
  optionClick(value) {
    let { loadHazardFilter, hazards } = this.props
    let id = 0
    let filteredData
    if (hazards) {
      filteredData = hazards.filter(x => x.TypeEventName === value)
    }
    if (filteredData) {
      filteredData[0].TypeEventId ? id = filteredData[0].TypeEventId : ''
    }
    if (value[0] !== this.state.value && value !== "Select...") {
      this.setState({ value: value })
      loadHazardFilter(id)
    }
  }
  /**
   * Set render options
   * @param {object} data The data object
   */
  renderOptions(data) {
    let options = []
    data.value.sort((a, b) => (a.TypeEventName > b.TypeEventName) ? 1 : ((b.TypeEventName > a.TypeEventName) ? -1 : 0))
    data.value.map(item => {
      options.push(
        <Option key={item.TypeEventId} value={item.TypeEventName}>
          {item.TypeEventName}
        </Option>
      )
    })
    return options
  }

  render() {
    const hazardsQuery = {
      select: ['TypeEventId', 'TypeEventName']
    }
    return (
      <>
        <OData baseUrl={apiBaseURL + 'TypeEvents'} query={hazardsQuery}>
          {({ loading, error, data }) => {
            if (loading) {
              return <div>Loading...</div>
            }
            if (error) {
              return <div>Error Loading Data From Server</div>
            }
            if (data && data.value) {
              //Dispatch data to store
              setTimeout(() => {
                if(!_.isEqual(data.value, this.props.hazards)){
                  this.props.loadHazards(data.value)
                }
              }, 100)
              return (
                <Select
                  style={{ width: "100%" }}
                  onChange={this.optionClick}
                  value={this.state.value}
                  dropdownMatchSelectWidth={false}
                >
                  {this.renderOptions(data)}
                </Select>
              )
            }
          }}
        </OData>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HazardFilters)