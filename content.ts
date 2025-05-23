import type { PlasmoCSConfig } from "plasmo"
import { toast } from "sonner"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "WORD_CAPTURED") {
    toast.success(`Word captured: ${message.word}`, {
      position: "bottom-right",
      duration: 2000
    })
  }
})
