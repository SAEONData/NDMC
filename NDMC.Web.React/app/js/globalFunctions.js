export function stripURLParam(paramKey){
  let i = location.toString().indexOf("?")
  let l = location.toString().length
  let queryString = location.toString().substr(i, l-i)

  if(queryString === ("?" + paramKey)){
    location = location.toString().replace(("?" + paramKey), "")
  }
  else if(queryString.includes("?" + paramKey + "&")){
    location = location.toString().replace(paramKey + "&", "")
  }
  else if(queryString.includes("&" + paramKey)){
    location = location.toString().replace("&" + paramKey, "")
  }
}

export function GetUID() {
  return Math.random().toString().substr(2, 9)
}