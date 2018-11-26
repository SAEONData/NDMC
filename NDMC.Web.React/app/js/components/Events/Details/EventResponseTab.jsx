'use strict'

//React
import React from 'react'
import { Button, Input } from 'mdbreact'
import { connect } from 'react-redux'
import { Table, TableBody, TableHead } from 'mdbreact';

//Local
import TextComponent from '../../Shared/TextComponent.jsx'
import TextAreaComponent from '../../Shared/TextAreaComponent.jsx'
import RangeComponent from '../../Shared/RangeComponent.jsx'

//Odata
import OData from 'react-odata'
const baseUrl = 'https://localhost:44334/odata/'

const mapStateToProps = (state, props) => {
  return {}
}

class EventResponseTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      eventData: {}
    }
  }

  render() {
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
          <OData baseUrl={baseUrl + 'Mitigations'} query={mitigationQuery}>
            {({ loading, error, data }) => {
              if (loading) { return <div>Loading...</div> }
              if (error) { return <div>Error Loading Data From Server</div> }
              if (data) {
                data.value.map(curr => {
                  if (curr.TypeMitigation.ParentTypeMitigationId === 12 || curr.TypeMitigationId === 12) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    rehabResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ? 
                        isCurrency? `${formatter.format(curr.Value)}`
                        : `${curr.Value} ${curr.TypeMitigation.UnitOfMeasure}` 
                          : 'No amount recorded'
                    })
                  }
                  if (curr.TypeMitigation.ParentTypeMitigationId === 45 || curr.TypeMitigationId === 45) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    emergencyResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ? 
                        isCurrency? `${formatter.format(curr.Value)}`
                        : `${curr.Value} ${curr.TypeMitigation.UnitOfMeasure}` 
                          : 'No amount recorded'
                    })
                  }
                  if (curr.TypeMitigation.ParentTypeMitigationId === 46 || curr.TypeMitigationId === 46) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    mitigationResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ? 
                        isCurrency? `${formatter.format(curr.Value)}`
                        : `${curr.Value} ${curr.TypeMitigation.UnitOfMeasure}` 
                          : 'No amount recorded'
                    })
                  }
                  if (curr.TypeMitigation.ParentTypeMitigationId === 47 || curr.TypeMitigationId === 47) {
                    let isCurrency = curr.TypeMitigation.UnitOfMeasure === 'Rands'
                    adaptationResponses.push({
                      response: curr.TypeMitigation.TypeMitigationName,
                      amount: curr.Value ? 
                        isCurrency? `${formatter.format(curr.Value)}`
                        : `${curr.Value} ${curr.TypeMitigation.UnitOfMeasure}` 
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
                    <div style={{width:'500px'}}>
                      <h4>Emergency Responses</h4>
                      {emergencyResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={emergencyResponses} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <div style={{width:'500px'}}>
                      <h4>Rehabilitation and Reconstruction Responses</h4>
                      {rehabResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={rehabResponses} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <div style={{width:'500px'}}>
                      <h4>Mitigation Responses</h4>
                      {mitigationResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey'  columns={tableData.columns} />
                          <TableBody rows={mitigationResponses} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <div style={{width:'500px'}}>
                      <h4>Adaptation Responses</h4>
                      {adaptationResponses.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey'  columns={tableData.columns} />
                          <TableBody rows={adaptationResponses} />
                        </Table> : <i>None recorded</i>}
                    </div>
                  </div>
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