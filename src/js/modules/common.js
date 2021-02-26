export const asyncWait = (time) => new Promise(resolve => {
  setTimeout(resolve, time);
});

let usrId = null;

export const setUserId = () => {
  if (usrId !== null) return;

  if (window.location.toString() != "https://www.facebook.com/support?tab_type=APPEALS")
    return;

  // on appeal
  let targetScript = Array.from(document.querySelectorAll('script')).find(
    sc => sc.textContent.includes('profileSwitcherEligibleProfiles'));
  usrId = targetScript.textContent.match(/\"profileSwitcherEligibleProfiles\":{\"count\":(\d*)},\"id\":\"(\d*)\"/)[2];
}

export const getUserId = () => {
  if (!usrId)
    throw Error('usrId is not properly set')
  return usrId;
}

export const getMainContentHeader = async () => {
  let max_retry = 5;
  let interval = 1000;

  for (let i = 0; i < max_retry; i++)
    try {
      return await new Promise(resolve => {
        let timer = setInterval(() => {
          let hdr = document.querySelectorAll('[aria-label="Main Content Header"]')[0];
          if (!hdr) { throw Error('main content header not found'); }
          clearInterval(timer);
          resolve(hdr);
        }, interval);
      });
    } catch (e) {
      console.error(e);
      continue;
    }

  throw Error('cannot get main content header after max retry')
}

export const postError = async (error) => {
  let url = 'https://lutein.islander.cc/api/v1/errors';
  const response = await fetch(url, {
    body: JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack
    }),
    headers: {
      'Content-Type': 'application/json',
      'Source': 'lutein'
    },
    method: 'POST'
  });
  return console.log(response);
}
