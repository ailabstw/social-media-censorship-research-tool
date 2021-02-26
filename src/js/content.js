import {getAppeals} from './modules/appeals';
import {showForeground, setMessage, showMoreInfo} from './modules/progress';
import {asyncWait, postError} from './modules/common';
import {initializeI18n} from './modules/i18n';

const shouldJobRun = async () => new Promise(resolve => {
  chrome.runtime.sendMessage({cmd: 'shouldJobRun'}, response => resolve(response));
});

const notifyError = async (e) => {
  console.error(e);
  setMessage('errorMessage');
  await postError(e);
}

const notifyJobDone = async () => {
  showMoreInfo();
  await asyncWait(6000);
  return new Promise(() => {
    chrome.runtime.sendMessage({cmd: 'notifyJobDone'});
  });
}

window.addEventListener('load', async () => {
  if (!await shouldJobRun()) { return; }

  initializeI18n();

  try {

    await showForeground();

    await getAppeals();
    
  } catch (e) {
    await notifyError(e);
  } finally {
    await notifyJobDone();
  }

});
