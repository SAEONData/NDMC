import { siteBaseURL, apiBaseURL } from '../js/config/serviceURLs.js'

export const MapConfig = {
  "service": `${apiBaseURL}events/extensions.geojson`,
  "domain": siteBaseURL,
  "IDField": "properties.id",
  "toolTipTitle": "properties.hazardName",
  "toolTipFields": [
    {
      "field": "properties.startDate",
      "alias": "Start Date"
    },
    {
      "field": "properties.endDate",
      "alias": "End Date"
    }
  ],
  "styleField": "properties.hazard",
  "styles": [
    {
      "value": 0,
      "title": "Unknown",
      "default": true,
      "strokeWidth": 1,
      "strokeColor": "rgba(255,0,0,0.5)", //red
      "fillColor": "rgba(255,0,0,0.3)"
    }
  ]
}