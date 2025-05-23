import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const storage = new Storage()

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "word-snatcher",
    title: "Snatch Word",
    contexts: ["selection"]
  })
})

interface WordInfo {
  word: string
  timestamp: number
  source: string
  context: string
}

chrome.contextMenus.onClicked.addListener(
  async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId === "word-snatcher" && info.selectionText) {
      const word = info.selectionText.trim()

      // Store the word in Chrome storage
      const words = (await storage.get<WordInfo[]>("words")) || []
      await storage.set("words", [
        ...words,
        {
          word,
          timestamp: Date.now(),
          source: tab?.url || "unknown",
          context: info.pageUrl
        }
      ])

      // Show success notification
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "WORD_CAPTURED",
          word
        })
      }
    }
  }
)
