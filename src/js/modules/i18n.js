let i18nMapping = { 
  askForAppealsFetching: {
    "en": "We found {num} censored content, are you willing to share your content to us for analysis?",
    "zh-Hant": "我們發現您有 {num} 筆遭到審查的內容，請問您是否願意上傳內容以供分析？"
  },
  startFetching: {
    "en": "Thank you for supporting us, we will start fetching your censored content.",
    "zh-Hant": "謝謝您的支持，我們將開始存取您遭到審查的內容。"
  },
  stopFetching: {
    "en": "Thank you for trying this extension. This page will be closed automatically.",
    "zh-Hant": "謝謝您使用這個 Chrome 擴充套件，此分頁將會自動關閉。"
  },
  pullingAppeals: {
    "en": "We are loading your censored content.",
    "zh-Hant": "我們正在載入您遭到審查的內容。"
  },
  appealsNotFound: {
    "en": "Thank you for supporting us, your account has no censored content. This page will be closed automatically.",
    "zh-Hant": "謝謝您的支持，並未發現您有遭到審查的內容，此分頁將會自動關閉。"
  },
  fetchingAppeals: {
    "en": "Fetching your censored content, please wait.",
    "zh-Hant": "正在存取您遭到審查的內容，請稍候。"
  },
  finishFetching: {
    "en":"Finish fetching, thank you for sharing! This page will be closed automatically.",
    "zh-Hant": "所有內容已存取完成，謝謝您的分享，此分頁將會自動關閉。"
  },
  errorMessage: {
    "en": "Oops, Something Went Wrong. This page will be closed automatically.",
    "zh-Hant": "系統異常，此分頁將會自動關閉。"
  },
  acceptButton: {
    "en": "Accept",
    "zh-Hant": "同意"
  },
  cancelButton: {
    "en": "Decline",
    "zh-Hant": "不同意"
  },
  moreInfo: {
    "en": "For more information about this open source project on GitHub.",
    "zh-Hant": "本擴充套件為開源專案，更多資訊及專案說明請參閱 GitHub。"
  }
};

let lang = "en";

export const initializeI18n = () => {
  lang = document.querySelector('html').lang;
}

export const getI18n = (key) => {
  if (!(lang in i18nMapping[key]))
    return i18nMapping[key]["en"];
  return i18nMapping[key][lang];
}
