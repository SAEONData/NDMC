'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'

//MDBReact
import { Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//Odata
import OData from 'react-odata'
const baseUrl = 'https://localhost:44334/odata/'

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
      value: "Choose your option",
      data: []
    }
    this.optionClick = this.optionClick.bind(this)
    this.onClick = this.onClick.bind(this)
    this.otherDropdownsClose = this.otherDropdownsClose.bind(this)

  }

  otherDropdownsClose() {
    let dropdowns = document.querySelectorAll('.dropdown-content')
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('fadeIn')) {
        dropdowns[i].classList.remove('fadeIn')
      }
    }
  }

  optionClick(value) {
    //console.log(_data)
    let { loadHazardFilter } = this.props
    let id = 0
    let filteredData
    if (_data) { filteredData = _data.filter(x => x.TypeEventName === value[0]) }
    if (filteredData) { id = filteredData[0].TypeEventId }
    if (value[0] !== this.state.value && value !== "Choose your option") {
      this.setState({ value: value[0] })
      loadHazardFilter({ id: id, name: value[0] })
    }
  }

  onClick(e) {
    if (e.target.dataset.multiple === 'true') {
      return
    }
    if (e.target.classList.contains('select-dropdown')) {
      this.otherDropdownsClose()
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.classList.add('fadeIn')
      }
    } else {
      this.otherDropdownsClose()
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick)
  }

  render() {
    const hazardsQuery = {
      select: ['TypeEventId', 'TypeEventName']
    }
    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <Select getValue={this.optionClick}>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                <OData baseUrl={baseUrl + 'TypeEvents'} query={hazardsQuery}>
                  {({ loading, error, data }) => {
                    if (loading) { return <div>Loading...</div> }
                    if (error) { return <div>Error Loading Data From Server</div> }
                    if (data) {
                      if (data.value) {
                        _data = data.value
                        return data.value.map(item => {
                          return <SelectOption key={item.TypeEventId}>{item.TypeEventName}</SelectOption>
                        })
                      }
                    }
                  }}
                </OData>
              </SelectOptions>
            </Select>
          </div>
        </div>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HazardFilters)