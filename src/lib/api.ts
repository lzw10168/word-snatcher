interface PlatformAPI {
  addWord: (word: string) => Promise<boolean>
  checkLogin: () => Promise<boolean>
}

class ShanbayAPI implements PlatformAPI {
  async addWord(word: string) {
    // TODO: 实现不背单词 API
    return true
  }

  async checkLogin() {
    // TODO: 检查不背单词登录状态
    return true
  }
}

class BubeiAPI implements PlatformAPI {
  async addWord(word: string) {
    // TODO: 实现默默背单词 API
    return true
  }

  async checkLogin() {
    // TODO: 检查默默背单词登录状态
    return true
  }
}

class MomoAPI implements PlatformAPI {
  async addWord(word: string) {
    // TODO: 实现百词斩 API
    return true
  }

  async checkLogin() {
    // TODO: 检查百词斩登录状态
    return true
  }
}

const apis = {
  shanbay: new ShanbayAPI(),
  bubei: new BubeiAPI(),
  momo: new MomoAPI()
}

export type PlatformType = keyof typeof apis

export function getAPI(platform: PlatformType): PlatformAPI {
  return apis[platform]
} 
