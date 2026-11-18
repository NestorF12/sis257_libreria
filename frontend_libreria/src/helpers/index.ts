function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1] ?? ''
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function getTokenFromLocalStorage() {
  const tokenAuth = localStorage.getItem('token') || ''
  if (!tokenAuth) return null

  const jwtPayload = parseJwt(tokenAuth)
  if (!jwtPayload || !jwtPayload.exp) return null

  const isExpired = jwtPayload.exp < Date.now() / 1000
  if (!isExpired) return tokenAuth
  else {
    localStorage.clear()
    return null
  }
}

export { getTokenFromLocalStorage, parseJwt }
