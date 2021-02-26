let runningTabs = {};

chrome.browserAction.onClicked.addListener(() => {
  let url = "https://www.facebook.com/support?tab_type=APPEALS";
  chrome.tabs.create({url: url}, async (tab) => {
    runningTabs[tab.id] = true;
  });
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
  console.log("got message: " + JSON.stringify(message));

  switch(message.cmd) {
    case 'shouldJobRun':
      response(sender.tab.id in runningTabs);
      break;
    case 'notifyJobDone':
      delete runningTabs[sender.tab.id];
      chrome.tabs.remove(sender.tab.id);
      break;
    default:
      break;
  }
});
