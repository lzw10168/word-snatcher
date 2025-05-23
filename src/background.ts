import { Storage } from "@plasmohq/storage"

const storage = new Storage()

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-word",
    title: "添加到生词本",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-word" && info.selectionText) {
    const platform = await storage.get("platform")
    // TODO: 根据不同平台调用不同的 API
    chrome.tabs.sendMessage(tab.id, {
      type: "WORD_ADDED",
      word: info.selectionText
    })
  }
}) 
