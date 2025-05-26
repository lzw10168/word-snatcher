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
  async addWord(word: string) {
    // TODO: 实现百词斩 API
    return true
  }

  async checkLogin() {
    try {
      const res = await fetch("https://www.maimemo.com/notepad/add", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          Referer: "https://www.maimemo.com/notepad/show",
          "User-Agent": navigator.userAgent
        }
      })
      if (!res.ok) return false
      const html = await res.text()
      if (html.includes("i-dengchu")) {
        return true // 未登录
      }
      return false // 已登录
    } catch (e) {
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
