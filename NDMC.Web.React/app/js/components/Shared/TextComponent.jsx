'use strict'

import React from 'react'
import { connect } from 'react-redux'
import { UILookup } from "../../constants/ui_config.js"

const mapStateToProps = (state, props) => {
    let { globalData: { editMode } } = state
    return { editMode }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setValue: (key, payload) => {
            dispatch({ type: key, payload })
        }
    }
}

class TextComponent extends React.Component {

    constructor(props) {
        super(props);

        let { value } = props
        this.state = { ...this.state, value }
    }

    fixNullOrUndefinedValue(value) {

        if (typeof value === 'undefined' || value === null) {
            value = ""
        }

        return value
    }

    getLabelFontColour(uiconf){
        if (typeof uiconf.required != 'undefined' && uiconf.required === true) {
            return "red"
        }
        else {
            return "black"
        }
    }

    getFontColour() {
        if (this.props.editMode) {
            return "steelblue"
        }
        else {
            return "black"
        }
    }

    valueChange(event) {

        let { setValue, setValueKey, parentId, editMode } = this.props

        if (typeof setValueKey !== 'undefined') {
            setValue(setValueKey, { value: event.target.value, id: parentId, state: editMode === true ? "modified" : "original" })
        }
    }

    render() {

        let { col, label, id, editMode, value } = this.props
        value = this.fixNullOrUndefinedValue(value)

        let uiconf = UILookup(id, label)

        return (
            <div className={col}>
                <label data-tip={uiconf.tooltip} style={{ fontWeight: "bold", color: this.getLabelFontColour(uiconf) }}>{uiconf.label}</label>
                <input
                    id={id} type="text" readOnly={!editMode} value={value} onChange={this.valueChange.bind(this)}
                    style={{ color: this.getFontColour() }}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextComponent)