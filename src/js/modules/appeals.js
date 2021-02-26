import {getItem} from './item';
import {setProgress, setMessage, showProgressBar} from './progress';
import {asyncWait, setUserId, getMainContentHeader} from './common';
import {getI18n} from './i18n';

const loadAppeals = async () => {
  setMessage('pullingAppeals');
  let height = document.body.scrollHeight;
  while (true) {
    window.scrollTo(0, document.body.scrollHeight);
    await asyncWait(3000);
    if (height == document.body.scrollHeight) break;
    else height = document.body.scrollHeight;
  }
}

const getAnchors = () => {
  return document.querySelectorAll('[aria-label="Main Content Header"] a');
}

const createButton = (text) => {
  let btn = document.createElement('button');
  btn.setAttribute('class', 'ailabstw-appeals-btn-cls');
  btn.textContent = text;
  return btn;
}

const showAppealsButtons = async () => {
  let yesBtn = createButton(getI18n('acceptButton'));
  let noBtn = createButton(getI18n('cancelButton'));
  
  let promise = new Promise((resolve) => {
    yesBtn.addEventListener('click', () => resolve(true));
    noBtn.addEventListener('click', () => resolve(false));
  });
  
  let div = document.getElementById('ailabstw-button-div');
  div.appendChild(yesBtn);
  div.appendChild(noBtn);

  let decision = await promise;

  yesBtn.remove();
  noBtn.remove();

  return decision;
}

const showPrompt = async () => {
  await loadAppeals();

  let hdr = await getMainContentHeader();
  let anchors = getAnchors(hdr);
  
  if (anchors.length == 0) {
    setMessage('appealsNotFound');
    return false;
  }
  
  setMessage('askForAppealsFetching', {num: anchors.length});
  
  let decision = await showAppealsButtons();

  if (decision) setMessage('startFetching');
  else setMessage('stopFetching');

  return decision;
}

export const getAppeals = async () => {
  if (!(await showPrompt())) return;
  
  showProgressBar();
  setProgress(0);
  setUserId();

  let idx = 0;
  while (true) {
    await loadAppeals();

    let hdr = await getMainContentHeader();
    let anchors = getAnchors(hdr);

    if (idx >= anchors.length) break;

    console.log(`start fetching item ${idx}`);

    setMessage('fetchingAppeals');
    await getItem(anchors[idx]);
    setProgress((++idx) / anchors.length); //total 100%
  }

  setMessage('finishFetching');
}
