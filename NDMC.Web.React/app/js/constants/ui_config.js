
const _ = require('./ui_config.cfg')

export function UILookup(key, defaultLabel) {

  let searchConfig = _.ui_config.filter(x => x.key === key)

  if (searchConfig.length > 0) {
    return searchConfig[0]
  }
  else {
    return {
      key: key,
      label: typeof defaultLabel === 'undefined' ? "" : defaultLabel,
      tooltip: "",
      required: false
    }
  }
}