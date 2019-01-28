
const ui_config = [
  // EXAMPLE //
  {
    key: "txtExample",
    label: "Example title:",
    tooltip: "Example tooltip",
    required: false
  },
  {
    key: "txtExample2",
    label: "Example2 title:",
    tooltip: "Example2 tooltip",
    required: true
  }
]

export function UILookup(key, defaultLabel) {

  let searchConfig = ui_config.filter(x => x.key === key)

  if (searchConfig.length > 0) {
    return searchConfig[0]
  }
  else {
    return {
      key: key,
      label: typeof defaultLabel === 'undefined' ? '' : defaultLabel,
      tooltip: '',
      required: false
    }
  }
}