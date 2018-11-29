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
import { apiBaseURL } from '../../../config/serviceURLs.cfg'

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
    let impactQuery = {
      filter: {
        EventId: parseInt(eventId),
      },
      expand: ['EventRegions/EventImpacts/TypeImpact',
        {
          EventRegions:
          {
            filter: { Region: { RegionTypeId: { ne: 5 } } },
            expand: ['Region']
          }
        },
      ]
    }

    const formatter = new Intl.NumberFormat('en-Za', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    })

    let impacts = []
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
          <OData baseUrl={apiBaseURL + 'Events'} query={impactQuery}>
            {({ loading, error, data }) => {
              if (loading) { return <div>Loading...</div> }
              if (error) { return <div>Error Loading Data From Server</div> }
              if (data) {
                data.value[0].EventRegions[0].EventImpacts.map(impact => {
                  let amountMeasure = ''
                  switch (impact.TypeImpact.UnitOfMeasure) {
                    case 'Hectare':
                      amountMeasure = '(Hectares)'
                      break
                    case 'Count':
                      amountMeasure = '(Count)'
                      break
                    case 'Meters':
                      amountMeasure = '(Meters)'
                      break
                    case 'Rands':
                      amountMeasure = formatter.format(impact.Measure)
                      break
                    default:
                      amountMeasure = '(Count)'
                  }
                  impacts.push({
                    impact: impact.TypeImpact.TypeImpactName,
                    amount: impact.Measure && impact.Measure !== 0 ? 
                      `${impact.Measure} ${amountMeasure}`
                      : 'No amount recorded'
                  })
                })
                const tableData = {
                  columns: [
                    {
                      label: 'Impact',
                      field: 'impact'
                    },
                    {
                      label: 'Amount',
                      field: 'amount'
                    }
                  ]
                }
                return (<>
                  <br />
                  <div>
                    <div style={{ width: '500px' }}>
                      <h4>Event Impacts Recorded</h4>
                      {impacts.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={impacts} />
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