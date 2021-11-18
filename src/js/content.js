import { getAnchors, getAppeals, showFinishButtons, showShareButtons } from './modules/appeals'
import { showForeground, setMessage, showMoreInfo } from './modules/progress'
import { initializeI18n, getI18n } from './modules/i18n'
import { getMainContentHeader } from './modules/common'

const shouldJobRun = async () => new Promise(resolve => {
  chrome.runtime.sendMessage({ cmd: 'shouldJobRun' }, response => resolve(response))
})

const notifyError = async (e) => {
  console.error(e)
  setMessage('errorMessage')
  await postError(e)
}

const notifyJobDone = async () => {
  await asyncWait(6000)
  return new Promise(() => {
    chrome.runtime.sendMessage({ cmd: 'notifyJobDone' })
  })
}

const noViolence = async () => {
  const hdr = await getMainContentHeader()
  const anchors = getAnchors(hdr)
  return (anchors.length == 0)
}

const createScanDiv = async () => {
  const innerDiv = document.querySelector('[aria-label="Main Content Header"] div div div')
  const firstElement = innerDiv.querySelectorAll('div')[1]
  const scanDiv = firstElement.cloneNode(true)
  // set id
  scanDiv.setAttribute('id', 'scan_div')
  // remove a tag
  scanDiv.querySelector('div[style]').innerHTML = scanDiv.querySelector('a').innerHTML
  // set bottom height
  scanDiv.querySelector('div[style]').setAttribute('style', 'border-radius: max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px; margin-bottom: 20px;')
  // remove image
  scanDiv.querySelector('div[class="q676j6op"]').remove()

  // replace text and date
  scanDiv.querySelectorAll('span')[1].innerHTML = getI18n('scanDivText')
  scanDiv.querySelectorAll('span')[2].innerText = ''

  const temp_button = document.createElement('button')

  temp_button.setAttribute('type', 'button')
  temp_button.setAttribute('id', 'scan_button')
  temp_button.setAttribute('class', 'execute-button-style')
  temp_button.innerText = getI18n('executeButton')
  temp_button.addEventListener('click', startScan)

  scanDiv.querySelectorAll('span')[1].appendChild(temp_button)

  innerDiv.prepend(scanDiv)
}

const startScan = async () => {
  try {
    // block the page and show the asking window
    await showForeground()
    // start parsing appeals
    await getAppeals()
    await showFinishButtons()
    await showShareButtons()
  } catch (e) {
    await notifyError(e)
  }
}

// insert btn to appeal page on mainpage
const mainPageActions = () => {
  if (window.location.toString() != 'https://www.facebook.com/') {
    return
  }
  // insert after 2 secs to avoid page reload (the btn may be rewrote)
  setTimeout(() => {
    // if not on main page, return
    if (window.location.toString() != 'https://www.facebook.com/') {
      return
    }
    // check whether censor btn has correct text
    // the btn text might be rewrote by the following COVID-19 btn
    if (document.getElementById('censorBtn')) {
      const censorLi = document.getElementById('censorBtn')
      if (censorLi.querySelector('span span').innerText != getI18n('censorButton')) {
        censorLi.querySelector('span span').innerText = getI18n('censorButton')
      }
      return
    }
    const left_rail = document.querySelector('div[data-pagelet="LeftRail"] div[data-visualcompletion="ignore-dynamic"]')
    if (!left_rail) {
      return
    }

    // copy the COVID-19 info center btn and prepend it 
    const main_ul = left_rail.querySelectorAll('ul')[1]
    const li_template = main_ul.querySelector('li').innerHTML
    const temp_li = document.createElement('li')
    temp_li.innerHTML = li_template
    temp_li.setAttribute('id', 'censorBtn')
    temp_li.querySelector('a').href = 'https://www.facebook.com/support?tab_type=APPEALS'
    const aClassName = temp_li.querySelector('a').className
    temp_li.querySelector('a').setAttribute('class', `${aClassName} censorDiv`)
    temp_li.querySelector('span span').innerText = getI18n('censorButton')
    temp_li.querySelector('img').src = chrome.runtime.getURL('images/icon.png')
    main_ul.prepend(temp_li)
  }, 2000)

  // Check tab is created successfully
  tabChecker('censorBtn', 'https://www.facebook.com/')
}

// insert upload btn on appeal page
const appealPageActions = () => {
  if (window.location.toString() != 'https://www.facebook.com/support?tab_type=APPEALS') {
    if (document.getElementById('scan_div')) {
      const scanDiv = document.getElementById('scan_div')
      scanDiv.remove()
    }
    return
  }
  // insert after 2 secs to avoid page reload (the btn may be deleted)
  setTimeout(async () => {
    if (!document.querySelector('[aria-label="Main Content Header"]')) {
      return
    }
    // we won't insert upload btn if the user doesn't have any violent post
    if (await noViolence()) {
      return
    }
    // we use local storage to record the last showing date of asking window
    
    chrome.storage.local.get('lastBlockDate', async (items) => {
      const currentDate = new Date().toLocaleDateString()
      // if we haven't asked today, the page would be blocked w/ asking window
      if (items.lastBlockDate != currentDate && !(document.getElementById('ailabstw-foreground-div'))) {
        chrome.storage.local.set({
          lastBlockDate: currentDate
        })
        await startScan()
      }
    })

    if (document.getElementById('scan_div')) {
      return
    }

    try {
      await createScanDiv()
    } catch (err) {
      console.log(err)
    }
  }, 2000)

  // Check tab is created successfully
  tabChecker('scan_div', 'https://www.facebook.com/support?tab_type=APPEALS')
}

const urlHandler = async (url) => {
  switch (url) {
    case 'https://www.facebook.com/':
      // run homepage routine here
      mainPageActions()
      break
    case 'https://www.facebook.com/support?tab_type=APPEALS':
      // run appeal routine here
      appealPageActions()
      break
  }
}

const tabChecker = (elementId, targetLocation) => {
  const checkTimes = 3
  const interval = 1000
  let checkCnt = 0

  const timer = setInterval(async () => {
    const element = document.getElementById(elementId)
    if (element || window.location.toString() != targetLocation) {
      clearInterval(timer)
    } else {
      checkCnt++
      if (checkCnt >= checkTimes) {
        clearInterval(timer)
        await urlHandler(window.location.toString())
      }
    }
  }, interval)
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(request)
  await urlHandler(request.url)
})

window.addEventListener('load', async () => {
  initializeI18n()
  await urlHandler(window.location.toString())
})
