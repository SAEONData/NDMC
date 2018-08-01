'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'

//MDBReact
import { Button, Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//GraphQl
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

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
let _data = { TypeEvents: [] }

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
    let { loadHazardFilter } = this.props
    let id = 0
    let filteredData = _data.TypeEvents.filter(x => x.typeEventName === value)
    if (filteredData.length > 0) {
      id = filteredData[0].typeEventId
    }
    if (value !== this.state.value) {
      this.setState({ value })
      loadHazardFilter({id: id, name: value})
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
    const GET_HAZARDS = gql`
    {
      TypeEvents {
        typeEventName
        typeEventId
      }
    }`
    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <Select getValue={this.optionClick}>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                {<Query query={GET_HAZARDS}>
                  {({ data, loading, error }) => {
                    if (error) return <p>Error Loading Data From Server</p>
                    if (loading) return <p>Loading...</p>
                    //Keep data for later
                    _data = data
                    return data.TypeEvents.map(item => {
                      return <SelectOption key={item.typeEventId}>{item.typeEventName}</SelectOption>
                    })
                  }
                  }
                </Query>
                }
              </SelectOptions>
            </Select>
          </div>
        </div>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HazardFilters)