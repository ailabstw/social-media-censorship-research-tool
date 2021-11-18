const runningTabs = {}

chrome.browserAction.onClicked.addListener(() => {
  const url = 'https://www.facebook.com/support?tab_type=APPEALS'
  chrome.tabs.create({ url: url }, async (tab) => {
    runningTabs[tab.id] = true
  })
})

chrome.webNavigation.onHistoryStateUpdated.addListener(detail => {
  switch (detail.url) {
    case 'https://www.facebook.com/support?tab_type=APPEALS':
    case 'https://www.facebook.com/':
      console.log('Current URL: ', detail.url)
      chrome.tabs.sendMessage(detail.tabId, detail)
      break
  }
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
  console.log('got message: ' + JSON.stringify(message))

  switch (message.cmd) {
    case 'shouldJobRun':
      response(sender.tab.id in runningTabs)
      break
    case 'notifyJobDone':
      delete runningTabs[sender.tab.id]
      chrome.tabs.remove(sender.tab.id)
      break
    default:
      break
  }
})
