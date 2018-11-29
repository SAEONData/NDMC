export function stripURLParam(paramKey) {
  let i = location.toString().indexOf('?')
  let l = location.toString().length
  let queryString = location.toString().substr(i, l - i)

  if (queryString === ('?' + paramKey)) {
    location = location.toString().replace(('?' + paramKey), '')
  }
  else if (queryString.includes('?' + paramKey + '&')) {
    location = location.toString().replace(paramKey + '&', '')
  }
  else if (queryString.includes('&' + paramKey)) {
    location = location.toString().replace('&' + paramKey, '')
  }
}

export function GetUID() {
  return Math.random().toString().substr(2, 9)
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

//-------------------------//
// Create and Read Cookies //
//-------------------------//

export function SaveCurrentUrl() {
  CreateCookie("nccrd_last_url", document.URL, 1);
}

export function ReadLastUrl() {
  return ReadCookie("nccrd_last_url")
}

export function CreateCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

export function ReadCookie(name) {
  var nameEQ = name + "="; var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
} 