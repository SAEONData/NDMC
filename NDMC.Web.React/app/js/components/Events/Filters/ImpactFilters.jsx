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
const baseUrl = 'https://localhost:44334/odata/'

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

let _data
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
    let filteredData
    if (_data) { filteredData = _data.filter(x => x.TypeImpactName === value[0]) }
    if (filteredData) { filteredData[0].TypeImpactId ? id = filteredData[0].TypeImpactId : '' }
    if (value[0] !== this.state.value && value !== "Choose your option") {
      this.setState({ value: value[0] })
      loadImpactFilter({ id: id, name: value[0] })
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
                    if (data) {
                      _data = data.value
                      let sorted = data.value.map(x => { return { TypeImpactName: x.TypeImpactName, TypeImpactId: x.TypeImpactId } })
                        .sort((c, n) => c.TypeImpactName.localeCompare(n.TypeImpactName))
                      return sorted.map(item => {
                        return <SelectOption key={item.TypeImpactId}>{item.TypeImpactName}</SelectOption>
                      })
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
export default connect(mapStateToProps, mapDispatchToProps)(impactFilters)