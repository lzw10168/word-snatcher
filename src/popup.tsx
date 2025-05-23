import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

import { useStore } from "./lib/store"

import "./styles/globals.css"
import "./styles/popup.css"

type TabType = "settings" | "features" | "contact"

function IndexPopup() {
  const { theme, setTheme, platform, setPlatform } = useStore()
  const [activeTab, setActiveTab] = useState<TabType>("settings")

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

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
              <PlatformItem
                name="不背单词"
                isSelected={platform === "bubei"}
                onClick={() => setPlatform("bubei")}
                isLoggedIn={true}
              />
              <PlatformItem
                name="默默背单词"
                isSelected={platform === "momo"}
                onClick={() => setPlatform("momo")}
                isLoggedIn={false}
              />
              <PlatformItem
                name="百词斩"
                isSelected={platform === "baicizhan"}
                onClick={() => setPlatform("baicizhan")}
                isLoggedIn={false}
              />
              <PlatformItem
                name="扇贝"
                isSelected={platform === "shanbay"}
                onClick={() => setPlatform("shanbay")}
                isLoggedIn={false}
              />
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
}

function PlatformItem({
  name,
  isSelected,
  onClick,
  isLoggedIn = false
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
