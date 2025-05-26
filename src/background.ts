import { Storage } from "@plasmohq/storage"

import { getAPI } from "./lib/api"

const storage = new Storage()

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-word",
    title: "添加到WordSnatcher生词本",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-word" && info.selectionText) {
    const platform = (await storage.get("platform")) as any
    // TODO: 根据不同平台调用不同的 API
    const word = info.selectionText.trim().toLowerCase()
    getAPI(platform)
      .addWord(word)
      .then((res) => {
        if (res) {
          chrome.tabs.sendMessage(tab.id, {
            type: "WORD_ADDED",
            word,
            platform
          })
        }
      })
  }
})
