const i18nMapping = {
  askForAppealsFetching: {
    en: 'Upload to AILabs.tw <hr> We found {num} censored content, are you willing to share your content to us for ' + '<a href="' + 'https://lutein.ailabs.tw/' + '" target="_blank">' + 'the Censorship Research' + '</a>?',
    'zh-Hant': '上傳至 AILabs.tw <hr> 發現您有 {num} 筆遭到審查的內容，請問您是否願意上傳內容以供分析' + '<a href="' + 'https://lutein.ailabs.tw/' + '" target="_blank">' + '言論審查中立性' + '</a>?'
  },
  startFetching: {
    en: 'Thank you for supporting us, we will start fetching your censored content.',
    'zh-Hant': '謝謝您的支持，我們將開始存取您遭到審查的內容。'
  },
  stopFetching: {
    en: 'Thank you for trying this extension.',
    'zh-Hant': '謝謝您使用這個 Chrome 擴充套件。'
  },
  pullingAppeals: {
    en: 'We are loading your censored content.',
    'zh-Hant': '正在載入您遭到審查的內容。'
  },
  appealsNotFound: {
    en: 'Thank you for supporting us, your account has no censored content.',
    'zh-Hant': '謝謝您的支持，並未發現您有遭到審查的內容。'
  },
  fetchingAppeals: {
    en: 'Fetching your censored content, please wait.',
    'zh-Hant': '正在存取您遭到審查的內容，請稍候。'
  },
  finishFetching: {
    en: 'Finish fetching, thank you for sharing!',
    'zh-Hant': '所有內容已存取完成，謝謝您的分享。'
  },
  errorMessage: {
    en: 'Oops, Something Went Wrong.',
    'zh-Hant': '系統異常'
  },
  acceptButton: {
    en: 'Accept',
    'zh-Hant': '同意'
  },
  cancelButton: {
    en: 'Decline',
    'zh-Hant': '不同意'
  },
  censorButton: {
    en: 'Censorship Page',
    'zh-Hant': '貼文審查中心'
  },
  moreInfo: {
    en: 'For more information about this open source project on GitHub.',
    'zh-Hant': '本擴充套件為開源專案，更多資訊及專案說明請參閱 GitHub。'
  },
  finishButton: {
    en: 'Finish',
    'zh-Hant': '結束'
  },
  shareButton: {
    en: 'Share',
    'zh-Hant': '分享'
  },
  scanDivText: {
    en: 'Upload for ' + '<a href="' + 'https://lutein.ailabs.tw/' + '" target="_blank">' + 'the Censorship Research' + '</a>',
    'zh-Hant': '上傳至 AILabs.tw 以分析' + '<a href="' + 'https://lutein.ailabs.tw/' + '" target="_blank">' + '言論審查中立性' + '</a>'
  },
  executeButton: {
    en: 'Execute',
    'zh-Hant': '執行'
  }
}

let lang = 'en'

export const initializeI18n = () => {
  lang = document.querySelector('html').lang
}

export const getI18n = (key) => {
  if (!(lang in i18nMapping[key])) { return i18nMapping[key].en }
  return i18nMapping[key][lang]
}
