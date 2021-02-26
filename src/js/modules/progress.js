import {getI18n} from './i18n';

let ProgressBar = require('progressbar.js');

let line = null; // progress bar handler

export const showProgressBar = () => {
  line = new ProgressBar.Line('#ailabstw-progressbar-div', {
    strokeWidth: 2,
    easing: 'easeInOut',
    duration: 1400,
    color: '#FFFFFF',
    svgStyle: {width: '100%', height: '100%'},
    text: {
      style: null,
      autoStyleContainer: false
    },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100) + ' %');
    }
  });
}

export const showForeground = async () => {
  return await new Promise(resolve => {
    let body = document.getElementsByTagName('body')[0];
    let foregroundDiv = document.createElement('div');
    foregroundDiv.setAttribute('id', 'ailabstw-foreground-div');
    foregroundDiv.innerHTML = `
      <div id="ailabstw-info-div">
        <div id="ailabstw-progressbar-div">
        </div>
        <div id="ailabstw-message-div">
          <p id="ailabstw-message-p"></p>
        </div>
        <div id="ailabstw-more-info-div">
          <a id="ailabstw-more-info-a"></a>
        </div>
        <div id="ailabstw-button-div">
        </div>
      </div>
    `;
    body.prepend(foregroundDiv);
    
    resolve();
  })
}

export const setProgress = (percentage) => {
  line.animate(percentage);
}

export const setMessage = (i18nKey, kwargs) => {
  let p = document.getElementById('ailabstw-message-p');
  if (!kwargs)
    p.textContent = getI18n(i18nKey);
  else
    p.textContent = getI18n(i18nKey).slice().replace(/{(\w+)}/g,
      (match, matchKey) => kwargs.hasOwnProperty(matchKey) ? kwargs[matchKey] : match);
}

export const showMoreInfo = () => {
  let a = document.getElementById('ailabstw-more-info-a');
  a.setAttribute('href', 'https://github.com/ailabstw/social-media-censorship-research-tool');
  a.textContent = getI18n('moreInfo');
}