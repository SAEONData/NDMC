'use strict'

import React from 'react'
import { Button, Input } from 'mdbreact'
import { connect } from 'react-redux'
import TextComponent from '../../Shared/TextComponent.jsx'
import TextAreaComponent from '../../Shared/TextAreaComponent.jsx'
import RangeComponent from '../../Shared/RangeComponent.jsx'
import SelectComponent from '../../Shared/SelectComponent.jsx'
import { apiBaseURL } from "../../../constants/apiBaseURL"
import * as ACTION_TYPES from "../../../constants/action-types"

const mapStateToProps = (state, props) => {
    let { eventData: { eventDetails } } = state
    let { lookupData:{ } } = state
    return { eventDetails }
}

class EventDetailsTab extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { eventDetails } = this.props
        return (
            <>
                <br />
                <div className="row">
                    <TextAreaComponent
                        col="col-md-12"
                        label="Hazard Type:"
                        id="txtHazardType"
                        value={eventDetails.HazardType}
                    />
                </div>
                <br />
                <div className="row">
                    <RangeComponent
                        col="col-md-6"
                        id="txtProjectYear"
                        label="Date"
                        inputWidth="75px"
                        valueFrom={eventDetails.StartYear} valueTo={eventDetails.EndYear}
                    />
                </div>
                <br />
                <div className="row">
                    <TextAreaComponent
                        col="col-md-12"
                        label="Region:"
                        id="txtEventRegion"
                        value={eventDetails.Region}
                    />
                </div>
                <br />
                <div className="row">
                    <TextComponent
                        col="col-md-4"
                        label="Impact Type"
                        id="txtImpactType"
                        value={eventDetails.ImpactType}
                    />
                </div>
                <br />
                <div className="row">
                    <TextComponent
                        col="col-md-4"
                        label="Declared Date"
                        id="txtDeclaredDate"
                        value={eventDetails.DeclareDate}
                    />
                </div>
                <br />
            </>
        )
    }
}

export default connect(mapStateToProps)(EventDetailsTab)