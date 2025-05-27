import { Storage } from "@plasmohq/storage"

interface PlatformAPI {
  addWord: (word: string) => Promise<boolean>
  checkLogin: () => Promise<boolean>
}

class ShanbayAPI implements PlatformAPI {
  async addWord(word: string) {
    return true
  }

  async checkLogin() {
    try {
      const res = await fetch(
        "https://bbdc.cn/api/user-new-word?page=0&time=" + Date.now(),
        {
          credentials: "include",
          headers: {
            Accept: "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest"
          }
        }
      )
      if (!res.ok) return false
      const data = await res.json()
      if (Array.isArray(data) || data?.code === 0) {
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

class bbdcAPI implements PlatformAPI {
  async addWord(word: string) {
    try {
      const formData = new FormData()
      formData.append(
        "newwordlist",
        JSON.stringify({
          word: word,
          course: "*",
          wordidx: "*",
          infoidx: "100",
          selection: "*",
          opcode: "1"
        })
      )
      const res = await fetch("https://bbdc.cn/api/user-new-word", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*",
          "X-Requested-With": "XMLHttpRequest"
        }
      })
      if (!res.ok) return false
      const data = await res.json()
      if (data?.result_code !== 200) {
        return false
      }
      return true
    } catch {
      return false
    }
  }
  async checkLogin() {
    try {
      const res = await fetch(
        "https://bbdc.cn/api/user-new-word?page=0&time=" + Date.now(),
        {
          credentials: "include",
          headers: {
            Accept: "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest"
          }
        }
      )
      console.log(res)
      if (!res.ok) return false
      const data = await res.json()
      if (data?.result_code !== 200) {
        return false
      }
      return true
    } catch {
      return false
    }
  }
}

class MomoAPI implements PlatformAPI {
  private storage = new Storage()
  private async getApiKey(): Promise<string> {
    return ((await this.storage.get("momoApiKey")) as string) || ""
  }

  // 获取云词本列表
  private async listNotepads(apiKey: string) {
    const res = await fetch("https://open.maimemo.com/api/v1/notepads", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    })
    if (!res.ok) throw new Error("获取云词本失败")
    return res.json()
  }

  // 创建云词本，参数参考用户给定格式
  private async createNotepad(apiKey: string, word: string) {
    const todayDate = new Date().toLocaleDateString("en-CA")
    const res = await fetch("https://open.maimemo.com/api/v1/notepads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        notepad: {
          status: "UNPUBLISHED",
          content: `# ${todayDate}\n${word}\n`,
          title: "浏览器单词同步",
          brief: "浏览器插件单词同步(请勿修改描述)",
          tags: []
        }
      })
    })
    if (!res.ok) throw new Error("创建云词本失败")
    const data = await res.json()
    return data?.notepad?.id || data?.id
  }

  // 整体更新云词本内容，插入单词到当天 section
  private async addWordToNotepad(
    apiKey: string,
    notepadId: string,
    word: string
  ) {
    // 1. 获取当前云词本内容
    const getRes = await fetch(
      `https://open.maimemo.com/api/v1/notepads/${notepadId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    )
    if (!getRes.ok) throw new Error("获取云词本内容失败")
    const notepadData = await getRes.json()
    const notepad = notepadData?.notepad
    if (!notepad) throw new Error("云词本不存在")

    // 2. 解析内容，插入单词到今天 section
    const today = new Date().toLocaleDateString("en-CA")
    let lines = notepad.content.split("\n").map((line) => line.trim())
    let idx = lines.findIndex((line) => line.startsWith(`# ${today}`))
    if (idx === -1) {
      lines.unshift("")
      lines.unshift(`# ${today}`)
      idx = 0
    }
    // 检查是否已存在该单词，避免重复
    if (!lines.includes(word)) {
      lines.splice(idx + 1, 0, word)
    }

    // 3. POST 整体内容回去
    const postRes = await fetch(
      `https://open.maimemo.com/api/v1/notepads/${notepadId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          notepad: {
            ...notepad,
            content: lines.join("\n")
          }
        })
      }
    )
    if (!postRes.ok) throw new Error("更新云词本失败")
    return true
  }

  async checkLogin() {
    const apiKey = await this.getApiKey()
    if (!apiKey) return false
    try {
      const data = await this.listNotepads(apiKey)
      return Array.isArray(data?.notepads)
    } catch {
      return false
    }
  }

  async addWord(word: string) {
    const apiKey = await this.getApiKey()
    if (!apiKey) return false
    let notepads
    try {
      const data = await this.listNotepads(apiKey)
      notepads = data.notepads
    } catch {
      notepads = []
    }
    let notepad = notepads?.find(
      (n: any) =>
        n.title === "浏览器单词同步" &&
        n.brief === "浏览器插件单词同步(请勿修改描述)"
    )
    let notepadId = notepad?.id
    if (!notepadId) {
      try {
        notepadId = await this.createNotepad(apiKey, word)
      } catch {
        return false
      }
    }
    try {
      await this.addWordToNotepad(apiKey, notepadId, word)
      return true
    } catch {
      return false
    }
  }
}

class BaicizhanAPI implements PlatformAPI {
  async addWord(word: string) {
    // TODO: 实现百词斩 API
    return true
  }

  async checkLogin() {
    // TODO: 检查百词斩登录状态
    return false
  }
}
const apis = {
  shanbay: new ShanbayAPI(),
  bbdc: new bbdcAPI(),
  momo: new MomoAPI(),
  baicizhan: new BaicizhanAPI()
}

export type PlatformType = keyof typeof apis

export function getAPI(platform: PlatformType): PlatformAPI {
  return apis[platform]
}
