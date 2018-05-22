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
    let dropdowns = document.querySelectorAll('.dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('fadeIn')) {
        dropdowns[i].classList.remove('fadeIn');
      }
    }
  }

  optionClick(value) {
    let { loadHazardFilter, hazardTree } = this.props
    if (typeof value === 'undefined') {
      value = 'undefined'
    }
    this.setState({ value: value })
    let id = hazardTree.filter(function(hazard){return hazard.TypeEventName === value})
    loadHazardFilter(id[0].TypeEventId)
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

    fetch(apiBaseURL + 'api/events/eventtypes/', {
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

  buildHazardOptions(data) {
    return data.map((item) => {
      if (item.TypeEventName) {
        return <SelectOption triggerOptionClick={this.optionClick}>{item.TypeEventName}</SelectOption>
      }
      return
    })
  }

  render() {
    let { hazard, hazardTree, hazardFilter } = this.props
    return (
      <>
        <div className="row">
          <div className="col-md-4">
            <Select>
              <SelectInput value={this.state.value}></SelectInput>
              <SelectOptions>
                {this.buildHazardOptions(hazardTree)}
              </SelectOptions>
            </Select>
          </div>
        </div>
      </>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HazardFilters)