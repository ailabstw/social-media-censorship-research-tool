import {asyncWait, getUserId, getMainContentHeader} from './common';

let url = 'https://lutein.islander.cc/api/v1/appeals';

const getItemID = () => {
  let tabURL = window.location.toString();
  return tabURL.split('=')[1];
}

const postAppeal = async (mainContentHdr) => {
  let hrefs = await getHrefs(mainContentHdr);
  const response = await fetch(url, {
    body: JSON.stringify({
      id: getItemID(),
      usrId: getUserId(),
      content: mainContentHdr.textContent,
      uri: hrefs
    }),
    headers: {
      'Content-Type': 'application/json',
      'Source': 'lutein'
    },
    method: 'POST'
  });
  return console.log(response);
}

const expandMessage = async (mainContentHdr) => {
  console.log(`enter expandMessage`);

  let buttonList = mainContentHdr.querySelectorAll('div[role="button"]');
  
  console.log(`buttonList length: ${buttonList.length}`);
  
  let idx = 0;
  while (true) {
    if (idx >= buttonList.length) break;
    
    console.log(`start checking button ${idx}`)
    
    if (!(buttonList[idx].getAttribute('aria-label')) && /\d/.test(buttonList[idx].textContent)) {
      console.log('[CLICK BUTTTON] : ', buttonList[idx].textContent);
      buttonList[idx].click();
      await asyncWait(5000);
      break;
    }
    ++idx;
  }

  console.log(`exit expandMessage`);
}

export const getItem = async (anchor) => {
  anchor.click();

  await asyncWait(5000);

  let hdr = await getMainContentHeader();
  
  console.log(hdr.innerHTML);

  await expandMessage(hdr);

  await postAppeal(hdr);

  window.history.back();
}

const cleanHref = (href) => {
  href = href.split('__cft__')[0];
  return href.replace(/\&$|\?$/, '');
}

const expandHrefs = async (hdr) => {
  console.log(`enter expandHrefs`);

  let hrefs = hdr.querySelectorAll('a[role="link"]');

  console.log(`hrefs length: ${hrefs.length}`);

  for (let i = 0; i < hrefs.length; i++) {
      if (hrefs[i].getAttribute('href') == "#") {
          let event = new FocusEvent('focusin', {'view': window, 'bubbles': true, 'cancelable': true});
          hrefs[i].dispatchEvent(event);
          await asyncWait(2000);
          console.log('[Href after expand] : ',hrefs[i].getAttribute('href'));
      }
  }

  console.log(`exit expandHrefs`);
}

const getHrefs = async (mainContentHdr) => {
  console.log(`enter getHrefs`);
  
  let resultHref = [];
  // click readmore if exists
  let readMore = mainContentHdr.querySelector('div[style="text-align: start;"] div[role="button"]');
  if (readMore) {
      console.log('[CLICK BUTTTON] : ', readMore.textContent);
      readMore.click();
      console.log('[Location after click()] : ', window.location.toString());
      await asyncWait(2000);
  }

  await expandHrefs(mainContentHdr);

  let hrefs = mainContentHdr.querySelectorAll('a[role="link"]');
  for (let i = 0; i < hrefs.length; i++) {
      console.log('[Found Href] : ', hrefs[i].getAttribute('href'));
      let tmpHref = cleanHref(hrefs[i].getAttribute('href'));
      console.log('Href After Clean : ', tmpHref);
      if (! resultHref.includes(tmpHref)) {
          resultHref.push(tmpHref);
      }
      console.log('Current len of Result Href: ', resultHref.length);
  }

  console.log(`exit getHrefs ${resultHref}`);

  return resultHref.join();
}

