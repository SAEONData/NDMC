'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'

//MDBReact
// import { Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//Odata
import OData from 'react-odata'
import { apiBaseURL } from '../../../config/serviceURLs.cfg'

//AntD Tree-Select
import Select from 'antd/lib/select'
import '../../../../css/antd.select.css' //Overrides default antd.select css
const Option = Select.Option;

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter } } = state
  return { hazardFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadHazardFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload })
    }
  }
}

let _data

class HazardFilters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: "Select...",
      data: []
    }

    this.optionClick = this.optionClick.bind(this)
  }

  componentDidUpdate(){

    let { hazardFilter } = this.props
    if(hazardFilter.name === "" || hazardFilter === 0) hazardFilter = { id: 0, name: "Select..." }

    if(hazardFilter.name !== this.state.value){
      this.setState({ value: hazardFilter.name})
    }
  }

  optionClick(value) {

    let { loadHazardFilter } = this.props
    let id = 0

    let filteredData

    if (_data) { 
      filteredData = _data.filter(x => x.TypeEventName === value) 
    }

    if (filteredData) { 
      filteredData[0].TypeEventId ? id = filteredData[0].TypeEventId : '' 
    }

    if (value[0] !== this.state.value && value !== "Select...") {
      this.setState({ value: value })
      loadHazardFilter({ id: id, name: value })
    }
  }

  renderOptions(data){
    let options = []

    //Sort
    data.value.sort((a,b) => (a.TypeEventName > b.TypeEventName) ? 1 : ((b.TypeEventName > a.TypeEventName) ? -1 : 0))

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
              _data = data.value
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