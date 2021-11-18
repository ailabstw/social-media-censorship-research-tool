import config from './config'

export const asyncWait = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

let usrId = null

export const setUserId = () => {
  if (usrId !== null) return

  if (window.location.toString() != config.fbAppealURI) { return }

  // on appeal
  const targetScript = Array.from(document.querySelectorAll('script')).find(
    sc => sc.textContent.includes('profileSwitcherEligibleProfiles'))

   usrId = targetScript.textContent.match(/\"__typename\":\"(\w*)\",\"id\":\"(\d*)\"/)[2]
}

export const getUserId = () => {
  if (!usrId) { throw Error('usrId is not properly set') }
  return usrId
}

export const getMainContentHeader = async () => {
  const maxRetry = 5
  const interval = 1000
  let retryCnt = 0
  return await new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const hdr = document.querySelectorAll('[aria-label="Main Content Header"]')[0]
      if (!hdr) {
        retryCnt++
        if (retryCnt >= maxRetry) {
          clearInterval(timer)
          reject(Error('main content header not found'))
        }
        return
      }
      clearInterval(timer)
      resolve(hdr)
    }, interval)
  })
}

export const postError = async (error) => {
  const response = await fetch(config.errorURI, {
    body: JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack
    }),
    headers: {
      'Content-Type': 'application/json',
      Source: 'lutein'
    },
    method: 'POST'
  })
  return console.log(response)
}
