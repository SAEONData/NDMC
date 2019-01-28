'use strict'
/**
 * @ignore
 * Imports
 */
import React from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableHead } from 'mdbreact'
import OData from 'react-odata'
import { apiBaseURL } from '../../../config/serviceURLs.js'

const mapStateToProps = (state, props) => {
  return {}
}

/**
 * EventResponseTab Class for response details tab of individual events
 * @class
 */
class EventResponseTab extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eventData: {}
    }
  }

  render () {
    const { eventId } = this.props
    const mitigationQuery = {
      filter: {
        eventId: parseInt(eventId)
      },
      expand: ['TypeMitigation']
    }
    const formatter = new Intl.NumberFormat('en-Za', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    })

    let emergencyResponses = []
    let mitigationResponses = []
    let adaptationResponses = []
    let rehabResponses = []
    return (
      <>
        <div style={{
          backgroundColor: "white",
          borderBottom: "1px solid silver",
          borderLeft: "1px solid silver",
          borderRight: "1px solid silver",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          padding: "10px",
          marginTop: "-10px"
        }}>
          <OData baseUrl={apiBaseURL + 'Mitigations'} query={mitigationQuery}>
            {({ loading, error, data }) => {
              if (loading) { return <div>Loading...</div> }
              if (error) { return <div>Error Loading Data From Server</div> }
              if (data && data.value) {
                data.value.map(curr => {
                  if (curr.TypeMitigation.ParentTypeMitigationId === 12 || curr.TypeMitigationId === 12) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    rehabResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ?
                        isCurrency ? `${ formatter.format(curr.Value) }`
                          : `${ curr.Value } (${ curr.TypeMitigation.UnitOfMeasure })`
                        : 'No amount recorded'
                    })
                  }
                  if (curr.TypeMitigation.ParentTypeMitigationId === 45 || curr.TypeMitigationId === 45) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    emergencyResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ?
                        isCurrency ? `${ formatter.format(curr.Value) }`
                          : `${ curr.Value } (${ curr.TypeMitigation.UnitOfMeasure })`
                        : 'No amount recorded'
                    })
                  }
                  if (curr.TypeMitigation.ParentTypeMitigationId === 46 || curr.TypeMitigationId === 46) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    mitigationResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ?
                        isCurrency ? `${ formatter.format(curr.Value) }`
                          : `${ curr.Value } (${ curr.TypeMitigation.UnitOfMeasure })`
                        : 'No amount recorded'
                    })
                  }
                  if (curr.TypeMitigation.ParentTypeMitigationId === 47 || curr.TypeMitigationId === 47) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    adaptationResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ?
                        isCurrency ? `${ formatter.format(curr.Value) }`
                          : `${ curr.Value } (${ curr.TypeMitigation.UnitOfMeasure })`
                        : 'No amount recorded'
                    })
                  }
                })
                const tableData = {
                  columns: [
                    {
                      label: 'Response',
                      field: 'response'
                    },
                    {
                      label: 'Amount',
                      field: 'amount'
                    }
                  ],
                  rows: [mitigationResponses]
                }
                return (<>
                  <br />
                  <div>
                    <div style={{ width: '500px' }}>
                      <h4>Emergency Responses</h4>
                      {emergencyResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={emergencyResponses.sort((a, b) => (a.response > b.response) ? 1 : ((b.response > a.response) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <hr />
                    <div style={{ width: '500px' }}>
                      <h4>Rehabilitation and Reconstruction Responses</h4>
                      {rehabResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={rehabResponses.sort((a, b) => (a.response > b.response) ? 1 : ((b.response > a.response) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <hr />
                    <div style={{ width: '500px' }}>
                      <h4>Mitigation Responses</h4>
                      {mitigationResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={mitigationResponses.sort((a, b) => (a.response > b.response) ? 1 : ((b.response > a.response) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <hr />
                    <div style={{ width: '500px' }}>
                      <h4>Adaptation Responses</h4>
                      {adaptationResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={adaptationResponses.sort((a, b) => (a.response > b.response) ? 1 : ((b.response > a.response) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                  </div>
                  <br />
                </>
                )
              }
            }}
          </OData>
        </div>
      </>
    )
  }
}

export default connect(mapStateToProps)(EventResponseTab)
