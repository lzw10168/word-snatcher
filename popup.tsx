import {
  DownloadIcon,
  GearIcon,
  MoonIcon,
  SunIcon,
  TrashIcon
} from "@radix-ui/react-icons"
import { Button, Dialog, Flex, Switch, Text, Theme } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Storage } from "@plasmohq/storage"

import "@radix-ui/themes/styles.css"
import "./style.css"

import * as RadioGroup from "@radix-ui/react-radio-group"

interface WordInfo {
  word: string
  timestamp: number
  source: string
  context: string
}

interface UserInfo {
  email: string
  name?: string
  avatarUrl?: string
}

const PLATFORM_OPTIONS = [
  { label: "不背单词", value: "buBei" },
  { label: "默默背单词", value: "moMo" },
  { label: "百词斩", value: "baiCiZhan" }
]

function IndexPopup() {
  const [words, setWords] = useState<WordInfo[]>([])
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState("buBei")
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const storage = new Storage()

  useEffect(() => {
    const load = async () => {
      const savedWords = (await storage.get<WordInfo[]>("words")) || []
      setWords(savedWords)
      setPlatform((await storage.get<string>("platform")) || "buBei")
      setDarkMode((await storage.get<boolean>("darkMode")) || false)
      setUser((await storage.get<UserInfo | null>("user")) || null)
    }
    load()
    storage.watch({
      words: (change) => setWords(change.newValue || []),
      platform: (change) => setPlatform(change.newValue || "buBei"),
      darkMode: (change) => setDarkMode(change.newValue || false),
      user: (change) => setUser(change.newValue || null)
    })
  }, [])

  const handlePlatformChange = async (value: string) => {
    setPlatform(value)
    await storage.set("platform", value)
  }
  const handleThemeChange = async (checked: boolean) => {
    setDarkMode(checked)
    await storage.set("darkMode", checked)
  }

  const handleDelete = async (index: number) => {
    const newWords = words.slice()
    newWords.splice(index, 1)
    setWords(newWords)
    await storage.set("words", newWords)
  }

  const handleExport = () => {
    if (words.length === 0) return
    const header = "word,timestamp,source,context"
    const rows = words.map((w) =>
      [
        w.word,
        new Date(w.timestamp).toLocaleString(),
        w.source,
        w.context.replace(/\n/g, " ")
      ]
        .map((x) => `"${x.replace(/"/g, '""')}"`)
        .join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `word-snatcher-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSync = async () => {
    if (words.length === 0) {
      toast.error("词库为空，无需同步！")
      return
    }
    toast.loading(
      `正在同步到${PLATFORM_OPTIONS.find((p) => p.value === platform)?.label}...`
    )
    // 模拟网络请求
    setTimeout(() => {
      toast.success(
        `已同步 ${words.length} 个单词到${PLATFORM_OPTIONS.find((p) => p.value === platform)?.label}（mock）`
      )
    }, 1200)
  }

  const handleChromeLogin = async () => {
    if (!chrome.identity) {
      toast.error("当前环境不支持 Chrome 登录")
      return
    }
    chrome.identity.getProfileUserInfo((info) => {
      if (info && info.email) {
        const userInfo: UserInfo = { email: info.email }
        setUser(userInfo)
        storage.set("user", userInfo)
        toast.success("登录成功")
      } else {
        toast.error("未获取到用户信息")
      }
    })
  }

  const handleLogout = async () => {
    setUser(null)
    await storage.set("user", null)
    toast.success("已退出登录")
  }

  return (
    <Theme appearance={darkMode ? "dark" : "light"}>
      <div className="w-[600px] min-h-[400px] p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Word Snatcher</h1>
            <Button
              variant="ghost"
              size="1"
              onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <MoonIcon /> : <SunIcon />}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button variant="soft" size="1" onClick={handleLogout}>
                  退出
                </Button>
              </>
            ) : (
              <Button variant="solid" size="1" onClick={handleChromeLogin}>
                Chrome 登录
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setOpen(true)}
              style={{ width: 32, height: 32, padding: 0 }}
              aria-label="设置">
              <GearIcon />
            </Button>
          </div>
        </div>
        {words.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-gray-500 mb-4">还没有捕获任何单词</p>
            <p className="text-sm text-gray-400">
              在任意网页选中文本，右键选择"Snatch Word"即可添加单词
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {words.map((word, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-lg mb-1">{word.word}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(word.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    来源: {word.source}
                  </div>
                </div>
                <Button
                  variant="soft"
                  color="red"
                  size="1"
                  onClick={() => handleDelete(index)}
                  aria-label="删除">
                  <TrashIcon />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="solid"
            color="indigo"
            onClick={handleExport}
            disabled={words.length === 0}>
            <DownloadIcon style={{ marginRight: 4 }} />
            导出为 CSV
          </Button>
          <Button
            variant="solid"
            color="green"
            onClick={handleSync}
            disabled={words.length === 0}>
            同步到 {PLATFORM_OPTIONS.find((p) => p.value === platform)?.label}
          </Button>
        </div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] rounded-xl bg-white dark:bg-gray-900 p-6 shadow-2xl border dark:border-gray-800">
            <Dialog.Title className="text-xl font-bold mb-6">设置</Dialog.Title>
            <Flex direction="column" gap="4">
              <Text
                weight="bold"
                size="2"
                className="text-gray-700 dark:text-gray-300">
                单词平台
              </Text>
              <div className="space-y-3">
                {PLATFORM_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="platform"
                      value={opt.value}
                      checked={platform === opt.value}
                      onChange={(e) => handlePlatformChange(e.target.value)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </Flex>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                color="gray"
                variant="soft"
                onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button
                color="indigo"
                variant="solid"
                onClick={() => setOpen(false)}>
                确定
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </Theme>
  )
}

export default IndexPopup
