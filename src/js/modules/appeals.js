import { getItem } from './item'
import { setProgress, setMessage, showProgressBar } from './progress'
import { asyncWait, setUserId, getMainContentHeader } from './common'
import { getI18n } from './i18n'

const loadAppeals = async () => {
  setMessage('pullingAppeals')
  let height = document.body.scrollHeight
  while (true) {
    window.scrollTo(0, document.body.scrollHeight)
    await asyncWait(3000)
    if (height == document.body.scrollHeight) break
    else height = document.body.scrollHeight
  }
}

export const getAnchors = () => {
  return document.querySelectorAll('[aria-label="Main Content Header"] a:not([target])')
}

const createButton = (text, color = 'blue') => {
  const btn = document.createElement('button')
  btn.setAttribute('class', `ailabstw-appeals-btn-cls ailabstw-button-color-${color}`)
  btn.textContent = text
  return btn
}

const showAppealsButtons = async () => {
  const yesBtn = createButton(getI18n('acceptButton'))
  const noBtn = createButton(getI18n('cancelButton'), 'gray')

  const promise = new Promise((resolve) => {
    yesBtn.addEventListener('click', () => resolve(true))
    noBtn.addEventListener('click', () => resolve(false))
  })

  const div = document.getElementById('ailabstw-button-div')
  div.appendChild(noBtn)
  div.appendChild(yesBtn)

  const decision = await promise

  yesBtn.remove()
  noBtn.remove()

  return decision
}

const removeShield = async () => {
  const foregroundDiv = document.getElementById('ailabstw-foreground-div')
  foregroundDiv.remove()
}

export const showFinishButtons = async () => {
  return await new Promise(resolve => {
    const finishBtn = createButton(getI18n('finishButton'), 'gray')
    finishBtn.addEventListener('click', removeShield)

    const div = document.getElementById('ailabstw-button-div')
    div.appendChild(finishBtn)
    resolve()
  }
  )
}

export const showShareButtons = async () => {
  return await new Promise(resolve => {
    const shareBtn = createButton(getI18n('shareButton'))
    shareBtn.setAttribute('OnClick', "window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fsocial-media-censorship-r%2Fhooleahmilijlilmngdaicfiomhmopga', 'popup', 'width=600, height=600'); return false;")

    const div = document.getElementById('ailabstw-button-div')
    div.appendChild(shareBtn)
    resolve()
  }
  )
}

const showPrompt = async () => {
  await loadAppeals()

  const hdr = await getMainContentHeader()
  const anchors = getAnchors(hdr)

  if (anchors.length == 0) {
    setMessage('appealsNotFound')
    return false
  }

  setMessage('askForAppealsFetching', { num: anchors.length })

  const decision = await showAppealsButtons()

  if (decision) setMessage('startFetching')
  else setMessage('stopFetching')

  return decision
}

export const getAppeals = async () => {
  if (!(await showPrompt())) return

  showProgressBar()
  setProgress(0)
  setUserId()

  let idx = 0
  while (true) {
    await loadAppeals()

    const hdr = await getMainContentHeader()
    const anchors = getAnchors(hdr)

    if (idx >= anchors.length) break

    console.log(`start fetching item ${idx}`)

    setMessage('fetchingAppeals')
    await getItem(anchors[idx])
    setProgress((++idx) / anchors.length) // total 100%
  }
  const progressDiv = document.getElementById('ailabstw-progressbar-div')
  progressDiv.remove()
  setMessage('finishFetching')
}
