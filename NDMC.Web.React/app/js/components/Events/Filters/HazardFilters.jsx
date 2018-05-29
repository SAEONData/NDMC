'use strict'

//React
import React from 'react'
import { Button, Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//Local
import { apiBaseURL } from '../../../constants/apiBaseURL'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../../constants/action-types'
import ReactTooltip from 'react-tooltip'
import { UILookup } from '../../../constants/ui_config'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'

//AntD Tree
import Tree from 'antd/lib/tree'
import '../../../../css/antd.tree.css' //Overrides default antd.tree css
const TreeNode = Tree.TreeNode

//GraphQl
import { Query, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  let { lookupData: { hazardTree, hazard } } = state
  let { filterData: { hazardFilter } } = state
  return { hazardTree, hazardFilter, hazard }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadData: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_TREE, payload })
    },
    loadHazardFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_FILTER, payload })
    },
    loadHazardTypes: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_HAZARD_TYPE, payload })
    }
  }
}

class HazardFilters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "Choose Hazard Type"
    }
    this.optionClick = this.optionClick.bind(this)
    this.onClick = this.onClick.bind(this)
    this.otherDropdownsClose = this.otherDropdownsClose.bind(this)
    const parsedHash = queryString.parse(location.hash.replace('/events?', ''))
    if (typeof parsedHash.hazard !== 'undefined') {
      let { loadHazardFilter } = this.props
      loadHazardFilter(parsedHash.hazard)
      stripURLParam('hazard=' + parsedHash.hazard)
    }
  }

  otherDropdownsClose() {
    let dropdowns = document.querySelectorAll('.dropdown-content')
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('fadeIn')) {
        dropdowns[i].classList.remove('fadeIn')
      }
    }
  }

  optionClick(value, id) {
    let { loadHazardFilter, hazardTree } = this.props
    if (typeof value === 'undefined') {
      value = 'undefined'
    }
    this.setState({ value})
    loadHazardFilter(id)
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
            <Select>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                {<Query query={GET_HAZARDS}>
                  {({ data, loading, error }) => {
                    if (error) return <p >Error Loading Data From Server </p>
                    if (loading) return <p> wait for it... </p>
                    return data.TypeEvents.map(item => {
                      return <SelectOption triggerOptionClick={(e) => this.optionClick(e, item.typeEventId)} key={item.typeEventId}>{item.typeEventName}</SelectOption>
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