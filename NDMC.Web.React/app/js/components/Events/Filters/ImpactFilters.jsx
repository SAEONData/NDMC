'use strict'

import React from 'react'
import { Button, Select, SelectInput, SelectOptions, SelectOption } from 'mdbreact'
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

  optionClick(value) {
    let { loadImpactFilter, impacts } = this.props
    if (typeof value === 'undefined') {
      value = 'undefined'
    }
    this.setState({ value: value })
    let id = impacts.filter(function(impact){return impact.TypeEventName === value})
    loadImpactFilter(id[0].TypeEventId)
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
    let { loadData } = this.props
    document.addEventListener('click', this.onClick);

    fetch(apiBaseURL + 'api/events/impacttypes/', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        loadData(res)
      })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  buildImpactOptions(data) {
    return data.map((item,index) => {
      if (item.TypeEventName) {
        return <SelectOption triggerOptionClick={this.optionClick} key={index}>{item.TypeEventName}</SelectOption>
      }
      return
    })
  }

  render() {
    let { impact, impacts } = this.props
    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <Select>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                {this.buildImpactOptions(impacts)}
              </SelectOptions>
            </Select>
          </div>
        </div>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(impactFilters)