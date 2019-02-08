'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import { UILookup } from '../../config/ui_config.js'
import { Input } from 'mdbreact'

const mapStateToProps = (state, props) => {
  let { globalData: { editMode } } = state
  return { editMode }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setValueFrom: (key, payload) => {
      dispatch({ type: key, payload })
    },
    setValueTo: (key, payload) => {
      dispatch({ type: key, payload })
    }
  }
}

/**
 * RangeComponent Class for displaying a range component
 * @class
 */
class RangeComponent extends React.Component {
  constructor (props) {
    super(props)
    this.getFontColour = this.getFontColour.bind(this)
  }

  /**
   * Get prop prefix
   */
  getPrefix () {
    if (typeof this.props.prefix !== 'undefined') {
      return <label>{this.props.prefix}&nbsp;</label>
    }
  }

  /**
  * Get prop suffix
  */
  getSuffix () {
    if (typeof this.props.suffix !== 'undefined') {
      return <label>&nbsp;{this.props.suffix}</label>
    }
  }

  /**
   * Get props Id
   * @param {string} key props key
   */
  getId (key) {
    if (key === 'from') {
      return this.props.id + 'From'
    }
    else {
      return this.props.id + 'To'
    }
  }

  /**
   * Get props label
   */
  getLabel () {
    let { label, id, size, labelStyle } = this.props
    let uiconf = UILookup(id, label)

    if (!labelStyle) labelStyle = {}

    return (
      <div>
        <label data-tip={uiconf.tooltip} style={{ fontSize: size, fontWeight: 'bold', color: this.getLabelFontColour(uiconf), ...labelStyle }}>{uiconf.label}&nbsp;</label>
      </div>
    )
  }

  /**
   * Get props label font color
   */
  getLabelFontColour (uiconf) {
    if (typeof uiconf.required != 'undefined' && uiconf.required === true) {
      return 'red'
    }
    else {
      return 'black'
    }
  }

  /**
   * Get props font color
   */
  getFontColour () {
    if (this.props.editMode) {
      return 'steelblue'
    }
    else {
      return 'black'
    }
  }

  /**
   * Get value from event change
   * @param {object} event Event object
   */
  valueFromChange (event) {

    let { setValueFromKey, setValueFrom, parentId, editMode } = this.props

    if (typeof setValueFromKey !== 'undefined' && !isNaN(event.target.value)) {
      setValueFrom(setValueFromKey, { value: event.target.value, id: parentId, state: editMode === true ? 'modified' : 'original' })
    }
  }

  /**
  * Get value to event change
  * @param {object} event Event object
  */
  valueToChange (event) {
    let { setValueToKey, setValueTo, parentId, editMode } = this.props

    if (typeof setValueToKey !== 'undefined' && !isNaN(event.target.value)) {
      setValueTo(setValueToKey, { value: event.target.value, id: parentId, state: editMode === true ? 'modified' : 'original' })
    }
  }

  /**
   * Check for null or undefined value
   * @param {*} value Value to be checked
   * @returns {string} Empty string if value is undefined
   */
  fixNullOrUndefinedValue (value) {
    if (typeof value === 'undefined' || value === null) {
      value = ''
    }

    return value
  }

  render () {
    let { label, inputWidth, col, valueFrom, valueTo, editMode } = this.props
    valueFrom = this.fixNullOrUndefinedValue(valueFrom)
    valueTo = this.fixNullOrUndefinedValue(valueTo)

    return (
      <div className={col}>
        {this.getLabel()}
        <div className="row" style={{ marginTop: "8px" }}>
          <span style={{ width: "16px" }} />
          {this.getPrefix()}
          <Input size="sm" id={this.getId("from")} readOnly={!editMode}
            style={{ marginTop: "-31px", marginBottom: "-25px", color: this.getFontColour(), width: inputWidth, border: "1px solid lightgrey", borderRadius: "5px", padding: "5px" }}
            value={this.fixNullOrUndefinedValue(valueFrom)}
            onChange={this.valueFromChange.bind(this)} />
          {this.getSuffix()}
          <h6 style={{ marginTop: "5px", marginLeft: "10px", marginRight: "10px" }}> - </h6>
          {this.getPrefix()}
          <Input size="sm" id={this.getId("to")} readOnly={!editMode}
            style={{ marginTop: "-31px", marginBottom: "-25px", color: this.getFontColour(), width: inputWidth, border: "1px solid lightgrey", borderRadius: "5px", padding: "5px" }}
            value={this.fixNullOrUndefinedValue(valueTo)}
            onChange={this.valueToChange.bind(this)} />
          {this.getSuffix()}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RangeComponent)
