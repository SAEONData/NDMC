'use strict'

import React from 'react'
import { Button, Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'

//React
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'

//Local Imports
import { apiBaseURL } from '../../../constants/apiBaseURL'
import * as ACTION_TYPES from '../../../constants/action-types'
import { UILookup } from '../../../constants/ui_config'
import { stripURLParam, GetUID } from '../../../globalFunctions.js'

//GraphQL
import { graphql } from 'graphql'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

//AntD Tree
import Tree from 'antd/lib/tree'
import '../../../../css/antd.tree.css'

const TreeNode = Tree.TreeNode

const queryString = require('query-string')
const mapStateToProps = (state, props) => {
  let { lookupData: { impacts, impact } } = state
  let { filterData: { impactFilter } } = state
  return { impact, impacts, impactFilter }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadImpacts: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_IMPACTS, payload })
    },
    loadImpactFilter: payload => {
      dispatch({ type: ACTION_TYPES.LOAD_IMPACT_FILTER, payload })
    },
  }
}

class impactFilters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "Choose Impact Type"
    }
    this.optionClick = this.optionClick.bind(this)
    this.onClick = this.onClick.bind(this)
    this.otherDropdownsClose = this.otherDropdownsClose.bind(this)
    const parsedHash = queryString.parse(location.hash.replace('/events?', ''))
    if (typeof parsedHash.impacts !== 'undefined') {
      let { loadImpactFilter } = this.props
      loadImpactFilter(parsedHash.impact)
      stripURLParam('impact=' + parsedHash.impact)
    }
  }

  otherDropdownsClose() {
    let dropdowns = document.querySelectorAll('.dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('fadeIn')) {
        dropdowns[i].classList.remove('fadeIn');
      }
    }
  }

  optionClick(value, id) {
    let { loadImpactFilter, impacts } = this.props
    if (typeof value === 'undefined') {
      value = 'undefined'
    }
    this.setState({ value })
    loadImpactFilter(id)
  }

  onClick(e) {

    if (e.target.dataset.multiple === 'true') {
      return;
    }
    if (e.target.classList.contains('select-dropdown')) {
      this.otherDropdownsClose();
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.classList.add('fadeIn');
      }
    } else {
      this.otherDropdownsClose();
    }
  }

  componentDidMount() {
    let { loadImpacts } = this.props
    document.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  render() {
    let { impact, impacts } = this.props
    const query = gql`
    {
      TypeImpacts {
        typeImpactId
        typeImpactName
      }
    }`
    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <Select>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                {<Query query={query}>
                  {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>Error Loading Data From Server...</p>
                    return data.TypeImpacts.map(item => {
                      return <SelectOption triggerOptionClick={(e) => this.optionClick(e, item.typeImpactId)} key={item.typeImpactId}>{item.typeImpactName}</SelectOption>
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
export default connect(mapStateToProps, mapDispatchToProps)(impactFilters)