'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//MDBReact
import { Button, Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'

//GraphQL
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const queryString = require('query-string')
const mapStateToProps = (state, props) => {
  let { filterData: { impactFilter } } = state
  return { impactFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadImpactFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_IMPACT_FILTER, payload })
    },
  }
}

let _data = { TypeImpacts: [] }
class impactFilters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'Choose your option'
    }
    this.optionClick = this.optionClick.bind(this)
    this.onClick = this.onClick.bind(this)
    this.otherDropdownsClose = this.otherDropdownsClose.bind(this)
  }

  otherDropdownsClose() {
    let dropdowns = document.querySelectorAll('.dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('fadeIn')) {
        dropdowns[i].classList.remove('fadeIn')
      }
    }
  }

  optionClick(value) {
    let { loadImpactFilter } = this.props
    let id = 0
    let filteredData = _data.TypeImpacts.filter(x => x.typeImpactName === value)
    if (filteredData.length > 0) {
      id = filteredData[0].typeImpactId
    }
    if (value !== this.state.value) {
      this.setState({ value })
      loadImpactFilter(id)
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
    document.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  render() {
    const GET_IMPACTS = gql`
    {
      TypeImpacts {
        typeImpactId
        typeImpactName
      }
    }`
    return (
      <>
        <div className='row'>
          <div className='col-md-4'>
            <Select getValue={this.optionClick}>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                {<Query query={GET_IMPACTS}>
                  {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>Error Loading Data From Server...</p>
                    // Sort impacts alphabetically
                    let sorted = data.TypeImpacts.map(x => { return { typeImpactName: x.typeImpactName, typeImpactId: x.typeImpactId } })
                      .sort((c, n) => c.typeImpactName.localeCompare(n.typeImpactName))
                    console.log(sorted)
                    _data = data
                    return sorted.map(item => {
                      return <SelectOption key={item.typeImpactId}>{item.typeImpactName}</SelectOption>
                    })
                  }}
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
export default connect(mapStateToProps, mapDispatchToProps)(impactFilters)