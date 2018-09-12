'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//MDBReact
import { Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//Local
import * as ACTION_TYPES from '../../../constants/action-types'

//Odata
import OData from 'react-odata'
const baseUrl = 'http://app01.saeon.ac.za/ndmcapi/odata/'

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
      loadImpactFilter({ id: id, name: value })
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
    const impactsQuery = {
      select: ['TypeImpactId', 'TypeImpactName']
    }
    return (
      <>
        <div className='row'>
          <div className='col-md-4'>
            <Select getValue={this.optionClick}>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                <OData baseUrl={baseUrl + 'TypeImpacts'} query={impactsQuery}>
                  {({ loading, error, data }) => {
                    if (loading) { return <div>Loading...</div> }
                    if (error) { return <div>Error Loading Data From Server</div> }
                    // Sort impacts alphabetically
                    let sorted = data.TypeImpacts.map(x => { return { TypeImpactName: x.TypeImpactName, TypeImpactId: x.TypeImpactId } })
                      .sort((c, n) => c.TypeImpactName.localeCompare(n.TypeImpactName))
                    return sorted.map(item => {
                      return <SelectOption key={item.TypeImpactId}>{item.TypeImpactName}</SelectOption>
                    })
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
export default connect(mapStateToProps, mapDispatchToProps)(impactFilters)