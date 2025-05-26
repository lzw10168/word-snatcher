import type { PlasmoContentScript } from "@plasmohq/messaging/content"
import { Storage } from "@plasmohq/storage"

import { getAPI } from "./lib/api"

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

const storage = new Storage()

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  showToast(`已添加单词: ${message.word}`)
})

function showToast(message: string) {
  const toast = document.createElement("div")
  toast.className = "word-snatcher-toast"
  toast.textContent = message

  // 添加样式
  const style = document.createElement("style")
  style.textContent = `
    .word-snatcher-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(toast)

  // 3秒后移除
  setTimeout(() => {
    toast.remove()
    style.remove()
  }, 3000)
}
