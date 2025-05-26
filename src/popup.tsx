import { Button } from "@/components/ui/button"
import { getAPI, type PlatformType } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { useStore } from "./lib/store"

import "./styles/globals.css"
import "./styles/popup.css"

type TabType = "settings" | "features" | "contact"
console.log("popup.tsx loaded")
function IndexPopup() {
  const { theme, setTheme, platform, setPlatform } = useStore()
  const [activeTab, setActiveTab] = useState<TabType>("settings")

  // 新增：登录状态 state
  const [loginStatus, setLoginStatus] = useState({
    bbdc: false,
    momo: false,
    baicizhan: false,
    shanbay: false
  })

  const storage = new Storage()

  const platforms = [
    {
      key: "bbdc",
      name: "不背单词",
      loginUrl:
        "https://bbdc.cn/lexis/login?redirectUrl=http%3A%2F%2Fbbdc.cn%2Fnewword"
    },
    {
      key: "momo",
      name: "默默背单词",
      loginUrl: "https://www.maimemo.com/home/login"
    },
    { key: "baicizhan", name: "百词斩", loginUrl: "" },
    { key: "shanbay", name: "扇贝", loginUrl: "" }
  ] as const

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  useEffect(() => {
    storage.get("platform").then((platform) => {
      setPlatform(platform as PlatformType)
    })
  }, [])

  useEffect(() => {
    storage.set("platform", platform)
  }, [platform])

  // 新增：检测所有平台登录状态
  useEffect(() => {
    async function checkAllLogins() {
      const bbdc = await getAPI("bbdc").checkLogin()
      const momo = await getAPI("momo").checkLogin()
      const baicizhan = await getAPI("baicizhan").checkLogin()
      const shanbay = await getAPI("shanbay").checkLogin()
      setLoginStatus({ bbdc, momo, baicizhan, shanbay })
    }

    if (activeTab === "settings") {
      console.log("checkAllLogins")

      checkAllLogins()
    }
  }, [activeTab])

  return (
    <div className="w-[600px] h-[400px] bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-xl font-medium">Word Snatcher</h1>
        <div className="flex items-center gap-4">
          {theme === "dark" ? (
            <Moon
              className="w-4 h-4 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setTheme("light")}
            />
          ) : (
            <Sun
              className="w-4 h-4 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setTheme("dark")}
            />
          )}
          <Button variant="ghost" size="sm" className="font-medium ">
            登录
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[120px] flex flex-col h-[100%] p-2 space-y-1 border-r">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start font-medium rounded-lg transition-colors text-sm",
              activeTab === "settings"
                ? "bg-accent font-bold text-gray-900 dark:bg-accent-700 dark:text-gray-100"
                : "hover:bg-accent/60 hover:text-gray-900 dark:hover:bg-accent-800 dark:hover:text-gray-100"
            )}
            onClick={() => setActiveTab("settings")}>
            APP设置
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start font-medium rounded-lg transition-colors text-sm",
              activeTab === "features"
                ? "bg-accent font-bold text-gray-900 dark:bg-accent-700 dark:text-gray-100"
                : "hover:bg-accent/60 hover:text-gray-900 dark:hover:bg-accent-800 dark:hover:text-gray-100"
            )}
            onClick={() => setActiveTab("features")}>
            更多功能
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start font-medium rounded-lg transition-colors text-sm",
              activeTab === "contact"
                ? "bg-accent font-bold text-gray-900 dark:bg-accent-700 dark:text-gray-100"
                : "hover:bg-accent/60 hover:text-gray-900 dark:hover:bg-accent-800 dark:hover:text-gray-100"
            )}
            onClick={() => setActiveTab("contact")}>
            联系我们
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-2 relative">
          {activeTab === "settings" && (
            <div className="space-y-2">
              {platforms.map((item) => (
                <PlatformItem
                  key={item.key}
                  name={item.name}
                  isSelected={platform === item.key}
                  onClick={() => setPlatform(item.key as PlatformType)}
                  isLoggedIn={loginStatus[item.key]}
                  loginUrl={item.loginUrl}
                />
              ))}
            </div>
          )}

          {activeTab === "features" && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>更多功能开发中...</p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>联系方式即将添加...</p>
            </div>
          )}

          <div className="p-2 text-right text-xs text-muted-foreground">
            powered by lzw1068
          </div>

          {/* Powered by */}
        </div>
      </div>
    </div>
  )
}

interface PlatformItemProps {
  name: string
  isSelected: boolean
  onClick: () => void
  isLoggedIn?: boolean
  loginUrl?: string
}

function PlatformItem({
  name,
  isSelected,
  onClick,
  isLoggedIn = false,
  loginUrl = ""
}: PlatformItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-2 py-1 rounded-lg border cursor-pointer transition-colors",
        isSelected
          ? "bg-gray-200 border-gray-400 dark:bg-gray-800 dark:border-gray-600"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          {isLoggedIn && (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLoggedIn ? "outline" : "ghost"}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (!isLoggedIn) {
                window.open(loginUrl, "_blank")
              }
            }}
            size="sm"
            className={cn(
              "text-xs px-2 h-6",
              isLoggedIn
                ? "border-green-500/50 text-green-500 hover:bg-green-500/10"
                : "hover:bg-background/50"
            )}>
            {isLoggedIn ? "已登录" : "去登录"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
