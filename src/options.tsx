import { useEffect } from "react"
import { useStore } from "./lib/store"
import "./styles/globals.css"

function OptionsPage() {
  const { theme, words } = useStore()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Word Snatcher 设置</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">我的单词本</h2>
          <div className="bg-card rounded-lg p-4">
            {words.length === 0 ? (
              <p className="text-muted-foreground">还没有添加任何单词</p>
            ) : (
              <ul className="space-y-2">
                {words.map((word) => (
                  <li key={word} className="flex items-center justify-between">
                    <span>{word}</span>
                    <button
                      onClick={() => useStore.getState().removeWord(word)}
                      className="text-sm text-destructive hover:underline"
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">账号设置</h2>
          <div className="bg-card rounded-lg p-4">
            <button
              onClick={() => {
                // TODO: 实现 Chrome 账号登录
              }}
              className="bg-primary text-primary-foreground rounded-md px-4 py-2"
            >
              使用 Chrome 账号登录
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">数据统计</h2>
          <div className="bg-card rounded-lg p-4">
            <p className="text-muted-foreground">
              累计添加单词：{words.length} 个
            </p>
            {/* TODO: 添加更多统计数据和图表 */}
          </div>
        </section>
      </div>
    </div>
  )
}

export default OptionsPage 
