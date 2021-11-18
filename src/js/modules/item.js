import { asyncWait, getUserId, getMainContentHeader } from './common'
import config from './config'
import { toBlob } from 'html-to-image'

const getItemID = () => {
  const tabURL = window.location.toString()
  return tabURL.split('=')[1]
}

const getScreenshot = async () => toBlob(document.body, {
  filter: node => !(node.id == 'ailabstw-foreground-div')
})

const postAppeal = async (mainContentHdr) => {
  const hrefs = await getHrefs(mainContentHdr)
  const screenShot = await getScreenshot()

  const formData = new FormData()
  formData.append('id', getItemID())
  formData.append('usrId', getUserId())
  formData.append('content', mainContentHdr.textContent)
  formData.append('uri', hrefs)
  formData.append('screenshot', screenShot)

  const response = await fetch(config.appealURI, {
    method: 'POST',
    headers: { Source: 'lutein' },
    body: formData
  })
  return console.log(response)
}

const expandMessage = async (mainContentHdr) => {
  console.log('enter expandMessage')

  const buttonList = mainContentHdr.querySelectorAll('div[role="button"]')

  console.log(`buttonList length: ${buttonList.length}`)

  let idx = 0
  while (true) {
    if (idx >= buttonList.length) break

    console.log(`start checking button ${idx}`)

    if (!(buttonList[idx].getAttribute('aria-label')) && /\d/.test(buttonList[idx].textContent)) {
      console.log('[CLICK BUTTTON] : ', buttonList[idx].textContent)
      buttonList[idx].click()
      await asyncWait(5000)
      break
    }
    ++idx
  }

  console.log('exit expandMessage')
}

export const getItem = async (anchor) => {
  anchor.click()

  await asyncWait(5000)

  const hdr = await getMainContentHeader()

  console.log(hdr.innerHTML)

  await expandMessage(hdr)

  await postAppeal(hdr)

  window.history.back()
}

const cleanHref = (href) => {
  href = href.split('__cft__')[0]
  return href.replace(/\&$|\?$/, '')
}

const expandHrefs = async (hdr) => {
  console.log('enter expandHrefs')

  const hrefs = hdr.querySelectorAll('a[role="link"]')

  console.log(`hrefs length: ${hrefs.length}`)

  for (let i = 0; i < hrefs.length; i++) {
    if (hrefs[i].getAttribute('href') == '#') {
      const event = new FocusEvent('focusin', { view: window, bubbles: true, cancelable: true })
      hrefs[i].dispatchEvent(event)
      await asyncWait(2000)
      console.log('[Href after expand] : ', hrefs[i].getAttribute('href'))
    }
  }

  console.log('exit expandHrefs')
}

const getHrefs = async (mainContentHdr) => {
  console.log('enter getHrefs')

  const resultHref = []
  // click readmore if exists
  const readMore = mainContentHdr.querySelector('div[style="text-align: start;"] div[role="button"]')
  if (readMore) {
    console.log('[CLICK BUTTTON] : ', readMore.textContent)
    readMore.click()
    console.log('[Location after click()] : ', window.location.toString())
    await asyncWait(2000)
  }

  await expandHrefs(mainContentHdr)

  const hrefs = mainContentHdr.querySelectorAll('a[role="link"]')
  for (let i = 0; i < hrefs.length; i++) {
    console.log('[Found Href] : ', hrefs[i].getAttribute('href'))
    const tmpHref = cleanHref(hrefs[i].getAttribute('href'))
    console.log('Href After Clean : ', tmpHref)
    if (!resultHref.includes(tmpHref)) {
      resultHref.push(tmpHref)
    }
    console.log('Current len of Result Href: ', resultHref.length)
  }

  console.log(`exit getHrefs ${resultHref}`)

  return resultHref.join()
}
