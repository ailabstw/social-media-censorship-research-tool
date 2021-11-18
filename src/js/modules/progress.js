import { getI18n } from './i18n'
import config from './config'

const ProgressBar = require('progressbar.js')

let line = null // progress bar handler

export const showProgressBar = () => {
  document.getElementById('ailabstw-progressbar-div').style.display = 'block'
  line = new ProgressBar.Circle('#ailabstw-progressbar-div', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#aaa',
    svgStyle: { width: '100%', height: '100%' },
    text: {
      autoStyleContainer: false
    },
    from: { color: '#1877f2', width: 1 },
    to: { color: '#1877f2', width: 4 },
    step: (state, circle) => {
      circle.path.setAttribute('stroke', state.color)
      circle.path.setAttribute('stroke-width', state.width)

      var value = Math.round(circle.value() * 100)
      circle.setText(value + '%')
    }
  })
  line.text.style.fontFamily = '"Raleway", Helvetica, sans-serif'
  line.text.style.fontSize = '1.5rem'
}

export const showForeground = async () => {
  return await new Promise(resolve => {
    const body = document.getElementsByTagName('body')[0]
    const foregroundDiv = document.createElement('div')
    foregroundDiv.setAttribute('id', 'ailabstw-foreground-div')
    foregroundDiv.innerHTML = `
      <div id="ailabstw-info-div">
        <div id="ailabstw-message-div">
          <p id="ailabstw-message-p"></p>
          <div id="ailabstw-progressbar-div" style="display:none">
          </div>
        </div>
        <div id="ailabstw-button-div">
        </div>
        <div id="ailabstw-more-info-div">
      </div>
    `
    body.prepend(foregroundDiv)

    resolve()
  })
}

export const setProgress = (percentage) => {
  line.animate(percentage)
}

export const setMessage = (i18nKey, kwargs) => {
  const p = document.getElementById('ailabstw-message-p')
  if (!kwargs) { p.innerHTML = getI18n(i18nKey) } else {
    p.innerHTML = getI18n(i18nKey).slice().replace(/{(\w+)}/g,
      (match, matchKey) => kwargs.hasOwnProperty(matchKey) ? kwargs[matchKey] : match)
  }
}

export const showMoreInfo = () => {
  const a = document.getElementById('ailabstw-more-info-a')
  a.setAttribute('href', config.githubURI)
  a.textContent = getI18n('moreInfo')
}
